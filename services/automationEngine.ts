/**
 * Business Automation Engine - نظام الأتمتة التجارية
 * يوفر أتمتة شاملة للعمليات التجارية باستخدام Workflows و Triggers
 */

export enum TriggerType {
  INVENTORY_LOW = 'INVENTORY_LOW',
  INVOICE_OVERDUE = 'INVOICE_OVERDUE',
  NEW_ORDER = 'NEW_ORDER',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  PRICE_CHANGED = 'PRICE_CHANGED',
  STOCK_RECEIVED = 'STOCK_RECEIVED',
  CUSTOMER_SIGNUP = 'CUSTOMER_SIGNUP',
  TIME_BASED = 'TIME_BASED'
}

export enum ActionType {
  SEND_EMAIL = 'SEND_EMAIL',
  SEND_SMS = 'SEND_SMS',
  CREATE_NOTIFICATION = 'CREATE_NOTIFICATION',
  UPDATE_INVENTORY = 'UPDATE_INVENTORY',
  CREATE_PURCHASE_ORDER = 'CREATE_PURCHASE_ORDER',
  APPLY_DISCOUNT = 'APPLY_DISCOUNT',
  GENERATE_REPORT = 'GENERATE_REPORT',
  WEBHOOK_CALL = 'WEBHOOK_CALL',
  ARCHIVE_INVOICE = 'ARCHIVE_INVOICE',
  SEND_WHATSAPP = 'SEND_WHATSAPP'
}

export interface Trigger {
  id: string;
  name: string;
  type: TriggerType;
  enabled: boolean;
  conditions: Condition[];
  createdAt: Date;
}

export interface Condition {
  field: string;
  operator: 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS' | 'BETWEEN';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface Action {
  id: string;
  type: ActionType;
  config: Record<string, any>;
  delay?: number; // بالدقائق
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: Trigger;
  actions: Action[];
  enabled: boolean;
  createdAt: Date;
  lastExecuted?: Date;
  executionCount: number;
}

export interface ExecutionLog {
  id: string;
  workflowId: string;
  triggeredAt: Date;
  executedActions: string[];
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  error?: string;
  metadata: Record<string, any>;
}

