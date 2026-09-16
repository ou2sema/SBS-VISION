/**
 * SecurOps Global Application Context
 * Central reactive state store implementing Clean Architecture Controllers/Notifiers.
 */
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  UserProfile, 
  ServiceRequest, 
  WorkOrder, 
  WorkflowTask, 
  Quote, 
  QuoteItem, 
  Invoice, 
  Appointment, 
  AuditEntry, 
  InstalledEquipment, 
  ServiceReport 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_REQUESTS, 
  INITIAL_WORK_ORDERS, 
  INITIAL_TASKS, 
  INITIAL_QUOTES, 
  INITIAL_INVOICES, 
  INITIAL_APPOINTMENTS, 
  INITIAL_AUDIT_LOGS 
} from '../services/mockData';
import { WorkflowEngine } from '../services/workflowEngine';
import { offlineSyncManager, SyncState } from '../services/offlineSync';

export type AppView = 
  | 'DASHBOARD'
  | 'REQUESTS'
  | 'WORK_ORDERS'
  | 'WORK_ORDER_DETAIL'
  | 'APPOINTMENTS'
  | 'CATALOG'
  | 'AUDIT_TRAIL'
  | 'TECHNICIAN_MODE'
  | 'CUSTOMER_PORTAL'
  | 'ARCHITECTURE_SPEC';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

