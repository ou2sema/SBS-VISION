import React, { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  ShieldAlert, 
  DollarSign, 
  FileText, 
  Building2, 
  Banknote,
  Receipt,
  ExternalLink
} from 'lucide-react';
import { WorkflowTask, WorkOrder, Invoice, Quote } from '../../types';

interface InvoicePaymentTaskViewProps {
  task: WorkflowTask;
  workOrder: WorkOrder;
  invoice?: Invoice;
  quote?: Quote;
  onConfirmPayment: (paymentMethod: any, reference: string) => void;
  onUnlockInstallation: () => void;
  disabled?: boolean;
}

export const InvoicePaymentTaskView: React.FC<InvoicePaymentTaskViewProps> = ({
  task,
  workOrder,
  invoice,
  quote,
  onConfirmPayment,
  onUnlockInstallation,
  disabled
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'CASH' | 'CHEQUE' | 'ONLINE_CARD'>('BANK_TRANSFER');
  const [reference, setReference] = useState<string>('VIR-BNA-2026-9041');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const isPaid = invoice?.status === 'PAID';

  const handleConfirm = () => {
    setIsProcessing(true);
    onConfirmPayment(paymentMethod, reference);
    setIsProcessing(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      
      {/* Header with Commercial Gate Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Commercial Gate • Section 17 &amp; 18
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Authoritative Financial Validation
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center space-x-2">
            <span>Customer Invoice &amp; Payment Verification</span>
            {isPaid ? (
              <Unlock className="w-5 h-5 text-emerald-600" />
            ) : (
              <Lock className="w-5 h-5 text-rose-600" />
            )}
          </h2>
          <p className="text-xs text-slate-500">
            Installation tasks remain locked until commercial settlement is recorded in the backend.
          </p>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800 animate-pulse'
        }`}>
          {isPaid ? 'PAID • WORK AUTHORIZED' : 'UNPAID • COMMERCIAL LOCK'}
        </span>
      </div>

      {/* Commercial Gate Warning Banner if UNPAID */}
      {!isPaid && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-900">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-sm text-rose-900">Commercial Gate Active: Field Work Blocked</p>
            <p className="text-rose-700 mt-0.5">
              The backend workflow engine prevents unlocking <strong>Prepare Equipment</strong>, <strong>Mount Cameras</strong>, 
              or <strong>Configuration</strong> until invoice payment is verified.
            </p>
          </div>
        </div>
      )}

      {/* Invoice Overview Card */}
      {invoice ? (
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-extrabold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {invoice.id}
                </span>
                <span className="text-xs text-slate-500">Quote Ref: {invoice.quoteId}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Issued on {new Date(invoice.createdAt).toLocaleDateString()} to <strong>{workOrder.customerName}</strong>
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs text-slate-500 uppercase font-semibold">Total Amount Due</span>
              <p className="text-2xl font-black text-slate-900 font-mono">
                {invoice.amount.toFixed(2)} <span className="text-sm font-sans font-bold text-slate-500">TND</span>
              </p>
            </div>
          </div>

          {/* Payment Status Details */}
          {isPaid ? (
            <div className="bg-emerald-50 p-3.5 rounded-lg border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-bold">Payment Confirmed ({invoice.paymentMethod})</p>
                  <p className="text-emerald-700 text-[11px]">
                    Reference: {invoice.paymentReference} • Recorded {new Date(invoice.paidAt || '').toLocaleString()}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-600 text-white rounded font-bold text-[11px]">
                WORK AUTHORIZED
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Admin / Accountant Payment Confirmation
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'BANK_TRANSFER', label: 'Bank Wire Transfer', icon: Building2 },
                  { id: 'CASH', label: 'Cash / Office Receipt', icon: Banknote },
                  { id: 'CHEQUE', label: 'Bank Cheque', icon: Receipt },
                  { id: 'ONLINE_CARD', label: 'Online Card (Gateway)', icon: CreditCard },
                ].map(m => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        paymentMethod === m.id
                          ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${paymentMethod === m.id ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="text-xs font-semibold mt-2">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Bank Wire Reference / Cheque # / Cash Receipt Voucher
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={e => setReference(e.target.value)}
                  placeholder="e.g. BNA-TRANSFER-49204 or CHQ-0091823"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono font-medium focus:ring-2 focus:ring-rose-500 outline-none bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <p className="text-[11px] text-slate-500">
                  Submitting verification writes to <strong>/invoices</strong>, unlocks <strong>Equipment Preparation</strong>, 
                  and sets Work Order to <strong>WORK_AUTHORIZED</strong>.
                </p>

                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={disabled || isProcessing || !reference}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CONFIRM PAYMENT &amp; AUTHORIZE WORK</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
          Quote must be accepted by customer before invoice is generated.
        </div>
      )}

    </div>
  );
};
