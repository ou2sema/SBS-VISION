import React from 'react';
import { 
  Inbox, 
  Clock, 
  Calendar, 
  FileCheck2, 
  CreditCard, 
  Wrench, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  Check, 
  X, 
  ExternalLink,
  PlusCircle,
  MapPin,
  Building,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ServiceRequest } from '../types';

export const AdminDashboard: React.FC = () => {
  const { 
    requests, 
    workOrders, 
    tasks, 
    quotes, 
    invoices, 
    appointments, 
    acceptRequest, 
    rejectRequest,
    setSelectedView, 
    setSelectedWorkOrderId,
    setStatusFilter
  } = useApp();

  // Metrics computation answering "What needs my attention?"
  const newRequestsCount = requests.filter(r => r.status === 'NEW').length;
  const tasksDueCount = tasks.filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS').length;
  const visitsTodayCount = appointments.filter(a => a.type === 'SITE_VISIT' && a.status !== 'COMPLETED').length;
  const waitingApprovalCount = quotes.filter(q => q.status === 'SENT').length;
  const waitingPaymentCount = invoices.filter(i => i.status === 'UNPAID').length;
  const activeJobsCount = workOrders.filter(w => w.status !== 'COMPLETED' && w.status !== 'CANCELLED').length;
  const completedTodayCount = workOrders.filter(w => w.status === 'COMPLETED').length;

  const urgentRequests = requests.filter(r => r.status === 'NEW');
  const activeOrders = workOrders.filter(w => w.status !== 'COMPLETED').slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* Executive Welcome & Today's Summary Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Operations Cockpit
            </span>
            <span className="text-xs text-slate-500">Authoritative Workflow Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            What needs your attention today?
          </h1>
          <p className="text-sm text-slate-600">
            Automated task engine progressively unlocks operational stages according to strict commercial rules.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSelectedView('REQUESTS')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center space-x-2"
          >
            <Inbox className="w-4 h-4" />
            <span>Process Inbound ({newRequestsCount})</span>
          </button>
          <button
            onClick={() => setSelectedView('WORK_ORDERS')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
          >
            All Work Orders
          </button>
        </div>
      </div>

      {/* KPI Attention Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* New Requests */}
        <div 
          onClick={() => { setStatusFilter('NEW'); setSelectedView('REQUESTS'); }}
          className="bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">New Requests</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{newRequestsCount}</div>
          <span className="text-[11px] text-blue-600 font-medium flex items-center mt-1">
            Pending triage <ArrowRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>

        {/* Tasks Due */}
        <div 
          onClick={() => setSelectedView('WORK_ORDERS')}
          className="bg-white rounded-xl p-4 border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tasks Due</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{tasksDueCount}</div>
          <span className="text-[11px] text-amber-600 font-medium flex items-center mt-1">
            Actionable now <ArrowRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>

        {/* Visits Today */}
        <div 
          onClick={() => setSelectedView('APPOINTMENTS')}
          className="bg-white rounded-xl p-4 border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Visits Today</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{visitsTodayCount}</div>
          <span className="text-[11px] text-indigo-600 font-medium flex items-center mt-1">
            Field scheduled <ArrowRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>

        {/* Waiting Approval */}
        <div 
          onClick={() => setSelectedView('WORK_ORDERS')}
          className="bg-white rounded-xl p-4 border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Waiting Approval</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{waitingApprovalCount}</div>
          <span className="text-[11px] text-purple-600 font-medium flex items-center mt-1">
            Quotes sent <ArrowRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>

        {/* Waiting Payment (Commercial Gate) */}
        <div 
          onClick={() => setSelectedView('WORK_ORDERS')}
          className="bg-white rounded-xl p-4 border border-rose-200 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group bg-rose-50/20"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Waiting Payment</span>
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-900">{waitingPaymentCount}</div>
          <span className="text-[11px] text-rose-600 font-medium flex items-center mt-1">
            Commercial gate <ArrowRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>

        {/* Active Jobs */}
        <div 
          onClick={() => setSelectedView('WORK_ORDERS')}
          className="bg-white rounded-xl p-4 border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Jobs</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{activeJobsCount}</div>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center mt-1">
            In execution <ArrowRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>

      </div>

      {/* Main Grid: Urgent Inbound Requests & Work Orders in Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Inbound Requests (Section 6 & 7 in prompt) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Inbox className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Incoming Customer Requests</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {urgentRequests.length}
              </span>
            </div>
            <button
              onClick={() => setSelectedView('REQUESTS')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {urgentRequests.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-medium">All incoming requests have been triaged!</p>
              </div>
            ) : (
              urgentRequests.map(req => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {req.id}
                        </span>
                        <span className="text-xs text-slate-400">• {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {req.urgency === 'URGENT' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                            URGENT
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{req.customerName}</h3>
                      <div className="flex items-center space-x-3 text-xs text-slate-600 mt-1">
                        <span className="flex items-center space-x-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium text-slate-800">{req.serviceName}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{req.location}</span>
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800">
                      NEW
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{req.description}"
                  </p>

                  {/* Request photos preview if present */}
                  {req.photos.length > 0 && (
                    <div className="flex items-center space-x-2 mt-3">
                      <span className="text-[11px] text-slate-400 font-medium">{req.photos.length} photos attached:</span>
                      <div className="flex space-x-1.5">
                        {req.photos.map((p, idx) => (
                          <img
                            key={idx}
                            src={p}
                            alt="Site attach"
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions Bar as requested: [ACCEPT], [REJECT], [CALL] */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center space-x-2">
                      <a
                        href={`tel:${req.customerPhone}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                        <span>Call ({req.customerPhone})</span>
                      </a>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => rejectRequest(req.id, 'Duplicate or unserviceable area')}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center space-x-1 transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-slate-400" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => acceptRequest(req.id)}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm shadow-emerald-600/20 transition-all"
                      >
                        <Check className="w-4 h-4" />
                        <span>ACCEPT &amp; CREATE WORKFLOW</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Active Work Orders & Progress */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wrench className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Active Work Orders</h2>
            </div>
            <button
              onClick={() => setSelectedView('WORK_ORDERS')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>View All ({workOrders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activeOrders.map(wo => {
              const woTasks = tasks.filter(t => t.workOrderId === wo.id);
              const activeTask = woTasks.find(t => t.status === 'TODO' || t.status === 'IN_PROGRESS');

              return (
                <div
                  key={wo.id}
                  onClick={() => {
                    setSelectedWorkOrderId(wo.id);
                    setSelectedView('WORK_ORDER_DETAIL');
                  }}
                  className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {wo.id}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{wo.siteCity}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 mt-1 text-sm">{wo.customerName}</h4>
                      <p className="text-xs text-slate-500">{wo.serviceName}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      wo.status === 'WORK_AUTHORIZED' || wo.status === 'INSTALLATION_IN_PROGRESS'
                        ? 'bg-emerald-100 text-emerald-800'
                        : wo.status === 'WAITING_PAYMENT'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {wo.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium mb-1">
                      <span>Workflow Progress</span>
                      <span className="font-bold text-slate-800">{wo.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${
                          wo.progressPercentage >= 80 ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${wo.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Current Active Task */}
                  {activeTask && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1.5 text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                        <span className="font-medium text-slate-800 truncate max-w-[200px]">
                          {activeTask.title}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-blue-600 flex items-center">
                        Execute <ArrowRight className="w-3 h-3 ml-0.5" />
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
