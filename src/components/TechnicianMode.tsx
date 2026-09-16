import React, { useState } from 'react';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  MapPin, 
  Phone, 
  Navigation, 
  Camera, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Layers, 
  FileText, 
  AlertCircle,
  Upload,
  Check,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TechnicianMode: React.FC = () => {
  const { 
    currentUser, 
    workOrders, 
    tasks, 
    isOnline, 
    syncState, 
    pendingSyncCount, 
    toggleOnline,
    setSelectedWorkOrderId, 
    setSelectedView,
    completeTask
  } = useApp();

  const [activeTab, setActiveTab] = useState<'TODAY' | 'ALL_JOBS' | 'SYNC_STATUS'>('TODAY');

  // Filter tasks assigned to this technician or available
  const myTasks = tasks.filter(t => t.assignedToId === currentUser.id || !t.assignedToId);
  const actionableTasks = myTasks.filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS');

  // Find primary active job & next task for "WHAT SHOULD I DO NEXT?" (Section 28)
  const currentTask = actionableTasks[0] || myTasks[0];
  const currentWorkOrder = currentTask 
    ? workOrders.find(w => w.id === currentTask.workOrderId) 
    : workOrders[0];

  return (
    <div className="max-w-md mx-auto bg-slate-100 min-h-screen pb-20 shadow-2xl rounded-3xl overflow-hidden border border-slate-300 flex flex-col">
      
      {/* Mobile App Bar */}
      <div className="bg-slate-900 text-white p-4 sticky top-0 z-30 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-bold text-slate-950 text-sm">
              ST
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">{currentUser.name}</h2>
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                Field Technician Handheld
              </span>
            </div>
          </div>

          {/* Network Sync Pill */}
          <button
            onClick={toggleOnline}
            className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-all ${
              isOnline
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700'
                : 'bg-rose-950/80 text-rose-300 border border-rose-700 animate-pulse'
            }`}
            title="Toggle online / offline mode"
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-rose-400" />}
            <span className="text-[11px]">{isOnline ? 'Online' : 'Offline'}</span>
            {pendingSyncCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center">
                {pendingSyncCount}
              </span>
            )}
          </button>
        </div>

        {/* Offline notice bar if offline */}
        {!isOnline && (
          <div className="mt-2.5 p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between">
            <span className="text-[11px]">Basement / Offline Cache Active</span>
            <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">
              {pendingSyncCount} changes queued
            </span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4 flex-1">
        
        {activeTab === 'TODAY' && (
          <>
            {/* SECTION 28: "WHAT SHOULD I DO NEXT?" CARD */}
            {currentTask && currentWorkOrder ? (
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-5 shadow-xl border border-indigo-800/40 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold mb-2">
                  <span className="uppercase tracking-wider flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1"></span>
                    What to do next
                  </span>
                  <span className="font-mono text-white bg-indigo-900/80 px-2 py-0.5 rounded border border-indigo-700/60">
                    {currentWorkOrder.id}
                  </span>
                </div>

                <h3 className="text-xl font-black text-white tracking-tight">
                  {currentTask.title}
                </h3>
                <p className="text-xs text-indigo-200 mt-1 line-clamp-2">
                  {currentTask.description}
                </p>

                {/* Site location & rapid phone dial */}
                <div className="mt-4 pt-3 border-t border-indigo-900/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{currentWorkOrder.siteAddress}, {currentWorkOrder.siteCity}</span>
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(currentWorkOrder.siteAddress + ' ' + currentWorkOrder.siteCity)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-amber-400 flex items-center hover:underline shrink-0 ml-2"
                    >
                      <Navigation className="w-3 h-3 mr-1" />
                      GPS
                    </a>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{currentWorkOrder.customerName} ({currentWorkOrder.customerPhone})</span>
                    </div>
                    <a
                      href={`tel:${currentWorkOrder.customerPhone}`}
                      className="text-[11px] font-bold text-emerald-400 flex items-center hover:underline shrink-0 ml-2"
                    >
                      Call
                    </a>
                  </div>
                </div>

                {/* Large Touch Target Action Button (min 44px height) */}
                <button
                  onClick={() => {
                    setSelectedWorkOrderId(currentWorkOrder.id);
                    setSelectedView('WORK_ORDER_DETAIL');
                  }}
                  className="mt-5 w-full h-12 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/30 transition-all"
                >
                  <span>EXECUTE THIS STEP NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-bold text-slate-900">All Tasks Completed!</h4>
                <p className="text-xs text-slate-500 mt-1">Check with dispatch for newly accepted jobs.</p>
              </div>
            )}

            {/* List of Tasks Queued for Today */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                Sequential Field Queue ({actionableTasks.length} Actionable)
              </h4>

              {actionableTasks.map(task => {
                const wo = workOrders.find(w => w.id === task.workOrderId);
                const isSelected = task.id === currentTask?.id;

                return (
                  <div
                    key={task.id}
                    onClick={() => {
                      if (wo) {
                        setSelectedWorkOrderId(wo.id);
                        setSelectedView('WORK_ORDER_DETAIL');
                      }
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-amber-400 shadow-md ring-1 ring-amber-400'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="pr-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {wo?.id}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{wo?.customerName}</span>
                        </div>
                        <h5 className="font-extrabold text-sm text-slate-900 mt-1">{task.title}</h5>
                        <p className="text-xs text-slate-500 mt-0.5">{wo?.siteCity} • {wo?.serviceName}</p>
                      </div>

                      <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 mt-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === 'ALL_JOBS' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              All Assigned Field Work Orders
            </h4>
            {workOrders.map(wo => (
              <div
                key={wo.id}
                onClick={() => {
                  setSelectedWorkOrderId(wo.id);
                  setSelectedView('WORK_ORDER_DETAIL');
                }}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-blue-600">{wo.id}</span>
                  <span className="font-bold text-slate-700">{wo.progressPercentage}%</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{wo.customerName}</h4>
                <p className="text-xs text-slate-500">{wo.serviceName}</p>
                <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${wo.progressPercentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'SYNC_STATUS' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Offline Storage &amp; Sync Engine</h4>
              <p className="text-xs text-slate-600">
                SecurOps caches active work orders in local storage. When you photograph hardware or complete steps in underground basements,
                changes are stored in the local SQLite/IndexedDB queue and pushed when GSM signal returns.
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Network State:</span>
                  <span className={`font-bold ${isOnline ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isOnline ? 'CONNECTED' : 'DISCONNECTED'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sync Engine Status:</span>
                  <span className="font-bold text-slate-800">{syncState}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pending Actions in Queue:</span>
                  <span className="font-bold text-amber-600">{pendingSyncCount}</span>
                </div>
              </div>

              <button
                onClick={toggleOnline}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                {isOnline ? 'Simulate Poor Network (Go Offline)' : 'Reconnect & Force Sync Now'}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Mobile Bottom Navigation Bar (Section 27) */}
      <div className="bg-white border-t border-slate-200 p-2 fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('TODAY')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'TODAY' ? 'text-amber-600 font-bold' : 'text-slate-400'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Today</span>
        </button>

        <button
          onClick={() => setActiveTab('ALL_JOBS')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'ALL_JOBS' ? 'text-amber-600 font-bold' : 'text-slate-400'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">My Jobs</span>
        </button>

        <button
          onClick={() => setActiveTab('SYNC_STATUS')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors relative ${
            activeTab === 'SYNC_STATUS' ? 'text-amber-600 font-bold' : 'text-slate-400'
          }`}
        >
          <RefreshCw className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Sync</span>
          {pendingSyncCount > 0 && (
            <span className="absolute top-0 right-3 w-3 h-3 bg-rose-500 rounded-full"></span>
          )}
        </button>
      </div>

    </div>
  );
};
