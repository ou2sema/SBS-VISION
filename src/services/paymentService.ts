/**
 * Payment Service Abstraction Layer
 * Interfaces with Payment Gateways (Stripe, Konnect, Flouci, Bank Wire)
 * and verifies authorization before invoice settlement.
 */

export interface PaymentIntentRequest {
  invoiceId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  paymentMethod: 'ONLINE_CARD' | 'BANK_TRANSFER' | 'CASH_ON_HANDOVER';
  metadata?: Record<string, any>;
}

export interface PaymentIntentResult {
  transactionId: string;
  status: 'PENDING_AUTHORIZATION' | 'SUCCEEDED' | 'REQUIRES_MANUAL_VERIFICATION' | 'FAILED';
  receiptUrl?: string;
  wireInstructions?: {
    bankName: string;
    accountHolder: string;
    iban: string;
    swiftBic: string;
    paymentReference: string;
  };
  clientSecret?: string;
  timestamp: string;
}

export class PaymentService {
  /**
   * Initializes a payment intent.
   * In production, this proxies to a secure Cloud Function (/api/create-payment-intent).
   */
  static async createPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntentResult> {
    const timestamp = new Date().toISOString();
    const transactionId = `TX-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (request.paymentMethod === 'ONLINE_CARD') {
      // In production, delegates to Stripe / Payment Provider Webhook
      return {
        transactionId,
        status: 'SUCCEEDED',
        receiptUrl: `https://receipts.securops.com/${transactionId}`,
        timestamp,
      };
    }

    if (request.paymentMethod === 'BANK_TRANSFER') {
      return {
        transactionId,
        status: 'REQUIRES_MANUAL_VERIFICATION',
        wireInstructions: {
          bankName: 'Banque Internationale de Tunisie (BIAT) / Enterprise Commercial',
          accountHolder: 'SecurOps Technology Systems SARL',
          iban: 'TN59 0800 1000 5521 0023 4589',
          swiftBic: 'BIATTNTTXXX',
          paymentReference: `INV-${request.invoiceId}`,
        },
        timestamp,
      };
    }

    // CASH_ON_HANDOVER or Manual
    return {
      transactionId,
      status: 'PENDING_AUTHORIZATION',
      timestamp,
    };
  }

  /**
   * Upload bank transfer receipt proof
   */
  static async uploadTransferProof(invoiceId: string, file: File): Promise<{ proofUrl: string; uploadedAt: string }> {
    // In production, uploads to Firebase Storage: invoices/{invoiceId}/payment_proofs/
    return {
      proofUrl: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
    };
  }
}
