import React from 'react';
import { 
  Shield, 
  ArrowRight, 
  Wrench, 
  CheckCircle2, 
  Cpu, 
  Wifi, 
  Camera, 
  Lock, 
  Terminal,
  Activity,
  Layers,
  Search
} from 'lucide-react';
import { CustomerWebsiteRoute } from '../../types/customerWebsite';

interface HeroSectionProps {
  setCurrentRoute: (route: CustomerWebsiteRoute) => void;
  onTrackRequestModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  setCurrentRoute,
  onTrackRequestModal,
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800">
      
      {/* Background Subtle Technical Grid & Ambient Lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Status Pill */}
            <div className="inline-flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              <span className="font-semibold text-blue-300">Authoritative Field Engineering</span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-slate-400">Tunisia Operations</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Security &amp; Technology, <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                Designed Around You.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
              We design, install, configure, and maintain security and technology systems. From industrial 4K IP video surveillance and biometric access gates to certified Cat6 cabling and high-density Wi-Fi 6 networks.
            </p>

            {/* Core Competencies Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { title: 'System Design', desc: 'Site visit & RF planning' },
                { title: 'Installation', desc: 'Clean conduit & cabling' },
                { title: 'Configuration', desc: 'VLAN, NVR & VMS' },
                { title: 'Maintenance', desc: 'SLA warranty & audits' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
                  <div className="flex items-center space-x-1.5 text-blue-400 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold text-white">{item.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  setCurrentRoute('REQUEST_SERVICE');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-7 py-4 rounded-xl font-extrabold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 flex items-center space-x-3 transition-all transform active:scale-98"
              >
                <span>REQUEST A SERVICE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCurrentRoute('SERVICES');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-4 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center space-x-2 transition-all hover:text-white"
              >
                <span>Explore Services</span>
              </button>

              <button
                onClick={onTrackRequestModal}
                className="px-4 py-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1.5 transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-blue-400" />
                <span>Track Request #</span>
              </button>
            </div>

            {/* Factual reassurance notes */}
            <div className="pt-2 flex items-center space-x-4 text-slate-400 text-xs">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Transparent Itemized Proposals</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No Guesswork &bull; On-Site Evaluation</span>
              </span>
            </div>

          </div>

          {/* Right Column: Live Interactive Technical Architecture Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 border border-slate-800 shadow-2xl space-y-5">
              
              {/* Card Header: Live Engineering Spec */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400 font-bold">SecurOps Workflow Engine</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ONLINE &bull; DISPATCH READY
                </span>
              </div>

              {/* Technical Pipeline Visualization */}
              <div className="space-y-2.5 text-xs">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Standard Execution Workflow</span>
                  <span className="text-blue-400 font-mono">8 Sequential Milestones</span>
                </div>

                <div className="space-y-2 font-mono text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-blue-500/40 flex items-center justify-between text-blue-200 shadow-xs">
                    <span className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-md bg-blue-500/30 flex items-center justify-center text-[10px] font-bold text-blue-300">01</span>
                      <span className="font-bold">Customer Submits Request</span>
                    </span>
                    <span className="text-[10px] text-blue-400 font-sans font-bold">Starts here</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-slate-300">
                    <span className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">02</span>
                      <span>Dispatch Phone Consultation</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans">Within 2h</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-slate-300">
                    <span className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">03</span>
                      <span>On-Site Technical Visit &amp; Survey</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans">Measurement</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-slate-300">
                    <span className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">04</span>
                      <span>Itemized Quote &amp; Digital Sign-Off</span>
                    </span>
                    <span className="text-[10px] text-purple-400 font-sans font-bold">Secure Link</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-slate-300">
                    <span className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">05</span>
                      <span>Field Installation &amp; Testing</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-sans">Fluke &amp; Camera Align</span>
                  </div>
                </div>
              </div>

              {/* Quick Action Prompt */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  Ready to specify your system?
                </div>
                <button
                  onClick={() => {
                    setCurrentRoute('REQUEST_SERVICE');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                >
                  <span>Open Request Wizard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
