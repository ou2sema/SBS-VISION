import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  MapPin, 
  User, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WorkOrder } from '../types';

export const WorkOrdersList: React.FC = () => {
  const { workOrders, tasks, setSelectedWorkOrderId, setSelectedView, searchQuery } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const activeQuery = (searchTerm || searchQuery).toLowerCase();

  const filteredOrders = workOrders.filter(wo => {
    const matchesStatus = filterStatus === 'ALL' || wo.status === filterStatus;
    const matchesSearch = 
      !activeQuery ||
      wo.customerName.toLowerCase().includes(activeQuery) ||
      wo.id.toLowerCase().includes(activeQuery) ||
      wo.siteCity.toLowerCase().includes(activeQuery) ||
      wo.serviceName.toLowerCase().includes(activeQuery);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Wrench className="w-6 h-6 text-indigo-600" />
            <span>Work Orders Master List</span>
          </h1>
          <p className="text-sm text-slate-600">
            Automated sequential task pipelines governing field installations from contact to handover.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>{workOrders.length} Total Registered Work Orders</span>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer, city, WO ID, service..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'WAITING_FOR_CONTACT', 'VISIT_PENDING', 'WAITING_PAYMENT', 'WORK_AUTHORIZED', 'COMPLETED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStatus === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Work Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            <p className="text-sm font-medium">No work orders match the selected filters.</p>
          </div>
        ) : (
          filteredOrders.map(wo => {
            const woTasks = tasks.filter(t => t.workOrderId === wo.id);
            const activeTask = woTasks.find(t => t.status === 'TODO' || t.status === 'IN_PROGRESS');
            const completedCount = woTasks.filter(t => t.status === 'COMPLETED' || t.status === 'SKIPPED').length;

            return (
              <div
                key={wo.id}
                onClick={() => {
                  setSelectedWorkOrderId(wo.id);
                  setSelectedView('WORK_ORDER_DETAIL');
                }}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {wo.id}
                    </span>
                    <span className="text-xs text-slate-500">• Request: {wo.serviceRequestId}</span>
                    <span className="text-xs text-slate-400">• Created: {new Date(wo.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mt-1 truncate">
                    {wo.customerName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-1.5">
                    <span className="font-semibold text-slate-800">{wo.serviceName}</span>
                    <span className="flex items-center space-x-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{wo.siteCity} ({wo.siteAddress})</span>
                    </span>
                  </div>

                  {/* Active Next Task notification */}
                  {activeTask ? (
                    <div className="mt-2.5 flex items-center space-x-2 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 max-w-xl">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                      <span className="text-slate-500 font-medium">Next Actionable:</span>
                      <span className="font-bold text-slate-800 truncate">{activeTask.title}</span>
                    </div>
                  ) : wo.status === 'COMPLETED' ? (
                    <div className="mt-2.5 flex items-center space-x-2 text-xs text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Handed Over &amp; Signed Off</span>
                    </div>
                  ) : null}
                </div>

                {/* Right side: Progress Bar & Status Pill */}
                <div className="flex flex-col md:items-end space-y-2 md:w-56 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold self-start md:self-end ${
                    wo.status === 'WORK_AUTHORIZED' || wo.status === 'INSTALLATION_IN_PROGRESS'
                      ? 'bg-emerald-100 text-emerald-800'
                      : wo.status === 'WAITING_PAYMENT'
                      ? 'bg-amber-100 text-amber-800'
                      : wo.status === 'COMPLETED'
                      ? 'bg-slate-100 text-slate-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {wo.status.replace(/_/g, ' ')}
                  </span>

                  <div className="w-full">
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span>Tasks: {completedCount}/{woTasks.length}</span>
                      <span>{wo.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          wo.progressPercentage === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${wo.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <span className="text-xs font-bold text-indigo-600 flex items-center pt-1">
                    <span>Manage Workflow</span>
                    <ChevronRight className="w-4 h-4 ml-0.5" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
