import { z } from 'zod';

export const serviceRequestSchema = z.object({
  // Customer Info
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  phone: z.string().min(8, 'Phone number must be at least 8 digits').max(20),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().max(100).optional(),

  // Service Selection
  serviceType: z.string().min(1, 'Please select a service type'),

  // Location Details
  address: z.string().min(5, 'Please provide a specific street address or site location'),
  city: z.string().min(2, 'City name is required'),
  locationDetails: z.string().max(500).optional(),

  // Technical Requirements
  propertyType: z.enum([
    'COMMERCIAL_OFFICE',
    'WAREHOUSE',
    'RESIDENTIAL_VILLA',
    'RETAIL_STORE',
    'CLINIC_HEALTH',
    'OTHER',
  ]),
  existingInstallation: z.enum([
    'NO_EXISTING',
    'UPGRADE_EXISTING',
    'EXPANSION',
    'TROUBLESHOOTING_ONLY',
  ]),
  urgency: z.enum(['NORMAL', 'HIGH', 'URGENT']),
  preferredContactTime: z.enum(['ANYTIME', 'MORNING_09_12', 'AFTERNOON_14_18', 'WEEKENDS']),
  deviceCountEstimate: z.number().int().min(1).max(500).optional(),
  description: z.string().min(10, 'Please provide at least 10 characters describing your technical requirements'),

  // Attachments (validated client-side before submission)
  attachments: z.array(
    z.object({
      name: z.string(),
      size: z.number().max(10 * 1024 * 1024, 'Each photo must be under 10MB'),
      type: z.string().refine(
        (type) => ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(type),
        'Supported formats: JPG, PNG, WEBP, PDF'
      ),
      url: z.string(),
      caption: z.string().optional(),
    })
  ).max(5, 'Maximum of 5 attachments allowed'),
});

export const quoteDecisionSchema = z.object({
  quoteId: z.string().min(1),
  decision: z.enum(['ACCEPTED', 'REVISION_REQUESTED', 'DECLINED']),
  clientSignatureName: z.string().min(2, 'Please enter your full name as digital approval signature'),
  clientNotes: z.string().max(1000).optional(),
});

export const contactInquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(8, 'Valid phone number required'),
  subject: z.string().min(3, 'Subject required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
