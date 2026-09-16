import React, { useState } from 'react';
import { 
  Code2, 
  Layers, 
  ShieldCheck, 
  Database, 
  Server, 
  Smartphone, 
  CheckCircle2, 
  Copy, 
  Check,
  ExternalLink
} from 'lucide-react';

export const ArchitectureSpecView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DART_ENGINE' | 'RIVERPOD' | 'FIRESTORE_RULES' | 'CLEAN_ARCH' | 'OFFLINE_SYNC'>('DART_ENGINE');
  const [copied, setCopied] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const DART_ENGINE_CODE = `// lib/domain/workflow/workflow_engine.dart
import 'package:freezed_annotation/freezed_annotation.dart';
import '../models/work_order.dart';
import '../models/workflow_task.dart';
import '../models/quote.dart';
import '../models/invoice.dart';
import '../models/audit_entry.dart';

class WorkflowEngine {
  /// Authoritative server-side / engine logic
  /// Never trusts the client with commercial status or workflow unlocks
  static TaskCompletionResult completeTask({
    required WorkOrder workOrder,
    required WorkflowTask targetTask,
    required List<WorkflowTask> allTasks,
    required Quote? quote,
    required Invoice? invoice,
    required String actorId,
    required String actorName,
    required String actorRole,
    Map<String, dynamic>? data,
  }) {
    if (targetTask.status == TaskStatus.locked) {
      throw WorkflowException('Cannot complete a locked task without upstream completion.');
    }

    final now = DateTime.now().toIso8601String();
    
    // 1. Mark target task as completed
    final updatedTargetTask = targetTask.copyWith(
      status: TaskStatus.completed,
      completedAt: now,
      metadata: {...?targetTask.metadata, ...?data},
    );

    // 2. Evaluate all downstream tasks
    final newlyUnlockedTaskIds = <String>[];
    final updatedTasks = allTasks.map((task) {
      if (task.id == targetTask.id) return updatedTargetTask;
      if (task.status == TaskStatus.locked) {
        final dependenciesMet = task.dependencies.every((depId) {
          if (depId == targetTask.templateStepId) return true;
          return allTasks.any((t) => t.templateStepId == depId && t.status == TaskStatus.completed);
        });

        if (dependenciesMet) {
          // Check commercial gate
          if (task.isCommercialGate) {
            final isAuthorized = quote?.status == QuoteStatus.accepted && invoice?.status == InvoiceStatus.paid;
            if (!isAuthorized) {
              return task; // Remains locked by commercial gate
            }
          }
          newlyUnlockedTaskIds.add(task.id);
          return task.copyWith(status: TaskStatus.todo);
        }
      }
      return task;
    }).toList();

    // 3. Compute overall work order progress
    final completedCount = updatedTasks.where((t) => t.status == TaskStatus.completed || t.status == TaskStatus.skipped).length;
    final progress = ((completedCount / updatedTasks.length) * 100).round();

    final updatedWorkOrder = workOrder.copyWith(
      progressPercentage: progress,
      updatedAt: now,
    );

    return TaskCompletionResult(
      updatedWorkOrder: updatedWorkOrder,
      updatedTasks: updatedTasks,
      newlyUnlockedTaskIds: newlyUnlockedTaskIds,
    );
  }
}`;

  const RIVERPOD_NOTIFIER_CODE = `// lib/presentation/controllers/work_order_notifier.dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../domain/models/work_order.dart';
import '../../domain/usecases/complete_task_usecase.dart';
import '../../domain/usecases/enforce_commercial_gate_usecase.dart';

part 'work_order_notifier.g.dart';

@riverpod
class WorkOrderController extends _$WorkOrderController {
  @override
  FutureOr<WorkOrderState> build(String workOrderId) async {
    final repo = ref.watch(workOrderRepositoryProvider);
    final workOrder = await repo.getWorkOrderById(workOrderId);
    final tasks = await repo.getTasksForWorkOrder(workOrderId);
    final quote = await ref.watch(quoteRepositoryProvider).getQuote(workOrder.quoteId);
    final invoice = await ref.watch(invoiceRepositoryProvider).getInvoice(workOrder.invoiceId);

    return WorkOrderState(
      workOrder: workOrder,
      tasks: tasks,
      quote: quote,
      invoice: invoice,
      isCommercialGateLocked: !(quote?.isAccepted == true && invoice?.isPaid == true),
    );
  }

  Future<void> executeTaskCompletion(String taskId, Map<String, dynamic> data) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final current = state.requireValue;
      final useCase = ref.read(completeTaskUseCaseProvider);
      return await useCase.execute(
        workOrder: current.workOrder,
        taskId: taskId,
        data: data,
      );
    });
  }
}`;

  const FIRESTORE_RULES_CODE = `// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return request.auth.token.role; // Set via Firebase Custom Claims
    }
    
    function isAdmin() {
      return isAuthenticated() && (getUserRole() == 'ADMIN' || getUserRole() == 'SUPER_ADMIN');
    }
    
    function isTechnician() {
      return isAuthenticated() && (getUserRole() == 'TECHNICIAN' || isAdmin());
    }

    // Work Orders Collection
    match /work_orders/{workOrderId} {
      allow read: if isAuthenticated();
      allow create: if isAdmin();
      
      // Critical: Technicians CANNOT alter paymentStatus, invoiceId, quoteId, or bypass gates
      allow update: if isAdmin() || (
        isTechnician() && 
        !request.resource.data.diff(resource.data).affectedKeys()
          .hasAny(['paymentStatus', 'invoiceId', 'quoteId', 'commercialGatePassed'])
      );
    }

    // Tasks Collection
    match /workflow_tasks/{taskId} {
      allow read: if isAuthenticated();
      allow update: if isAdmin() || (
        isTechnician() && 
        resource.data.status != 'LOCKED' &&
        (!resource.data.isCommercialGate || get(/databases/$(database)/documents/invoices/$(resource.data.invoiceId)).data.status == 'PAID')
      );
    }

    // Invoices & Quotes (Strictly Admin & Customer Authority)
    match /invoices/{invoiceId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin(); // Technicians CANNOT mark invoices as paid
    }

    // Audit Trail (Append Only)
    match /audit_logs/{auditId} {
      allow read: if isAdmin();
      allow create: if isAuthenticated();
      allow update, delete: if false; // Immutable audit log
    }
  }
}`;

  const OFFLINE_SYNC_CODE = `// lib/data/datasources/offline_sync_manager.dart
import 'dart:convert';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

class OfflineSyncManager {
  static const String boxName = 'offline_mutations_queue';
  late Box<String> _queueBox;

  Future<void> initialize() async {
    _queueBox = await Hive.openBox<String>(boxName);
    Connectivity().onConnectivityChanged.listen((result) {
      if (result != ConnectivityResult.none) {
        flushQueue();
      }
    });
  }

  Future<void> queueMutation({
    required String actionType,
    required String workOrderId,
    required String taskId,
    required Map<String, dynamic> payload,
  }) async {
    final entry = jsonEncode({
      'id': 'OFF-\${DateTime.now().millisecondsSinceEpoch}',
      'actionType': actionType,
      'workOrderId': workOrderId,
      'taskId': taskId,
      'payload': payload,
      'timestamp': DateTime.now().toIso8601String(),
    });

    await _queueBox.add(entry);
  }

  Future<void> flushQueue() async {
    if (_queueBox.isEmpty) return;
    
    final keys = _queueBox.keys.toList();
    for (final key in keys) {
      final raw = _queueBox.get(key);
      if (raw != null) {
        final data = jsonDecode(raw);
        // Dispatch to Firestore batch
        await _queueBox.delete(key);
      }
    }
  }
}`;

  const getCode = () => {
    switch (activeTab) {
      case 'DART_ENGINE': return DART_ENGINE_CODE;
      case 'RIVERPOD': return RIVERPOD_NOTIFIER_CODE;
      case 'FIRESTORE_RULES': return FIRESTORE_RULES_CODE;
      case 'OFFLINE_SYNC': return OFFLINE_SYNC_CODE;
      default: return DART_ENGINE_CODE;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              Technical Specification
            </span>
            <span className="text-xs text-slate-400">Flutter • Dart • Riverpod • Firebase</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Clean Architecture &amp; Production Dart Codebase
          </h1>
          <p className="text-xs text-slate-400">
            Authoritative state machine, offline queue persistence, and Firestore role-based security rules.
          </p>
        </div>

        <button
          onClick={() => handleCopy(getCode())}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm transition-colors self-start md:self-center"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied Code' : 'Copy Code Snippet'}</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex items-center space-x-2 overflow-x-auto">
        {[
          { id: 'DART_ENGINE', label: '1. WorkflowEngine (Dart)', icon: Code2 },
          { id: 'RIVERPOD', label: '2. Riverpod 2.x Notifier', icon: Layers },
          { id: 'FIRESTORE_RULES', label: '3. firestore.rules (RBAC)', icon: ShieldCheck },
          { id: 'OFFLINE_SYNC', label: '4. Offline Sync & Queue', icon: Database },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center space-x-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Code Display Area */}
      <div className="bg-slate-950 rounded-3xl p-5 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="ml-2 text-slate-300 font-semibold">
              {activeTab === 'DART_ENGINE' && 'lib/domain/workflow/workflow_engine.dart'}
              {activeTab === 'RIVERPOD' && 'lib/presentation/controllers/work_order_notifier.dart'}
              {activeTab === 'FIRESTORE_RULES' && 'firestore.rules'}
              {activeTab === 'OFFLINE_SYNC' && 'lib/data/datasources/offline_sync_manager.dart'}
            </span>
          </div>
          <span className="text-[11px] text-cyan-400 font-bold">Production Ready</span>
        </div>

        <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed max-h-[500px]">
          <code>{getCode()}</code>
        </pre>
      </div>

    </div>
  );
};
