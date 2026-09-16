import React, { useState } from 'react';
import { 
  Shield, 
  Wrench, 
  Menu, 
  X, 
  Search, 
  Phone, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  FileText,
  Sliders,
  Laptop
} from 'lucide-react';
import { CustomerWebsiteRoute } from '../../types/customerWebsite';

interface NavbarProps {
  currentRoute: CustomerWebsiteRoute;
  setCurrentRoute: (route: CustomerWebsiteRoute) => void;
  onOpenAdminCockpit: () => void;
  onTrackRequestModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  setCurrentRoute,
  onOpenAdminCockpit,
  onTrackRequestModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { route: 'HOME' as CustomerWebsiteRoute, label: 'Home' },
    { route: 'SERVICES' as CustomerWebsiteRoute, label: 'Services' },
    { route: 'PRODUCTS' as CustomerWebsiteRoute, label: 'Products' },
    { route: 'SOLUTIONS' as CustomerWebsiteRoute, label: 'Solutions' },
    { route: 'ABOUT' as CustomerWebsiteRoute, label: 'About & Quality' },
    { route: 'CONTACT' as CustomerWebsiteRoute, label: 'Contact' },
  ];

  const handleNavClick = (route: CustomerWebsiteRoute) => {
    setCurrentRoute(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white selection:bg-blue-600 selection:text-white">
      {/* Top emergency & dispatch announcement strip */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/40 border-b border-slate-800/80 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-300">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-slate-300">
              Direct Technical Field Dispatch &bull; Emergency Security Hotline:
            </span>
            <a href="tel:+21675200300" className="text-blue-400 hover:text-blue-300 font-bold ml-1">
              +216 75 200 300
            </a>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <button
              onClick={onTrackRequestModal}
              className="text-slate-400 hover:text-white flex items-center space-x-1 font-semibold transition-colors"
            >
              <Search className="w-3 h-3 text-blue-400" />
              <span>Track My Request</span>
            </button>
            <span className="text-slate-700">|</span>
            {/* Direct access to Operations Dashboard for evaluation */}
            <button
              onClick={onOpenAdminCockpit}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1 transition-colors px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20"
              title="Switch to Internal Operations Cockpit to process incoming requests"
            >
              <Laptop className="w-3 h-3" />
              <span>Staff Operations Cockpit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleNavClick('HOME')}
              className="flex items-center space-x-3 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-blue-200 transition-colors">
                    SecurOps
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider">
                    Systems
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Design &bull; Installation &bull; Maintenance
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNavClick(item.route)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-slate-800/90 text-white font-bold border border-slate-700 shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTA */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={onTrackRequestModal}
              className="hidden xl:inline-flex px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
            >
              Track Request
            </button>

            <button
              onClick={() => handleNavClick('REQUEST_SERVICE')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 flex items-center space-x-2 transition-all transform active:scale-95"
            >
              <span>REQUEST A SERVICE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => handleNavClick('REQUEST_SERVICE')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white"
            >
              Request Service
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((item) => (
            <button
              key={item.route}
              onClick={() => handleNavClick(item.route)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                currentRoute === item.route
                  ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onTrackRequestModal();
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-2"
            >
              <Search className="w-4 h-4 text-blue-400" />
              <span>Track An Existing Request / Quote</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminCockpit();
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 flex items-center space-x-2"
            >
              <Laptop className="w-4 h-4" />
              <span>Switch to Operations Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