export class AutomationEngine {
  private workflows: Map<string, Workflow> = new Map();
  private executionLogs: ExecutionLog[] = [];
  private activeTimers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * إنشاء Workflow جديد
   */
  createWorkflow(
    name: string,
    description: string,
    trigger: Trigger,
    actions: Action[]
  ): Workflow {
    const workflow: Workflow = {
      id: this.generateId(),
      name,
      description,
      trigger,
      actions,
      enabled: true,
      createdAt: new Date(),
      executionCount: 0
    };

    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  /**
   * أتمتة تنبيهات المخزون المنخفض
   */
  createLowStockAutomation(): Workflow {
    const trigger: Trigger = {
      id: this.generateId(),
      name: 'تنبيه المخزون المنخفض',
      type: TriggerType.INVENTORY_LOW,
      enabled: true,
      conditions: [
        {
          field: 'currentStock',
          operator: 'LESS_THAN',
          value: 'reorderPoint'
        }
      ],
      createdAt: new Date()
    };

    const actions: Action[] = [
      {
        id: this.generateId(),
        type: ActionType.CREATE_NOTIFICATION,
        config: {
          title: 'تنبيه: مخزون منخفض',
          message: 'المنتج {productName} وصل إلى نقطة إعادة الطلب',
          priority: 'HIGH'
        }
      },
      {
        id: this.generateId(),
        type: ActionType.SEND_EMAIL,
        config: {
          to: '{managerEmail}',
          subject: 'تنبيه: مخزون منخفض - {productName}',
          template: 'low_stock_alert'
        },
        delay: 0
      },
      {
        id: this.generateId(),
        type: ActionType.CREATE_PURCHASE_ORDER,
        config: {
          supplier: '{preferredSupplier}',
          quantity: '{suggestedQuantity}',
          autoSubmit: false
        },
        delay: 5 // بعد 5 دقائق
      },
      {
        id: this.generateId(),
        type: ActionType.SEND_SMS,
        config: {
          to: '{managerPhone}',
          message: 'تنبيه: {productName} وصل إلى مستوى المخزون الحرج'
        },
        delay: 1
      }
    ];

    return this.createWorkflow(
      'أتمتة المخزون المنخفض',
      'تنبيهات وإجراءات تلقائية عند انخفاض المخزون',
      trigger,
      actions
    );
  }

  /**
   * أتمتة الفواتير المتأخرة
   */
  createOverdueInvoiceAutomation(): Workflow {
    const trigger: Trigger = {
      id: this.generateId(),
      name: 'فاتورة متأخرة',
      type: TriggerType.INVOICE_OVERDUE,
      enabled: true,
      conditions: [
        {
          field: 'dueDate',
          operator: 'LESS_THAN',
          value: 'TODAY'
        },
        {
          field: 'status',
          operator: 'EQUALS',
          value: 'UNPAID',
          logicalOperator: 'AND'
        }
      ],
      createdAt: new Date()
    };

    const actions: Action[] = [
      {
        id: this.generateId(),
        type: ActionType.SEND_EMAIL,
        config: {
          to: '{customerEmail}',
          subject: 'تذكير: فاتورة متأخرة #{invoiceId}',
          template: 'overdue_invoice_reminder',
          variables: { daysOverdue: '{daysOverdue}' }
        },
        delay: 1
      },
      {
        id: this.generateId(),
        type: ActionType.SEND_SMS,
        config: {
          to: '{customerPhone}',
          message: 'فاتورة متأخرة: {daysOverdue} أيام. الرجاء الدفع فوراً.'
        },
        delay: 2
      },
      {
        id: this.generateId(),
        type: ActionType.SEND_WHATSAPP,
        config: {
          to: '{customerPhone}',
          message: 'السلام عليكم ورحمة الله وبركاته\n\nتذكير: لديك فاتورة متأخرة رقم {invoiceId}\nالمبلغ: {amount} ر.س\nيرجى التواصل معنا للدفع',
          includePaymentLink: true
        },
        delay: 5
      },
      {
        id: this.generateId(),
        type: ActionType.CREATE_NOTIFICATION,
        config: {
          title: '⚠️ فاتورة متأخرة',
          message: '{customerName} - {daysOverdue} أيام متأخرة',
          priority: 'CRITICAL'
        }
      }
    ];

    return this.createWorkflow(
      'أتمتة الفواتير المتأخرة',
      'تنبيهات تلقائية للعملاء عن الفواتير المتأخرة',
      trigger,
      actions
    );
  }

  /**
   * أتمتة الطلب الجديد
   */
  createNewOrderAutomation(): Workflow {
    const trigger: Trigger = {
      id: this.generateId(),
      name: 'طلب جديد',
      type: TriggerType.NEW_ORDER,
      enabled: true,
      conditions: [
        {
          field: 'status',
          operator: 'EQUALS',
          value: 'PENDING'
        }
      ],
      createdAt: new Date()
    };

    const actions: Action[] = [
      {
        id: this.generateId(),
        type: ActionType.SEND_EMAIL,
        config: {
          to: '{customerEmail}',
          subject: 'تأكيد الطلب #{orderId}',
          template: 'order_confirmation',
          variables: { orderItems: '{orderItems}', total: '{total}' }
        },
        delay: 0
      },
      {
        id: this.generateId(),
        type: ActionType.UPDATE_INVENTORY,
        config: {
          action: 'DECREASE',
          items: '{orderItems}'
        },
        delay: 1
      },
      {
        id: this.generateId(),
        type: ActionType.SEND_WHATSAPP,
        config: {
          to: '{customerPhone}',
          message: 'شكراً لطلبك! رقم الطلب: {orderId}\nسيتم الشحن قريباً ✓',
          includeTrackingLink: true
        },
        delay: 2
      },
      {
        id: this.generateId(),
        type: ActionType.WEBHOOK_CALL,
        config: {
          url: '{warehouseWebhook}',
          method: 'POST',
          payload: {
            orderId: '{orderId}',
            items: '{orderItems}',
            destination: '{shippingAddress}'
          }
        },
        delay: 0
      }
    ];

    return this.createWorkflow(
      'أتمتة الطلب الجديد',
      'تأكيدات وتحديثات تلقائية للطلبات الجديدة',
      trigger,
      actions
    );
  }

  /**
   * أتمتة الدفع المستلم
   */
  createPaymentReceivedAutomation(): Workflow {
    const trigger: Trigger = {
      id: this.generateId(),
      name: 'دفع مستلم',
      type: TriggerType.PAYMENT_RECEIVED,
      enabled: true,
      conditions: [],
      createdAt: new Date()
    };

    const actions: Action[] = [
      {
        id: this.generateId(),
        type: ActionType.SEND_EMAIL,
        config: {
          to: '{customerEmail}',
          subject: 'شكراً: تم استلام الدفع',
          template: 'payment_received'
        },
        delay: 0
      },
      {
        id: this.generateId(),
        type: ActionType.ARCHIVE_INVOICE,
        config: {
          invoiceId: '{invoiceId}',
          status: 'PAID'
        },
        delay: 1
      },
      {
        id: this.generateId(),
        type: ActionType.GENERATE_REPORT,
        config: {
          type: 'PAYMENT_RECEIPT',
          email: '{accountantEmail}'
        },
        delay: 5
      },
      {
        id: this.generateId(),
        type: ActionType.SEND_WHATSAPP,
        config: {
          to: '{customerPhone}',
          message: 'تم استلام دفعتك بنجاح ✓\nشكراً على تعاملك معنا'
        },
        delay: 2
      }
    ];

    return this.createWorkflow(
      'أتمتة الدفع المستلم',
      'تأكيدات وإجراءات تلقائية عند استلام الدفع',
      trigger,
      actions
    );
  }

  /**
   * أتمتة التقارير الدورية
   */
  createScheduledReportAutomation(): Workflow {
    const trigger: Trigger = {
      id: this.generateId(),
      name: 'تقرير يومي',
      type: TriggerType.TIME_BASED,
      enabled: true,
      conditions: [
        {
          field: 'time',
          operator: 'EQUALS',
          value: '08:00' // الساعة 8 صباحاً
        }
      ],
      createdAt: new Date()
    };

    const actions: Action[] = [
      {
        id: this.generateId(),
        type: ActionType.GENERATE_REPORT,
        config: {
          type: 'DAILY_SUMMARY',
          metrics: ['revenue', 'orders', 'inventory', 'alerts']
        },
        delay: 0
      },
      {
        id: this.generateId(),
        type: ActionType.SEND_EMAIL,
        config: {
          to: '{managerEmail},{ownerEmail}',
          subject: 'التقرير اليومي - {date}',
          template: 'daily_summary',
          attachReport: true
        },
        delay: 1
      }
    ];

    return this.createWorkflow(
      'التقارير اليومية التلقائية',
      'توليد وإرسال التقارير الدورية',
      trigger,
      actions
    );
  }

  /**
   * تنفيذ Workflow
   */
  async executeWorkflow(workflow: Workflow, context: any): Promise<ExecutionLog> {
    const log: ExecutionLog = {
      id: this.generateId(),
      workflowId: workflow.id,
      triggeredAt: new Date(),
      executedActions: [],
      status: 'SUCCESS',
      metadata: context
    };

    try {
      for (const action of workflow.actions) {
        try {
          // تأخير الإجراء إذا لزم الأمر
          if (action.delay && action.delay > 0) {
            await new Promise(resolve => setTimeout(resolve, action.delay! * 60000));
          }

          // تنفيذ الإجراء
          await this.executeAction(action, context);
          log.executedActions.push(action.id);
        } catch (error) {
          log.status = 'PARTIAL';
          log.error = `خطأ في إجراء ${action.type}: ${error}`;
          console.error(log.error);
        }
      }

      workflow.lastExecuted = new Date();
      workflow.executionCount++;
    } catch (error) {
      log.status = 'FAILED';
      log.error = String(error);
    }

    this.executionLogs.push(log);
    return log;
  }

  /**
   * تنفيذ إجراء واحد
   */
  private async executeAction(action: Action, context: any): Promise<void> {
    const interpolatedConfig = this.interpolateContext(action.config, context);

    switch (action.type) {
      case ActionType.SEND_EMAIL:
        console.log(`📧 إرسال بريد إلى: ${interpolatedConfig.to}`);
        // TODO: تكامل مع خدمة البريد
        break;

      case ActionType.SEND_SMS:
        console.log(`📱 إرسال SMS إلى: ${interpolatedConfig.to}`);
        // TODO: تكامل مع خدمة SMS
        break;

      case ActionType.SEND_WHATSAPP:
        console.log(`💬 إرسال WhatsApp إلى: ${interpolatedConfig.to}`);
        // TODO: تكامل مع WhatsApp API
        break;

      case ActionType.CREATE_NOTIFICATION:
        console.log(`🔔 إنشاء إشعار: ${interpolatedConfig.title}`);
        // TODO: إنشاء إشعار في النظام
        break;

      case ActionType.UPDATE_INVENTORY:
        console.log(`📦 تحديث المخزون`);
        // TODO: تحديث المخزون
        break;

      case ActionType.CREATE_PURCHASE_ORDER:
        console.log(`🛒 إنشاء أمر شراء`);
        // TODO: إنشاء أمر شراء
        break;

      case ActionType.WEBHOOK_CALL:
        console.log(`🔗 استدعاء Webhook: ${interpolatedConfig.url}`);
        // TODO: استدعاء Webhook
        break;

      case ActionType.GENERATE_REPORT:
        console.log(`📊 توليد تقرير: ${interpolatedConfig.type}`);
        // TODO: توليد التقرير
        break;
    }
  }

  /**
   * استبدال المتغيرات في السياق
   */
  private interpolateContext(config: any, context: any): any {
    const str = JSON.stringify(config);
    let result = str;

    Object.entries(context).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{${key}}`, 'g'), String(value));
    });

    return JSON.parse(result);
  }

  /**
   * الحصول على سجل التنفيذ
   */
  getExecutionLogs(workflowId: string): ExecutionLog[] {
    return this.executionLogs.filter(log => log.workflowId === workflowId);
  }

  /**
   * توليد معرف فريد
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * الحصول على جميع Workflows
   */
  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  /**
   * تفعيل/تعطيل Workflow
   */
  toggleWorkflow(workflowId: string): boolean {
    const workflow = this.workflows.get(workflowId);
    if (workflow) {
      workflow.enabled = !workflow.enabled;
      return workflow.enabled;
    }
    return false;
  }

  /**
   * حذف Workflow
   */
  deleteWorkflow(workflowId: string): boolean {
    return this.workflows.delete(workflowId);
  }
}

export const automationEngine = new AutomationEngine();
