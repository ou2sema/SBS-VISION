import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  FileText, 
  ExternalLink, 
  ArrowLeft, 
  AlertCircle,
  Sparkles,
  HelpCircle,
  ThumbsUp,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CustomerPortal: React.FC = () => {
  const { 
    quotes, 
    invoices, 
    workOrders, 
    respondToQuote, 
    confirmPayment, 
    setSelectedView,
    setSelectedWorkOrderId 
  } = useApp();

  // Find the primary active quote or work order
  const activeQuote = quotes.find(q => q.status === 'SENT') || quotes[0];
  const relatedWorkOrder = activeQuote ? workOrders.find(w => w.id === activeQuote.workOrderId) : null;
  const relatedInvoice = activeQuote ? invoices.find(i => i.quoteId === activeQuote.id) : null;

  const [revisionNotes, setRevisionNotes] = useState('Can we add 2 more outdoor cameras for the side parking lot?');
  const [showRevisionInput, setShowRevisionInput] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Customer Brand Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/30">
              Customer Web Portal Simulation
            </span>
            <span className="text-xs text-slate-400">Same Firebase Backend</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Client Self-Service &amp; Approvals
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            This screen simulates what the client sees on the public website when reviewing quotes and settling invoices.
          </p>
        </div>

        <button
          onClick={() => setSelectedView('DASHBOARD')}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-colors flex items-center space-x-1.5 self-start sm:self-center"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Admin Cockpit</span>
        </button>
      </div>

      {activeQuote ? (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          
          {/* Quote Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {activeQuote.id}
                </span>
                <span className="text-xs text-slate-500 font-medium">Version {activeQuote.currentVersion}</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Security Engineering Proposal for {activeQuote.customerName}
              </h2>
              <p className="text-xs text-slate-500">
                Work Order Reference: <strong>{activeQuote.workOrderId}</strong>
              </p>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              activeQuote.status === 'ACCEPTED'
                ? 'bg-emerald-100 text-emerald-800'
                : activeQuote.status === 'SENT'
                ? 'bg-blue-100 text-blue-800 animate-pulse'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {activeQuote.status.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Proposal Line Items */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeQuote.items.map(it => (
                  <tr key={it.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{it.name}</td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-700">{it.quantity}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-600">{it.unitPrice.toFixed(2)} TND</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{it.total.toFixed(2)} TND</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end pt-2 border-t border-slate-100">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Catalog Total:</span>
                <span className="font-mono font-medium">{activeQuote.subtotal.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount:</span>
                <span className="font-mono">-{activeQuote.discount.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>VAT (19%):</span>
                <span className="font-mono">{activeQuote.tax.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-200">
                <span>Authorized Total:</span>
                <span className="font-mono text-purple-700">{activeQuote.total.toFixed(2)} TND</span>
              </div>
            </div>
          </div>

          {/* Terms & Warranty note */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">Commercial Notes &amp; Scope:</p>
            <p>{activeQuote.notes}</p>
          </div>

          {/* Customer Action Gate */}
          {activeQuote.status === 'SENT' && (
            <div className="p-5 bg-purple-50 rounded-2xl border border-purple-200 space-y-4">
              <div className="flex items-center space-x-2 text-purple-900 font-bold text-sm">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>Simulate Customer Decision</span>
              </div>
              <p className="text-xs text-purple-800">
                In production, the customer receives an SMS/Email with a secure token to this screen.
                Accepting triggers the Firestore trigger to generate the commercial invoice.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => respondToQuote(activeQuote.id, 'ACCEPTED')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ACCEPT PROPOSAL &amp; GENERATE INVOICE</span>
                </button>

                <button
                  onClick={() => setShowRevisionInput(!showRevisionInput)}
                  className="px-4 py-2.5 bg-white border border-purple-300 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-semibold"
                >
                  Request Modifications
                </button>
              </div>

              {showRevisionInput && (
                <div className="pt-3 border-t border-purple-200 space-y-2">
                  <label className="block text-xs font-bold text-purple-900">
                    Client Modification Note:
                  </label>
                  <input
                    type="text"
                    value={revisionNotes}
                    onChange={e => setRevisionNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-purple-300 outline-none bg-white"
                  />
                  <button
                    onClick={() => {
                      respondToQuote(activeQuote.id, 'REVISION_REQUESTED', revisionNotes);
                      setShowRevisionInput(false);
                    }}
                    className="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold"
                  >
                    Submit Revision Request
                  </button>
                </div>
              )}
            </div>
          )}

          {/* If Quote is Accepted, Display Linked Invoice Payment Gate */}
          {activeQuote.status === 'ACCEPTED' && relatedInvoice && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h3 className="font-extrabold text-slate-900 text-base">Commercial Invoice #{relatedInvoice.id}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  relatedInvoice.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {relatedInvoice.status}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">Balance Due:</span>
                <span className="font-mono font-bold text-slate-900 text-base">{relatedInvoice.amount.toFixed(2)} TND</span>
              </div>

              {relatedInvoice.status === 'UNPAID' ? (
                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={() => confirmPayment(relatedInvoice.id, 'ONLINE_CARD', 'CARD-CLI-90184')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center space-x-1.5"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Simulate Online Card Payment</span>
                  </button>
                  <p className="text-[11px] text-slate-500">
                    Payment unblocks the technician installation phase immediately.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Payment confirmed via {relatedInvoice.paymentMethod}. Work is officially authorized!</span>
                </div>
              )}
            </div>
          )}

        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
          No proposals are currently pending approval.
        </div>
      )}

    </div>
  );
};
