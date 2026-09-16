import React, { useState } from 'react';
import { 
  Inbox, 
  Search, 
  Filter, 
  PhoneCall, 
  Check, 
  X, 
  Plus, 
  Clock, 
  MapPin, 
  ArrowRight,
  MessageSquare,
  Sparkles,
  Building
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ServiceRequest, ServiceTypeCode } from '../types';
import { WORKFLOW_TEMPLATES } from '../services/workflowTemplates';

export const RequestsList: React.FC = () => {
  const { requests, acceptRequest, rejectRequest, statusFilter, setStatusFilter, searchQuery } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);

  // New Request Form State
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('Gabès');
  const [newServiceType, setNewServiceType] = useState<ServiceTypeCode>('cctv_installation');
  const [newDescription, setNewDescription] = useState('');

  const activeQuery = (searchTerm || searchQuery).toLowerCase();

  const filteredRequests = requests.filter(req => {
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    const matchesSearch = 
      !activeQuery ||
      req.customerName.toLowerCase().includes(activeQuery) ||
      req.location.toLowerCase().includes(activeQuery) ||
      req.id.toLowerCase().includes(activeQuery) ||
      req.serviceName.toLowerCase().includes(activeQuery);
    return matchesStatus && matchesSearch;
  });

  const handleCreateMockRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName || !newPhone) return;

    const newReqId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const template = WORKFLOW_TEMPLATES[newServiceType];

    const newRequest: ServiceRequest = {
      id: newReqId,
      customerName: newCustomerName,
      customerPhone: newPhone,
      customerEmail: `${newCustomerName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      serviceType: newServiceType,
      serviceName: template.name,
      location: newCity,
      address: `Avenue Centrale, ${newCity}`,
      description: newDescription || `Request for ${template.name}`,
      photos: [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
      ],
      createdAt: new Date().toISOString(),
      status: 'NEW',
      urgency: 'NORMAL',
    };

    // Add to requests list
    // (We can accept directly or let admin press accept)
    requests.unshift(newRequest);
    setShowNewRequestModal(false);
    setNewCustomerName('');
    setNewPhone('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Inbox className="w-6 h-6 text-blue-600" />
            <span>Service Requests Inbox</span>
          </h1>
          <p className="text-sm text-slate-600">
            Inbound customer service requests from website forms and call center.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNewRequestModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center space-x-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Simulate Customer Request</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer, city, ID, or service..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Pill filters */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'NEW', 'ACCEPTED', 'REJECTED'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequests.map(req => (
          <div
            key={req.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {req.id}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{req.customerName}</h3>
                </div>

                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                  req.status === 'NEW'
                    ? 'bg-amber-100 text-amber-800 animate-pulse'
                    : req.status === 'ACCEPTED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {req.status}
                </span>
              </div>

              {/* Service & Location */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-2">
                <span className="flex items-center space-x-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800">{req.serviceName}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{req.location} ({req.address})</span>
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-700 mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 line-clamp-3">
                "{req.description}"
              </p>

              {/* Photos preview */}
              {req.photos.length > 0 && (
                <div className="flex items-center space-x-2 mt-3">
                  <span className="text-[11px] text-slate-400 font-medium">Customer Attachments:</span>
                  <div className="flex space-x-1.5">
                    {req.photos.map((p, i) => (
                      <img
                        key={i}
                        src={p}
                        alt="attachment"
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <a
                  href={`tel:${req.customerPhone}`}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                  <span>Call ({req.customerPhone})</span>
                </a>
              </div>

              {req.status === 'NEW' ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => rejectRequest(req.id, 'Outside coverage territory or declined by customer')}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => acceptRequest(req.id)}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm shadow-emerald-600/20"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>ACCEPT</span>
                  </button>
                </div>
              ) : req.status === 'ACCEPTED' ? (
                <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1">
                  <Check className="w-4 h-4" />
                  <span>Work Order Initialized</span>
                </span>
              ) : (
                <span className="text-xs text-rose-500 font-medium">Rejected</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-lg">Simulate Website Request</h3>
              </div>
              <button
                onClick={() => setShowNewRequestModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMockRequest} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Customer / Business Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samir Trabelsi or Société El Amen"
                  value={newCustomerName}
                  onChange={e => setNewCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+216 98 ..."
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City / Governorate
                  </label>
                  <select
                    value={newCity}
                    onChange={e => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="Gabès">Gabès</option>
                    <option value="Tunis">Tunis</option>
                    <option value="Sfax">Sfax</option>
                    <option value="Sousse">Sousse</option>
                    <option value="Djerba">Djerba</option>
                    <option value="Bizerte">Bizerte</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Selected Service Workflow
                </label>
                <select
                  value={newServiceType}
                  onChange={e => setNewServiceType(e.target.value as ServiceTypeCode)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  {Object.values(WORKFLOW_TEMPLATES).map(tmpl => (
                    <option key={tmpl.id} value={tmpl.id}>
                      {tmpl.name} ({tmpl.steps.length} workflow steps)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Requirements / Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Need 4 outdoor cameras with night vision and remote app..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewRequestModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-600/20"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
