import React from 'react';
import { X, CheckCircle2, ArrowRight, ShieldCheck, Wrench, Layers } from 'lucide-react';
import { ServiceItem } from '../../types/customerWebsite';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onRequestService: (service: ServiceItem) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onRequestService,
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl animate-fadeIn">
        
        {/* Top visual banner */}
        <div className="relative h-56 w-full">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6">
            <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-blue-600 text-white uppercase">
              {service.category}
            </span>
            <h2 className="text-2xl font-black text-white mt-1">
              {service.name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 text-xs">
          
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
              Scope Description
            </span>
            <p className="text-slate-300 leading-relaxed text-sm">
              {service.description}
            </p>
          </div>

          {/* Key Deliverables */}
          <div className="space-y-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
              Included Engineering Deliverables
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {service.features.map((feat, i) => (
                <div key={i} className="flex items-start space-x-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Typical Applications */}
          <div className="space-y-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
              Typical Facility Environments
            </span>
            <div className="flex flex-wrap gap-2">
              {service.typicalApplications.map((app, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px]">
                  &bull; {app}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-slate-500 block">Baseline Estimate</span>
              <span className="text-base font-black text-white font-mono">{service.startingPriceEstimate || 'Custom Site Survey'}</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onRequestService(service);
              }}
              className="px-6 py-3 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition-all"
            >
              <span>REQUEST THIS SERVICE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
