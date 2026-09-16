import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, 
  Smartphone, 
  Monitor, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Bell, 
  ExternalLink, 
  Code2, 
  UserCheck, 
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  ChevronDown,
  Layers,
  Search,
  LayoutDashboard,
  Inbox,
  Wrench,
  Calendar,
  Package,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Info,
  Check,
  Trash2,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onSwitchToWebsite?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSwitchToWebsite }) => {
  const {
    currentUser,
    allUsers,
    setCurrentUser,
    selectedView,
    setSelectedView,
    selectedWorkOrderId,
    setSelectedWorkOrderId,
    workOrders,
    requests,
    appointments,
    isOnline,
    syncState,
    pendingSyncCount,
    toggleOnline,
    notifications,
    dismissNotification,
    resetAllData,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showViewsMenu, setShowViewsMenu] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const viewsMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(target)) {
        setShowNotifications(false);
      }
      if (viewsMenuRef.current && !viewsMenuRef.current.contains(target)) {
        setShowViewsMenu(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowUserMenu(false);
        setShowNotifications(false);
        setShowViewsMenu(false);
        setShowSyncModal(false);
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const newRequestsCount = requests.filter(r => r.status === 'NEW').length;
  const currentWorkOrder = selectedWorkOrderId 
    ? workOrders.find(w => w.id === selectedWorkOrderId)
    : null;

  const isTechMode = selectedView === 'TECHNICIAN_MODE';

  const handleClearAllNotifications = () => {
    notifications.forEach(n => dismissNotification(n.id));
  };

  return (
    <header className="sticky top-0 z-50 flex flex-col shadow-sm">
      
      {/* 1. PRIMARY APP BAR (Slate Dark) */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand Identity */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setSelectedView('DASHBOARD');
                  setShowMobileMenu(false);
                }}
                className="flex items-center space-x-3 group text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl p-1 -m-1 transition-all"
                title="Go to Operations Dashboard"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold tracking-tight text-lg text-white group-hover:text-blue-200 transition-colors">
                      SecurOps
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 tracking-wider uppercase">
                      Field OS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 hidden sm:block">
                    Security &amp; Tech Systems Engineering
                  </p>
                </div>
              </button>
            </div>

            {/* Center: Primary Mode Switcher (Admin Cockpit vs Field Tech) */}
            <div className="hidden md:flex items-center">
              <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center shadow-inner">
                <button
                  onClick={() => {
                    setSelectedView('DASHBOARD');
                    if (currentUser.role === 'TECHNICIAN') {
                      const admin = allUsers.find(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN');
                      if (admin) setCurrentUser(admin);
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-2 transition-all ${
                    !isTechMode
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                  title="Admin Operations Cockpit (Office & Dispatch)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Office / Dispatch</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedView('TECHNICIAN_MODE');
                    if (currentUser.role !== 'TECHNICIAN') {
                      const tech = allUsers.find(u => u.role === 'TECHNICIAN');
                      if (tech) setCurrentUser(tech);
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-2 transition-all ${
                    isTechMode
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-1 ring-amber-400/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                  title="Technician Mobile Handheld Interface"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Field Technician</span>
                </button>
              </div>
            </div>

            {/* Right: Actions, Sync Pill, Explore Menu, Notifications, Profile */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Back to Customer Website Button */}
              {onSwitchToWebsite && (
                <button
                  onClick={onSwitchToWebsite}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 flex items-center space-x-1.5 transition-all"
                  title="Switch to Customer Facing Website"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Customer Website</span>
                </button>
              )}

              {/* Field Network Sync Badge */}
              <button
                onClick={() => setShowSyncModal(true)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 border transition-all ${
                  isOnline
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/50'
                    : 'bg-rose-950/70 text-rose-300 border-rose-800/80 hover:bg-rose-900/60 animate-pulse'
                }`}
                title="View Network &amp; Offline Sync Engine Status"
              >
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                </span>
                {isOnline ? (
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span className="hidden lg:inline text-[11px] font-bold">
                  {isOnline ? 'Live Synced' : 'Offline Mode'}
                </span>
                {pendingSyncCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-rose-500 text-white font-black">
                    {pendingSyncCount}
                  </span>
                )}
              </button>

              {/* Views & Simulations Dropdown ("Explore Views ▾") */}
              <div className="relative" ref={viewsMenuRef}>
                <button
                  onClick={() => setShowViewsMenu(!showViewsMenu)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border flex items-center space-x-1.5 transition-all ${
                    selectedView === 'CUSTOMER_PORTAL' || selectedView === 'ARCHITECTURE_SPEC'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                  title="Access Customer Portal Simulation or Flutter Engine Architecture"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">Simulations &amp; Specs</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showViewsMenu ? 'rotate-180' : ''}`} />
                </button>

                {showViewsMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-2 text-left">
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      Interactive Demos &amp; Specs
                    </div>
                    
                    <div className="py-1 space-y-1">
                      <button
                        onClick={() => {
                          setSelectedView('CUSTOMER_PORTAL');
                          setShowViewsMenu(false);
                        }}
                        className={`w-full flex items-start space-x-2.5 p-2.5 rounded-xl text-left transition-colors ${
                          selectedView === 'CUSTOMER_PORTAL'
                            ? 'bg-purple-950/60 text-purple-200 border border-purple-800/60'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <ExternalLink className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold text-xs text-white flex items-center space-x-1.5">
                            <span>Customer Client Portal</span>
                            {selectedView === 'CUSTOMER_PORTAL' && <Check className="w-3 h-3 text-purple-400" />}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Simulate customer reviewing quote proposals &amp; paying invoices online
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedView('ARCHITECTURE_SPEC');
                          setShowViewsMenu(false);
                        }}
                        className={`w-full flex items-start space-x-2.5 p-2.5 rounded-xl text-left transition-colors ${
                          selectedView === 'ARCHITECTURE_SPEC'
                            ? 'bg-cyan-950/60 text-cyan-200 border border-cyan-800/60'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <Code2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold text-xs text-white flex items-center space-x-1.5">
                            <span>Flutter &amp; Firebase Spec</span>
                            {selectedView === 'ARCHITECTURE_SPEC' && <Check className="w-3 h-3 text-cyan-400" />}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Clean Architecture, Dart WorkflowEngine, Riverpod 2.x &amp; RBAC rules
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedView('TECHNICIAN_MODE');
                          setShowViewsMenu(false);
                        }}
                        className={`w-full flex items-start space-x-2.5 p-2.5 rounded-xl text-left transition-colors ${
                          selectedView === 'TECHNICIAN_MODE'
                            ? 'bg-amber-950/60 text-amber-200 border border-amber-800/60'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <Smartphone className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold text-xs text-white flex items-center space-x-1.5">
                            <span>Field Technician Handheld</span>
                            {selectedView === 'TECHNICIAN_MODE' && <Check className="w-3 h-3 text-amber-400" />}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            High-contrast mobile interface with "What to do next" queue
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedView('AUDIT_TRAIL');
                          setShowViewsMenu(false);
                        }}
                        className={`w-full flex items-start space-x-2.5 p-2.5 rounded-xl text-left transition-colors ${
                          selectedView === 'AUDIT_TRAIL'
                            ? 'bg-emerald-950/60 text-emerald-200 border border-emerald-800/60'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold text-xs text-white flex items-center space-x-1.5">
                            <span>Audit &amp; Compliance Trail</span>
                            {selectedView === 'AUDIT_TRAIL' && <Check className="w-3 h-3 text-emerald-400" />}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Immutable cryptographic transaction ledger
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications Center */}
              <div className="relative" ref={notifMenuRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Operations Activity &amp; Alerts"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-[9px] font-black text-white flex items-center justify-center animate-pulse">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-3 text-left">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 px-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-white">Operations Feed</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-semibold">
                          {notifications.length}
                        </span>
                      </div>
                      {notifications.length > 0 && (
                        <button
                          onClick={handleClearAllNotifications}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Clear All</span>
                        </button>
                      )}
                    </div>

                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400 space-y-1">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500/80 mx-auto" />
                        <p className="font-semibold text-slate-300">All caught up!</p>
                        <p className="text-[11px] text-slate-500">No active unread operations alerts</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {notifications.map(notif => (
                          <div
                            key={notif.id}
                            className={`p-2.5 rounded-xl border text-xs flex items-start justify-between space-x-2 transition-all ${
                              notif.type === 'success'
                                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                                : notif.type === 'warning'
                                ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                                : notif.type === 'error'
                                ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                                : 'bg-slate-800/80 border-slate-700/60 text-slate-200'
                            }`}
                          >
                            <div className="flex-1 min-w-0 pr-1">
                              <p className="font-bold text-xs text-white">{notif.title}</p>
                              <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">{notif.message}</p>
                              <span className="text-[10px] text-slate-400 font-mono mt-1 block">{notif.timestamp}</span>
                            </div>
                            <button
                              onClick={() => dismissNotification(notif.id)}
                              className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10"
                              title="Dismiss"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Active Role & User Persona Selector */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors focus:outline-none"
                  title="Switch Active Persona / Role"
                >
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500"
                  />
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-bold text-white leading-tight">{currentUser.name}</div>
                    <div className="text-[10px] text-blue-400 font-semibold leading-none">
                      {currentUser.role.replace('_', ' ')}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-2 text-left">
                    <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Switch Active Persona
                      </span>
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                        RBAC
                      </span>
                    </div>

                    <div className="py-1 space-y-1">
                      {allUsers.map(user => (
                        <button
                          key={user.id}
                          onClick={() => {
                            setCurrentUser(user);
                            setShowUserMenu(false);
                            if (user.role === 'TECHNICIAN' && selectedView !== 'TECHNICIAN_MODE') {
                              setSelectedView('TECHNICIAN_MODE');
                            } else if (user.role !== 'TECHNICIAN' && selectedView === 'TECHNICIAN_MODE') {
                              setSelectedView('DASHBOARD');
                            }
                          }}
                          className={`w-full flex items-center space-x-2.5 p-2 rounded-xl text-left transition-colors ${
                            currentUser.id === user.id
                              ? 'bg-blue-600/20 text-blue-200 border border-blue-500/40'
                              : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-600"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs text-white truncate">{user.name}</p>
                            <p className="text-[10px] text-slate-400">
                              {user.role === 'SUPER_ADMIN' ? 'Managing Director' :
                               user.role === 'ADMIN' ? 'Ops Dispatch & Admin' :
                               user.role === 'TECHNICIAN' ? 'Field Security Tech' :
                               user.role === 'ACCOUNTANT' ? 'Billing & Finance' : user.role}
                            </p>
                          </div>
                          {currentUser.id === user.id && (
                            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800 px-2 flex justify-between items-center">
                      <button
                        onClick={() => {
                          resetAllData();
                          setShowUserMenu(false);
                        }}
                        className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 flex items-center space-x-1.5 p-1 rounded hover:bg-rose-950/40 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset All Demo Data</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                aria-label="Toggle Navigation Menu"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* 2. SECONDARY SUB-NAVIGATION BAR (Light Clean Bar) */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* A. When viewing standard Admin Cockpit views */}
          {!isTechMode && selectedView !== 'CUSTOMER_PORTAL' && selectedView !== 'ARCHITECTURE_SPEC' && selectedView !== 'WORK_ORDER_DETAIL' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-2">
              
              {/* Operational Navigation Tabs */}
              <nav className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'REQUESTS', label: 'Requests', icon: Inbox, count: newRequestsCount },
                  { id: 'WORK_ORDERS', label: 'Work Orders', icon: Wrench, count: workOrders.length },
                  { id: 'APPOINTMENTS', label: 'Appointments', icon: Calendar, count: appointments.length },
                  { id: 'CATALOG', label: 'Catalog & Rates', icon: Package },
                  { id: 'AUDIT_TRAIL', label: 'Audit Trail', icon: ShieldCheck },
                  { id: 'ARCHITECTURE_SPEC', label: 'Flutter Spec', icon: Code2, badge: 'Dart' },
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = selectedView === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setSelectedView(tab.id as any);
                        setShowMobileMenu(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center space-x-1.5 transition-all ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                      <span>{tab.label}</span>
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                          isActive
                            ? 'bg-blue-500 text-white'
                            : tab.id === 'REQUESTS'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                      {tab.badge && (
                        <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                          isActive ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-cyan-100 text-cyan-800'
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Quick Search Field (Filters requests and jobs) */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Quick search jobs or clients..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

            </div>
          )}

          {/* B. Breadcrumb Context Banner: Work Order Detail */}
          {selectedView === 'WORK_ORDER_DETAIL' && (
            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs">
                <button
                  onClick={() => setSelectedView('WORK_ORDERS')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center space-x-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Work Orders</span>
                </button>
                <span className="text-slate-300">/</span>
                <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {selectedWorkOrderId}
                </span>
                {currentWorkOrder && (
                  <span className="font-bold text-slate-900 hidden sm:inline">
                    {currentWorkOrder.customerName} ({currentWorkOrder.siteCity})
                  </span>
                )}
              </div>

              {currentWorkOrder && (
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-500 hidden sm:inline">Progress:</span>
                  <span className="font-mono font-bold text-slate-800">{currentWorkOrder.progressPercentage}%</span>
                  <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${currentWorkOrder.progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* C. Context Banner: Customer Portal */}
          {selectedView === 'CUSTOMER_PORTAL' && (
            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                <span className="text-xs font-bold text-purple-900">
                  Simulating Customer Web Portal Experience (Public Sign-Off &amp; Card Checkout)
                </span>
              </div>
              <button
                onClick={() => setSelectedView('DASHBOARD')}
                className="px-3 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold flex items-center space-x-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Admin Cockpit</span>
              </button>
            </div>
          )}

          {/* D. Context Banner: Flutter & Firebase Technical Spec */}
          {selectedView === 'ARCHITECTURE_SPEC' && (
            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-cyan-600" />
                <span className="text-xs font-bold text-slate-900">
                  Technical Architecture Specification (Dart Engine, Riverpod &amp; Firestore Security)
                </span>
              </div>
              <button
                onClick={() => setSelectedView('DASHBOARD')}
                className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Dashboard</span>
              </button>
            </div>
          )}

          {/* E. Context Banner: Field Handheld Mode Active */}
          {isTechMode && (
            <div className="py-2.5 flex items-center justify-between bg-amber-50/60 -mx-4 px-4 sm:-mx-8 sm:px-8 border-t border-amber-200/60">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-950">
                  Technician Mobile Handheld Simulation Active (Actor: {currentUser.name})
                </span>
              </div>
              <button
                onClick={() => setSelectedView('DASHBOARD')}
                className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
              >
                <Monitor className="w-3.5 h-3.5 text-blue-400" />
                <span>Exit to Admin Cockpit</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* 3. MOBILE SLIDE-OUT DRAWER */}
      {showMobileMenu && (
        <div className="md:hidden bg-slate-900 text-white border-b border-slate-800 p-4 space-y-4 shadow-2xl">
          <div className="p-1 bg-slate-950 rounded-xl border border-slate-800 flex items-center">
            <button
              onClick={() => {
                setSelectedView('DASHBOARD');
                setShowMobileMenu(false);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 ${
                !isTechMode ? 'bg-blue-600 text-white' : 'text-slate-400'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Admin Cockpit</span>
            </button>
            <button
              onClick={() => {
                setSelectedView('TECHNICIAN_MODE');
                setShowMobileMenu(false);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 ${
                isTechMode ? 'bg-amber-600 text-white' : 'text-slate-400'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Field Tech</span>
            </button>
          </div>

          {/* Nav links */}
          <div className="space-y-1">
            <button
              onClick={() => {
                setSelectedView('DASHBOARD');
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-xs font-bold"
            >
              <div className="flex items-center space-x-2">
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                <span>Dashboard</span>
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedView('REQUESTS');
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-xs font-bold"
            >
              <div className="flex items-center space-x-2">
                <Inbox className="w-4 h-4 text-blue-400" />
                <span>Inbound Requests</span>
              </div>
              {newRequestsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500 text-white font-bold">
                  {newRequestsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setSelectedView('WORK_ORDERS');
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-xs font-bold"
            >
              <div className="flex items-center space-x-2">
                <Wrench className="w-4 h-4 text-blue-400" />
                <span>Work Orders</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">({workOrders.length})</span>
            </button>

            <button
              onClick={() => {
                setSelectedView('APPOINTMENTS');
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-xs font-bold"
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Appointments</span>
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedView('CATALOG');
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-xs font-bold"
            >
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-blue-400" />
                <span>Equipment Catalog</span>
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedView('CUSTOMER_PORTAL');
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-xs font-bold text-purple-300"
            >
              <div className="flex items-center space-x-2">
                <ExternalLink className="w-4 h-4" />
                <span>Customer Portal Simulation</span>
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedView('ARCHITECTURE_SPEC');
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-xs font-bold text-cyan-300"
            >
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4" />
                <span>Flutter &amp; Firebase Spec</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 4. MODAL: SYNC & BASEMENT OFFLINE DETAILS */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className={`p-2 rounded-xl ${isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Field Offline &amp; Sync Engine</h3>
                  <p className="text-[11px] text-slate-400">Hive / SQLite Mutation Queue</p>
                </div>
              </div>
              <button
                onClick={() => setShowSyncModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Network State:</span>
                  <span className={`font-black ${isOnline ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isOnline ? 'CONNECTED (GSM / WI-FI)' : 'OFFLINE (BASEMENT CACHE)'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Sync Manager Status:</span>
                  <span className="font-mono text-slate-200">{syncState}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Pending Local Mutations:</span>
                  <span className="font-bold text-amber-400">{pendingSyncCount} operations queued</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                When technicians install cameras or test switches in basements with zero GSM signal, SecurOps queues all task completions, equipment serial logs, and photos in local persistent storage. As soon as signal is restored, mutations automatically replay in FIFO order without data loss.
              </p>

              <button
                onClick={() => {
                  toggleOnline();
                  setShowSyncModal(false);
                }}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md ${
                  isOnline
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                }`}
              >
                {isOnline ? (
                  <>
                    <WifiOff className="w-4 h-4" />
                    <span>Simulate Underground Basement (Go Offline)</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Reconnect Signal &amp; Flush Queue</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
