import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  Tv, 
  Moon, 
  Activity, 
  FileText, 
  PenTool, 
  RotateCcw, 
  Award,
  CheckSquare,
  Square,
  Sparkles,
  Download
} from 'lucide-react';
import { WorkflowTask, WorkOrder, ServiceReport, InstalledEquipment } from '../../types';

interface TestingAndHandoverViewProps {
  task: WorkflowTask;
  workOrder: WorkOrder;
  installedAssets: InstalledEquipment[];
  onComplete: (data: any) => void;
  onFinalizeJob: (reportData: Omit<ServiceReport, 'id' | 'completedAt'>) => void;
  disabled?: boolean;
}

export const TestingAndHandoverView: React.FC<TestingAndHandoverViewProps> = ({
  task,
  workOrder,
  installedAssets,
  onComplete,
  onFinalizeJob,
  disabled
}) => {
  const isTestingStep = task.templateStepId === 'testing_commissioning';
  const isHandoverStep = task.templateStepId === 'customer_handover';

  // Testing checklist state
  const [testChecks, setTestChecks] = useState({
    allFeedsOnline: true,
    nightVisionIR: true,
    motionDetectionAcuSense: true,
    recordingSchedule24_7: true,
    mobileAppPaired: true,
    rebootRecovery: true,
  });

  // Handover state
  const [customerName, setCustomerName] = useState(workOrder.customerName);
  const [customerFeedback, setCustomerFeedback] = useState('Excellent installation quality. Clean conduit work and mobile app is fast.');
  const [rating, setRating] = useState<number>(5);
  const [hasDrawnSignature, setHasDrawnSignature] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Digital signature canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e293b';
  }, [canvasRef]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled || task.status === 'COMPLETED') return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled || task.status === 'COMPLETED') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    setHasDrawnSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSignature(false);
  };

  const toggleTest = (key: keyof typeof testChecks) => {
    if (disabled || task.status === 'COMPLETED') return;
    setTestChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allTestsPassed = Object.values(testChecks).every(Boolean);

  const handleCompleteTesting = () => {
    onComplete({
      testChecks,
      testedBy: 'Slimane Trabelsi (Senior Field Tech)',
      testedAt: new Date().toISOString(),
    });
  };

  const handleFinalizeHandover = () => {
    const canvas = canvasRef.current;
    const sigData = canvas ? canvas.toDataURL() : 'data:image/svg+xml;utf8,<svg></svg>';

    onFinalizeJob({
      workOrderId: workOrder.id,
      customerSignName: customerName,
      customerSignatureUrl: sigData,
      technicianNotes: 'All hardware tested and online. Customer trained on live playback, clip export, and mobile push alerts.',
      installedEquipmentCount: installedAssets.length,
      warrantyDurationMonths: 24,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
            {isTestingStep ? 'Step 8 • Commissioning & QA Testing' : 'Step 9 • Customer Handover & Sign-off'}
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            {isTestingStep ? 'System Commissioning & Diagnostic Tests' : 'Customer Acceptance & Digital Signature'}
          </h2>
          <p className="text-xs text-slate-500">
            {isTestingStep 
              ? 'Validate video stream integrity, motion tripwires, night vision, and P2P mobile pairing.'
              : 'Formal sign-off by customer and issuance of Official Service & Warranty Report.'}
          </p>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          task.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-cyan-100 text-cyan-800'
        }`}>
          {task.status}
        </span>
      </div>

      {/* Mode A: Testing & Diagnostics */}
      {isTestingStep && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Quality Assurance Checklist
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { key: 'allFeedsOnline', label: 'All camera streams online at full 4MP 25fps resolution', icon: Tv },
                { key: 'nightVisionIR', label: 'Night vision IR & ColorVu warm illumination verified', icon: Moon },
                { key: 'motionDetectionAcuSense', label: 'AcuSense human/vehicle smart detection zones set', icon: Activity },
                { key: 'recordingSchedule24_7', label: 'Continuous 24/7 HDD circular overwrite initialized', icon: ShieldCheck },
                { key: 'mobileAppPaired', label: 'Customer smartphone paired via secure QR cloud code', icon: Smartphone },
                { key: 'rebootRecovery', label: 'Power-cycle reboot recovery & auto-reconnect test passed', icon: RotateCcw },
              ].map(item => {
                const checked = testChecks[item.key as keyof typeof testChecks];
                const Icon = item.icon;
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleTest(item.key as keyof typeof testChecks)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center space-x-3 transition-all ${
                      checked
                        ? 'bg-emerald-50/70 border-emerald-300 text-slate-900 font-semibold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    {checked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <Icon className={`w-4 h-4 shrink-0 ${checked ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span className="text-xs">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {task.status !== 'COMPLETED' && (
            <div className="pt-2 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                All 6 tests must be confirmed to unlock final customer handover.
              </p>
              <button
                onClick={handleCompleteTesting}
                disabled={disabled || !allTestsPassed}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Pass QA &amp; Unlock Handover</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode B: Customer Handover & Digital Signature (Section 25) */}
      {isHandoverStep && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Authorized Signatory Full Name
              </label>
              <input
                type="text"
                disabled={task.status === 'COMPLETED' || disabled}
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-bold text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Customer Satisfaction Rating
              </label>
              <div className="flex items-center space-x-1 py-1.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    disabled={task.status === 'COMPLETED' || disabled}
                    onClick={() => setRating(star)}
                    className="text-amber-400 hover:scale-110 transition-transform text-lg"
                  >
                    ★
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">{rating} / 5 Stars</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Customer Sign-off Feedback
            </label>
            <textarea
              rows={2}
              disabled={task.status === 'COMPLETED' || disabled}
              value={customerFeedback}
              onChange={e => setCustomerFeedback(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
            />
          </div>

          {/* Digital Signature Canvas */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                <PenTool className="w-3.5 h-3.5 text-blue-600" />
                <span>Customer Digital Signature (Touch / Pen / Mouse)</span>
              </label>
              {task.status !== 'COMPLETED' && (
                <button
                  type="button"
                  onClick={clearSignature}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear Pad</span>
                </button>
              )}
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 p-2 relative overflow-hidden">
              <canvas
                ref={canvasRef}
                width={500}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-40 bg-white rounded-xl touch-none border border-slate-200 cursor-crosshair"
              />
              {!hasDrawnSignature && task.status !== 'COMPLETED' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-slate-400 font-medium">
                  Draw customer signature here with finger or mouse
                </div>
              )}
            </div>
          </div>

          {/* Handover Action */}
          {task.status !== 'COMPLETED' ? (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Finalizing marks Work Order as <strong>COMPLETED</strong> and generates official warranty certificate.
              </p>

              <button
                onClick={handleFinalizeHandover}
                disabled={disabled || !customerName}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all"
              >
                <Award className="w-4 h-4" />
                <span>FINALIZE &amp; ISSUE SERVICE REPORT</span>
              </button>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-sm">Work Order Fully Completed &amp; Handed Over</p>
                  <p className="text-emerald-700 text-[11px]">
                    Signed by {customerName} on {new Date(task.completedAt || '').toLocaleString()}.
                  </p>
                </div>
              </div>
              <button
                onClick={() => alert(`Service Report REP-${workOrder.id} ready for PDF export.`)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
