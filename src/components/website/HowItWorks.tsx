import React from 'react';
import { 
  Inbox, 
  PhoneCall, 
  MapPin, 
  FileText, 
  CreditCard, 
  Wrench, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';
import { CustomerWebsiteRoute } from '../../types/customerWebsite';

interface HowItWorksProps {
  setCurrentRoute: (route: CustomerWebsiteRoute) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ setCurrentRoute }) => {
  const steps = [
    {
      step: '01',
      title: 'Service Request',
      description: 'Submit your requirements via our dynamic online request form with location and optional photo attachments.',
      icon: Inbox,
      highlight: 'Takes 2 minutes',
    },
    {
      step: '02',
      title: 'We Contact You',
      description: 'Our technical dispatcher reviews your site parameters and calls within 2 business hours for preliminary scoping.',
      icon: PhoneCall,
      highlight: 'Fast response',
    },
    {
      step: '03',
      title: 'Site Visit & Survey',
      description: 'A lead field specialist conducts on-site measurements, optical angle simulations, and cable pathway inspection.',
      icon: MapPin,
      highlight: 'Zero guesswork',
    },
    {
      step: '04',
      title: 'Itemized Proposal',
      description: 'We generate an itemized quote detailing exact hardware models, installation labor, warranty periods, and terms.',
      icon: FileText,
      highlight: 'Transparent pricing',
    },
    {
      step: '05',
      title: 'Approval & Payment',
      description: 'Review and approve your proposal via your secure link. Work is officially authorized once deposit is settled.',
      icon: CreditCard,
      highlight: 'Secure digital sign-off',
    },
    {
      step: '06',
      title: 'Field Installation',
      description: 'Certified technicians install hardware using concealed conduit, low-smoke cabling, and rackmount dressing.',
      icon: Wrench,
      highlight: 'Clean professional work',
    },
    {
      step: '07',
      title: 'System Testing',
      description: 'Every camera sensor, motion beam, magnetic lock, and network port undergoes rigorous functional sign-off.',
      icon: CheckCircle2,
      highlight: 'Fluke certified',
    },
    {
      step: '08',
      title: 'Handover & Completion',
      description: 'Technician conducts training on mobile viewing apps, delivers asset serial registers, and signs final service report.',
      icon: ShieldCheck,
      highlight: 'Official warranty active',
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-blue-400 tracking-widest uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            Engineered Delivery Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            How It Works: From Request to Handover
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            We operate on an automated, workflow-driven execution model. Every project follows strict operational milestones to guarantee engineering quality and on-time completion.
          </p>
        </div>

        {/* 8-Step Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;

            return (
              <div
                key={item.step}
                className="relative rounded-3xl bg-slate-950 p-6 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all hover:shadow-xl group"
              >
                {/* Step indicator header */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded-lg">
                    STEP {item.step}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {item.highlight}
                  </span>
                </div>

                {/* Icon & Title */}
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-200 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Flow connector dot */}
                <div className="pt-2 border-t border-slate-900 flex items-center text-[10px] text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                  <span>Phase {idx < 4 ? 'A: Planning' : 'B: Field Execution'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-950 to-indigo-950/60 border border-blue-900/40 text-center space-y-4 max-w-3xl mx-auto">
          <h3 className="text-lg font-bold text-white">
            Ready to initiate Step 01 for your property?
          </h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Submit a service request without obligation. Our engineering dispatcher will reach out to schedule an on-site visit.
          </p>
          <button
            onClick={() => {
              setCurrentRoute('REQUEST_SERVICE');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 inline-flex items-center space-x-2 transition-all"
          >
            <span>START SERVICE REQUEST</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
