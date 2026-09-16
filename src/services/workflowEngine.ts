/**
 * Authoritative Workflow Engine & State Machine
 * Central business logic governing work orders, task dependencies, and commercial gates.
 */
import { 
  ServiceRequest, 
  WorkOrder, 
  WorkflowTask, 
  Quote, 
  QuoteItem, 
  Invoice, 
  UserProfile, 
  AuditEntry, 
  ServiceReport, 
  InstalledEquipment,
  WorkOrderStatus
} from '../types';
import { WORKFLOW_TEMPLATES } from './workflowTemplates';
import { CATALOG_PRODUCTS } from './catalog';

export class WorkflowEngine {
  /**
   * Accepts a new service request and initializes the Work Order with template tasks
   */
  static acceptRequest(
    request: ServiceRequest, 
    actor: UserProfile
  ): { workOrder: WorkOrder; tasks: WorkflowTask[]; audit: AuditEntry } {
    const template = WORKFLOW_TEMPLATES[request.serviceType] || WORKFLOW_TEMPLATES.cctv_installation;
    const workOrderId = `WO-${request.id.replace('REQ-', '')}`;
    const now = new Date().toISOString();

    // Create tasks based on template steps
    const tasks: WorkflowTask[] = template.steps.map((step, index) => {
      const taskId = `TSK-${workOrderId.replace('WO-', '')}-${String(index + 1).padStart(2, '0')}`;
      const isFirstStep = step.dependencies.length === 0;

      return {
        id: taskId,
        workOrderId,
        templateStepId: step.id,
        title: step.title,
        type: step.type,
        status: isFirstStep ? 'TODO' : 'LOCKED',
        order: step.order,
        assignedRole: step.defaultAssigneeRole,
        dependencies: [...step.dependencies],
        notes: step.description,
      };
    });

    const workOrder: WorkOrder = {
      id: workOrderId,
      serviceRequestId: request.id,
      customerId: `cust_${request.id.toLowerCase()}`,
      customerName: request.customerName,
      customerPhone: request.customerPhone,
      customerEmail: request.customerEmail,
      siteCity: request.location,
      siteAddress: request.address,
      serviceType: request.serviceType,
      serviceName: request.serviceName,
      status: 'WAITING_FOR_CONTACT',
      progressPercentage: 10,
      assignedTechnicianIds: [],
      createdAt: now,
      currentStepId: template.steps[0].id,
      taskIds: tasks.map(t => t.id),
      overrideHistory: [],
    };

    const audit: AuditEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: now,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'REQUEST_ACCEPTED',
      targetType: 'WORK_ORDER',
      targetId: workOrderId,
      previousState: 'NEW',
      newState: 'WAITING_FOR_CONTACT',
      reason: `Request accepted by ${actor.name}. Automatically instantiated ${template.name} (${tasks.length} tasks).`,
    };

