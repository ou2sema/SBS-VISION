import React, { useState } from 'react';
import { 
  Wrench, 
  CheckCircle2, 
  Camera, 
  Barcode, 
  Layers, 
  Cpu, 
  HardDrive, 
  Plus, 
  CheckSquare, 
  Square,
  ShieldCheck
} from 'lucide-react';
import { WorkflowTask, WorkOrder, InstalledEquipment } from '../../types';

interface InstallationTaskViewProps {
  task: WorkflowTask;
  workOrder: WorkOrder;
  onComplete: (data: any) => void;
  onRecordAsset: (asset: Omit<InstalledEquipment, 'id' | 'installedAt'>) => void;
  installedAssets: InstalledEquipment[];
  disabled?: boolean;
}

export const InstallationTaskView: React.FC<InstallationTaskViewProps> = ({
  task,
  workOrder,
  onComplete,
  onRecordAsset,
  installedAssets,
  disabled
}) => {
  // Serial number inputs
  const [newDeviceName, setNewDeviceName] = useState('Hikvision ColorVu 4MP Turret');
  const [newDeviceCategory, setNewDeviceCategory] = useState<'CAMERA' | 'RECORDER' | 'NETWORK' | 'POWER'>('CAMERA');
  const [newSerial, setNewSerial] = useState('HK-CAM-90481');
  const [newLocation, setNewLocation] = useState('Front Customer Entrance');

  // Installation Checklist
  const [checklist, setChecklist] = useState({
    cablePulled: true,
    camerasMounted: true,
    waterproofJunctions: true,
    nvrRacked: true,
    powerTested: true,
  });

  // Installation Photos
  const [photos, setPhotos] = useState<{ url: string; caption: string }[]>([
    {
      url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80',
      caption: 'Outdoor waterproof junction box and camera mount'
    },
    {
      url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      caption: 'Cat6 cable trunking & NVR termination rack'
    }
  ]);

  const isCompleted = task.status === 'COMPLETED';

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSerial || !newDeviceName) return;

    onRecordAsset({
      workOrderId: workOrder.id,
      name: newDeviceName,
      category: newDeviceCategory,
      serialNumber: newSerial,
      modelNumber: 'DS-2CD2347G2-LU',
      locationOnSite: newLocation,
      notes: 'Tested and online via PoE switch port',
    });

    setNewSerial(`HK-${newDeviceCategory === 'CAMERA' ? 'CAM' : 'NVR'}-${Math.floor(10000 + Math.random() * 90000)}`);
  };

  const toggleCheck = (key: keyof typeof checklist) => {
    if (isCompleted || disabled) return;
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecked = Object.values(checklist).every(Boolean);

  const handleComplete = () => {
    onComplete({
      installedAssetsCount: installedAssets.length,
      checklist,
      installationPhotos: photos,
      completedAt: new Date().toISOString(),
    });
  };

  const woAssets = installedAssets.filter(a => a.workOrderId === workOrder.id);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Field Execution • Mounting &amp; Cabling
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Physical Installation &amp; Hardware Assembly
          </h2>
          <p className="text-xs text-slate-500">
            Mount field hardware, run conduits, terminate Cat6 jacks, and record hardware serials for warranty.
          </p>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {task.status}
        </span>
      </div>

      {/* Equipment Serial Registration Section */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Barcode className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Installed Hardware Serial Registry ({woAssets.length} logged)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">Required for customer warranty certificate</span>
        </div>

        {/* Existing Logged Serials */}
        {woAssets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {woAssets.map(asset => (
              <div key={asset.id} className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{asset.name}</span>
                  <p className="text-[11px] text-slate-500">{asset.locationOnSite}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 text-[11px]">
                    {asset.serialNumber}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No equipment serials recorded yet. Add below:</p>
        )}

        {/* Add Asset Form */}
        {!isCompleted && !disabled && (
          <form onSubmit={handleAddAsset} className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Device Name</label>
              <input
                type="text"
                value={newDeviceName}
                onChange={e => setNewDeviceName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Category</label>
              <select
                value={newDeviceCategory}
                onChange={e => setNewDeviceCategory(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium"
              >
                <option value="CAMERA">Camera</option>
                <option value="RECORDER">NVR / DVR</option>
                <option value="NETWORK">PoE Switch</option>
                <option value="POWER">UPS / Power</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Serial Number</label>
              <input
                type="text"
                value={newSerial}
                onChange={e => setNewSerial(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono font-bold text-indigo-700"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Serial</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Installation Quality Checklist */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          Workmanship Quality Sign-off
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[
            { key: 'cablePulled', label: 'Cat6 cable runs pulled in rigid PVC conduit' },
            { key: 'camerasMounted', label: 'Cameras firmly mounted at target optical angles' },
            { key: 'waterproofJunctions', label: 'Waterproof rubber glands tightened on exterior cameras' },
            { key: 'nvrRacked', label: 'NVR secured and ventilated in telecom rack' },
            { key: 'powerTested', label: 'PoE voltage & power consumption verified' },
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

      {/* Completion Action */}
      {!isCompleted && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Completing installation unlocks <strong>Task: Configuration &amp; Commissioning</strong>.
          </p>

          <button
            onClick={handleComplete}
            disabled={disabled || !allChecked}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Physical Installation</span>
          </button>
        </div>
      )}

      {isCompleted && (
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Physical installation verified. Next phase: Software configuration and commissioning.
          </span>
        </div>
      )}

    </div>
  );
};
