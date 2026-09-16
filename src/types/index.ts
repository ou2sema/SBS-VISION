/**
 * SecurOps Field Service & Workflow Engine
 * Core Domain Types & Firestore Data Models
 */

export type UserRole = 
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'TECHNICIAN'
  | 'SALES'
  | 'ACCOUNTANT'
  | 'MANAGER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatarUrl?: string;
  activeJobsCount?: number;
}

export type RequestStatus = 'NEW' | 'ACCEPTED' | 'REJECTED';

export interface ServiceRequest {
  id: string; // e.g. "REQ-001024"
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceType: ServiceTypeCode;
  serviceName: string;
  location: string;
  address: string;
  description: string;
  photos: string[];
  createdAt: string;
  status: RequestStatus;
  urgency: 'NORMAL' | 'HIGH' | 'URGENT';
}

export type ServiceTypeCode = 
  | 'cctv_installation'
  | 'wifi_installation'
  | 'network_installation'
  | 'access_control_installation'
  | 'alarm_installation'
  | 'satellite_installation'
  | 'iptv_installation'
  | 'maintenance'
  | 'troubleshooting';

export type WorkOrderStatus =
  | 'WAITING_FOR_CONTACT'
  | 'VISIT_PENDING'
  | 'VISIT_IN_PROGRESS'
  | 'QUOTE_PENDING'
  | 'WAITING_CUSTOMER_APPROVAL'
  | 'INVOICE_PENDING'
  | 'WAITING_PAYMENT'
  | 'PAYMENT_CONFIRMED'
  | 'WORK_AUTHORIZED'
  | 'INSTALLATION_IN_PROGRESS'
  | 'TESTING'
  | 'WAITING_CONFIRMATION'
  | 'COMPLETED'
  | 'CANCELLED';

export interface WorkOrder {
  id: string; // e.g. "WO-001024"
  serviceRequestId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  siteCity: string;
  siteAddress: string;
  serviceType: ServiceTypeCode;
  serviceName: string;
  status: WorkOrderStatus;
  progressPercentage: number;
  assignedTechnicianIds: string[];
  createdAt: string;
  authorizedAt?: string;
  completedAt?: string;
  currentStepId: string;
  quoteId?: string;
  invoiceId?: string;
  reportId?: string;
  taskIds: string[];
  overrideHistory: AuditEntry[];
}

export type TaskStatus = 
  | 'LOCKED'
  | 'TODO'
  | 'IN_PROGRESS'
  | 'WAITING'
  | 'COMPLETED'
  | 'SKIPPED'
  | 'CANCELLED';

export type TaskTypeCode =
  | 'CONTACT'
  | 'SITE_VISIT'
  | 'CREATE_QUOTE'
  | 'CUSTOMER_APPROVAL'
  | 'CREATE_INVOICE'
  | 'PAYMENT'
  | 'PREPARE_EQUIPMENT'
  | 'INSTALLATION'
  | 'CONFIGURATION'
  | 'TESTING'
  | 'CUSTOMER_CONFIRMATION'
  | 'COMPLETION';

export interface WorkflowTask {
  id: string;
  workOrderId: string;
  templateStepId: string;
  title: string;
  type: TaskTypeCode;
  status: TaskStatus;
  order: number;
  assignedTo?: string; // userId
  assignedRole: UserRole;
  dueAt?: string;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
  attachments?: string[];
  dependencies: string[]; // array of templateStepIds that must be COMPLETED or SKIPPED
  data?: Record<string, any>;
}

export interface WorkflowStepTemplate {
  id: string;
  title: string;
  type: TaskTypeCode;
  order: number;
  dependencies: string[];
  defaultAssigneeRole: UserRole;
  description: string;
  criticalGate?: boolean;
}

export interface WorkflowTemplate {
  id: ServiceTypeCode;
  name: string;
  category: string;
  description: string;
  defaultEstimatedDurationHours: number;
  steps: WorkflowStepTemplate[];
}

