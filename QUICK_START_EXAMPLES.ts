#!/usr/bin/env node

/**
 * Quick Start Examples - أمثلة البدء السريع
 * نسخ والصق هذه الأمثلة في مشروعك مباشرة
 */

// ============================================================================
// 1️⃣ استخدام التحليلات الذكية
// ============================================================================

import { AdvancedAnalyticsEngine } from './services/advancedAnalytics';
import { SmartRecommendationEngine } from './services/smartRecommendations';
import { automationEngine } from './services/automationEngine';
import { realtimeSyncEngine } from './services/realtimeSync';

// مثال 1: تحليل الاتجاهات
async function exampleAnalyticsTrends() {
  console.log('📊 مثال: تحليل الاتجاهات');
  
  const historicalRevenue = [
    50000, 52000, 55000, 58000, 60000, 65000, 70000, 75000
  ];
  
  const trend = AdvancedAnalyticsEngine.analyzeTrends(historicalRevenue);
  
  console.log('النتيجة:', {
    اتجاه: trend.trend,           // 'UP'
    النسبة: trend.percentage,     // 50
    التوقع30يوم: trend.forecastNext30Days,  // 81000
    درجةالثقة: `${(trend.confidence * 100).toFixed(0)}%`,  // 95%
    الموسمية: trend.seasonality   // 'LOW'
  });
  
  /*
  النتيجة:
  {
    اتجاه: 'UP',
    النسبة: 50,
    التوقع30يوم: 81000,
    درجةالثقة: '95%',
    الموسمية: 'LOW'
  }
  */
}

// مثال 2: كشف الشذوذ
async function exampleAnomalyDetection() {
  console.log('🔍 مثال: كشف الشذوذ');
  
  const invoices = [
    { id: '1', totalAmount: 5000, date: '2024-01-15', status: 'PAID', dueDate: '2024-02-15', customerName: 'أحمد', type: 'SALES', items: [], taxAmount: 250, compliance: {} },
    { id: '2', totalAmount: 50000, date: '2024-01-16', status: 'PENDING', dueDate: '2024-02-16', customerName: 'محمد', type: 'SALES', items: [], taxAmount: 2500, compliance: {} },
    { id: '3', totalAmount: 4500, date: '2024-01-20', status: 'OVERDUE', dueDate: '2024-01-30', customerName: 'علي', type: 'SALES', items: [], taxAmount: 225, compliance: {} },
  ];
  
  const anomalies = AdvancedAnalyticsEngine.detectAnomalies(invoices);
  
  console.log(`تم العثور على ${anomalies.length} شذوذ:`);
  anomalies.forEach(a => {
    console.log(`  ⚠️ ${a.description}`);
    console.log(`     → ${a.suggestedAction}`);
  });
}

// ============================================================================
// 2️⃣ استخدام التوصيات الذكية
// ============================================================================

async function exampleSmartRecommendations() {
  console.log('💡 مثال: التوصيات الذكية');
  
  const products = [
    { id: '1', name: 'آيفون 15', sku: 'IP15', category: 'هواتف', currentStock: 3, reorderPoint: 10, costPrice: 4000, sellingPrice: 5000, lastRestocked: '2024-12-20' },
    { id: '2', name: 'سامسونج S24', sku: 'SS24', category: 'هواتف', currentStock: 15, reorderPoint: 10, costPrice: 3500, sellingPrice: 4500, lastRestocked: '2024-12-18' },
  ];
  
  const invoices = [
    { id: '1', type: 'SALES' as const, customerName: 'أحمد', date: '2024-01-15', dueDate: '2024-02-15', items: [{ productId: '1', productName: 'آيفون 15', quantity: 2, unitPrice: 5000, total: 10000 }], totalAmount: 10000, taxAmount: 500, status: 'PAID' as const, compliance: {} },
  ];
  
  const customers = [
    { id: '1', name: 'أحمد', email: 'a@ex.com', phone: '01234567890', type: 'customer' as const, address: 'القاهرة', balance: 500 },
  ];
  
  const recs = SmartRecommendationEngine.generateRecommendationReport(products, invoices, customers);
  
  console.log(`تم توليد ${recs.length} توصية:`);
  recs.slice(0, 3).forEach(rec => {
    console.log(`\n  📌 ${rec.title}`);
    console.log(`     الأولوية: ${rec.priority}`);
    console.log(`     الإجراء: ${rec.actionItems[0]}`);
    console.log(`     التأثير المالي: ${rec.impact.revenue || rec.impact.savings} ر.س`);
  });
}

// ============================================================================
// 3️⃣ استخدام الأتمتة
// ============================================================================

async function exampleAutomation() {
  console.log('⚙️ مثال: الأتمتة التلقائية');
  
  // إنشاء Workflow للمخزون المنخفض
  const workflow = automationEngine.createLowStockAutomation();
  console.log(`✅ تم إنشاء Workflow: ${workflow.name}`);
  
  // إنشاء workflows أخرى
  automationEngine.createOverdueInvoiceAutomation();
  automationEngine.createNewOrderAutomation();
  automationEngine.createPaymentReceivedAutomation();
  
  // عرض جميع Workflows
  const allWorkflows = automationEngine.getAllWorkflows();
  console.log(`\nإجمالي Workflows: ${allWorkflows.length}`);
  
  allWorkflows.forEach(w => {
    console.log(`  ✓ ${w.name} (${w.actions.length} إجراءات)`);
  });
  
  // تنفيذ workflow
  const context = {
    productName: 'آيفون 15 برو',
    currentStock: 3,
    reorderPoint: 10,
    managerEmail: 'manager@zimam.com',
    managerPhone: '+966501234567'
  };
  
  const executionLog = await automationEngine.executeWorkflow(workflow, context);
  console.log(`\n${executionLog.status === 'SUCCESS' ? '✅' : '❌'} تم تنفيذ ${executionLog.executedActions.length} إجراءات`);
}

