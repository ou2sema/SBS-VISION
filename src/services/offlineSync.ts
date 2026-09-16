/**
 * Offline Sync Manager
 * Supports field technicians working in basements/remote sites with poor connectivity.
 * Caches tasks, allows queuing notes/photos/completion, and synchronizes when back online.
 */
import { OfflineAction } from '../types';

export type SyncState = 'SYNCED' | 'SYNCING' | 'OFFLINE_QUEUED' | 'SYNC_FAILED';

export class OfflineSyncManager {
  private queue: OfflineAction[] = [];
  private isOnline: boolean = true;
  private listeners: ((state: SyncState, count: number) => void)[] = [];

  constructor() {
    // Check local storage for pending items
    try {
      const saved = localStorage.getItem('securops_offline_queue');
      if (saved) {
        this.queue = JSON.parse(saved);
      }
    } catch {
      this.queue = [];
    }
  }

  public subscribe(listener: (state: SyncState, count: number) => void) {
    this.listeners.push(listener);
    this.notify();
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    let state: SyncState = 'SYNCED';
    if (!this.isOnline && this.queue.length > 0) {
      state = 'OFFLINE_QUEUED';
    } else if (this.queue.some(q => q.status === 'SYNCING')) {
      state = 'SYNCING';
    } else if (this.queue.some(q => q.status === 'FAILED')) {
      state = 'SYNC_FAILED';
    } else if (this.queue.length > 0) {
      state = 'OFFLINE_QUEUED';
    }

    this.listeners.forEach(l => l(state, this.queue.length));
    try {
      localStorage.setItem('securops_offline_queue', JSON.stringify(this.queue));
    } catch (e) {
      console.error('Failed to persist offline queue', e);
    }
  }

  public setOnlineStatus(online: boolean) {
    this.isOnline = online;
    this.notify();
    if (online && this.queue.length > 0) {
      this.flushQueue();
    }
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }

  public getQueueCount(): number {
    return this.queue.length;
  }

  public enqueueAction(action: Omit<OfflineAction, 'id' | 'timestamp' | 'status' | 'retryCount'>): OfflineAction {
    const item: OfflineAction = {
      ...action,
      id: `OFF-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      status: this.isOnline ? 'SYNCING' : 'QUEUED',
      retryCount: 0,
    };

    this.queue.push(item);
    this.notify();

    if (this.isOnline) {
      this.flushQueue();
    }

    return item;
  }

  public async flushQueue(processCallback?: (action: OfflineAction) => Promise<boolean>) {
    if (!this.isOnline || this.queue.length === 0) return;

    this.queue = this.queue.map(item => ({ ...item, status: 'SYNCING' }));
    this.notify();

    // Simulate network latency flush
    await new Promise(res => setTimeout(res, 800));

    const remaining: OfflineAction[] = [];
    for (const item of this.queue) {
      try {
        if (processCallback) {
          const ok = await processCallback(item);
          if (!ok) {
            remaining.push({ ...item, status: 'FAILED', retryCount: item.retryCount + 1 });
            continue;
          }
        }
        // Successfully synced
      } catch {
        remaining.push({ ...item, status: 'FAILED', retryCount: item.retryCount + 1 });
      }
    }

    this.queue = remaining;
    this.notify();
  }

  public clearQueue() {
    this.queue = [];
    this.notify();
  }
}

export const offlineSyncManager = new OfflineSyncManager();
