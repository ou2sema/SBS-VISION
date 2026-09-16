import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight, 
  PhoneCall, 
  FileText, 
  ShieldCheck,
  Laptop
} from 'lucide-react';

interface SubmissionSuccessModalProps {
  requestId: string;
  secureToken: string;
  onTrackNow: (requestId: string) => void;
  onReturnHome: () => void;
  onOpenAdminCockpit: () => void;
}

export const SubmissionSuccessModal: React.FC<SubmissionSuccessModalProps> = ({
  requestId,
  secureToken,
  onTrackNow,
  onReturnHome,
  onOpenAdminCockpit,
}) => {
  const [copied, setCopied] = useState(false);

  const copyRef = () => {
    navigator.clipboard.writeText(requestId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-lg w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white space-y-6 shadow-2xl animate-fadeIn">
        
        {/* Success Icon Badge */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
            Request Logged in Operations Queue
          </span>
          <h2 className="text-2xl font-black text-white">
            Service Request Received
          </h2>
          <p className="text-xs text-slate-400">
            Status: <strong>Request received. We will contact you shortly.</strong>
          </p>
        </div>

        {/* Reference Code Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Official Reference Code:
            </span>
            <span className="text-xl font-black font-mono text-blue-400 block mt-0.5">
              {requestId}
            </span>
          </div>

          <button
            onClick={copyRef}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-300 flex items-center space-x-1.5 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy Ref'}</span>
          </button>
        </div>

        {/* Immediate Next Steps */}
        <div className="space-y-2.5 text-xs text-slate-300">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
            What Happens Next:
          </span>
          <div className="space-y-2">
            <div className="flex items-start space-x-2.5">
              <PhoneCall className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>A technical dispatcher will call your mobile number to confirm location accessibility and site visit time.</span>
            </div>
            <div className="flex items-start space-x-2.5">
              <FileText className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>Following the survey, an itemized quote will be posted to your secure link for digital review.</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => onTrackNow(requestId)}
            className="w-full py-3 rounded-xl font-black text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all"
          >
            <span>TRACK THIS REQUEST NOW</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onReturnHome}
              className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Return to Website Home
            </button>

            {/* Quick staff switch to test workflow advancement */}
            <button
              onClick={onOpenAdminCockpit}
              className="py-2.5 px-3 rounded-xl font-bold text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1 transition-colors"
              title="Open Staff Operations Cockpit to accept request & create quote"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Staff Cockpit</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
