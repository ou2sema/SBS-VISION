import React, { useState } from 'react';
import { 
  Camera, 
  ShieldAlert, 
  KeyRound, 
  Network, 
  Wifi, 
  Tv, 
  Wrench, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  Sparkles 
} from 'lucide-react';
import { SERVICES_CATALOG } from '../../data/servicesData';
import { ServiceItem, CustomerWebsiteRoute } from '../../types/customerWebsite';

interface ServicesGridProps {
  onSelectService: (service: ServiceItem) => void;
  onRequestServiceWithType: (service: ServiceItem) => void;
  setCurrentRoute: (route: CustomerWebsiteRoute) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  onSelectService,
  onRequestServiceWithType,
  setCurrentRoute,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'All Technical Services' },
    { id: 'SECURITY', label: 'Surveillance & Access' },
    { id: 'NETWORKING', label: 'Cabling & Wi-Fi' },
    { id: 'TELECOM', label: 'IPTV & Satellite' },
    { id: 'MAINTENANCE', label: 'Maintenance & SLA' },
  ];

  const filteredServices = SERVICES_CATALOG.filter(service => {
    if (selectedCategory === 'ALL') return true;
    return service.category === selectedCategory;
  });

  const getServiceIcon = (slug: string) => {
    switch (slug) {
      case 'cctv-installation': return Camera;
      case 'alarm-systems': return ShieldAlert;
      case 'access-control': return KeyRound;
      case 'networking-cabling': return Network;
      case 'wifi-access-points': return Wifi;
      case 'iptv-satellite': return Tv;
      case 'maintenance-troubleshooting': return Wrench;
      default: return Wrench;
    }
  };

  return (
    <section className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-blue-400 tracking-widest uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Core Engineering Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Engineered Security &amp; Technology Solutions
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl">
              Turnkey system design, physical field installation, managed switch configuration, and preventative maintenance for businesses and private compounds.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const Icon = getServiceIcon(service.slug);

            return (
              <div
                key={service.id}
                className="rounded-3xl bg-slate-950 border border-slate-800/90 overflow-hidden flex flex-col group hover:border-slate-700 transition-all hover:shadow-2xl hover:shadow-blue-950/30"
              >
                {/* Visual Top Image with Overlay */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-900/90 backdrop-blur-md text-blue-300 border border-slate-700">
                      {service.category}
                    </span>
                  </div>

                  {/* Icon Badge */}
                  <div className="absolute bottom-4 left-4 w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                    <Icon className="w-5 h-5" />
                  </div>

                  {service.startingPriceEstimate && (
                    <div className="absolute bottom-4 right-4 text-[11px] font-mono font-bold px-2 py-1 rounded bg-slate-900/90 text-slate-300 border border-slate-700">
                      {service.startingPriceEstimate}
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>

                  {/* Key Features List */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-900">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Scope includes:
                    </span>
                    {service.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="pt-4 flex items-center space-x-2">
                    <button
                      onClick={() => onRequestServiceWithType(service)}
                      className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <span>Request Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onSelectService(service)}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                      title="View full technical specification"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
