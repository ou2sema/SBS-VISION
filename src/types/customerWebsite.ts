/**
 * Customer Website Types & Data Models
 * Synchronized with Firebase Firestore collections
 */

import { ServiceTypeCode } from './index';

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  category: 'SECURITY' | 'NETWORKING' | 'TELECOM' | 'MAINTENANCE';
  shortDescription: string;
  description: string;
  image: string;
  features: string[];
  typicalApplications: string[];
  active: boolean;
  displayOrder: number;
  startingPriceEstimate?: string;
  serviceType: ServiceTypeCode;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  category: 'CCTV' | 'NETWORK' | 'ACCESS_CONTROL' | 'ALARM' | 'POWER_CABLES';
  brand: string;
  model: string;
  description: string;
  images: string[];
  specifications: Record<string, string>;
  price: number;
  currency: string;
  active: boolean;
  featured: boolean;
  requiresServiceInstallation: boolean;
}

export interface IndustrySolution {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  icon: string;
  description: string;
  challengesSolved: string[];
  recommendedServices: string[];
  recommendedHardware: string[];
  caseStudyHighlight: string;
}

export interface ServiceRequestSubmission {
  // Step 1: Customer
  fullName: string;
  phone: string;
  email: string;
  company?: string;
  
  // Step 2: Service
  serviceType: ServiceTypeCode;
  serviceCategoryLabel: string;
  
  // Step 3: Location
  address: string;
  city: string;
  locationDetails?: string;
  
  // Step 4: Requirements
  propertyType: 'COMMERCIAL_OFFICE' | 'WAREHOUSE' | 'RESIDENTIAL_VILLA' | 'RETAIL_STORE' | 'CLINIC_HEALTH' | 'OTHER';
  existingInstallation: 'NO_EXISTING' | 'UPGRADE_EXISTING' | 'EXPANSION' | 'TROUBLESHOOTING_ONLY';
  urgency: 'NORMAL' | 'HIGH' | 'URGENT';
  preferredContactTime: 'ANYTIME' | 'MORNING_09_12' | 'AFTERNOON_14_18' | 'WEEKENDS';
  deviceCountEstimate?: number; // e.g., cameras, APs, access doors
  description: string;
  
  // Step 5: Photos & Attachments
  attachments: {
    name: string;
    size: number;
    type: string;
    url: string;
    caption?: string;
  }[];
}

export type CustomerWebsiteRoute = 
  | 'HOME'
  | 'SERVICES'
  | 'SERVICE_DETAIL'
  | 'PRODUCTS'
  | 'PRODUCT_DETAIL'
  | 'SOLUTIONS'
  | 'ABOUT'
  | 'CONTACT'
  | 'REQUEST_SERVICE'
  | 'REQUEST_TRACKING'
  | 'QUOTE_VIEW'
  | 'INVOICE_VIEW'
  | 'PAYMENT_VIEW'
  | 'SUCCESS';