interface AppContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  setCurrentUser: (user: UserProfile) => void;
  selectedView: AppView;
  setSelectedView: (view: AppView) => void;
  selectedWorkOrderId: string | null;
  setSelectedWorkOrderId: (id: string | null) => void;
  requests: ServiceRequest[];
  workOrders: WorkOrder[];
  tasks: WorkflowTask[];
  quotes: Quote[];
  invoices: Invoice[];
  appointments: Appointment[];
  auditLogs: AuditEntry[];
  installedAssets: InstalledEquipment[];
  serviceReports: ServiceReport[];
  notifications: ToastNotification[];
  isOnline: boolean;
  syncState: SyncState;
  pendingSyncCount: number;
  toggleOnline: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  
  // Actions
  acceptRequest: (requestId: string) => Promise<string>;
  rejectRequest: (requestId: string, reason: string) => void;
  submitCustomerRequest?: (requestData: any) => string;
  completeTask: (workOrderId: string, taskId: string, data?: Record<string, any>) => Promise<void>;
  saveQuote: (workOrderId: string, items: QuoteItem[], discount: number, notes: string) => void;
  respondToQuote: (quoteId: string, decision: 'ACCEPTED' | 'REVISION_REQUESTED' | 'DECLINED', notes?: string) => void;
  updateQuoteStatus: (quoteId: string, decision: 'ACCEPTED' | 'REVISION_REQUESTED' | 'DECLINED', notes?: string) => void;
  confirmPayment: (invoiceId: string, paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'ONLINE_CARD', reference: string) => void;
  updateInvoiceStatus: (invoiceId: string, status: 'PAID' | 'UNPAID', notes?: string) => void;
  adminOverride: (workOrderId: string, taskId: string, action: 'SKIP_TASK' | 'FORCE_UNLOCK' | 'REOPEN_TASK', reason: string) => void;
  recordInstalledAsset: (asset: Omit<InstalledEquipment, 'id' | 'installedAt'>) => InstalledEquipment;
  finalizeJobAndReport: (workOrderId: string, reportData: Omit<ServiceReport, 'id' | 'completedAt'>) => void;
  scheduleAppointment: (appointmentData: Omit<Appointment, 'id'>) => void;
  dismissNotification: (id: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[1]); // Sonia Guesmi (ADMIN)
  const [selectedView, setSelectedView] = useState<AppView>('DASHBOARD');
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>(() => {
    const saved = localStorage.getItem('securops_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => {
    const saved = localStorage.getItem('securops_work_orders');
    return saved ? JSON.parse(saved) : INITIAL_WORK_ORDERS;
  });
  const [tasks, setTasks] = useState<WorkflowTask[]>(() => {
    const saved = localStorage.getItem('securops_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  const [quotes, setQuotes] = useState<Quote[]>(() => {
    const saved = localStorage.getItem('securops_quotes');
    return saved ? JSON.parse(saved) : INITIAL_QUOTES;
  });
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('securops_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('securops_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(() => {
    const saved = localStorage.getItem('securops_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });
  const [installedAssets, setInstalledAssets] = useState<InstalledEquipment[]>(() => {
    const saved = localStorage.getItem('securops_assets');
    return saved ? JSON.parse(saved) : [];
  });
  const [serviceReports, setServiceReports] = useState<ServiceReport[]>(() => {
    const saved = localStorage.getItem('securops_reports');
    return saved ? JSON.parse(saved) : [];
  });
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [syncState, setSyncState] = useState<SyncState>('SYNCED');
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Persistence to localStorage
  useEffect(() => {
    localStorage.setItem('securops_requests', JSON.stringify(requests));
  }, [requests]);
  useEffect(() => {
    localStorage.setItem('securops_work_orders', JSON.stringify(workOrders));
  }, [workOrders]);
  useEffect(() => {
    localStorage.setItem('securops_tasks', JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem('securops_quotes', JSON.stringify(quotes));
  }, [quotes]);
  useEffect(() => {
    localStorage.setItem('securops_invoices', JSON.stringify(invoices));
  }, [invoices]);
  useEffect(() => {
    localStorage.setItem('securops_appointments', JSON.stringify(appointments));
  }, [appointments]);
  useEffect(() => {
    localStorage.setItem('securops_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    localStorage.setItem('securops_assets', JSON.stringify(installedAssets));
  }, [installedAssets]);
  useEffect(() => {
    localStorage.setItem('securops_reports', JSON.stringify(serviceReports));
  }, [serviceReports]);

  // Sync state subscription
  useEffect(() => {
    const unsubscribe = offlineSyncManager.subscribe((state, count) => {
      setSyncState(state);
      setPendingSyncCount(count);
    });
    return unsubscribe;
  }, []);

  const addNotification = useCallback((title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    setNotifications(prev => [
      { id, title, message, type, timestamp: new Date().toLocaleTimeString() },
      ...prev.slice(0, 4), // max 5 notifications
    ]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const toggleOnline = useCallback(() => {
    const nextOnline = !isOnline;
    setIsOnline(nextOnline);
    offlineSyncManager.setOnlineStatus(nextOnline);
    addNotification(
      nextOnline ? 'Network Reconnected' : 'Field Offline Mode Active',
      nextOnline 
        ? 'Connected to Firestore backend. Processing queued changes...' 
        : 'Working offline. All notes, photos, and task completions are queued locally.',
      nextOnline ? 'success' : 'warning'
    );
  }, [isOnline, addNotification]);

  /**
   * Action: Accept Request
   */
  const acceptRequest = useCallback(async (requestId: string): Promise<string> => {
    const req = requests.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');

    const { workOrder, tasks: newTasks, audit } = WorkflowEngine.acceptRequest(req, currentUser);

    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'ACCEPTED' as const } : r));
    setWorkOrders(prev => [workOrder, ...prev]);
    setTasks(prev => [...newTasks, ...prev]);
    setAuditLogs(prev => [audit, ...prev]);

    addNotification(
      'Request Accepted & Work Order Created',
      `Work Order ${workOrder.id} generated with ${newTasks.length} sequential workflow tasks for ${req.customerName}.`,
      'success'
    );

    setSelectedWorkOrderId(workOrder.id);
    setSelectedView('WORK_ORDER_DETAIL');
    return workOrder.id;
  }, [requests, currentUser, addNotification]);

  /**
   * Action: Reject Request
   */
  const rejectRequest = useCallback((requestId: string, reason: string) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'REJECTED' as const } : r));
    const audit: AuditEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'REQUEST_REJECTED',
      targetType: 'REQUEST',
      targetId: requestId,
      previousState: 'NEW',
      newState: 'REJECTED',
      reason,
    };
    setAuditLogs(prev => [audit, ...prev]);
    addNotification('Request Rejected', `Request ${requestId} rejected. Reason: ${reason}`, 'warning');
  }, [currentUser, addNotification]);

  /**
   * Action: Complete Task
   */
  const completeTask = useCallback(async (workOrderId: string, taskId: string, data?: Record<string, any>) => {
    const wo = workOrders.find(w => w.id === workOrderId);
    const targetTask = tasks.find(t => t.id === taskId);
    if (!wo || !targetTask) return;

    if (!isOnline) {
      // Offline queue
      offlineSyncManager.enqueueAction({
        actionType: 'COMPLETE_TASK',
        workOrderId,
        taskId,
        payload: data,
      });
    }

    const woTasks = tasks.filter(t => t.workOrderId === workOrderId);
    const woQuote = quotes.find(q => q.workOrderId === workOrderId);
    const woInvoice = invoices.find(i => i.workOrderId === workOrderId);

    const { updatedWorkOrder, updatedTasks, audit, newlyUnlockedTaskIds } = WorkflowEngine.completeTask(
      wo,
      targetTask,
      woTasks,
      woQuote,
      woInvoice,
      currentUser,
      data
    );

    setWorkOrders(prev => prev.map(w => w.id === workOrderId ? updatedWorkOrder : w));
    setTasks(prev => prev.map(t => {
      const updated = updatedTasks.find(ut => ut.id === t.id);
      return updated || t;
    }));
    setAuditLogs(prev => [audit, ...prev]);

    addNotification(
      'Task Completed',
      `"${targetTask.title}" completed. ${newlyUnlockedTaskIds.length ? `Unlocked: ${newlyUnlockedTaskIds.length} next task(s).` : ''}`,
      'success'
    );
  }, [workOrders, tasks, quotes, invoices, currentUser, isOnline, addNotification]);

  /**
   * Action: Save Quote
   */
  const saveQuote = useCallback((workOrderId: string, items: QuoteItem[], discount: number, notes: string) => {
    const wo = workOrders.find(w => w.id === workOrderId);
    if (!wo) return;

    const existingQuote = quotes.find(q => q.workOrderId === workOrderId);
    const { quote, audit } = WorkflowEngine.saveQuote(wo, existingQuote, items, discount, notes, currentUser);

    setQuotes(prev => {
      const filtered = prev.filter(q => q.id !== quote.id);
      return [quote, ...filtered];
    });
    setWorkOrders(prev => prev.map(w => w.id === workOrderId ? { ...w, quoteId: quote.id, status: 'WAITING_CUSTOMER_APPROVAL' } : w));
    
    // Complete create_quote task and unlock customer_approval
    setTasks(prev => prev.map(t => {
      if (t.workOrderId === workOrderId && t.templateStepId === 'create_quote') {
        return { ...t, status: 'COMPLETED' as const, completedAt: new Date().toISOString() };
      }
      if (t.workOrderId === workOrderId && t.templateStepId === 'customer_approval') {
        return { ...t, status: 'TODO' as const };
      }
      return t;
    }));

    setAuditLogs(prev => [audit, ...prev]);
    addNotification('Quotation Dispatched', `Quote ${quote.id} v${quote.currentVersion} sent to customer for approval.`, 'info');
  }, [workOrders, quotes, currentUser, addNotification]);

  /**
   * Action: Respond to Quote (Customer Simulation or Real)
   */
  const respondToQuote = useCallback((quoteId: string, decision: 'ACCEPTED' | 'REVISION_REQUESTED' | 'DECLINED', notes?: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;
    const wo = workOrders.find(w => w.id === quote.workOrderId);
    if (!wo) return;

    const woTasks = tasks.filter(t => t.workOrderId === wo.id);
    const { updatedQuote, updatedWorkOrder, updatedTasks, invoice, audit } = WorkflowEngine.processCustomerQuoteDecision(
      quote,
      wo,
      woTasks,
      decision,
      notes
    );

    setQuotes(prev => prev.map(q => q.id === quoteId ? updatedQuote : q));
    setWorkOrders(prev => prev.map(w => w.id === wo.id ? updatedWorkOrder : w));
    setTasks(prev => prev.map(t => {
      const up = updatedTasks.find(ut => ut.id === t.id);
      return up || t;
    }));
    if (invoice) {
      setInvoices(prev => [invoice, ...prev.filter(i => i.id !== invoice.id)]);
    }
    setAuditLogs(prev => [audit, ...prev]);

    addNotification(
      decision === 'ACCEPTED' ? 'Quote Accepted!' : 'Quote Revision Requested',
      decision === 'ACCEPTED' 
        ? `Customer approved Quote ${quote.id}. Invoice ${invoice?.id} issued (Awaiting Payment).`
        : `Customer requested modifications on Quote ${quote.id}. Reopened quote task.`,
      decision === 'ACCEPTED' ? 'success' : 'warning'
    );
  }, [quotes, workOrders, tasks, addNotification]);

  /**
   * Action: Confirm Payment (Commercial Gate)
   */
  const confirmPayment = useCallback((invoiceId: string, paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'ONLINE_CARD', reference: string) => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return;
    const wo = workOrders.find(w => w.id === inv.workOrderId);
    if (!wo) return;

    const woTasks = tasks.filter(t => t.workOrderId === wo.id);

    try {
      const { updatedInvoice, updatedWorkOrder, updatedTasks, audit } = WorkflowEngine.confirmPayment(
        inv,
        wo,
        woTasks,
        paymentMethod,
        reference,
        currentUser
      );

      setInvoices(prev => prev.map(i => i.id === invoiceId ? updatedInvoice : i));
      setWorkOrders(prev => prev.map(w => w.id === wo.id ? updatedWorkOrder : w));
      setTasks(prev => prev.map(t => {
        const up = updatedTasks.find(ut => ut.id === t.id);
        return up || t;
      }));
      setAuditLogs(prev => [audit, ...prev]);

      addNotification(
        'Commercial Gate Passed: Work Authorized',
        `Payment of ${inv.amount.toFixed(2)} TND confirmed. Equipment preparation & installation tasks unlocked!`,
        'success'
      );
    } catch (err: any) {
      addNotification('Payment Gate Error', err.message || 'Payment confirmation failed', 'error');
    }
  }, [invoices, workOrders, tasks, currentUser, addNotification]);

  /**
   * Action: Admin Override
   */
  const adminOverride = useCallback((workOrderId: string, taskId: string, action: 'SKIP_TASK' | 'FORCE_UNLOCK' | 'REOPEN_TASK', reason: string) => {
    const wo = workOrders.find(w => w.id === workOrderId);
    if (!wo) return;
    const woTasks = tasks.filter(t => t.workOrderId === workOrderId);

    try {
      const { updatedWorkOrder, updatedTasks, audit } = WorkflowEngine.adminOverride(
        wo,
        taskId,
        action,
        reason,
        currentUser,
        woTasks
      );

      setWorkOrders(prev => prev.map(w => w.id === workOrderId ? updatedWorkOrder : w));
      setTasks(prev => prev.map(t => {
        const up = updatedTasks.find(ut => ut.id === t.id);
        return up || t;
      }));
      setAuditLogs(prev => [audit, ...prev]);

      addNotification(
        'Admin Workflow Override Applied',
        `Task updated via ${action}. Override recorded in audit trail.`,
        'warning'
      );
    } catch (err: any) {
      addNotification('Override Refused', err.message, 'error');
    }
  }, [workOrders, tasks, currentUser, addNotification]);

  /**
   * Action: Record Installed Asset
   */
  const recordInstalledAsset = useCallback((assetData: Omit<InstalledEquipment, 'id' | 'installedAt'>): InstalledEquipment => {
    const id = `AST-${Math.floor(10000 + Math.random() * 90000)}`;
    const asset: InstalledEquipment = {
      ...assetData,
      id,
      installedAt: new Date().toISOString(),
    };

    setInstalledAssets(prev => [asset, ...prev]);

    if (!isOnline) {
      offlineSyncManager.enqueueAction({
        actionType: 'SAVE_ASSET',
        workOrderId: asset.workOrderId,
        payload: asset,
      });
    }

    addNotification('Asset Serial Recorded', `Registered ${asset.name} (${asset.serialNumber}) at ${asset.locationOnSite}.`, 'info');
    return asset;
  }, [isOnline, addNotification]);

  /**
   * Action: Finalize Job and Generate Service Report
   */
  const finalizeJobAndReport = useCallback((workOrderId: string, reportData: Omit<ServiceReport, 'id' | 'completedAt'>) => {
    const wo = workOrders.find(w => w.id === workOrderId);
    if (!wo) return;
    const woTasks = tasks.filter(t => t.workOrderId === workOrderId);
    const woAssets = installedAssets.filter(a => a.workOrderId === workOrderId);

    const reportId = `REP-${workOrderId.replace('WO-', '')}`;
    const report: ServiceReport = {
      ...reportData,
      id: reportId,
      workOrderId,
      completedAt: new Date().toISOString(),
    };

    const { updatedWorkOrder, updatedTasks, audit } = WorkflowEngine.finalizeJob(
      wo,
      woTasks,
      report,
      woAssets,
      currentUser
    );

    setServiceReports(prev => [report, ...prev]);
    setWorkOrders(prev => prev.map(w => w.id === workOrderId ? updatedWorkOrder : w));
    setTasks(prev => prev.map(t => {
      const up = updatedTasks.find(ut => ut.id === t.id);
      return up || t;
    }));
    setAuditLogs(prev => [audit, ...prev]);

    addNotification(
      'Work Order Completed & Handed Over',
      `Service Report ${reportId} signed by customer ${report.customerSignName}. Work Order # ${workOrderId} marked COMPLETED.`,
      'success'
    );
  }, [workOrders, tasks, installedAssets, currentUser, addNotification]);

  /**
   * Action: Schedule Appointment
   */
  const scheduleAppointment = useCallback((appointmentData: Omit<Appointment, 'id'>) => {
    const apt: Appointment = {
      ...appointmentData,
      id: `APT-${Date.now().toString().slice(-4)}`,
    };
    setAppointments(prev => [apt, ...prev]);
    addNotification('Appointment Booked', `${apt.type} scheduled with ${apt.technicianName} for ${apt.customerName}.`, 'info');
  }, [addNotification]);

  /**
   * Action: Reset Demo Data
   */
  const resetAllData = useCallback(() => {
    localStorage.clear();
    setRequests(INITIAL_REQUESTS);
    setWorkOrders(INITIAL_WORK_ORDERS);
    setTasks(INITIAL_TASKS);
    setQuotes(INITIAL_QUOTES);
    setInvoices(INITIAL_INVOICES);
    setAppointments(INITIAL_APPOINTMENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setInstalledAssets([]);
    setServiceReports([]);
    offlineSyncManager.clearQueue();
    addNotification('Data Reset', 'Restored initial sample requests and database state.', 'info');
  }, [addNotification]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers: INITIAL_USERS,
        setCurrentUser,
        selectedView,
        setSelectedView,
        selectedWorkOrderId,
        setSelectedWorkOrderId,
        requests,
        workOrders,
        tasks,
        quotes,
        invoices,
        appointments,
        auditLogs,
        installedAssets,
        serviceReports,
        notifications,
        isOnline,
        syncState,
        pendingSyncCount,
        toggleOnline,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        acceptRequest,
        rejectRequest,
        completeTask,
        saveQuote,
        respondToQuote,
        updateQuoteStatus: respondToQuote,
        confirmPayment,
        updateInvoiceStatus: (invId: string, status: 'PAID' | 'UNPAID', notes?: string) => {
          if (status === 'PAID') {
            confirmPayment(invId, 'ONLINE_CARD', notes || 'GATEWAY-CONFIRMED');
          }
        },
        adminOverride,
        recordInstalledAsset,
        finalizeJobAndReport,
        scheduleAppointment,
        dismissNotification,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
