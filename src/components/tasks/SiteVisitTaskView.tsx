import React, { useState } from 'react';
import { 
  Camera, 
  CheckCircle2, 
  MapPin, 
  Building, 
  Zap, 
  Wifi, 
  FileText, 
  Upload, 
  Plus, 
  CheckSquare, 
  Square,
  Sparkles,
  Layers
} from 'lucide-react';
import { WorkflowTask, WorkOrder } from '../../types';

interface SiteVisitTaskViewProps {
  task: WorkflowTask;
  workOrder: WorkOrder;
  onComplete: (data: any) => void;
  disabled?: boolean;
}

export const SiteVisitTaskView: React.FC<SiteVisitTaskViewProps> = ({
  task,
  workOrder,
  onComplete,
  disabled
}) => {
  const [propertyType, setPropertyType] = useState<'COMMERCIAL' | 'RESIDENTIAL' | 'INDUSTRIAL'>('COMMERCIAL');
  const [floors, setFloors] = useState<number>(1);
  const [rooms, setRooms] = useState<number>(4);
  const [internetAvailable, setInternetAvailable] = useState<boolean>(true);
  const [electricalSituation, setElectricalSituation] = useState<'STABLE' | 'NEEDS_UPS' | 'UNGROUNDED'>('NEEDS_UPS');
  const [cableMeters, setCableMeters] = useState<number>(150);
  const [cameraLocations, setCameraLocations] = useState<string>('Front entrance (bullet), Cashier desk (turret with audio), Warehouse corridor (turret), Rear loading bay (bullet).');
  const [technicalNotes, setTechnicalNotes] = useState<string>('Drop ceiling present in retail area. Masonry conduit needed along rear loading dock. 19-inch mini wall rack recommended near fiber ONT box.');
  
  // Photos
  const [photos, setPhotos] = useState<{ url: string; caption: string }[]>([
    {
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
      caption: 'Main storefront entrance & conduit entry point'
    },
    {
      url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80',
      caption: 'Backroom telecom rack location & power outlet'
    }
  ]);

  // Section 11 Checklist
  const [checklist, setChecklist] = useState({
    requirementsConfirmed: true,
    siteInspected: true,
    photosCaptured: true,
    technicalRecorded: true,
    equipmentRecommended: true,
  });

  const isCompleted = task.status === 'COMPLETED';

  const toggleCheck = (key: keyof typeof checklist) => {
    if (isCompleted || disabled) return;
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecked = Object.values(checklist).every(Boolean);

  const handleComplete = () => {
    onComplete({
      propertyType,
      floors,
      rooms,
      internetAvailable,
      electricalSituation,
      cableMeters,
      cameraLocations,
      technicalNotes,
      photos,
      checklist,
      inspectedAt: new Date().toISOString(),
    });
  };

  const handleSimulateAddPhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'
    ];
    const randomUrl = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    setPhotos(prev => [...prev, { url: randomUrl, caption: `Site Survey Photo #${prev.length + 1}` }]);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            Step 2 • Technical Site Survey
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Site Visit &amp; Technical Inspection
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Record physical building constraints, power reliability, cable runs, and mounting angles.
          </p>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
        }`}>
          {task.status}
        </span>
      </div>

      {/* Building & Environmental Specifications */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Property Type
          </label>
          <select
            disabled={isCompleted || disabled}
            value={propertyType}
            onChange={e => setPropertyType(e.target.value as any)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
          >
            <option value="COMMERCIAL">Commercial / Retail Store</option>
            <option value="RESIDENTIAL">Residential Villa / Apartment</option>
            <option value="INDUSTRIAL">Industrial Warehouse / Plant</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Floors / Levels
          </label>
          <input
            type="number"
            min={1}
            max={20}
            disabled={isCompleted || disabled}
            value={floors}
            onChange={e => setFloors(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Estimated Cat6 Run (Meters)
          </label>
          <input
            type="number"
            min={10}
            step={10}
            disabled={isCompleted || disabled}
            value={cableMeters}
            onChange={e => setCableMeters(parseInt(e.target.value) || 50)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          />
        </div>
      </div>

      {/* Infrastructure Readiness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Wifi className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-xs font-bold text-slate-900">Broadband Internet Available?</p>
              <p className="text-[11px] text-slate-500">Fiber/VDSL for cloud P2P remote streaming</p>
            </div>
          </div>
          <button
            type="button"
            disabled={isCompleted || disabled}
            onClick={() => setInternetAvailable(!internetAvailable)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              internetAvailable ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
            }`}
          >
            {internetAvailable ? 'YES (Active)' : 'NO (Offline Only)'}
          </button>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Zap className="w-4 h-4 text-amber-600" />
            <div>
              <p className="text-xs font-bold text-slate-900">Electrical Grid Situation</p>
              <p className="text-[11px] text-slate-500">Power stability &amp; surge exposure</p>
            </div>
          </div>
          <select
            disabled={isCompleted || disabled}
            value={electricalSituation}
            onChange={e => setElectricalSituation(e.target.value as any)}
            className="px-2 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
          >
            <option value="STABLE">Stable Grid</option>
            <option value="NEEDS_UPS">Needs UPS Battery Backup</option>
            <option value="UNGROUNDED">Ungrounded (High Surge Risk)</option>
          </select>
        </div>
      </div>

      {/* Equipment Placements & Technical Notes */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Planned Device Locations
          </label>
          <textarea
            rows={2}
            disabled={isCompleted || disabled}
            value={cameraLocations}
            onChange={e => setCameraLocations(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Technical Survey Notes &amp; Conduit Recommendations
          </label>
          <textarea
            rows={2}
            disabled={isCompleted || disabled}
            value={technicalNotes}
            onChange={e => setTechnicalNotes(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Photos Capture / Gallery */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            <span>Site Survey Photos ({photos.length})</span>
          </label>
          {!isCompleted && (
            <button
              onClick={handleSimulateAddPhoto}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add / Capture Photo</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative group">
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-24 object-cover"
              />
              <div className="p-2">
                <p className="text-[11px] font-medium text-slate-700 truncate">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 11: Visit Checklist */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          Visit Quality Checklist (Mandatory Sign-off)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[
            { key: 'requirementsConfirmed', label: 'Customer requirements confirmed' },
            { key: 'siteInspected', label: 'Physical building & pathways inspected' },
            { key: 'photosCaptured', label: 'Site photos captured and geotagged' },
            { key: 'technicalRecorded', label: 'Technical & cabling specs recorded' },
            { key: 'equipmentRecommended', label: 'Recommended bill of materials finalized' },
          ].map(item => {
            const checked = checklist[item.key as keyof typeof checklist];
            return (
              <div
                key={item.key}
                onClick={() => toggleCheck(item.key as keyof typeof checklist)}
                className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${
                  checked ? 'text-slate-900 font-semibold' : 'text-slate-500'
                }`}
              >
                {checked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-300 shrink-0" />
                )}
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion Button */}
      {!isCompleted && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Completing this visit automatically unlocks <strong>Task 3: Create Quotation</strong> with survey specs.
          </p>
          <button
            onClick={handleComplete}
            disabled={disabled || !allChecked}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Visit</span>
          </button>
        </div>
      )}

      {isCompleted && (
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Technical site survey completed. Quotation generation unlocked.
          </span>
        </div>
      )}

    </div>
  );
};
