import React from 'react';
import { 
  Shield, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Lock,
  Search,
  Laptop
} from 'lucide-react';
import { CustomerWebsiteRoute } from '../../types/customerWebsite';

interface FooterProps {
  setCurrentRoute: (route: CustomerWebsiteRoute) => void;
  onOpenAdminCockpit: () => void;
  onTrackRequestModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentRoute,
  onOpenAdminCockpit,
  onTrackRequestModal,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      
      {/* Top Banner: Technical Consultation Callout */}
      <div className="border-b border-slate-800/80 py-10 bg-gradient-to-b from-slate-900/60 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              Field Engineering Dispatch
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-2 tracking-tight">
              Planning a new installation or security upgrade?
            </h3>
            <p className="text-slate-400 text-xs max-w-xl mt-1">
              Our technical team conducts structured site visits, optical angle simulations, and RF surveys across Tunisia to deliver authoritative, itemized proposals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setCurrentRoute('REQUEST_SERVICE');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition-all"
            >
              <span>REQUEST A SERVICE</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onTrackRequestModal}
              className="px-4 py-3 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center space-x-2 transition-all"
            >
              <Search className="w-4 h-4 text-blue-400" />
              <span>Track Existing Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Company Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">SecurOps Systems</span>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              We design, install, configure, and maintain security and technology systems. Industrial-grade video surveillance, biometric access control, certified networking, and wireless infrastructure.
            </p>

            <div className="space-y-2 pt-2 text-slate-300">
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Zone Industrielle Chenini &bull; Gabès / Tunis, Tunisia</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+21675200300" className="hover:text-white font-bold">+216 75 200 300</a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href="mailto:contact@securops.tn" className="hover:text-white">contact@securops.tn</a>
              </div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Technical Services</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => setCurrentRoute('SERVICES')} className="hover:text-white transition-colors">
                  CCTV &amp; IP Cameras
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('SERVICES')} className="hover:text-white transition-colors">
                  Intrusion Alarm Systems
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('SERVICES')} className="hover:text-white transition-colors">
                  Access Control &amp; Biometrics
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('SERVICES')} className="hover:text-white transition-colors">
                  Structured Cat6 Cabling
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('SERVICES')} className="hover:text-white transition-colors">
                  Commercial Wi-Fi &amp; Mesh
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('SERVICES')} className="hover:text-white transition-colors">
                  Hospitality IPTV &amp; Satellite
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Industry Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => setCurrentRoute('SOLUTIONS')} className="hover:text-white transition-colors">
                  Commercial Offices &amp; HQ
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('SOLUTIONS')} className="hover:text-white transition-colors">
                  Industrial Warehouses &amp; Yards
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('SOLUTIONS')} className="hover:text-white transition-colors">
                  Luxury Residential Villas
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('SOLUTIONS')} className="hover:text-white transition-colors">
                  Retail Stores &amp; Cashiers
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('SOLUTIONS')} className="hover:text-white transition-colors">
                  Healthcare Clinics &amp; Labs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Workflow & Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Customer Workflow</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={onTrackRequestModal} className="hover:text-white transition-colors flex items-center space-x-1.5 text-blue-300 font-semibold">
                  <Search className="w-3.5 h-3.5 text-blue-400" />
                  <span>Track Status &amp; Quote</span>
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('ABOUT')} className="hover:text-white transition-colors">
                  Quality Standards &amp; Testing
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('CONTACT')} className="hover:text-white transition-colors">
                  Technical Visit Request
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenAdminCockpit}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 flex items-center space-x-1.5 font-bold transition-colors"
                >
                  <Laptop className="w-3.5 h-3.5 text-amber-400" />
                  <span>Internal Staff Cockpit</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright and compliance */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-4">
          <p>&copy; {new Date().getFullYear()} SecurOps Technology Systems SARL. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>TLS 1.3 256-bit Encrypted Service Architecture</span>
            </span>
            <span>&bull;</span>
            <span>Tunisia Technical Norms Compliant</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
