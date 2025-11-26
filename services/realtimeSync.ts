/**
 * Real-time Sync Engine - محرك المزامنة الفورية
 * يضمن تحديث البيانات الحية بين جميع الأجهزة والمستخدمين
 */

export interface SyncMessage {
  id: string;
  type: 'UPDATE' | 'CREATE' | 'DELETE' | 'SYNC_REQUEST';
  entity: 'product' | 'invoice' | 'customer' | 'order';
  entityId: string;
  data: any;
  timestamp: number;
  userId: string;
  companyId: string;
  checksum?: string;
}

export interface SyncState {
  lastSyncTime: number;
  pendingChanges: SyncMessage[];
  isOnline: boolean;
  connectionQuality: 'EXCELLENT' | 'GOOD' | 'POOR' | 'OFFLINE';
}

export class RealtimeSyncEngine {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageQueue: SyncMessage[] = [];
  private syncState: SyncState = {
    lastSyncTime: 0,
    pendingChanges: [],
    isOnline: false,
    connectionQuality: 'OFFLINE'
  };

  private listeners: Map<string, Set<Function>> = new Map();

  /**
   * الاتصال بخادم WebSocket
   */
  connect(wsUrl: string, accessToken: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('✅ متصل بخادم المزامنة الفورية');
          this.reconnectAttempts = 0;
          this.reconnectDelay = 1000;
          this.syncState.isOnline = true;
          this.syncState.connectionQuality = 'EXCELLENT';

          // إرسال التحقق من الهوية
          this.sendMessage({
            type: 'SYNC_REQUEST',
            entity: 'auth',
            entityId: 'authenticate',
            data: { token: accessToken },
            timestamp: Date.now(),
            userId: '',
            companyId: ''
          });

          // معالجة الرسائل المعلقة
          this.processQueuedMessages();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: SyncMessage = JSON.parse(event.data);
            this.handleSyncMessage(message);
          } catch (error) {
            console.error('خطأ في معالجة الرسالة:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('خطأ في WebSocket:', error);
          this.syncState.connectionQuality = 'POOR';
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('❌ قطع الاتصال بخادم المزامنة');
          this.syncState.isOnline = false;
          this.syncState.connectionQuality = 'OFFLINE';
          this.attemptReconnect(wsUrl, accessToken);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * محاولة إعادة الاتصال
   */
  private attemptReconnect(wsUrl: string, accessToken: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
      
      console.log(`🔄 محاولة إعادة الاتصال ${this.reconnectAttempts}/${this.maxReconnectAttempts} بعد ${this.reconnectDelay}ms`);
      
      setTimeout(() => {
        this.connect(wsUrl, accessToken).catch(err => {
          console.error('فشل إعادة الاتصال:', err);
        });
      }, this.reconnectDelay);
    } else {
      console.error('❌ فشل الاتصال - تم الوصول للحد الأقصى من المحاولات');
      this.notifyListeners('CONNECTION_FAILED', {});
    }
  }

  /**
   * إرسال رسالة
   */
  sendMessage(message: Partial<SyncMessage>): void {
    const fullMessage: SyncMessage = {
      id: this.generateId(),
      type: (message.type || 'UPDATE') as any,
      entity: (message.entity || 'product') as any,
      entityId: message.entityId || '',
      data: message.data || {},
      timestamp: message.timestamp || Date.now(),
      userId: message.userId || '',
      companyId: message.companyId || ''
    };

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(fullMessage));
    } else {
      // تخزين الرسالة في الطابور إذا لم نكن متصلين
      this.messageQueue.push(fullMessage);
      this.syncState.pendingChanges.push(fullMessage);
      this.notifyListeners('MESSAGE_QUEUED', fullMessage);
    }
  }

  /**
   * معالجة رسائل المزامنة
   */
  private handleSyncMessage(message: SyncMessage): void {
    this.syncState.lastSyncTime = Date.now();

    switch (message.type) {
      case 'UPDATE':
      case 'CREATE':
      case 'DELETE':
        this.notifyListeners(`${message.entity.toUpperCase()}_${message.type}`, message.data);
        break;
      
      case 'SYNC_REQUEST':
        // رد المزامنة من الخادم
        this.notifyListeners('SYNC_COMPLETE', { timestamp: message.timestamp });
        break;
    }
  }

  /**
   * معالجة الرسائل المعلقة
   */
  private processQueuedMessages(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message && this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message));
      }
    }
  }

  /**
   * الاستماع للتحديثات
   */
  onUpdate(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    this.listeners.get(event)!.add(callback);

    // إرجاع دالة لإزالة المستمع
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  /**
   * إخطار جميع المستمعين
   */
  private notifyListeners(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`خطأ في معالج ${event}:`, error);
        }
      });
    }
  }

  /**
   * الحصول على حالة المزامنة
   */
  getSyncState(): SyncState {
    return { ...this.syncState };
  }

  /**
   * إعادة تعيين الحالة
   */
  resetSync(): void {
    this.messageQueue = [];
    this.syncState.pendingChanges = [];
    this.syncState.lastSyncTime = Date.now();
  }

  /**
   * قطع الاتصال
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * توليد معرف فريد
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// إنشاء مثيل واحد
export const realtimeSyncEngine = new RealtimeSyncEngine();
