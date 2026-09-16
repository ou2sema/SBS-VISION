import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Plus, 
  CheckCircle2, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Appointment } from '../types';

export const AppointmentsView: React.FC = () => {
  const { appointments, workOrders, scheduleAppointment, setSelectedWorkOrderId, setSelectedView } = useApp();
  const [showModal, setShowModal] = useState(false);

  // Modal form state
  const [selectedWoId, setSelectedWoId] = useState(workOrders[0]?.id || '');
  const [type, setType] = useState<'SITE_VISIT' | 'INSTALLATION' | 'MAINTENANCE'>('SITE_VISIT');
  const [scheduledAt, setScheduledAt] = useState('2026-09-16T14:30');
  const [techName, setTechName] = useState('Slimane Trabelsi');
  const [notes, setNotes] = useState('Inspect perimeter fence line and power outlets');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const wo = workOrders.find(w => w.id === selectedWoId);
    if (!wo) return;

    scheduleAppointment({
      workOrderId: wo.id,
      customerName: wo.customerName,
      customerPhone: wo.customerPhone,
      technicianId: 'user_tech_slimane',
      technicianName: techName,
      scheduledAt,
      type,
      status: 'CONFIRMED',
      location: `${wo.siteAddress}, ${wo.siteCity}`,
      notes,
    });

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-indigo-600" />
            <span>Field Appointments &amp; Dispatch Schedule</span>
          </h1>
          <p className="text-sm text-slate-600">
            Coordinated site surveys, physical installations, and customer handover appointments.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Grid of Appointments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {appointments.map(apt => (
          <div
            key={apt.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  apt.type === 'SITE_VISIT'
                    ? 'bg-blue-100 text-blue-800'
                    : apt.type === 'INSTALLATION'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {apt.type.replace(/_/g, ' ')}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">{apt.id}</span>
              </div>

              <h3 className="font-bold text-slate-900 text-base">{apt.customerName}</h3>
              
              <div className="space-y-1.5 mt-3 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="font-semibold text-slate-800">
                    {new Date(apt.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Technician: <strong>{apt.technicianName}</strong></span>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{apt.location}</span>
                </div>
              </div>

              {apt.notes && (
                <p className="text-xs text-slate-600 mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  "{apt.notes}"
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">WO: {apt.workOrderId}</span>
              <button
                onClick={() => {
                  setSelectedWorkOrderId(apt.workOrderId);
                  setSelectedView('WORK_ORDER_DETAIL');
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
              >
                <span>View Job</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Book Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Schedule Field Appointment</h3>
            
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Select Work Order</label>
                <select
                  value={selectedWoId}
                  onChange={e => setSelectedWoId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium outline-none"
                >
                  {workOrders.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.id} — {w.customerName} ({w.serviceName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Appointment Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium outline-none"
                >
                  <option value="SITE_VISIT">Site Visit &amp; Technical Inspection</option>
                  <option value="INSTALLATION">Physical Installation &amp; Cabling</option>
                  <option value="MAINTENANCE">Maintenance / Testing</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Scheduled Date &amp; Time</label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={e => setScheduledAt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Assigned Lead Technician</label>
                <select
                  value={techName}
                  onChange={e => setTechName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium outline-none"
                >
                  <option value="Slimane Trabelsi">Slimane Trabelsi (Lead Security Specialist)</option>
                  <option value="Zied Khelil">Zied Khelil (Senior Network &amp; Wi-Fi Tech)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Field Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