// ============================================================================
// 4️⃣ استخدام المزامنة الفورية
// ============================================================================

async function exampleRealtimeSync() {
  console.log('🔄 مثال: المزامنة الفورية');
  
  const wsUrl = 'wss://api.zimam.com/ws/sync';
  const accessToken = 'your_jwt_token_here';
  
  try {
    // الاتصال
    await realtimeSyncEngine.connect(wsUrl, accessToken);
    console.log('✅ متصل بخادم المزامنة');
    
    // الاستماع للتحديثات
    const unsubscribe = realtimeSyncEngine.onUpdate('PRODUCT_UPDATE', (data) => {
      console.log('🔔 تحديث منتج:', data);
    });
    
    // إرسال تحديث
    realtimeSyncEngine.sendMessage({
      type: 'UPDATE',
      entity: 'product',
      entityId: '123',
      data: { 
        price: 5500,
        stock: 10
      },
      timestamp: Date.now(),
      userId: 'user123',
      companyId: 'company456'
    });
    
    // الحصول على الحالة
    const state = realtimeSyncEngine.getSyncState();
    console.log(`📊 حالة المزامنة:`, {
      متصل: state.isOnline,
      جودةالاتصال: state.connectionQuality,
      التغييراتالمعلقة: state.pendingChanges.length
    });
    
  } catch (error) {
    console.error('❌ خطأ:', error);
  }
}

// ============================================================================
// 5️⃣ دمج في Context (React)
// ============================================================================

/*
في component:

import { useEffect, useState } from 'react';
import { AdvancedAnalyticsEngine } from '@/services/advancedAnalytics';
import { SmartRecommendationEngine } from '@/services/smartRecommendations';

export function MyDashboard() {
  const [insights, setInsights] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  
  useEffect(() => {
    // تحميل التحليلات
    const analyticsData = AdvancedAnalyticsEngine.generateFinancialInsights(financials);
    setInsights(analyticsData);
    
    // تحميل التوصيات
    const recs = SmartRecommendationEngine.generateRecommendationReport(
      products, 
      invoices, 
      customers
    );
    setRecommendations(recs);
  }, []);
  
  return (
    <div>
      {/* عرض الرؤى */}
      {insights?.map(i => (
        <div key={i.type}>
          <h3>{i.metric}</h3>
          <p>القيمة الحالية: {i.currentValue}</p>
          <p>التوقع: {i.predictedValue}</p>
        </div>
      ))}
      
      {/* عرض التوصيات */}
      {recommendations.map(rec => (
        <div key={rec.id}>
          <h4>{rec.title}</h4>
          <p>{rec.description}</p>
        </div>
      ))}
    </div>
  );
}
*/

// ============================================================================
// 6️⃣ دمج في الـ Backend Views (Django)
// ============================================================================

/*
من API endpoint:

from rest_framework.views import APIView
from rest_framework.response import Response
from .services import AdvancedAnalyticsEngine

class AnalyticsView(APIView):
    def get(self, request):
        company_id = request.user.profile.company_id
        
        # جلب البيانات
        financials = FinancialSnapshot.objects.filter(company_id=company_id)
        invoices = Invoice.objects.filter(company_id=company_id)
        
        # تحليل
        insights = AdvancedAnalyticsEngine.generateFinancialInsights(
            [f.to_dict() for f in financials]
        )
        
        return Response({
            'insights': insights,
            'status': 'success'
        })
*/

// ============================================================================
// 7️⃣ إعدادات الإنتاج المقترحة
// ============================================================================

const productionSettings = {
  // Frontend (.env)
  frontend: {
    VITE_API_URL: 'https://api.zimam.com/api',
    VITE_WS_URL: 'wss://api.zimam.com/ws',
    VITE_GOOGLE_API_KEY: 'your_production_gemini_key',
    VITE_ENVIRONMENT: 'production'
  },
  
  // Backend (settings.py)
  backend: {
    DEBUG: false,
    ALLOWED_HOSTS: ['zimam.com', 'www.zimam.com', 'api.zimam.com'],
    SECURE_SSL_REDIRECT: true,
    SESSION_COOKIE_SECURE: true,
    CSRF_COOKIE_SECURE: true,
    SECURE_HSTS_SECONDS: 31536000
  },
  
  // Database
  database: {
    ENGINE: 'postgresql',
    CONNECTION_POOLING: 'pgbouncer',
    MAX_CONNECTIONS: 100
  },
  
  // Cache
  cache: {
    ENGINE: 'redis',
    TIMEOUT: 3600,
    KEY_PREFIX: 'zimam_prod'
  }
};

// ============================================================================
// تشغيل الأمثلة
// ============================================================================

async function runExamples() {
  console.log('\n🚀 بدء تشغيل الأمثلة...\n');
  
  try {
    await exampleAnalyticsTrends();
    console.log('\n---\n');
    
    await exampleAnomalyDetection();
    console.log('\n---\n');
    
    await exampleSmartRecommendations();
    console.log('\n---\n');
    
    await exampleAutomation();
    console.log('\n---\n');
    
    console.log('✅ اكتملت جميع الأمثلة بنجاح!\n');
  } catch (error) {
    console.error('❌ خطأ:', error);
  }
}

// تشغيل إذا تم استدعاء هذا الملف مباشرة
if (require.main === module) {
  runExamples();
}

export {
  exampleAnalyticsTrends,
  exampleAnomalyDetection,
  exampleSmartRecommendations,
  exampleAutomation,
  exampleRealtimeSync,
  productionSettings
};
