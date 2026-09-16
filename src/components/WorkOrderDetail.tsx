import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  User, 
  MapPin, 
  Phone, 
  FileText, 
  CreditCard, 
  ShieldCheck, 
  Settings, 
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WorkflowTask, WorkOrder } from '../types';
import { ContactTaskView } from './tasks/ContactTaskView';
import { SiteVisitTaskView } from './tasks/SiteVisitTaskView';
import { QuoteTaskView } from './tasks/QuoteTaskView';
import { InvoicePaymentTaskView } from './tasks/InvoicePaymentTaskView';
import { InstallationTaskView } from './tasks/InstallationTaskView';
import { TestingAndHandoverView } from './tasks/TestingAndHandoverView';

export const WorkOrderDetail: React.FC = () => {
  const { 
    selectedWorkOrderId, 
    setSelectedWorkOrderId, 
    setSelectedView,
    workOrders, 
    tasks, 
    quotes, 
    invoices, 
    installedAssets,
    currentUser,
    completeTask,
    saveQuote,
    confirmPayment,
    adminOverride,
    recordInstalledAsset,
    finalizeJobAndReport,
  } = useApp();

  const workOrder = workOrders.find(w => w.id === selectedWorkOrderId);
  const woTasks = tasks.filter(t => t.workOrderId === selectedWorkOrderId);
  const quote = quotes.find(q => q.workOrderId === selectedWorkOrderId);
  const invoice = invoices.find(i => i.workOrderId === selectedWorkOrderId);

  // Default active task selection
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideAction, setOverrideAction] = useState<'SKIP_TASK' | 'FORCE_UNLOCK' | 'REOPEN_TASK'>('FORCE_UNLOCK');
  const [overrideReason, setOverrideReason] = useState('Authorized client emergency dispensation approved by management.');

  useEffect(() => {
    if (woTasks.length > 0 && !activeTaskId) {
      // Find first actionable task (TODO or IN_PROGRESS), or fallback to first
      const actionable = woTasks.find(t => t.status === 'TODO' || t.status === 'IN_PROGRESS');
      setActiveTaskId(actionable ? actionable.id : woTasks[0].id);
    }
  }, [woTasks, activeTaskId]);

  if (!workOrder) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500 font-medium">Work Order not found.</p>
        <button
          onClick={() => setSelectedView('WORK_ORDERS')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Work Orders
        </button>
      </div>
    );
  }

  const activeTask = woTasks.find(t => t.id === activeTaskId) || woTasks[0];
  const canAdminOverride = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN';

  const handleExecuteOverride = () => {
    if (!activeTaskId || !overrideReason) return;
    adminOverride(workOrder.id, activeTaskId, overrideAction, overrideReason);
    setShowOverrideModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Navigation & Summary Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSelectedView('WORK_ORDERS')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Back to list"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {workOrder.id}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Service Request: {workOrder.serviceRequestId}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  workOrder.status === 'COMPLETED'
                    ? 'bg-slate-100 text-slate-800'
                    : workOrder.status === 'WORK_AUTHORIZED' || workOrder.status === 'INSTALLATION_IN_PROGRESS'
                    ? 'bg-emerald-100 text-emerald-800'
                    : workOrder.status === 'WAITING_PAYMENT'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {workOrder.status.replace(/_/g, ' ')}
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 mt-1">
                {workOrder.serviceName} • {workOrder.customerName}
              </h1>
            </div>
          </div>

          {/* Quick Actions & Admin Override Trigger */}
          <div className="flex items-center space-x-2">
            {canAdminOverride && (
              <button
                onClick={() => setShowOverrideModal(true)}
                className="px-3.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center space-x-1.5 transition-colors"
                title="Admin Workflow Override (Section 36)"
              >
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Admin Override</span>
              </button>
            )}

            {/* Shortcut to customer portal to test customer approval */}
            {quote && quote.status === 'SENT' && (
              <button
                onClick={() => setSelectedView('CUSTOMER_PORTAL')}
                className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 text-xs font-bold flex items-center space-x-1"
                title="Customer Portal"
              >
                <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
                <span>Simulate Customer Approval</span>
              </button>
            )}
          </div>
        </div>

        {/* Info Grid & Progress Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Customer Contact</span>
            <div className="font-bold text-slate-800 mt-0.5">{workOrder.customerName}</div>
            <div className="text-slate-600 font-mono">{workOrder.customerPhone}</div>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Installation Site</span>
            <div className="font-bold text-slate-800 mt-0.5">{workOrder.siteCity}</div>
            <div className="text-slate-600 truncate">{workOrder.siteAddress}</div>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Commercial Status</span>
            <div className="font-bold text-slate-800 mt-0.5">
              {quote ? `Quote v${quote.currentVersion} (${quote.status})` : 'No Quote Drafted'}
            </div>
            <div className="text-slate-600">
              {invoice ? `Invoice: ${invoice.status} (${invoice.amount.toFixed(2)} TND)` : 'Invoice Pending'}
            </div>
          </div>

          <div>
            <div className="flex justify-between font-bold text-slate-700 mb-1">
              <span>Overall Progress</span>
              <span>{workOrder.progressPercentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  workOrder.progressPercentage === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${workOrder.progressPercentage}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {woTasks.filter(t => t.status === 'COMPLETED').length} of {woTasks.length} tasks completed
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Workflow Timeline / Right = Task Execution View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Authoritative Workflow Timeline (Section 8) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <Wrench className="w-3.5 h-3.5 text-blue-600" />
              <span>Workflow Pipeline</span>
            </h3>
            <span className="text-[11px] text-slate-400">Sequential</span>
          </div>

          <div className="relative pl-3 space-y-1">
            {woTasks.map((t, idx) => {
              const isSelected = activeTaskId === t.id;
              const isCompleted = t.status === 'COMPLETED';
              const isLocked = t.status === 'LOCKED';
              const isActionable = t.status === 'TODO' || t.status === 'IN_PROGRESS';
              const isCommercialGate = t.isCommercialGate;

              return (
                <div
                  key={t.id}
                  onClick={() => setActiveTaskId(t.id)}
                  className={`relative flex items-start space-x-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/80 border border-blue-300 shadow-xs'
                      : isCompleted
                      ? 'hover:bg-slate-50 text-slate-700'
                      : isLocked
                      ? 'opacity-65 hover:opacity-90 text-slate-400'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  {/* Status Indicator Icon */}
                  <div className="pt-0.5 shrink-0">
                    {isCompleted ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : isLocked ? (
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    ) : isActionable ? (
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center animate-pulse">
                        <span className="text-[11px] font-bold">{t.stepOrder}</span>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Task Text & Step Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-bold truncate ${
                        isSelected ? 'text-blue-900' : isCompleted ? 'text-slate-800' : isLocked ? 'text-slate-500' : 'text-slate-900'
                      }`}>
                        {t.title}
                      </p>
                      {isCommercialGate && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 ml-1">
                          GATE
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {isCompleted ? 'Completed' : isLocked ? 'Locked by prerequisites' : t.actionType}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Execution View for the Selected Task */}
        <div className="lg:col-span-8">
          {activeTask ? (
            <div>
              {/* Task Dependency / Lock Notice */}
              {activeTask.status === 'LOCKED' && (
                <div className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-amber-900">
                  <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-sm">Task Currently Locked</p>
                    <p className="mt-0.5 text-amber-800">
                      This task is locked by the backend workflow engine. You must complete upstream prerequisite steps 
                      {activeTask.dependencies.length > 0 ? ` (${activeTask.dependencies.join(', ')})` : ''} 
                      before this task becomes actionable.
                    </p>
                    {activeTask.isCommercialGate && (
                      <p className="font-bold text-rose-700 mt-1">
                        Commercial Gate: Customer must accept quote and clear invoice payment before proceeding!
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Render Appropriate Sub-Task Component based on templateStepId */}
              {activeTask.templateStepId === 'contact_customer' && (
                <ContactTaskView
                  task={activeTask}
                  workOrder={workOrder}
                  onComplete={data => completeTask(workOrder.id, activeTask.id, data)}
                  disabled={activeTask.status === 'LOCKED'}
                />
              )}

              {activeTask.templateStepId === 'site_visit' && (
                <SiteVisitTaskView
                  task={activeTask}
                  workOrder={workOrder}
                  onComplete={data => completeTask(workOrder.id, activeTask.id, data)}
                  disabled={activeTask.status === 'LOCKED'}
                />
              )}

              {activeTask.templateStepId === 'create_quote' && (
                <QuoteTaskView
                  task={activeTask}
                  workOrder={workOrder}
                  quote={quote}
                  onSaveQuote={(items, discount, notes) => saveQuote(workOrder.id, items, discount, notes)}
                  disabled={activeTask.status === 'LOCKED'}
                />
              )}

              {activeTask.templateStepId === 'customer_approval' && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-extrabold text-slate-900 text-lg">Customer Quote Approval Gate</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      quote?.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {quote?.status || 'AWAITING APPROVAL'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    The customer must review and approve Quote {quote?.id} on their portal.
                  </p>

                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
                    <div>
                      <p className="font-bold">Test Customer Portal Response:</p>
                      <p className="text-[11px] text-purple-700">You can simulate the customer accepting the quote in one click.</p>
                    </div>
                    <button
                      onClick={() => setSelectedView('CUSTOMER_PORTAL')}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-sm"
                    >
                      Open Customer Portal
                    </button>
                  </div>
                </div>
              )}

              {(activeTask.templateStepId === 'create_invoice' || activeTask.templateStepId === 'customer_payment') && (
                <InvoicePaymentTaskView
                  task={activeTask}
                  workOrder={workOrder}
                  invoice={invoice}
                  quote={quote}
                  onConfirmPayment={(method, ref) => invoice && confirmPayment(invoice.id, method, ref)}
                  onUnlockInstallation={() => completeTask(workOrder.id, activeTask.id)}
                  disabled={activeTask.status === 'LOCKED'}
                />
              )}

              {(activeTask.templateStepId === 'prepare_equipment' || activeTask.templateStepId === 'mount_cameras' || activeTask.templateStepId === 'cable_installation') && (
                <InstallationTaskView
                  task={activeTask}
                  workOrder={workOrder}
                  installedAssets={installedAssets}
                  onRecordAsset={recordInstalledAsset}
                  onComplete={data => completeTask(workOrder.id, activeTask.id, data)}
                  disabled={activeTask.status === 'LOCKED'}
                />
              )}

              {(activeTask.templateStepId === 'testing_commissioning' || activeTask.templateStepId === 'customer_handover' || activeTask.templateStepId === 'device_configuration') && (
                <TestingAndHandoverView
                  task={activeTask}
                  workOrder={workOrder}
                  installedAssets={installedAssets}
                  onComplete={data => completeTask(workOrder.id, activeTask.id, data)}
                  onFinalizeJob={reportData => finalizeJobAndReport(workOrder.id, reportData)}
                  disabled={activeTask.status === 'LOCKED'}
                />
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
              Select a task from the workflow timeline on the left.
            </div>
          )}
        </div>

      </div>

      {/* Section 36: Admin Workflow Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-amber-600">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-lg">Admin Workflow Override</h3>
              </div>
              <button onClick={() => setShowOverrideModal(false)} className="text-slate-400 hover:text-slate-600">
                ×
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
              <p className="font-bold">Audit Policy Notice</p>
              <p className="mt-0.5">
                Overrides bypass standard sequential gates. Every override is logged permanently with your user ID (
                {currentUser.name} - {currentUser.role}) in the Firestore audit trail.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Selected Task to Override
              </label>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
                {activeTask?.title} ({activeTask?.status})
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Override Action
              </label>
              <select
                value={overrideAction}
                onChange={e => setOverrideAction(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold outline-none"
              >
                <option value="FORCE_UNLOCK">Force Unlock Task (Bypass Prerequisites)</option>
                <option value="SKIP_TASK">Mark Task as SKIPPED (Bypass Step)</option>
                <option value="REOPEN_TASK">Reopen Completed Task for Revision</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Mandatory Business Justification (Required)
              </label>
              <textarea
                rows={3}
                required
                value={overrideReason}
                onChange={e => setOverrideReason(e.target.value)}
                placeholder="State the exact contractual or emergency operational reason..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowOverrideModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteOverride}
                disabled={!overrideReason.trim()}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md disabled:opacity-50"
              >
                Apply Override &amp; Log Audit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
