import React, { useState } from 'react';
import { 
  Package, 
  ArrowRight, 
  SlidersHorizontal, 
  Check, 
  Info, 
  ShieldCheck, 
  Cpu, 
  Eye,
  Wrench
} from 'lucide-react';
import { PRODUCTS_CATALOG } from '../../data/productsData';
import { ProductItem, CustomerWebsiteRoute } from '../../types/customerWebsite';

interface ProductsSectionProps {
  onSelectProduct: (product: ProductItem) => void;
  onRequestProductInstallation: (product: ProductItem) => void;
  setCurrentRoute: (route: CustomerWebsiteRoute) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  onSelectProduct,
  onRequestProductInstallation,
  setCurrentRoute,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'All Equipment' },
    { id: 'CCTV', label: 'Cameras & NVRs' },
    { id: 'ACCESS_CONTROL', label: 'Biometrics & Access' },
    { id: 'NETWORK', label: 'Switches & Wi-Fi' },
    { id: 'ALARM', label: 'Alarm Panels' },
  ];

  const filteredProducts = PRODUCTS_CATALOG.filter(product => {
    if (selectedCategory === 'ALL') return true;
    return product.category === selectedCategory;
  });

  return (
    <section className="py-20 bg-slate-950 text-white border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Hardware Catalog &bull; Discovery
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Enterprise Grade Equipment &amp; Field Hardware
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl">
              We deploy tier-1 industrial components tested for high-heat resilience and 24/7 reliability. We supply hardware exclusively as part of certified engineering design and installation.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Technical Guidance Notice (Prevent Blind Purchases) */}
        <div className="mb-8 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs flex items-start space-x-3 text-slate-300">
          <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-white">Installation &amp; Engineering Requirement Notice</p>
            <p className="text-slate-400 leading-relaxed">
              Industrial security hardware requires optical alignment, VLAN segregation, and electrical grounding to operate safely. Rather than purchasing blind hardware, request our turnkey service to ensure full compatibility and manufacturer warranty.
            </p>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-all hover:shadow-xl"
            >
              {/* Product Visual */}
              <div className="relative h-48 bg-slate-950/60 overflow-hidden flex items-center justify-center p-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900/90 text-slate-300 border border-slate-700">
                    {product.brand}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                    {product.model}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 text-sm font-black text-white bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700">
                  {product.price} {product.currency}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Key Specifications Preview */}
                <div className="space-y-1 pt-2 border-t border-slate-800/80 text-xs">
                  {Object.entries(product.specifications).slice(0, 3).map(([key, val], idx) => (
                    <div key={idx} className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500 font-medium truncate max-w-[120px]">{key}:</span>
                      <span className="text-slate-300 font-mono font-semibold truncate max-w-[180px] text-right">{val}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons: Request installation / Details */}
                <div className="pt-3 flex items-center space-x-2">
                  <button
                    onClick={() => onRequestProductInstallation(product)}
                    className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-md flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Request Installation</span>
                  </button>

                  <button
                    onClick={() => onSelectProduct(product)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                    title="View Datasheet Specifications"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
