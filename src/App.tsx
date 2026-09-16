import React, { useState } from 'react';
import { 
  Inbox, 
  LayoutDashboard, 
  Wrench, 
  Calendar, 
  Package, 
  ShieldCheck, 
  Smartphone, 
  ExternalLink, 
  Code2, 
  X, 
  AlertTriangle, 
  WifiOff, 
  Globe 
} from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { AdminDashboard } from './components/AdminDashboard';
import { RequestsList } from './components/RequestsList';
import { WorkOrdersList } from './components/WorkOrdersList';
import { WorkOrderDetail } from './components/WorkOrderDetail';
import { AppointmentsView } from './components/AppointmentsView';
import { CatalogView } from './components/CatalogView';
import { AuditTrailView } from './components/AuditTrailView';
import { TechnicianMode } from './components/TechnicianMode';
import { CustomerPortal } from './components/CustomerPortal';
import { ArchitectureSpecView } from './components/ArchitectureSpecView';
import { CustomerWebsiteApp } from './components/website/CustomerWebsiteApp';

const MainLayout: React.FC = () => {
  const { 
    selectedView, 
    setSelectedView, 
    requests, 
    workOrders, 
    notifications, 
    dismissNotification,
    isOnline,
    pendingSyncCount
  } = useApp();

  // Mode: Default to Customer Website as requested by user
  const [appExperience, setAppExperience] = useState<'CUSTOMER_WEBSITE' | 'OPERATIONS_COCKPIT'>('CUSTOMER_WEBSITE');

  if (appExperience === 'CUSTOMER_WEBSITE') {
    return (
      <>
        <CustomerWebsiteApp onOpenAdminCockpit={() => setAppExperience('OPERATIONS_COCKPIT')} />
        
        {/* Toast Notifications */}
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm pointer-events-none">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`pointer-events-auto p-4 rounded-2xl shadow-xl border text-xs flex items-start justify-between space-x-3 transition-all ${
                n.type === 'success'
                  ? 'bg-emerald-950 text-emerald-100 border-emerald-800'
                  : n.type === 'warning'
                  ? 'bg-amber-950 text-amber-100 border-amber-800'
                  : n.type === 'error'
                  ? 'bg-rose-950 text-rose-100 border-rose-800'
                  : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}
            >
              <div>
                <p className="font-bold text-sm text-white">{n.title}</p>
                <p className="mt-0.5 opacity-90">{n.message}</p>
                <span className="text-[10px] opacity-60 mt-1 block">{n.timestamp}</span>
              </div>
              <button
                onClick={() => dismissNotification(n.id)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-blue-500 selection:text-white">
      
      {/* Global Header with button to return to Customer Website */}
      <Header onSwitchToWebsite={() => setAppExperience('CUSTOMER_WEBSITE')} />

      {/* Field Offline Notice Banner */}
      {!isOnline && (
        <div className="bg-rose-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-inner">
          <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full">
            <WifiOff className="w-4 h-4 animate-bounce" />
            <span>
              Field Mode Offline: Changes are safely stored in local queue ({pendingSyncCount} pending). Will auto-sync when network returns.
            </span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {selectedView === 'DASHBOARD' && <AdminDashboard />}
        {selectedView === 'REQUESTS' && <RequestsList />}
        {selectedView === 'WORK_ORDERS' && <WorkOrdersList />}
        {selectedView === 'WORK_ORDER_DETAIL' && <WorkOrderDetail />}
        {selectedView === 'APPOINTMENTS' && <AppointmentsView />}
        {selectedView === 'CATALOG' && <CatalogView />}
        {selectedView === 'AUDIT_TRAIL' && <AuditTrailView />}
        {selectedView === 'TECHNICIAN_MODE' && <TechnicianMode />}
        {selectedView === 'CUSTOMER_PORTAL' && <CustomerPortal />}
        {selectedView === 'ARCHITECTURE_SPEC' && <ArchitectureSpecView />}
      </main>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm pointer-events-none">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border text-xs flex items-start justify-between space-x-3 transition-all ${
              n.type === 'success'
                ? 'bg-emerald-950 text-emerald-100 border-emerald-800'
                : n.type === 'warning'
                ? 'bg-amber-950 text-amber-100 border-amber-800'
                : n.type === 'error'
                ? 'bg-rose-950 text-rose-100 border-rose-800'
                : 'bg-slate-900 text-slate-100 border-slate-800'
            }`}
          >
            <div>
              <p className="font-bold text-sm text-white">{n.title}</p>
              <p className="mt-0.5 opacity-90">{n.message}</p>
              <span className="text-[10px] opacity-60 mt-1 block">{n.timestamp}</span>
            </div>
            <button
              onClick={() => dismissNotification(n.id)}
              className="text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