    return { workOrder, tasks, audit };
  }

  /**
   * Completes a task and evaluates downstream dependencies according to business rules
   */
  static completeTask(
    workOrder: WorkOrder,
    taskToComplete: WorkflowTask,
    allTasks: WorkflowTask[],
    quote: Quote | undefined,
    invoice: Invoice | undefined,
    actor: UserProfile,
    taskData?: Record<string, any>
  ): {
    updatedWorkOrder: WorkOrder;
    updatedTasks: WorkflowTask[];
    audit: AuditEntry;
    newlyUnlockedTaskIds: string[];
  } {
    const now = new Date().toISOString();
    
    // Mark target task completed
    const updatedTasks = allTasks.map(t => {
      if (t.id === taskToComplete.id) {
        return {
          ...t,
          status: 'COMPLETED' as const,
          completedAt: now,
          data: { ...t.data, ...taskData },
        };
      }
      return t;
    });

    const completedStepIds = new Set(
      updatedTasks
        .filter(t => t.status === 'COMPLETED' || t.status === 'SKIPPED')
        .map(t => t.templateStepId)
    );

    const newlyUnlockedTaskIds: string[] = [];

    // Evaluate dependencies for all non-completed tasks
    const evaluatedTasks = updatedTasks.map(t => {
      if (t.status !== 'LOCKED') return t;

      const allDepsMet = t.dependencies.every(depId => completedStepIds.has(depId));
      if (!allDepsMet) return t;

      // Check Payment Gate requirement for installation tasks
      const isInstallationPhase = ['PREPARE_EQUIPMENT', 'INSTALLATION', 'CONFIGURATION', 'TESTING'].includes(t.type);
      if (isInstallationPhase) {
        const isQuoteAccepted = quote && quote.status === 'ACCEPTED';
        const isInvoicePaid = invoice && invoice.status === 'PAID';

        if (!isQuoteAccepted || !isInvoicePaid) {
          // Gate keeps task locked until payment confirmed
          return {
            ...t,
            notes: `Commercial Gate Locked: Requires Quote Acceptance & Invoice Payment confirmation.`,
          };
        }
      }

      // Unlock task!
      newlyUnlockedTaskIds.push(t.id);
      return {
        ...t,
        status: 'TODO' as const,
      };
    });

    // Compute progress & new WorkOrder status
    const completedCount = evaluatedTasks.filter(t => t.status === 'COMPLETED' || t.status === 'SKIPPED').length;
    const progressPercentage = Math.round((completedCount / evaluatedTasks.length) * 100);

    let nextStatus: WorkOrderStatus = workOrder.status;
    if (taskToComplete.type === 'CONTACT') {
      nextStatus = 'VISIT_PENDING';
    } else if (taskToComplete.type === 'SITE_VISIT') {
      nextStatus = 'QUOTE_PENDING';
    } else if (taskToComplete.type === 'PREPARE_EQUIPMENT' || taskToComplete.type === 'INSTALLATION') {
      nextStatus = 'INSTALLATION_IN_PROGRESS';
    } else if (taskToComplete.type === 'CONFIGURATION' || taskToComplete.type === 'TESTING') {
      nextStatus = 'TESTING';
    } else if (taskToComplete.type === 'CUSTOMER_CONFIRMATION') {
      nextStatus = 'COMPLETED';
    }

    const firstTodoTask = evaluatedTasks.find(t => t.status === 'TODO');

    const updatedWorkOrder: WorkOrder = {
      ...workOrder,
      status: nextStatus,
      progressPercentage,
      currentStepId: firstTodoTask ? firstTodoTask.templateStepId : workOrder.currentStepId,
      completedAt: nextStatus === 'COMPLETED' ? now : undefined,
    };

    const audit: AuditEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: now,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'TASK_COMPLETED',
      targetType: 'TASK',
      targetId: taskToComplete.id,
      previousState: taskToComplete.status,
      newState: 'COMPLETED',
      reason: `Task "${taskToComplete.title}" completed. Unlocked: ${newlyUnlockedTaskIds.length} downstream tasks.`,
    };

    return {
      updatedWorkOrder,
      updatedTasks: evaluatedTasks,
      audit,
      newlyUnlockedTaskIds,
    };
  }

  /**
   * Generates or updates a Quote using trusted catalog prices with strict versioning
   */
  static saveQuote(
    workOrder: WorkOrder,
    existingQuote: Quote | undefined,
    items: QuoteItem[],
    discount: number,
    notes: string,
    actor: UserProfile
  ): { quote: Quote; audit: AuditEntry } {
    const now = new Date().toISOString();
    
    // Server-side validation of item unit prices from catalog
    const validatedItems = items.map(item => {
      const catalogItem = CATALOG_PRODUCTS.find(p => p.id === item.productId);
      const unitPrice = catalogItem ? catalogItem.unitPrice : item.unitPrice;
      return {
        ...item,
        unitPrice,
        total: Math.round(unitPrice * item.quantity * 100) / 100,
      };
    });

    const subtotal = validatedItems.reduce((sum, it) => sum + it.total, 0);
    const effectiveDiscount = Math.max(0, Math.min(discount, subtotal * 0.3)); // max 30% discount safeguard
    const taxableAmount = Math.max(0, subtotal - effectiveDiscount);
    const taxRate = 0.19; // 19% VAT in Tunisia
    const taxAmount = Math.round(taxableAmount * taxRate * 100) / 100;
    const total = Math.round((taxableAmount + taxAmount) * 100) / 100;

    const nextVersionNumber = existingQuote ? existingQuote.currentVersion + 1 : 1;
    const newVersion = {
      version: nextVersionNumber,
      items: validatedItems,
      subtotal,
      discount: effectiveDiscount,
      taxRate,
      taxAmount,
      total,
      notes,
      createdAt: now,
      createdBy: actor.name,
    };

    const quoteId = existingQuote ? existingQuote.id : `QUO-${workOrder.id.replace('WO-', '')}`;
    const updatedQuote: Quote = {
      id: quoteId,
      workOrderId: workOrder.id,
      customerId: workOrder.customerId,
      customerName: workOrder.customerName,
      currentVersion: nextVersionNumber,
      versions: existingQuote ? [...existingQuote.versions, newVersion] : [newVersion],
      status: 'SENT',
      validUntil: new Date(Date.now() + 86400000 * 30).toISOString(),
      sentAt: now,
    };

    const audit: AuditEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: now,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: existingQuote ? 'QUOTE_MODIFIED' : 'QUOTE_CREATED',
      targetType: 'QUOTE',
      targetId: quoteId,
      previousState: existingQuote ? `v${existingQuote.currentVersion}` : 'DRAFT',
      newState: `v${nextVersionNumber} (SENT)`,
      reason: `Quotation v${nextVersionNumber} issued for ${total.toFixed(2)} TND by ${actor.name}.`,
    };

    return { quote: updatedQuote, audit };
  }

  /**
   * Processes Customer decision on Quote (Accept / Revise / Decline)
   */
  static processCustomerQuoteDecision(
    quote: Quote,
    workOrder: WorkOrder,
    allTasks: WorkflowTask[],
    decision: 'ACCEPTED' | 'REVISION_REQUESTED' | 'DECLINED',
    customerNotes?: string
  ): {
    updatedQuote: Quote;
    updatedWorkOrder: WorkOrder;
    updatedTasks: WorkflowTask[];
    invoice?: Invoice;
    audit: AuditEntry;
  } {
    const now = new Date().toISOString();
    const updatedQuote: Quote = {
      ...quote,
      status: decision,
      customerResponseNotes: customerNotes,
      acceptedAt: decision === 'ACCEPTED' ? now : undefined,
    };

    let invoice: Invoice | undefined;
    let updatedTasks = [...allTasks];
    let updatedWorkOrder = { ...workOrder };

    if (decision === 'ACCEPTED') {
      const activeVersion = quote.versions[quote.versions.length - 1];
      const invoiceId = `INV-${workOrder.id.replace('WO-', '')}`;

      // Automatically create commercial invoice
      invoice = {
        id: invoiceId,
        workOrderId: workOrder.id,
        quoteId: quote.id,
        customerId: workOrder.customerId,
        customerName: workOrder.customerName,
        amount: activeVersion.total,
        currency: 'TND',
        issueDate: now,
        dueAt: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days
        status: 'UNPAID',
      };

      // Complete 'customer_approval' and unlock 'create_invoice' and 'payment_confirmation'
      updatedTasks = updatedTasks.map(t => {
        if (t.templateStepId === 'customer_approval') {
          return { ...t, status: 'COMPLETED' as const, completedAt: now, notes: `Customer accepted quote v${quote.currentVersion}.` };
        }
        if (t.templateStepId === 'create_invoice') {
          return { ...t, status: 'COMPLETED' as const, completedAt: now, notes: `Invoice ${invoiceId} generated automatically.` };
        }
        if (t.templateStepId === 'payment_confirmation') {
          return { ...t, status: 'TODO' as const, notes: `Awaiting payment confirmation for ${activeVersion.total.toFixed(2)} TND.` };
        }
        return t;
      });

      updatedWorkOrder = {
        ...workOrder,
        quoteId: quote.id,
        invoiceId,
        status: 'WAITING_PAYMENT',
      };
    } else if (decision === 'REVISION_REQUESTED') {
      // Re-enable create_quote task
      updatedTasks = updatedTasks.map(t => {
        if (t.templateStepId === 'create_quote') {
          return { ...t, status: 'TODO' as const, notes: `Customer requested revision: ${customerNotes || 'No notes provided'}.` };
        }
        return t;
      });
      updatedWorkOrder = {
        ...workOrder,
        status: 'QUOTE_PENDING',
      };
    }

    const audit: AuditEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: now,
      actorId: 'customer_online_portal',
      actorName: workOrder.customerName,
      actorRole: 'SALES',
      action: 'QUOTE_CUSTOMER_RESPONSE',
      targetType: 'QUOTE',
      targetId: quote.id,
      previousState: 'SENT',
      newState: decision,
      reason: `Customer responded to Quote ${quote.id}: ${decision}. ${customerNotes ? `Notes: ${customerNotes}` : ''}`,
    };

    return { updatedQuote, updatedWorkOrder, updatedTasks, invoice, audit };
  }

  /**
   * Confirms payment for an Invoice. Unlocks the commercial gate and authorizes work.
   * STRICT SECURITY: Only ADMIN, SUPER_ADMIN, or ACCOUNTANT can confirm.
   */
  static confirmPayment(
    invoice: Invoice,
    workOrder: WorkOrder,
    allTasks: WorkflowTask[],
    paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'ONLINE_CARD',
    reference: string,
    actor: UserProfile
  ): {
    updatedInvoice: Invoice;
    updatedWorkOrder: WorkOrder;
    updatedTasks: WorkflowTask[];
    audit: AuditEntry;
  } {
    // Role Authorization Check
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT'];
    if (!allowedRoles.includes(actor.role)) {
      throw new Error(`Unauthorized: Technicians cannot mark invoices as paid. Required role: Admin or Accountant.`);
    }

    const now = new Date().toISOString();

    const updatedInvoice: Invoice = {
      ...invoice,
      status: 'PAID',
      paidAt: now,
      paidAmount: invoice.amount,
      paymentMethod,
      paymentReference: reference,
      confirmedBy: actor.name,
    };

    // Unlock installation gate tasks!
    const updatedTasks = allTasks.map(t => {
      if (t.templateStepId === 'payment_confirmation') {
        return {
          ...t,
          status: 'COMPLETED' as const,
          completedAt: now,
          notes: `Payment confirmed (${paymentMethod} - ${reference}) by ${actor.name}.`,
        };
      }
      if (t.templateStepId === 'prepare_equipment') {
        return {
          ...t,
          status: 'TODO' as const,
          notes: 'Equipment preparation unlocked following payment confirmation.',
        };
      }
      return t;
    });

    const updatedWorkOrder: WorkOrder = {
      ...workOrder,
      status: 'WORK_AUTHORIZED',
      authorizedAt: now,
      currentStepId: 'prepare_equipment',
    };

    const audit: AuditEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: now,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'PAYMENT_CONFIRMED',
      targetType: 'PAYMENT',
      targetId: invoice.id,
      previousState: 'UNPAID',
      newState: 'PAID',
      reason: `Payment of ${invoice.amount.toFixed(2)} TND confirmed via ${paymentMethod} (Ref: ${reference}). WORK AUTHORIZED!`,
    };

    return { updatedInvoice, updatedWorkOrder, updatedTasks, audit };
  }

  /**
   * Administrator Workflow Override with mandatory audit logging
   */
  static adminOverride(
    workOrder: WorkOrder,
    taskId: string,
    action: 'SKIP_TASK' | 'FORCE_UNLOCK' | 'REOPEN_TASK',
    reason: string,
    actor: UserProfile,
    allTasks: WorkflowTask[]
  ): {
    updatedWorkOrder: WorkOrder;
    updatedTasks: WorkflowTask[];
    audit: AuditEntry;
  } {
    if (!['SUPER_ADMIN', 'ADMIN'].includes(actor.role)) {
      throw new Error('Unauthorized: Only administrators can execute workflow overrides.');
    }

    if (!reason || reason.trim().length < 5) {
      throw new Error('A detailed justification reason is required for administrative overrides.');
    }

    const targetTask = allTasks.find(t => t.id === taskId);
    if (!targetTask) throw new Error(`Task ${taskId} not found.`);

    const now = new Date().toISOString();
    const previousState = targetTask.status;
    let newStatus = targetTask.status;

    if (action === 'SKIP_TASK') newStatus = 'SKIPPED';
    else if (action === 'FORCE_UNLOCK') newStatus = 'TODO';
    else if (action === 'REOPEN_TASK') newStatus = 'TODO';

    const updatedTasks = allTasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: newStatus,
          notes: `${t.notes || ''} [ADMIN OVERRIDE by ${actor.name}: ${reason}]`,
        };
      }
      return t;
    });

    const audit: AuditEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: now,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: `OVERRIDE_${action}`,
      targetType: 'OVERRIDE',
      targetId: taskId,
      previousState,
      newState: newStatus,
      reason: `Admin Override by ${actor.name}: ${reason}`,
    };

    const updatedWorkOrder: WorkOrder = {
      ...workOrder,
      overrideHistory: [...workOrder.overrideHistory, audit],
    };

    return { updatedWorkOrder, updatedTasks, audit };
  }

  /**
   * Finalizes job, stores equipment assets, registers customer confirmation and completes Work Order
   */
  static finalizeJob(
    workOrder: WorkOrder,
    allTasks: WorkflowTask[],
    serviceReport: ServiceReport,
    installedAssets: InstalledEquipment[],
    actor: UserProfile
  ): {
    updatedWorkOrder: WorkOrder;
    updatedTasks: WorkflowTask[];
    audit: AuditEntry;
  } {
    const now = new Date().toISOString();

    const updatedTasks = allTasks.map(t => {
      if (t.templateStepId === 'customer_confirmation' || t.templateStepId === 'completion') {
        return {
          ...t,
          status: 'COMPLETED' as const,
          completedAt: now,
          notes: `Customer signed off: ${serviceReport.customerSignName} via ${serviceReport.confirmationMethod}`,
        };
      }
      return t;
    });

    const updatedWorkOrder: WorkOrder = {
      ...workOrder,
      status: 'COMPLETED',
      progressPercentage: 100,
      completedAt: now,
      reportId: serviceReport.id,
    };

    const audit: AuditEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: now,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'JOB_COMPLETED',
      targetType: 'WORK_ORDER',
      targetId: workOrder.id,
      previousState: workOrder.status,
      newState: 'COMPLETED',
      reason: `Work Order completed with signed service report. Recorded ${installedAssets.length} installed asset serials.`,
    };

    return { updatedWorkOrder, updatedTasks, audit };
  }
}
