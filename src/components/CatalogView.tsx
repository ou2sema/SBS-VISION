import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Tag, 
  ShieldCheck, 
  Layers, 
  CheckCircle2,
  Wrench,
  Wifi,
  HardDrive
} from 'lucide-react';
import { CATALOG_PRODUCTS } from '../services/catalog';

export const CatalogView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filtered = CATALOG_PRODUCTS.filter(p => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Package className="w-6 h-6 text-blue-600" />
            <span>Standardized Equipment &amp; Rate Catalog</span>
          </h1>
          <p className="text-sm text-slate-600">
            Trusted central price book for commercial quotations. Prevents unauthorized client price overrides.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          <span>{CATALOG_PRODUCTS.length} Standard SKU Items</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products, SKUs, or services..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'CCTV_HARDWARE', 'NETWORKING', 'ACCESS_CONTROL', 'CABLING_MATERIALS', 'SERVICES'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-slate-400 font-bold">{item.sku}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {item.category.replace(/_/g, ' ')}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.name}</h3>
              <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{item.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400">Unit Price ({item.unit})</span>
                <p className="text-lg font-black text-slate-900 font-mono">
                  {item.unitPrice.toFixed(2)} <span className="text-xs font-sans text-slate-500 font-bold">TND</span>
                </p>
              </div>

              {item.warrantyMonths ? (
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{item.warrantyMonths}m Warranty</span>
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