export interface SiteVisitData {
  propertyType: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'GOVERNMENT';
  floorsCount: number;
  roomsCount: number;
  existingEquipment: string;
  internetAvailable: boolean;
  internetSpeedMbps?: number;
  electricalSituation: 'STABLE' | 'NEEDS_UPS' | 'UNGROUNDED';
  cableRequirementsMeters: number;
  cameraLocations: string[];
  accessPointLocations: string[];
  technicalNotes: string;
  photos: {
    url: string;
    caption: string;
    annotation?: string;
    timestamp: string;
  }[];
  checklist: {
    id: string;
    label: string;
    checked: boolean;
  }[];
}

export interface CatalogProduct {
  id: string;
  sku: string;
  name: string;
  category: 'CAMERAS' | 'RECORDERS' | 'NETWORKING' | 'CABLES' | 'ACCESS' | 'ACCESSORIES' | 'SERVICES';
  unitPrice: number; // in TND
  unit: string;
  description: string;
  inStock: number;
  warrantyMonths?: number;
}

export interface QuoteItem {
  id: string;
  productId: string;
  name: string;
  type: 'product' | 'service';
  quantity: number;
  unitPrice: number;
  total: number;
}

export type QuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REVISION_REQUESTED' | 'DECLINED';

export interface QuoteVersion {
  version: number;
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  createdAt: string;
  createdBy: string;
}

export interface Quote {
  id: string; // e.g. "QUO-001024"
  workOrderId: string;
  customerId: string;
  customerName: string;
  currentVersion: number;
  versions: QuoteVersion[];
  status: QuoteStatus;
  validUntil: string;
  customerResponseNotes?: string;
  sentAt?: string;
  acceptedAt?: string;
}

export type InvoiceStatus = 'UNPAID' | 'PAID' | 'CANCELLED';

export interface Invoice {
  id: string; // e.g. "INV-001024"
  workOrderId: string;
  quoteId: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: 'TND';
  issueDate: string;
  dueAt: string;
  status: InvoiceStatus;
  paidAt?: string;
  paidAmount?: number;
  paymentMethod?: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'ONLINE_CARD';
  paymentReference?: string;
  confirmedBy?: string;
}

export interface InstalledEquipment {
  id: string; // e.g. "CAM-00482"
  productId: string;
  name: string;
  serialNumber: string;
  macAddress?: string;
  workOrderId: string;
  customerId: string;
  locationOnSite: string;
  installedAt: string;
  installedBy: string;
  status: 'ACTIVE' | 'TESTING' | 'REPLACED';
}

export interface ServiceReport {
  id: string; // e.g. "REP-001024"
  workOrderId: string;
  customerName: string;
  siteAddress: string;
  technicianName: string;
  technicianId: string;
  serviceType: string;
  completedAt: string;
  workPerformed: string[];
  equipmentInstalled: InstalledEquipment[];
  problemsFound: string;
  recommendations: string;
  photos: string[];
  customerSignatureUrl?: string;
  customerSignName: string;
  confirmationMethod: 'DIGITAL_SIGNATURE' | 'SMS_OTP' | 'CUSTOMER_PORTAL';
  customerComments?: string;
}

export type AppointmentType = 'CONTACT' | 'SITE_VISIT' | 'INSTALLATION' | 'MAINTENANCE' | 'TROUBLESHOOTING';
export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Appointment {
  id: string;
  workOrderId: string;
  type: AppointmentType;
  customerName: string;
  siteAddress: string;
  technicianId: string;
  technicianName: string;
  startAt: string;
  endAt: string;
  status: AppointmentStatus;
  notes: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetType: 'REQUEST' | 'WORK_ORDER' | 'TASK' | 'QUOTE' | 'INVOICE' | 'PAYMENT' | 'OVERRIDE' | 'APPOINTMENT';
  targetId: string;
  previousState?: string;
  newState?: string;
  reason?: string;
  details?: Record<string, any>;
}

export interface OfflineAction {
  id: string;
  timestamp: string;
  actionType: 'COMPLETE_TASK' | 'ADD_NOTE' | 'SAVE_ASSET' | 'SAVE_SIGNATURE';
  workOrderId: string;
  taskId?: string;
  payload: any;
  status: 'QUEUED' | 'SYNCING' | 'SYNCED' | 'FAILED';
  retryCount: number;
}
