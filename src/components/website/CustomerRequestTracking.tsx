import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  MapPin, 
  FileText, 
  CreditCard, 
  Wrench, 
  AlertCircle, 
  Search, 
  ArrowRight, 
  Lock, 
  Copy, 
  Check, 
  ExternalLink,
  Laptop
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CustomerWebsiteRoute } from '../../types/customerWebsite';

interface CustomerRequestTrackingProps {
  initialRequestId?: string;
  initialToken?: string;
  onViewQuote: (quoteId: string) => void;
  onViewInvoice: (invoiceId: string) => void;
  onOpenAdminCockpit: () => void;
  setCurrentRoute: (route: CustomerWebsiteRoute) => void;
}

export const CustomerRequestTracking: React.FC<CustomerRequestTrackingProps> = ({
  initialRequestId = '',
  initialToken = '',
  onViewQuote,
  onViewInvoice,
  onOpenAdminCockpit,
  setCurrentRoute,
}) => {
  const { requests, workOrders, quotes, invoices } = useApp();

  const [searchId, setSearchId] = useState(initialRequestId);
  const [tokenInput, setTokenInput] = useState(initialToken);
  const [copied, setCopied] = useState(false);
  const [searched, setSearched] = useState(Boolean(initialRequestId));

  // Find target request
  const matchedRequest = requests.find(r => 
    r.id.toLowerCase() === (searchId.trim().toLowerCase())
  );

  // Find associated work order (if admin accepted the request)
  const matchedWorkOrder = workOrders.find(wo => 
    wo.requestId === matchedRequest?.id || wo.id === matchedRequest?.id
  );

  // Find associated quote
  const matchedQuote = quotes.find(q => 
    q.workOrderId === matchedWorkOrder?.id || 
    q.workOrderId === matchedRequest?.id ||
    q.id === matchedWorkOrder?.quoteId
  );

  // Find associated invoice
  const matchedInvoice = invoices.find(inv => 
    inv.workOrderId === matchedWorkOrder?.id ||
    inv.quoteId === matchedQuote?.id ||
    inv.id === matchedWorkOrder?.invoiceId
  );

  const copyTrackingLink = () => {
    const link = `${window.location.origin}?track=${searchId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Authoritative 10-Milestone Workflow Progression Mapping
  const workflowMilestones = [
    { key: 'REQUEST_RECEIVED', label: 'Request Received', desc: 'Received in queue' },
    { key: 'REQUEST_ACCEPTED', label: 'Accepted by Ops', desc: 'Assigned to engineering' },
    { key: 'CONTACT', label: 'Phone Scoping', desc: 'Dispatcher contact' },
    { key: 'SITE_VISIT', label: 'Site Visit', desc: 'On-site RF survey & survey' },
    { key: 'PROPOSAL', label: 'Proposal Created', desc: 'Itemized quote generated' },
    { key: 'CUSTOMER_APPROVAL', label: 'Customer Approval', desc: 'Quote digitally signed' },
    { key: 'INVOICE', label: 'Invoice Issued', desc: 'Deposit / billing ready' },
    { key: 'PAYMENT', label: 'Payment Settled', desc: 'Work authorized' },
    { key: 'WORK_STARTED', label: 'Field Installation', desc: 'Cabling & hardware mount' },
    { key: 'COMPLETION', label: 'Testing & Handover', desc: 'Final sign-off & warranty' },
  ];

  // Determine current milestone index based on real request/workOrder state
  const getCurrentMilestoneIndex = (): number => {
    if (!matchedRequest) return 0;

    if (!matchedWorkOrder) {
      if (matchedRequest.status === 'ACCEPTED') return 1;
      return 0; // REQUEST_RECEIVED
    }

    const state = matchedWorkOrder.workflowState;

    if (state === 'COMPLETED' || state === 'CUSTOMER_SIGN_OFF' || state === 'HANDOVER_DOCUMENTATION') return 9;
    if (state === 'TESTING' || state === 'CONFIGURATION' || state === 'INSTALLATION' || state === 'PREPARE_EQUIPMENT') return 8;
    if (state === 'WORK_AUTHORIZED' || matchedInvoice?.status === 'PAID') return 7;
    if (state === 'CREATE_INVOICE' || state === 'CUSTOMER_PAYS' || Boolean(matchedInvoice)) return 6;
    if (state === 'CUSTOMER_ACCEPTS' || matchedQuote?.status === 'ACCEPTED') return 5;
    if (state === 'CREATE_PROPOSAL' || Boolean(matchedQuote)) return 4;
    if (state === 'SITE_VISIT') return 3;
    if (state === 'CONTACT_CUSTOMER') return 2;
    if (state === 'REQUEST_ACCEPTED') return 1;

    return 1;
  };

  const currentMilestoneIndex = getCurrentMilestoneIndex();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Search Header */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
              Live Secure Tracking
            </span>
            <h2 className="text-2xl font-black text-white mt-1">
              Customer Request &amp; Proposal Tracker
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Track the exact progress of your technical inquiry through our authoritative field service workflow.
            </p>
          </div>

          <button
            onClick={() => setCurrentRoute('HOME')}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800"
          >
            Back to Home
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Request ID (e.g. REQ-001024 or REQ-001)"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:border-blue-500 outline-none placeholder:text-slate-600"
            />
          </div>

          <button
            onClick={() => setSearched(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md flex items-center justify-center space-x-2 transition-all"
          >
            <span>TRACK REQUEST</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Preset Quick Demo Selector */}
        {requests.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="text-[11px] font-medium">Recent active requests:</span>
            {requests.slice(0, 4).map(r => (
              <button
                key={r.id}
                onClick={() => {
                  setSearchId(r.id);
                  setSearched(true);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold border transition-colors ${
                  searchId === r.id
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {r.id}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Tracking Result View */}
      {matchedRequest ? (
        <div className="mt-8 rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-2xl space-y-8 animate-fadeIn">
          
          {/* Header Card: Request ID, Status & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="text-2xl font-black font-mono text-white">
                  Request #{matchedRequest.id}
                </h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
                  matchedRequest.status === 'ACCEPTED'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  Status: {matchedRequest.status === 'ACCEPTED' ? 'ACCEPTED BY OPS' : 'REQUEST RECEIVED'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Client: <strong className="text-white">{matchedRequest.customerName}</strong> &bull; Site: {matchedRequest.location} &bull; Service: {matchedRequest.serviceName}
              </p>
            </div>

            {/* Quick Share Link */}
            <div className="flex items-center space-x-2">
              <button
                onClick={copyTrackingLink}
                className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 flex items-center space-x-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? 'Link Copied!' : 'Copy Secure Link'}</span>
              </button>
            </div>
          </div>

          {/* Connected Artifact Action Alert (Quote Ready or Invoice Ready) */}
          {matchedQuote && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-widest bg-purple-900/60 px-2 py-0.5 rounded">
                    Official Proposal Ready
                  </span>
                  <h4 className="text-base font-bold text-white mt-0.5">
                    Proposal {matchedQuote.id} ({matchedQuote.total.toFixed(2)} TND)
                  </h4>
                  <p className="text-xs text-slate-300">
                    Status: <strong className="capitalize text-purple-200">{matchedQuote.status}</strong>. Please review line items and authorize.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onViewQuote(matchedQuote.id)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-1.5 transition-all"
              >
                <span>OPEN PROPOSAL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {matchedInvoice && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-widest bg-emerald-900/60 px-2 py-0.5 rounded">
                    Invoice Issued
                  </span>
                  <h4 className="text-base font-bold text-white mt-0.5">
                    Invoice {matchedInvoice.id} ({matchedInvoice.total.toFixed(2)} TND)
                  </h4>
                  <p className="text-xs text-slate-300">
                    Status: <strong className="text-emerald-300">{matchedInvoice.status}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => onViewInvoice(matchedInvoice.id)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-1.5 transition-all"
              >
                <span>VIEW INVOICE &amp; PAYMENT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Real Authoritative Workflow Progress Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Authoritative Execution Timeline
              </h4>
              <span className="text-xs font-mono text-blue-400 font-semibold">
                Milestone {currentMilestoneIndex + 1} of 10
              </span>
            </div>

            <div className="space-y-3">
              {workflowMilestones.map((m, idx) => {
                const isPassed = idx < currentMilestoneIndex;
                const isCurrent = idx === currentMilestoneIndex;
                const isPending = idx > currentMilestoneIndex;

                return (
                  <div
                    key={m.key}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'bg-blue-950/40 border-blue-500 text-white ring-1 ring-blue-500/50 shadow-md'
                        : isPassed
                        ? 'bg-slate-950/80 border-slate-800 text-slate-300'
                        : 'bg-slate-950/30 border-slate-900 text-slate-600 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold ${
                        isPassed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : isCurrent
                          ? 'bg-blue-600 text-white animate-pulse'
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        {isPassed ? '✓' : `0${idx + 1}`}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-bold ${isCurrent ? 'text-blue-300 font-extrabold' : 'text-slate-300'}`}>
                            {m.label}
                          </span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
                              Active Stage
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">{m.desc}</p>
                      </div>
                    </div>

                    <div className="text-right text-[11px] font-mono">
                      {isPassed && <span className="text-emerald-400 font-bold">COMPLETED</span>}
                      {isCurrent && <span className="text-blue-400 font-bold">IN PROGRESS</span>}
                      {isPending && <span className="text-slate-600">LOCKED</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviewer / Admin Helper Box */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center space-x-2.5">
              <Laptop className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                Want to test advancing this request? Open the <strong>Internal Staff Cockpit</strong> to accept the request, schedule site visit, generate proposal, or verify payment!
              </span>
            </div>
            <button
              onClick={onOpenAdminCockpit}
              className="px-4 py-2 rounded-xl font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shrink-0"
            >
              Open Staff Cockpit
            </button>
          </div>

        </div>
      ) : searched ? (
        <div className="mt-8 p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No Request Found for ID: "{searchId}"</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Please verify your reference number. If you just submitted a request, you can click on any of the recent requests listed above.
          </p>
        </div>
      ) : null}

    </div>
  );
};
