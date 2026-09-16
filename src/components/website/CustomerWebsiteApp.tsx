import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { HeroSection } from './HeroSection';
import { ServicesGrid } from './ServicesGrid';
import { ProductsSection } from './ProductsSection';
import { HowItWorks } from './HowItWorks';
import { WhyChooseUs } from './WhyChooseUs';
import { ServiceRequestForm } from './ServiceRequestForm';
import { CustomerRequestTracking } from './CustomerRequestTracking';
import { CustomerQuoteView } from './CustomerQuoteView';
import { CustomerInvoiceView } from './CustomerInvoiceView';
import { ServiceDetailModal } from './ServiceDetailModal';
import { ProductDetailModal } from './ProductDetailModal';
import { SolutionsView } from './SolutionsView';
import { AboutContactView } from './AboutContactView';
import { SubmissionSuccessModal } from './SubmissionSuccessModal';
import { ServiceItem, ProductItem, CustomerWebsiteRoute } from '../../types/customerWebsite';
import { ServiceTypeCode } from '../../types';

interface CustomerWebsiteAppProps {
  onOpenAdminCockpit: () => void;
}

export const CustomerWebsiteApp: React.FC<CustomerWebsiteAppProps> = ({
  onOpenAdminCockpit,
}) => {
  const [currentRoute, setCurrentRoute] = useState<CustomerWebsiteRoute>('HOME');

  // Selected modals state
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceItem | null>(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState<ProductItem | null>(null);

  // Form prefill state
  const [requestedServiceType, setRequestedServiceType] = useState<ServiceTypeCode>('cctv_installation');
  const [requestedProductName, setRequestedProductName] = useState<string | undefined>(undefined);

  // Tracking state
  const [activeTrackingId, setActiveTrackingId] = useState<string>('REQ-001');
  const [activeTrackingToken, setActiveTrackingToken] = useState<string>('');

  // Active Quote / Invoice state
  const [activeQuoteId, setActiveQuoteId] = useState<string>('QT-101');
  const [activeInvoiceId, setActiveInvoiceId] = useState<string>('INV-201');

  // Success Modal state
  const [successModalData, setSuccessModalData] = useState<{
    isOpen: boolean;
    requestId: string;
    token: string;
  }>({
    isOpen: false,
    requestId: '',
    token: '',
  });

  // Check URL query parameters for direct links (e.g. ?track=REQ-001 or ?quote=QT-101)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trackParam = params.get('track');
    const quoteParam = params.get('quote');
    const invoiceParam = params.get('invoice');

    if (quoteParam) {
      setActiveQuoteId(quoteParam);
      setCurrentRoute('QUOTE_VIEW');
    } else if (invoiceParam) {
      setActiveInvoiceId(invoiceParam);
      setCurrentRoute('INVOICE_VIEW');
    } else if (trackParam) {
      setActiveTrackingId(trackParam);
      setCurrentRoute('REQUEST_TRACKING');
    }
  }, []);

  // Handlers
  const handleRequestServiceWithType = (service: ServiceItem) => {
    setRequestedServiceType(service.serviceType);
    setRequestedProductName(undefined);
    setCurrentRoute('REQUEST_SERVICE');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestProductInstallation = (product: ProductItem) => {
    setRequestedProductName(`${product.brand} - ${product.name} (${product.model})`);
    if (product.category === 'CCTV') setRequestedServiceType('cctv_installation');
    else if (product.category === 'ACCESS_CONTROL') setRequestedServiceType('access_control_installation');
    else if (product.category === 'NETWORK') setRequestedServiceType('network_installation');
    else if (product.category === 'ALARM') setRequestedServiceType('alarm_installation');
    else setRequestedServiceType('cctv_installation');

    setCurrentRoute('REQUEST_SERVICE');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSuccess = (newReqId: string, token: string) => {
    setSuccessModalData({
      isOpen: true,
      requestId: newReqId,
      token,
    });
  };

  const handleOpenTrackingFromModal = (reqId: string) => {
    setSuccessModalData(prev => ({ ...prev, isOpen: false }));
    setActiveTrackingId(reqId);
    setCurrentRoute('REQUEST_TRACKING');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackRequestModal = () => {
    setCurrentRoute('REQUEST_TRACKING');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Main Navbar */}
      <Navbar
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
        onOpenAdminCockpit={onOpenAdminCockpit}
        onTrackRequestModal={handleTrackRequestModal}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1">
        {/* VIEW: HOME */}
        {currentRoute === 'HOME' && (
          <>
            <HeroSection
              setCurrentRoute={setCurrentRoute}
              onTrackRequestModal={handleTrackRequestModal}
            />

            <ServicesGrid
              onSelectService={setSelectedServiceForModal}
              onRequestServiceWithType={handleRequestServiceWithType}
              setCurrentRoute={setCurrentRoute}
            />

            <ProductsSection
              onSelectProduct={setSelectedProductForModal}
              onRequestProductInstallation={handleRequestProductInstallation}
              setCurrentRoute={setCurrentRoute}
            />

            <HowItWorks setCurrentRoute={setCurrentRoute} />

            <WhyChooseUs setCurrentRoute={setCurrentRoute} />
          </>
        )}

        {/* VIEW: SERVICES CATALOG */}
        {currentRoute === 'SERVICES' && (
          <div className="py-8">
            <ServicesGrid
              onSelectService={setSelectedServiceForModal}
              onRequestServiceWithType={handleRequestServiceWithType}
              setCurrentRoute={setCurrentRoute}
            />
          </div>
        )}

        {/* VIEW: PRODUCTS CATALOG */}
        {currentRoute === 'PRODUCTS' && (
          <div className="py-8">
            <ProductsSection
              onSelectProduct={setSelectedProductForModal}
              onRequestProductInstallation={handleRequestProductInstallation}
              setCurrentRoute={setCurrentRoute}
            />
          </div>
        )}

        {/* VIEW: SOLUTIONS */}
        {currentRoute === 'SOLUTIONS' && (
          <SolutionsView
            onSelectSolution={() => {}}
            onRequestService={() => {
              setCurrentRoute('REQUEST_SERVICE');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            setCurrentRoute={setCurrentRoute}
          />
        )}

        {/* VIEW: ABOUT */}
        {currentRoute === 'ABOUT' && (
          <AboutContactView
            mode="ABOUT"
            onRequestService={() => {
              setCurrentRoute('REQUEST_SERVICE');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* VIEW: CONTACT */}
        {currentRoute === 'CONTACT' && (
          <AboutContactView
            mode="CONTACT"
            onRequestService={() => {
              setCurrentRoute('REQUEST_SERVICE');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* VIEW: MULTI-STEP REQUEST SERVICE FORM */}
        {currentRoute === 'REQUEST_SERVICE' && (
          <div className="py-12 bg-slate-950">
            <ServiceRequestForm
              initialServiceType={requestedServiceType}
              initialProductName={requestedProductName}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setCurrentRoute('HOME');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* VIEW: CUSTOMER REQUEST TRACKING */}
        {currentRoute === 'REQUEST_TRACKING' && (
          <div className="py-12 bg-slate-950">
            <CustomerRequestTracking
              initialRequestId={activeTrackingId}
              initialToken={activeTrackingToken}
              onViewQuote={(qId) => {
                setActiveQuoteId(qId);
                setCurrentRoute('QUOTE_VIEW');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewInvoice={(invId) => {
                setActiveInvoiceId(invId);
                setCurrentRoute('INVOICE_VIEW');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenAdminCockpit={onOpenAdminCockpit}
              setCurrentRoute={setCurrentRoute}
            />
          </div>
        )}

        {/* VIEW: PROPOSAL / QUOTE REVIEW */}
        {currentRoute === 'QUOTE_VIEW' && (
          <div className="py-12 bg-slate-950">
            <CustomerQuoteView
              quoteId={activeQuoteId}
              onBack={() => {
                setCurrentRoute('REQUEST_TRACKING');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onProceedToInvoice={(invId) => {
                setActiveInvoiceId(invId);
                setCurrentRoute('INVOICE_VIEW');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* VIEW: INVOICE & PAYMENT */}
        {currentRoute === 'INVOICE_VIEW' && (
          <div className="py-12 bg-slate-950">
            <CustomerInvoiceView
              invoiceId={activeInvoiceId}
              onBack={() => {
                setCurrentRoute('REQUEST_TRACKING');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer
        setCurrentRoute={setCurrentRoute}
        onOpenAdminCockpit={onOpenAdminCockpit}
        onTrackRequestModal={handleTrackRequestModal}
      />

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedServiceForModal}
        onClose={() => setSelectedServiceForModal(null)}
        onRequestService={handleRequestServiceWithType}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onRequestInstallation={handleRequestProductInstallation}
      />

      {/* Request Submission Success Modal */}
      {successModalData.isOpen && (
        <SubmissionSuccessModal
          requestId={successModalData.requestId}
          secureToken={successModalData.token}
          onTrackNow={handleOpenTrackingFromModal}
          onReturnHome={() => {
            setSuccessModalData(prev => ({ ...prev, isOpen: false }));
            setCurrentRoute('HOME');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAdminCockpit={() => {
            setSuccessModalData(prev => ({ ...prev, isOpen: false }));
            onOpenAdminCockpit();
          }}
        />
      )}

    </div>
  );
};
