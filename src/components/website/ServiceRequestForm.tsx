import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Upload, 
  X, 
  FileText, 
  Camera, 
  Shield, 
  Phone, 
  MapPin, 
  Building, 
  Clock, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServiceTypeCode } from '../../types';
import { ServiceRequestSubmission, CustomerWebsiteRoute } from '../../types/customerWebsite';
import { serviceRequestSchema } from '../../lib/validation/schemas';

interface ServiceRequestFormProps {
  initialServiceType?: ServiceTypeCode;
  initialProductName?: string;
  onSuccess: (requestId: string, token: string) => void;
  onCancel: () => void;
}

export const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({
  initialServiceType = 'cctv_installation',
  initialProductName,
  onSuccess,
  onCancel,
}) => {
  const { requests, acceptRequest } = useApp();

  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState<ServiceRequestSubmission>({
    fullName: '',
    phone: '',
    email: '',
    company: '',
    serviceType: initialServiceType,
    serviceCategoryLabel: 'CCTV Installation',
    address: '',
    city: 'Tunis',
    locationDetails: '',
    propertyType: 'COMMERCIAL_OFFICE',
    existingInstallation: 'NO_EXISTING',
    urgency: 'NORMAL',
    preferredContactTime: 'ANYTIME',
    deviceCountEstimate: 4,
    description: initialProductName 
      ? `Requesting installation assessment for: ${initialProductName}.`
      : '',
    attachments: [],
  });

  const serviceOptions: { code: ServiceTypeCode; label: string; icon: string; category: string }[] = [
    { code: 'cctv_installation', label: 'CCTV & IP Security Cameras', icon: '📹', category: 'Security' },
    { code: 'alarm_installation', label: 'Anti-Intrusion Alarm System', icon: '🚨', category: 'Security' },
    { code: 'access_control_installation', label: 'Biometric Access Control & Mag-Locks', icon: '🔐', category: 'Security' },
    { code: 'network_installation', label: 'Structured Cat6 Cabling & Rack Dressing', icon: '🔌', category: 'Networking' },
    { code: 'wifi_installation', label: 'Commercial Wi-Fi & Mesh Coverage', icon: '📶', category: 'Networking' },
    { code: 'iptv_installation', label: 'Hospitality IPTV & Satellite Distribution', icon: '📺', category: 'Telecom' },
    { code: 'maintenance', label: 'Preventative Maintenance & Health Audit', icon: '🛠️', category: 'Maintenance' },
    { code: 'troubleshooting', label: 'Urgent Breakdown & Troubleshooting', icon: '⚡', category: 'Maintenance' },
  ];

  const tunisianCities = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Sousse', 
    'Monastir', 'Sfax', 'Gabès', 'Bizerte', 'Kairouan', 'Gafsa', 'Djerba / Médenine'
  ];

  // Handle Photo Upload with Strict Validation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments = [...formData.attachments];
    const newErrors: Record<string, string> = { ...errors };

    Array.from(files).forEach((file: File) => {
      // Validate file count
      if (newAttachments.length >= 5) {
        newErrors.photos = 'Maximum 5 photos allowed.';
        return;
      }

      // Validate size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        newErrors.photos = `"${file.name}" exceeds 10MB limit.`;
        return;
      }

      // Validate MIME type
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowed.includes(file.type)) {
        newErrors.photos = `"${file.name}" is not a supported image format.`;
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      newAttachments.push({
        name: file.name,
        size: file.size,
        type: file.type,
        url: previewUrl,
        caption: 'Site photo',
      });
    });

    setFormData(prev => ({ ...prev, attachments: newAttachments }));
    setErrors(newErrors);
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  // Step Validation before progressing
  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (currentStep === 2) {
      if (!formData.serviceType) newErrors.serviceType = 'Please choose a service';
    }

    if (currentStep === 3) {
      if (!formData.address.trim()) newErrors.address = 'Street address or location is required';
      if (!formData.city) newErrors.city = 'Please select your city';
    }

    if (currentStep === 4) {
      if (!formData.description.trim() || formData.description.trim().length < 8) {
        newErrors.description = 'Please provide a brief description (at least 8 characters)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 6));
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Final Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setSubmitting(true);

    try {
      // Generate standard reference and cryptographically secure customer token
      const reqNumber = Math.floor(1000 + Math.random() * 9000);
      const newReqId = `REQ-00${reqNumber}`;
      const secureToken = `sec_${Math.random().toString(36).substring(2, 12)}_${Date.now().toString(36)}`;

      const selectedOption = serviceOptions.find(o => o.code === formData.serviceType);

      // Create authoritative ServiceRequest in shared Firebase schema
      const newRequestObject = {
        id: newReqId,
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerEmail: formData.email || `${formData.fullName.toLowerCase().replace(/\s+/g, '.')}@client.tn`,
        serviceType: formData.serviceType,
        serviceName: selectedOption?.label || 'Security Engineering Service',
        location: formData.city,
        address: `${formData.address}, ${formData.city}`,
        description: `[Property: ${formData.propertyType} | Existing: ${formData.existingInstallation} | Urgency: ${formData.urgency} | Target: ~${formData.deviceCountEstimate || 0} units]\n\n${formData.description}`,
        photos: formData.attachments.map(a => a.url),
        createdAt: new Date().toISOString(),
        status: 'NEW' as const,
        urgency: formData.urgency,
        source: 'WEBSITE',
        secureToken,
        preferredContactTime: formData.preferredContactTime,
      };

      // Store in AppContext requests queue (which persists to localStorage and Firestore)
      const existing = JSON.parse(localStorage.getItem('securops_requests') || '[]');
      existing.unshift(newRequestObject);
      localStorage.setItem('securops_requests', JSON.stringify(existing));

      // Also record in audit trail
      const existingLogs = JSON.parse(localStorage.getItem('securops_audit_logs') || '[]');
      existingLogs.unshift({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'CUSTOMER_REQUEST_CREATED',
        workOrderId: newReqId,
        actorId: 'WEBSITE_CLIENT',
        actorName: formData.fullName,
        actorRole: 'CUSTOMER',
        details: `Customer submitted service request for ${selectedOption?.label} in ${formData.city}. Status assigned: NEW.`,
      });
      localStorage.setItem('securops_audit_logs', JSON.stringify(existingLogs));

      // Trigger success callback
      setTimeout(() => {
        setSubmitting(false);
        onSuccess(newReqId, secureToken);
      }, 700);

    } catch (err: any) {
      setSubmitting(false);
      setErrors({ submit: err.message || 'Failed to submit request. Please retry.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Form Container */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl overflow-hidden">
        
        {/* Top Header & Step Progress Bar */}
        <div className="p-6 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                Turnkey Technical Inquiry
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Request a Service Installation
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Stepper Wizard Indicator */}
          <div className="grid grid-cols-6 gap-2">
            {[
              { num: 1, label: 'Customer' },
              { num: 2, label: 'Service' },
              { num: 3, label: 'Location' },
              { num: 4, label: 'Details' },
              { num: 5, label: 'Photos' },
              { num: 6, label: 'Confirm' },
            ].map(s => (
              <div key={s.num} className="space-y-1">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step >= s.num ? 'bg-blue-500' : 'bg-slate-800'
                  }`}
                />
                <span className={`text-[10px] font-bold block truncate text-center ${
                  step === s.num ? 'text-blue-400' : 'text-slate-500'
                }`}>
                  {s.num}. {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content Area */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* ================= STEP 1: CUSTOMER ================= */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <span>Step 1: Contact Information</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Who should our technical engineering dispatcher contact for scoping and scheduling?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Hatem Ben Ammar"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
                  />
                  {errors.fullName && <p className="text-rose-400 text-xs">{errors.fullName}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Phone Number (GSM) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +216 98 123 456"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
                  />
                  {errors.phone && <p className="text-rose-400 text-xs">{errors.phone}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Email Address (For itemized proposals)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. director@company.tn"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
                  />
                  {errors.email && <p className="text-rose-400 text-xs">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Company / Organization Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Clinique El Amen, Gabès"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-400 flex items-center space-x-2">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Your contact details are encrypted and used solely for technical consultation. No spam.</span>
              </div>
            </div>
          )}

          {/* ================= STEP 2: SERVICE SELECTION ================= */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Step 2: Select Technical Service</h3>
                <p className="text-xs text-slate-400">
                  What category of infrastructure or security installation do you require?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serviceOptions.map(option => (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => setFormData({ 
                      ...formData, 
                      serviceType: option.code,
                      serviceCategoryLabel: option.label
                    })}
                    className={`p-4 rounded-2xl border text-left flex items-start space-x-3 transition-all ${
                      formData.serviceType === option.code
                        ? 'bg-blue-950/40 border-blue-500 text-white shadow-md shadow-blue-500/10 ring-1 ring-blue-500'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-500 uppercase">{option.category}</span>
                        {formData.serviceType === option.code && (
                          <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <p className="font-bold text-sm text-white mt-0.5">{option.label}</p>
                    </div>
                  </button>
                ))}
              </div>
              {errors.serviceType && <p className="text-rose-400 text-xs">{errors.serviceType}</p>}
            </div>
          )}

          {/* ================= STEP 3: LOCATION ================= */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Step 3: Installation Site Location</h3>
                <p className="text-xs text-slate-400">
                  Where will the physical on-site technical survey and installation take place?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-300">
                    City / Governorate <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
                  >
                    {tunisianCities.map(c => (
                      <option key={c} value={c} className="bg-slate-900 text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300">
                    Street Address / Site Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Avenue Habib Bourguiba, Zone Industrielle"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
                  />
                  {errors.address && <p className="text-rose-400 text-xs">{errors.address}</p>}
                </div>

                <div className="space-y-1.5 sm:col-span-3">
                  <label className="text-xs font-bold text-slate-300">
                    Access / Landmark Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2nd Floor, next to central pharmacy, building has underground parking"
                    value={formData.locationDetails}
                    onChange={e => setFormData({ ...formData, locationDetails: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: DYNAMIC REQUIREMENTS ================= */}
          {step === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Step 4: Technical Scope &amp; Parameters</h3>
                <p className="text-xs text-slate-400">
                  Questions adapted to your selected service to help our engineers prepare appropriate measurement tools.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Property Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Type of Property</label>
                  <select
                    value={formData.propertyType}
                    onChange={e => setFormData({ ...formData, propertyType: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
                  >
                    <option value="COMMERCIAL_OFFICE">Commercial Office / HQ</option>
                    <option value="WAREHOUSE">Warehouse / Logistics Yard</option>
                    <option value="RESIDENTIAL_VILLA">Private Residential Villa</option>
                    <option value="RETAIL_STORE">Retail Store / Commercial Kiosk</option>
                    <option value="CLINIC_HEALTH">Medical Clinic / Laboratory</option>
                    <option value="OTHER">Other Construction Facility</option>
                  </select>
                </div>

                {/* Existing System Condition */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Existing Installation Status</label>
                  <select
                    value={formData.existingInstallation}
                    onChange={e => setFormData({ ...formData, existingInstallation: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
                  >
                    <option value="NO_EXISTING">Brand New Setup (No existing cables)</option>
                    <option value="UPGRADE_EXISTING">Upgrading / Replacing Old System</option>
                    <option value="EXPANSION">Adding Extra Equipment to Current System</option>
                    <option value="TROUBLESHOOTING_ONLY">Troubleshooting / Repairing Faulty System</option>
                  </select>
                </div>

                {/* Dynamic Question based on service: Camera count or Access Point count */}
                {(formData.serviceType === 'cctv_installation' || formData.serviceType === 'alarm_installation') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Estimated Camera / Sensor Count
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={128}
                      value={formData.deviceCountEstimate || 4}
                      onChange={e => setFormData({ ...formData, deviceCountEstimate: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                )}

                {formData.serviceType === 'wifi_installation' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Estimated Number of Access Points / Floors
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={64}
                      value={formData.deviceCountEstimate || 2}
                      onChange={e => setFormData({ ...formData, deviceCountEstimate: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                )}

                {/* Urgency */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Timeline / Urgency</label>
                  <select
                    value={formData.urgency}
                    onChange={e => setFormData({ ...formData, urgency: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
                  >
                    <option value="NORMAL">Standard Planning (Within 1-2 weeks)</option>
                    <option value="HIGH">High Priority (Within 3-5 days)</option>
                    <option value="URGENT">Emergency / Immediate Dispatch (24-48h)</option>
                  </select>
                </div>

                {/* Preferred Contact Time */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300">Preferred Dispatch Contact Time</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'ANYTIME', label: 'Anytime' },
                      { id: 'MORNING_09_12', label: 'Morning (09h - 12h)' },
                      { id: 'AFTERNOON_14_18', label: 'Afternoon (14h - 18h)' },
                      { id: 'WEEKENDS', label: 'Saturday / Weekend' },
                    ].map(slot => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, preferredContactTime: slot.id as any })}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                          formData.preferredContactTime === slot.id
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Technical Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300">
                    Describe Your Requirements &amp; Goals <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="e.g. Need to cover 2 entrance gates and warehouse interior with night vision cameras. We also need high-speed Wi-Fi in the administrative office without dead spots."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none leading-relaxed"
                  />
                  {errors.description && <p className="text-rose-400 text-xs">{errors.description}</p>}
                </div>

              </div>
            </div>
          )}

          {/* ================= STEP 5: PHOTOS UPLOAD ================= */}
          {step === 5 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Step 5: Site Photos (Optional)</h3>
                <p className="text-xs text-slate-400">
                  Uploading photos of existing network cabinets, entrance gates, walls, or camera locations speeds up on-site survey preparation.
                </p>
              </div>

              {/* Upload Dropzone */}
              <label className="border-2 border-dashed border-slate-700 hover:border-blue-500 bg-slate-950/60 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-white">Click or drag photos here to upload</span>
                <span className="text-xs text-slate-400 mt-1">
                  Supported formats: JPG, PNG, WEBP (Max 5 files, up to 10MB each)
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              {errors.photos && <p className="text-rose-400 text-xs">{errors.photos}</p>}

              {/* Photo Previews */}
              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400">Uploaded Attachments ({formData.attachments.length}/5):</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {formData.attachments.map((att, idx) => (
                      <div key={idx} className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden group">
                        <img
                          src={att.url}
                          alt={att.name}
                          className="w-full h-24 object-cover"
                        />
                        <div className="p-2 text-[10px] truncate text-slate-300 font-mono">
                          {att.name}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/90 text-rose-400 hover:text-white hover:bg-rose-600 transition-colors"
                          title="Remove photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 6: CONFIRMATION & SUBMIT ================= */}
          {step === 6 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Step 6: Review &amp; Submit Request</h3>
                <p className="text-xs text-slate-400">
                  Verify your technical specifications before sending to our field engineering dispatch queue.
                </p>
              </div>

              {/* Summary Card */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-800/80">
                  <div>
                    <span className="text-slate-500 font-medium block">Customer:</span>
                    <span className="text-sm font-bold text-white">{formData.fullName}</span>
                    <p className="text-slate-400 font-mono mt-0.5">{formData.phone}</p>
                    {formData.email && <p className="text-slate-400">{formData.email}</p>}
                    {formData.company && <p className="text-blue-400 font-semibold">{formData.company}</p>}
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Service Requested:</span>
                    <span className="text-sm font-bold text-white">
                      {serviceOptions.find(o => o.code === formData.serviceType)?.label}
                    </span>
                    <span className="text-slate-400 block mt-0.5">Location: {formData.address}, {formData.city}</span>
                    <span className="text-slate-400 block">Property Type: {formData.propertyType}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 font-medium block">Description:</span>
                  <p className="text-slate-300 mt-1 leading-relaxed whitespace-pre-line bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                    {formData.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2">
                  <span>Urgency: <strong className="text-white">{formData.urgency}</strong></span>
                  <span>Photos: <strong className="text-white">{formData.attachments.length} attached</strong></span>
                  <span>Contact Time: <strong className="text-white">{formData.preferredContactTime}</strong></span>
                </div>
              </div>

              {/* Security and Processing Notice */}
              <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-900/60 text-xs text-blue-300 flex items-center space-x-2.5">
                <Shield className="w-5 h-5 text-blue-400 shrink-0" />
                <span>
                  Upon submission, this request enters the company's central Firebase queue with status <strong>"NEW"</strong>. You will receive an immediate reference code and secure link to track survey scheduling and itemized quote generation.
                </span>
              </div>
            </div>
          )}

          {/* Wizard Navigation Action Controls */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center space-x-2 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Step</span>
              </button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 flex items-center space-x-2 transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 rounded-xl font-black text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/40 flex items-center space-x-2 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting to Operations Queue...</span>
                  </>
                ) : (
                  <>
                    <span>SUBMIT SERVICE REQUEST</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
