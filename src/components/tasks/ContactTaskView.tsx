import React, { useState } from 'react';
import { 
  PhoneCall, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  Calendar,
  User,
  AlertCircle
} from 'lucide-react';
import { WorkflowTask, WorkOrder } from '../../types';

interface ContactTaskViewProps {
  task: WorkflowTask;
  workOrder: WorkOrder;
  onComplete: (data: any) => void;
  disabled?: boolean;
}

export const ContactTaskView: React.FC<ContactTaskViewProps> = ({
  task,
  workOrder,
  onComplete,
  disabled
}) => {
  const [reachedOutcome, setReachedOutcome] = useState<'CUSTOMER_REACHED' | 'NO_ANSWER' | 'WRONG_NUMBER' | 'CALLBACK_REQUESTED'>('CUSTOMER_REACHED');
  const [preferredVisitDate, setPreferredVisitDate] = useState('');
  const [notes, setNotes] = useState('Customer confirmed requirements and prefers visit tomorrow afternoon.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = () => {
    setIsSubmitting(true);
    onComplete({
      contactResult: reachedOutcome,
      preferredVisitDate,
      contactNotes: notes,
      contactedAt: new Date().toISOString(),
    });
  };

  const isCompleted = task.status === 'COMPLETED';

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Step 1 • Initial Outreach
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Contact Customer
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Call or WhatsApp to clarify installation requirements and schedule site survey.
          </p>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {task.status}
        </span>
      </div>

      {/* Customer Info & Direct Dial Actions */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base shrink-0">
            {workOrder.customerName.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{workOrder.customerName}</h4>
            <p className="text-xs text-slate-500">{workOrder.siteCity} • {workOrder.siteAddress}</p>
            <p className="text-xs font-mono font-semibold text-slate-700 mt-0.5">{workOrder.customerPhone}</p>
          </div>
        </div>

        {/* Quick Launch Call / WhatsApp */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <a
            href={`tel:${workOrder.customerPhone}`}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call</span>
          </a>
          <a
            href={`https://wa.me/${workOrder.customerPhone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Outcome Radio/Checkboxes as requested in Section 9 */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Contact Result
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[
            { id: 'CUSTOMER_REACHED', label: 'Customer reached & requirements confirmed' },
            { id: 'CALLBACK_REQUESTED', label: 'Requested callback at specific time' },
            { id: 'NO_ANSWER', label: 'No answer / voicemail left' },
            { id: 'WRONG_NUMBER', label: 'Wrong number or invalid contact' },
          ].map(opt => (
            <label
              key={opt.id}
              className={`flex items-center space-x-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                reachedOutcome === opt.id
                  ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="contactOutcome"
                disabled={isCompleted || disabled}
                checked={reachedOutcome === opt.id}
                onChange={() => setReachedOutcome(opt.id as any)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Preferred visit schedule & notes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Site Survey Schedule
          </label>
          <input
            type="datetime-local"
            disabled={isCompleted || disabled}
            value={preferredVisitDate}
            onChange={e => setPreferredVisitDate(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Contact Notes
          </label>
          <input
            type="text"
            disabled={isCompleted || disabled}
            placeholder="e.g. Customer prefers technician visit after 2 PM; gate code 4092."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          />
        </div>
      </div>

      {/* Completion Button */}
      {!isCompleted && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Completing this task automatically unlocks <strong>Task 2: Site Survey Visit</strong> in the backend engine.
          </p>
          <button
            onClick={handleComplete}
            disabled={disabled || isSubmitting}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Contact</span>
          </button>
        </div>
      )}

      {isCompleted && (
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Contact completed on {task.completedAt ? new Date(task.completedAt).toLocaleString() : 'recently'}. Downstream Site Visit task unlocked.
          </span>
        </div>
      )}

    </div>
  );
};
