import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft, 
  Printer, 
  Download, 
  Clock, 
  ShieldCheck, 
  Building, 
  Upload, 
  AlertCircle,
  FileCheck,
  Lock,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentService, PaymentIntentResult } from '../../services/paymentService';

interface CustomerInvoiceViewProps {
  invoiceId: string;
  onBack: () => void;
}

export const CustomerInvoiceView: React.FC<CustomerInvoiceViewProps> = ({
  invoiceId,
  onBack,
}) => {
  const { invoices, workOrders, updateInvoiceStatus } = useApp();

  const invoice = invoices.find(i => i.id.toLowerCase() === invoiceId.toLowerCase()) || invoices[0];
  const matchedWorkOrder = workOrders.find(wo => wo.id === invoice?.workOrderId);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE_CARD' | 'BANK_TRANSFER' | 'CASH_ON_HANDOVER'>('ONLINE_CARD');
  const [processing, setProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentIntentResult | null>(null);
  const [uploadedProofName, setUploadedProofName] = useState<string | null>(null);

  if (!invoice) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-white">
        <h2 className="text-xl font-bold">Invoice not found</h2>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold">
          Go Back
        </button>
      </div>
    );
  }

  const handleInitiatePayment = async () => {
    setProcessing(true);

    try {
      const result = await PaymentService.createPaymentIntent({
        invoiceId: invoice.id,
        amount: invoice.total,
        currency: 'TND',
        customerEmail: invoice.customerEmail || 'client@company.tn',
        customerName: invoice.customerName,
        paymentMethod,
      });

      setPaymentResult(result);
      setProcessing(false);

      if (result.status === 'SUCCEEDED') {
        // Authoritative verification: simulate verified gateway callback
        updateInvoiceStatus(invoice.id, 'PAID', 'Credit Card Gateway Auth (Ref: ' + result.transactionId + ')');
      }
    } catch (err: any) {
      setProcessing(false);
      alert('Payment processing error: ' + err.message);
    }
  };

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedProofName(file.name);
    await PaymentService.uploadTransferProof(invoice.id, file);
    alert('Bank transfer slip uploaded! Operations dispatch will verify with our bank within 2 business hours.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Request Tracking</span>
        </button>

        <button
          onClick={() => window.print()}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print / PDF Invoice</span>
        </button>
      </div>

      {/* Invoice Document Box */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl p-6 sm:p-10 space-y-8">
        
        {/* Letterhead */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-800 pb-8">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-white text-sm">
                SO
              </div>
              <span className="text-xl font-black text-white tracking-tight">SecurOps Systems SARL</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Zone Industrielle Chenini &bull; Gabès / Tunis, Tunisia</p>
            <p className="text-xs text-slate-400">Matricule Fiscale: 1823901/A &bull; TVA: 19%</p>
            <p className="text-xs text-emerald-400 font-mono mt-0.5">finance@securops.tn &bull; +216 75 200 300</p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase border ${
              invoice.status === 'PAID'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}>
              OFFICIAL INVOICE &bull; {invoice.status}
            </span>
            <h2 className="text-2xl font-black font-mono text-white mt-1">{invoice.id}</h2>
            <p className="text-xs text-slate-400 font-mono">Issue Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
            <p className="text-xs text-slate-400 font-mono">Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
            {invoice.paidAt && (
              <p className="text-xs text-emerald-400 font-mono font-bold">Paid On: {new Date(invoice.paidAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>

        {/* Billed To Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 uppercase tracking-wider font-bold block text-[10px]">Billed To:</span>
            <span className="text-sm font-bold text-white block mt-0.5">{invoice.customerName}</span>
            <span className="text-slate-400 block">{invoice.customerAddress}</span>
            {invoice.customerEmail && <span className="text-slate-400 block">{invoice.customerEmail}</span>}
          </div>

          <div>
            <span className="text-slate-500 uppercase tracking-wider font-bold block text-[10px]">Reference Project:</span>
            <span className="text-sm font-bold text-emerald-400 block mt-0.5">Order #{invoice.workOrderId}</span>
            <span className="text-slate-400 block mt-0.5">Payment Terms: 50% Execution Deposit / Full Balance</span>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3 text-center">Qty</th>
                <th className="py-3 px-3 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right">Total (TND)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3.5 px-3 font-sans">
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

        {/* Financial Calculation */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-start gap-6">
          <div className="space-y-2 max-w-sm text-xs text-slate-400">
            <h4 className="font-bold text-white flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Tax Compliance &amp; Guarantee</span>
            </h4>
            <p className="leading-relaxed text-[11px]">
              This invoice serves as the official accounting and warranty document. Equipment serial numbers will be bound to this reference upon job completion.
            </p>
          </div>

          <div className="w-full sm:w-72 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span>{invoice.subtotal.toFixed(2)} TND</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>TVA (19%):</span>
              <span>{invoice.tax.toFixed(2)} TND</span>
            </div>
            <div className="border-t border-slate-800 pt-2 flex justify-between text-base font-black text-white">
              <span>Total Payable:</span>
              <span className="text-emerald-400">{invoice.total.toFixed(2)} TND</span>
            </div>
          </div>
        </div>

        {/* Payment Actions / Confirmation */}
        <div className="pt-6 border-t border-slate-800">
          {invoice.status === 'PAID' ? (
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Payment Confirmed &amp; Settled</h4>
                  <p className="text-xs text-emerald-300">
                    Payment Method: {invoice.paymentMethod || 'Credit Card Gateway Auth'}. Work execution is officially authorized!
                  </p>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300">
                Receipt Ref: {invoice.id}-REC
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/50 via-slate-950 to-indigo-950/50 border border-blue-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Invoice Outstanding: {invoice.total.toFixed(2)} TND</h4>
                <p className="text-xs text-slate-400">
                  Select your preferred settlement method to authorize field installation.
                </p>
              </div>

              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all"
              >
                <CreditCard className="w-4 h-4" />
                <span>PAY INVOICE NOW</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Payment Gateway Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white space-y-6 shadow-2xl animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Settlement Gateway</h3>
                  <span className="text-xs text-slate-400 font-mono">Invoice: {invoice.id}</span>
                </div>
              </div>

              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Select Payment Method
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'ONLINE_CARD', label: 'Credit Card', icon: '💳', desc: 'Instant gateway' },
                  { id: 'BANK_TRANSFER', label: 'Bank Wire', icon: '🏦', desc: 'BIAT / IBAN' },
                  { id: 'CASH_ON_HANDOVER', label: 'On Handover', icon: '💵', desc: 'Direct to tech' },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(method.id as any);
                      setPaymentResult(null);
                    }}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all ${
                      paymentMethod === method.id
                        ? 'bg-emerald-950/40 border-emerald-500 text-white ring-1 ring-emerald-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xl">{method.icon}</span>
                    <div>
                      <span className="text-xs font-bold text-white block">{method.label}</span>
                      <span className="text-[10px] text-slate-400">{method.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Method Specific Details */}
            {paymentMethod === 'ONLINE_CARD' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <span className="font-bold text-white block">SecurOps Online Payment Gateway</span>
                <p className="text-slate-400 leading-relaxed">
                  Processes Visa, Mastercard, and Tunisian CIB e-Dinar cards with 3D-Secure 2.0 two-factor authentication.
                </p>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Total charge:</span>
                  <span className="font-bold text-emerald-400">{invoice.total.toFixed(2)} TND</span>
                </div>
              </div>
            )}

            {paymentMethod === 'BANK_TRANSFER' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <span className="font-bold text-white block">Bank Wire Instructions:</span>
                <div className="space-y-1 font-mono text-[11px] bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300">
                  <p><strong className="text-slate-400">Bank:</strong> Banque Internationale Arabe de Tunisie (BIAT)</p>
                  <p><strong className="text-slate-400">Beneficiary:</strong> SecurOps Technology Systems SARL</p>
                  <p><strong className="text-slate-400">IBAN:</strong> TN59 0800 1000 5521 0023 4589</p>
                  <p><strong className="text-slate-400">SWIFT/BIC:</strong> BIATTNTTXXX</p>
                  <p><strong className="text-slate-400">Reference:</strong> INV-{invoice.id}</p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="font-bold text-slate-300 block">Upload Transfer Slip / Receipt:</span>
                  <label className="border border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-3 flex items-center justify-center cursor-pointer text-xs text-slate-400 hover:text-white transition-colors">
                    <Upload className="w-4 h-4 mr-2 text-emerald-400" />
                    <span>{uploadedProofName || 'Upload PDF or photo of transfer slip'}</span>
                    <input type="file" accept="image/*,.pdf" onChange={handleProofUpload} className="hidden" />
                  </label>
                </div>
              </div>
            )}

            {paymentMethod === 'CASH_ON_HANDOVER' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
                <span className="font-bold text-white block">Cash on Handover Confirmation:</span>
                <p className="text-slate-400 leading-relaxed">
                  Payment will be collected directly by the authorized lead field technician upon hardware delivery and physical installation testing.
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleInitiatePayment}
                disabled={processing}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md disabled:opacity-50 flex items-center space-x-2"
              >
                {processing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Communicating with Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Authorization</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
