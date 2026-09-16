import React, { useState } from 'react';
import { 
  Shield, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Wrench, 
  CheckCircle2, 
  Send, 
  Award, 
  Radio, 
  Cable,
  ArrowRight
} from 'lucide-react';
import { contactInquirySchema } from '../../lib/validation/schemas';

interface AboutContactViewProps {
  mode: 'ABOUT' | 'CONTACT';
  onRequestService: () => void;
}

export const AboutContactView: React.FC<AboutContactViewProps> = ({
  mode,
  onRequestService,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactInquirySchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.issues[0]?.message || 'Please verify form fields');
      return;
    }

    setError(null);
    setSubmitted(true);
  };

  return (
    <div className="py-16 bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-blue-400 tracking-widest uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            {mode === 'ABOUT' ? 'Engineering Ethos & Standards' : 'Direct Dispatch & Consultation'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {mode === 'ABOUT' ? 'Authoritative Field Engineering' : 'Contact Our Technical Dispatch'}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {mode === 'ABOUT'
              ? 'SecurOps Systems specializes in designing, installing, configuring, and maintaining security and technology infrastructure. We treat electronic security not as off-the-shelf retail products, but as mission-critical industrial engineering.'
              : 'Our technical team is deployed across Greater Tunis, Gabès, Sousse, and southern industrial hubs. Contact our field office directly for survey appointments and maintenance contracts.'}
          </p>
        </div>

        {/* About Section Content */}
        {mode === 'ABOUT' && (
          <div className="space-y-12">
            
            {/* Core Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Optical & RF Accuracy',
                  desc: 'Every camera lens angle, focal length, and Wi-Fi access point antenna pattern is calculated before a single hole is drilled.',
                  icon: Radio,
                },
                {
                  title: 'Clean Cable Concealment',
                  desc: 'We follow stringent physical installation standards: zero exposed dangling wiring, halogen-free Cat6 cabling, and rigid PVC conduit.',
                  icon: Cable,
                },
                {
                  title: 'Workflow Accountability',
                  desc: 'No ambiguity or unverified handovers. Our technicians log Fluke continuity tests, firmware hashes, and signed handover reports.',
                  icon: CheckCircle2,
                },
              ].map((val, idx) => {
                const Icon = val.icon;
                return (
                  <div key={idx} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">{val.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{val.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Quality Standard Callout */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-900/50 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Authoritative Testing Protocol
                </span>
                <h3 className="text-xl font-bold text-white">Every installation concludes with rigorous physical sign-off</h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Technicians test NVR storage RAID failover, perform optical night vision lux checks, simulate intruder alarm strobes, and calibrate magnetic door release timeouts before project completion.
                </p>
              </div>

              <button
                onClick={onRequestService}
                className="px-6 py-3 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg shrink-0 flex items-center space-x-2"
              >
                <span>Request a Technical Visit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* Contact Section Form & Office Coordinates */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Office Coordinates & Operating Hours */}
          <div className="lg:col-span-5 rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white">Central Operations &amp; Dispatch</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3 text-slate-300">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm">Main Office &amp; Warehouse:</strong>
                  <span>Zone Industrielle Chenini &bull; Route de Gabès km 3, Gabès, Tunisia</span>
                  <p className="text-slate-500 text-[11px] mt-0.5">Annexes: Les Berges du Lac 2, Tunis &bull; Zone Industrielle Akouda, Sousse</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-slate-300">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <strong className="text-white block text-sm">Direct Phone Hotline:</strong>
                  <a href="tel:+21675200300" className="hover:text-emerald-300 font-mono font-bold">+216 75 200 300</a>
                  <span className="text-slate-500 text-[11px] block">Mobile Dispatch: +216 98 123 456</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-slate-300">
                <Mail className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <strong className="text-white block text-sm">Official Email:</strong>
                  <a href="mailto:contact@securops.tn" className="hover:text-cyan-300 font-mono">contact@securops.tn</a>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-slate-300">
                <Clock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm">Field Operating Schedule:</strong>
                  <span>Monday – Friday: 08:00 – 18:00</span>
                  <p className="text-slate-400">Saturday: 08:30 – 14:00</p>
                  <p className="text-rose-400 font-bold text-[11px] mt-1">24/7 Priority SLA Dispatch for Banking &amp; Medical Contracts</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              Need urgent service? We recommend using our <button onClick={onRequestService} className="text-blue-400 font-bold underline">Service Request Form</button> for immediate dispatch logging.
            </div>
          </div>

          {/* Right Column: Direct Inquiry Form */}
          <div className="lg:col-span-7 rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-white">Send a Technical Inquiry</h3>
              <p className="text-xs text-slate-400">
                Have a general question regarding equipment compatibility or corporate SLAs?
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Inquiry Received</h4>
                <p className="text-xs text-emerald-200">
                  Thank you, <strong>{formData.name}</strong>. Our engineering dispatcher will reply to {formData.email} within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Your Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Karim Trabelsi"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="e.g. +216 98 000 111"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Email Address *</label>
                    <input
                      type="email"
                      placeholder="e.g. contact@business.tn"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Subject *</label>
                    <input
                      type="text"
                      placeholder="e.g. 48-Port Switch Expansion"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Message / Inquiries *</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your technical setup..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-blue-500 outline-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md flex items-center justify-center space-x-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Technical Inquiry</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
