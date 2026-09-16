import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  ArrowLeft, 
  Printer, 
  ShieldCheck, 
  Lock, 
  Download, 
  Calendar, 
  Building, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Quote } from '../../types';

interface CustomerQuoteViewProps {
  quoteId: string;
  onBack: () => void;
  onProceedToInvoice?: (invoiceId: string) => void;
}

export const CustomerQuoteView: React.FC<CustomerQuoteViewProps> = ({
  quoteId,
  onBack,
  onProceedToInvoice,
}) => {
  const { quotes, updateQuoteStatus, workOrders, invoices } = useApp();

  const quote = quotes.find(q => q.id.toLowerCase() === quoteId.toLowerCase()) || quotes[0];

  const matchedWorkOrder = workOrders.find(wo => 
    wo.id === quote?.workOrderId || wo.quoteId === quote?.id
  );

  const matchedInvoice = invoices.find(inv => 
    inv.workOrderId === matchedWorkOrder?.id || inv.quoteId === quote?.id
  );

  const [signerName, setSignerName] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [activeModal, setActiveModal] = useState<'ACCEPT' | 'REVISION' | 'DECLINE' | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!quote) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-white">
        <h2 className="text-xl font-bold">Proposal not found</h2>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold">
          Go Back
        </button>
      </div>
    );
  }

  const handleDecision = (decision: 'ACCEPTED' | 'REVISION_REQUESTED' | 'DECLINED') => {
    if (decision === 'ACCEPTED' && !signerName.trim()) {
      alert('Please enter your full name as authorized signature.');
      return;
    }

    updateQuoteStatus(quote.id, decision, feedbackText);
    setActiveModal(null);
    setActionSuccess(`Proposal status successfully recorded as: ${decision}`);

    // If accepted and invoice generated, allow customer to view invoice
    setTimeout(() => {
      if (matchedInvoice && onProceedToInvoice) {
        onProceedToInvoice(matchedInvoice.id);
      }
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Request Tracking</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Proposal</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Official Proposal Document Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl p-6 sm:p-10 space-y-8">
        
        {/* Proposal Letterhead */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-800 pb-8">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-sm">
                SO
              </div>
              <span className="text-xl font-black text-white tracking-tight">SecurOps Systems SARL</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Zone Industrielle Chenini &bull; Gabès / Tunis, Tunisia</p>
            <p className="text-xs text-slate-400">RC: B0819232023 &bull; Matricule Fiscale: 1823901/A</p>
            <p className="text-xs text-blue-400 font-mono mt-0.5">contact@securops.tn &bull; +216 75 200 300</p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
              TECHNICAL PROPOSAL &bull; {quote.status}
            </span>
            <h2 className="text-2xl font-black font-mono text-white mt-1">{quote.id}</h2>
            <p className="text-xs text-slate-400 font-mono">Date Issued: {new Date(quote.createdAt).toLocaleDateString()}</p>
            <p className="text-xs text-slate-400 font-mono">Valid Until: {new Date(quote.validUntil).toLocaleDateString()}</p>
            <p className="text-[11px] text-slate-500 font-mono">Ref Order: {quote.workOrderId}</p>
          </div>
        </div>

        {/* Client & Installation Scope Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 uppercase tracking-wider font-bold block text-[10px]">Issued To Client:</span>
            <span className="text-sm font-bold text-white block mt-0.5">{quote.customerName}</span>
            <span className="text-slate-400 block">{quote.customerAddress}</span>
            <span className="text-slate-400 block font-mono">{quote.customerPhone}</span>
          </div>

          <div>
            <span className="text-slate-500 uppercase tracking-wider font-bold block text-[10px]">Project Scope:</span>
            <span className="text-sm font-bold text-blue-300 block mt-0.5">
              Turnkey Security &amp; Technology Installation
            </span>
            <span className="text-slate-400 block mt-0.5">
              Includes physical mounting, optical alignment, Cat6 cabling, configuration, and technician sign-off.
            </span>
          </div>
        </div>

        {/* Itemized Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-4">Item &amp; Technical Description</th>
                <th className="py-3 px-3 text-center">Qty</th>
                <th className="py-3 px-3 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right">Total (TND)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {quote.items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-950/40">
                  <td className="py-3.5 px-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase ${
                      item.type === 'HARDWARE'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : item.type === 'LABOR'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className="font-bold text-white block">{item.description}</span>
                  </td>
                  <td className="py-3.5 px-3 text-center text-slate-300">{item.quantity}</td>
                  <td className="py-3.5 px-3 text-right text-slate-300">{item.unitPrice.toFixed(2)}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-white">{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Totals Calculation Block */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-start gap-6">
          <div className="space-y-2 max-w-sm text-xs text-slate-400">
            <h4 className="font-bold text-white flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Standard Warranty Terms</span>
            </h4>
            <p className="leading-relaxed text-[11px]">
              Hardware includes 24 months manufacturer warranty against defects. Field installation labor &amp; cabling are guaranteed for 12 months with priority technical dispatch.
            </p>
          </div>

          <div className="w-full sm:w-72 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span>{quote.subtotal.toFixed(2)} TND</span>
            </div>

            {quote.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Promotional Discount:</span>
                <span>-{quote.discount.toFixed(2)} TND</span>
              </div>
            )}

            <div className="flex justify-between text-slate-400">
              <span>VAT / TVA (19%):</span>
              <span>{quote.tax.toFixed(2)} TND</span>
            </div>

            <div className="border-t border-slate-800 pt-2 flex justify-between text-base font-black text-white">
              <span>Total Amount:</span>
              <span className="text-blue-400">{quote.total.toFixed(2)} TND</span>
            </div>
          </div>
        </div>

        {/* Customer Decision Actions (If Proposal is pending review) */}
        {quote.status === 'SENT' ? (
          <div className="pt-6 border-t border-slate-800 space-y-4">
            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-900/60 text-xs text-blue-300 flex items-center space-x-3">
              <Lock className="w-5 h-5 text-blue-400 shrink-0" />
              <span>
                Please review the line items carefully. You can accept this proposal with digital sign-off, request adjustments, or decline.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveModal('ACCEPT')}
                className="flex-1 py-3 px-6 rounded-xl font-black text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ACCEPT PROPOSAL</span>
              </button>

              <button
                onClick={() => setActiveModal('REVISION')}
                className="py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 flex items-center space-x-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Request Revision</span>
              </button>

              <button
                onClick={() => setActiveModal('DECLINE')}
                className="py-3 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-rose-400 border border-rose-500/20 flex items-center space-x-2 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>Decline</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Proposal Status: <strong className="text-white uppercase">{quote.status}</strong>
            </span>
            {matchedInvoice && (
              <button
                onClick={() => onProceedToInvoice && onProceedToInvoice(matchedInvoice.id)}
                className="font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
              >
                <span>Proceed to Invoice {matchedInvoice.id}</span>
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

      </div>

      {/* Decision Modal (Acceptance with Digital Signature) */}
      {activeModal === 'ACCEPT' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Digital Proposal Acceptance</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              By entering your full name below, you formally accept Proposal <strong>{quote.id}</strong> in the amount of <strong>{quote.total.toFixed(2)} TND</strong> and authorize our operations dispatch to generate the service deposit invoice.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Authorized Signatory Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Hatem Ben Ammar"
                value={signerName}
                onChange={e => setSignerName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDecision('ACCEPTED')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
              >
                Confirm &amp; Sign Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Request Modal */}
      {activeModal === 'REVISION' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <span>Request Changes to Proposal</span>
            </h3>

            <p className="text-xs text-slate-300">
              Please specify the hardware adjustments, camera positions, or scope changes you would like our engineers to modify.
            </p>

            <textarea
              rows={4}
              placeholder="e.g. We would like to add 2 additional outdoor bullet cameras for the back fence..."
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-amber-500 outline-none"
            />

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDecision('REVISION_REQUESTED')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md"
              >
                Send Revision Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {activeModal === 'DECLINE' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              <span>Decline Proposal</span>
            </h3>

            <p className="text-xs text-slate-300">
              Are you sure you wish to decline this proposal? Please let us know if there was an issue with timing, pricing, or specifications.
            </p>

            <textarea
              rows={3}
              placeholder="Reason for declining (Optional)..."
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-rose-500 outline-none"
            />

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDecision('DECLINED')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-500 shadow-md"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
