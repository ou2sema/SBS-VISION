import React from 'react';
import { X, Wrench, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { ProductItem } from '../../types/customerWebsite';

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onRequestInstallation: (product: ProductItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onRequestInstallation,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl animate-fadeIn">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded">
              {product.brand} &bull; {product.model}
            </span>
            <h2 className="text-xl font-bold text-white mt-1">{product.name}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6 text-xs">
          
          {/* Visual Display */}
          <div className="h-48 bg-slate-950 rounded-2xl p-4 flex items-center justify-center border border-slate-800">
            <img
              src={product.images[0]}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
              Engineering Overview
            </span>
            <p className="text-slate-300 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          {/* Full Datasheet Specifications Table */}
          <div className="space-y-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
              Full Datasheet Technical Specifications
            </span>
            <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
              {Object.entries(product.specifications).map(([key, val], idx) => (
                <div key={idx} className="p-3 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">{key}</span>
                  <span className="text-slate-200 font-mono text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Notice */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 text-[11px] flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>
              This hardware requires certified field mounting, PoE switch budget calculation, and secure firmware isolation. We deliver this item fully configured with 2-year warranty.
            </span>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-slate-500 block">Unit Hardware Price</span>
              <span className="text-xl font-black text-white font-mono">
                {product.price} {product.currency}
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                onRequestInstallation(product);
              }}
              className="px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition-all"
            >
              <Wrench className="w-4 h-4" />
              <span>REQUEST INSTALLATION FOR THIS PRODUCT</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
