import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Send, 
  CheckCircle2, 
  Clock, 
  History, 
  Calculator, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { WorkflowTask, WorkOrder, Quote, QuoteItem } from '../../types';
import { CATALOG_PRODUCTS } from '../../services/catalog';

interface QuoteTaskViewProps {
  task: WorkflowTask;
  workOrder: WorkOrder;
  quote?: Quote;
  onSaveQuote: (items: QuoteItem[], discount: number, notes: string) => void;
  disabled?: boolean;
}

export const QuoteTaskView: React.FC<QuoteTaskViewProps> = ({
  task,
  workOrder,
  quote,
  onSaveQuote,
  disabled
}) => {
  // Prepopulate with reasonable items based on service type or previous quote version
  const [items, setItems] = useState<QuoteItem[]>(() => {
    if (quote && quote.versions.length > 0) {
      const latest = quote.versions[quote.versions.length - 1];
      return latest.items;
    }
    // Default CCTV proposal
    return [
      {
        id: 'item_1',
        productId: 'prod_cam_4mp_turret',
        name: 'Hikvision ColorVu 4MP PoE Turret IP Camera',
        type: 'product',
        quantity: 4,
        unitPrice: 285.00,
        total: 1140.00
      },
      {
        id: 'item_2',
        productId: 'prod_nvr_8ch_poe',
        name: 'Hikvision AcuSense 8-Channel 4K PoE NVR',
        type: 'product',
        quantity: 1,
        unitPrice: 590.00,
        total: 590.00
      },
      {
        id: 'item_3',
        productId: 'prod_hdd_4tb_purple',
        name: 'Western Digital Purple 4TB Surveillance HDD',
        type: 'product',
        quantity: 1,
        unitPrice: 320.00,
        total: 320.00
      },
      {
        id: 'item_4',
        productId: 'prod_cable_cat6_roll',
        name: 'Cat6 UTP 100% Solid Copper Drum (305m)',
        type: 'product',
        quantity: 1,
        unitPrice: 260.00,
        total: 260.00
      },
      {
        id: 'item_5',
        productId: 'serv_cctv_install_per_cam',
        name: 'Camera Mounting, Conduit & Cable Pulling (per camera)',
        type: 'service',
        quantity: 4,
        unitPrice: 85.00,
        total: 340.00
      },
      {
        id: 'item_6',
        productId: 'serv_nvr_config_remote',
        name: 'NVR System Commissioning & P2P Cloud Setup',
        type: 'service',
        quantity: 1,
        unitPrice: 180.00,
        total: 180.00
      },
    ];
  });

  const [discount, setDiscount] = useState<number>(() => {
    if (quote && quote.versions.length > 0) {
      return quote.versions[quote.versions.length - 1].discount;
    }
    return 130.00;
  });

  const [notes, setNotes] = useState<string>(() => {
    if (quote && quote.versions.length > 0) {
      return quote.versions[quote.versions.length - 1].notes;
    }
    return 'Offer includes full equipment delivery, Cat6 cable pulling, NVR programming, mobile app setup, and 2-year warranty.';
  });

  const [selectedProductId, setSelectedProductId] = useState<string>(CATALOG_PRODUCTS[0].id);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [showVersionHistory, setShowVersionHistory] = useState<boolean>(false);

  // Live trusted price calculation
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.total, 0);
  }, [items]);

  const taxRate = 0.19; // 19% VAT
  const taxableAmount = Math.max(0, subtotal - discount);
  const taxAmount = Math.round(taxableAmount * taxRate * 100) / 100;
  const total = Math.round((taxableAmount + taxAmount) * 100) / 100;

  const isAccepted = quote?.status === 'ACCEPTED';
  const isSent = quote?.status === 'SENT';

  const handleAddItem = () => {
    const prod = CATALOG_PRODUCTS.find(p => p.id === selectedProductId);
    if (!prod) return;

    const newItem: QuoteItem = {
      id: `item_${Date.now()}`,
      productId: prod.id,
      name: prod.name,
      type: prod.category === 'SERVICES' ? 'service' : 'product',
      quantity: selectedQuantity,
      unitPrice: prod.unitPrice,
      total: prod.unitPrice * selectedQuantity,
    };

    setItems(prev => [...prev, newItem]);
    setSelectedQuantity(1);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(it => it.id !== id));
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    const safeQty = Math.max(1, qty);
    setItems(prev => prev.map(it => {
      if (it.id === id) {
        return {
          ...it,
          quantity: safeQty,
          total: it.unitPrice * safeQty,
        };
      }
      return it;
    }));
  };

  const handleSendQuote = () => {
    onSaveQuote(items, discount, notes);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      
      {/* Header & Versioning Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Step 3 • Commercial Quotation
            </span>
            {quote && (
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">
                Version {quote.currentVersion}
              </span>
            )}
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Bill of Quantities &amp; Pricing Proposal
          </h2>
          <p className="text-xs text-slate-500">
            Validated against trusted catalog pricing. Each change generates an auditable new version.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {quote && quote.versions.length > 1 && (
            <button
              onClick={() => setShowVersionHistory(!showVersionHistory)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center space-x-1"
            >
              <History className="w-3.5 h-3.5" />
              <span>Versions ({quote.versions.length})</span>
            </button>
          )}

          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            isAccepted 
              ? 'bg-emerald-100 text-emerald-800' 
              : isSent 
              ? 'bg-blue-100 text-blue-800 animate-pulse' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            {quote?.status || 'DRAFT'}
          </span>
        </div>
      </div>

      {/* Version History Drawer if toggled */}
      {showVersionHistory && quote && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
          <p className="font-bold text-slate-800 uppercase tracking-wider">Audit Version History</p>
          {quote.versions.map(v => (
            <div key={v.version} className="p-2.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900">Version {v.version}</span>
                <span className="text-slate-400 ml-2">by {v.createdBy} on {new Date(v.createdAt).toLocaleDateString()}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">{v.items.length} items • Notes: {v.notes.slice(0, 45)}...</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 text-sm">{v.total.toFixed(2)} TND</span>
                <span className="block text-[10px] text-slate-400">incl. 19% VAT</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Item from Catalog */}
      {!isAccepted && !disabled && (
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-2.5">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Select Product or Service from Trusted Catalog
            </label>
            <select
              value={selectedProductId}
              onChange={e => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white font-medium outline-none"
            >
              {CATALOG_PRODUCTS.map(p => (
                <option key={p.id} value={p.id}>
                  [{p.category}] {p.name} — {p.unitPrice.toFixed(2)} TND / {p.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="w-24">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Quantity
            </label>
            <input
              type="number"
              min={1}
              value={selectedQuantity}
              onChange={e => setSelectedQuantity(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white font-semibold outline-none"
            />
          </div>

          <div className="self-end w-full sm:w-auto">
            <button
              type="button"
              onClick={handleAddItem}
              className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg flex items-center justify-center space-x-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Description</th>
              <th className="py-2.5 px-2 text-center">Type</th>
              <th className="py-2.5 px-3 text-right">Unit Price</th>
              <th className="py-2.5 px-2 text-center w-20">Qty</th>
              <th className="py-2.5 px-3 text-right">Total (TND)</th>
              {!isAccepted && <th className="py-2.5 px-2 w-8"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/60">
                <td className="py-2.5 px-3 font-semibold text-slate-800">
                  {item.name}
                </td>
                <td className="py-2.5 px-2 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.type === 'service' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.type}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                  {item.unitPrice.toFixed(2)}
                </td>
                <td className="py-2.5 px-2 text-center">
                  {!isAccepted && !disabled ? (
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={e => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                      className="w-14 px-1.5 py-1 text-center font-bold border border-slate-200 rounded text-xs"
                    />
                  ) : (
                    <span className="font-bold text-slate-800">{item.quantity}</span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                  {item.total.toFixed(2)}
                </td>
                {!isAccepted && (
                  <td className="py-2.5 px-2 text-center">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financial Breakdown & Commercial Notes */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 border-t border-slate-100">
        <div className="md:col-span-7 space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Commercial Terms &amp; Scope of Work
          </label>
          <textarea
            rows={3}
            disabled={isAccepted || disabled}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <p className="text-[11px] text-slate-400">
            Terms are displayed to customer in the quote authorization portal.
          </p>
        </div>

        <div className="md:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600 font-medium">
            <span>Catalog Subtotal:</span>
            <span className="font-mono">{subtotal.toFixed(2)} TND</span>
          </div>

          <div className="flex justify-between items-center text-slate-600 font-medium">
            <span>Special Commercial Discount:</span>
            {!isAccepted && !disabled ? (
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={discount}
                  onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-1 text-right text-xs font-mono font-bold border border-slate-200 rounded"
                />
                <span className="text-[11px] text-slate-400">TND</span>
              </div>
            ) : (
              <span className="font-mono text-emerald-600 font-bold">-{discount.toFixed(2)} TND</span>
            )}
          </div>

          <div className="flex justify-between text-slate-600 font-medium pt-1 border-t border-slate-200">
            <span>VAT / Tax (19%):</span>
            <span className="font-mono">{taxAmount.toFixed(2)} TND</span>
          </div>

          <div className="flex justify-between items-baseline text-slate-900 font-extrabold text-base pt-2 border-t-2 border-slate-300">
            <span>Total Proposal:</span>
            <span className="font-mono text-purple-700 text-lg">{total.toFixed(2)} TND</span>
          </div>
        </div>
      </div>

      {/* Dispatch Action */}
      {!isAccepted && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Pressing <strong>SEND QUOTE</strong> registers version {quote ? quote.currentVersion + 1 : 1} and triggers customer notification.
          </p>

          <button
            onClick={handleSendQuote}
            disabled={disabled || items.length === 0}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 flex items-center space-x-1.5 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>SEND QUOTE TO CUSTOMER</span>
          </button>
        </div>
      )}

      {isAccepted && (
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Quote {quote?.id} has been formally accepted by customer on {new Date(quote?.acceptedAt || '').toLocaleDateString()}.
            </span>
          </div>
          <span className="font-bold text-emerald-900">{total.toFixed(2)} TND</span>
        </div>
      )}

    </div>
  );
};
