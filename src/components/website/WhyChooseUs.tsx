import React from 'react';
import { 
  Wrench, 
  Search, 
  ShieldCheck, 
  Settings, 
  Headphones, 
  CheckCircle2, 
  Check, 
  ArrowRight 
} from 'lucide-react';
import { CustomerWebsiteRoute } from '../../types/customerWebsite';

interface WhyChooseUsProps {
  setCurrentRoute: (route: CustomerWebsiteRoute) => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ setCurrentRoute }) => {
  const benefits = [
    {
      title: 'Professional Installation',
      description: 'Clean conduit routing, concealed low-smoke Cat6 cabling, properly grounded electrical supplies, and labeled rack patch panels.',
      icon: Wrench,
      details: [
        'Concealed cable pathways & trunking',
        'Strict electrical safety compliance',
        'Physical asset serial tagging',
      ],
    },
    {
      title: 'On-Site Technical Assessment',
      description: 'We evaluate optical angles, light levels, RF interference, and building construction materials on site before finalizing quotes.',
      icon: Search,
      details: [
        'No blind online estimates',
        'Accurate lens field-of-view calculation',
        'Cable run distance verification',
      ],
    },
    {
      title: 'Commercial-Grade Hardware',
      description: 'Hardware selected for continuous 24/7 duty cycles, high-temperature tolerance, and firmware security stability.',
      icon: ShieldCheck,
      details: [
        'IK10 vandal-resistant enclosures',
        'Surge-protected PoE switches',
        'Surveillance-grade hard drives',
      ],
    },
    {
      title: 'End-to-End System Configuration',
      description: 'We configure IP schemes, VLAN security isolation, AcuSense AI tripwires, NVR recording schedules, and mobile viewing apps.',
      icon: Settings,
      details: [
        'Port forwarding & DDNS / P2P setup',
        'Multi-user access rights & passwords',
        'False alarm filter tuning',
      ],
    },
    {
      title: 'Dedicated After-Sales Support',
      description: 'Direct access to qualified installation technicians for maintenance audits, firmware upgrades, and rapid troubleshooting callouts.',
      icon: Headphones,
      details: [
        'Service history documentation',
        'Priority dispatch for critical outages',
        'Preventative maintenance contracts',
      ],
    },
  ];

  return (
    <section className="py-20 bg-slate-950 text-white relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Factual Engineering Standards
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Why Partner With SecurOps
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Security and technology infrastructure cannot rely on superficial quick-fixes. We prioritize physical craftsmanship, network security best practices, and transparent proposals.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((item, idx) => {
            const Icon = item.icon;

            return (
              <div
                key={idx}
                className="rounded-3xl bg-slate-900 p-6 border border-slate-800/90 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all hover:shadow-xl"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  {item.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-[11px] text-slate-300">{detail}</span>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}

          {/* 6th Card: Callout / Contact */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 p-6 border border-blue-900/50 flex flex-col justify-between space-y-4 shadow-xl">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-blue-300 tracking-wider uppercase bg-blue-500/20 px-2 py-0.5 rounded">
                Direct Consultation
              </span>
              <h3 className="text-lg font-black text-white">
                Tell us what you need.
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Whether you are securing a new construction site, replacing an outdated analog CCTV system, or diagnosing slow commercial Wi-Fi, our technicians are ready to assess your location.
              </p>
            </div>

            <button
              onClick={() => {
                setCurrentRoute('REQUEST_SERVICE');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <span>REQUEST A SERVICE NOW</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
