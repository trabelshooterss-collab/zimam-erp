/**
 * Advanced Analytics Engine - نظام التحليلات الذكي المتقدم
 * يوفر تحليلات عميقة وتوقعات بناءً على ML
 */

import { Product, Invoice, FinancialSnapshot } from '../types';

export interface TrendAnalysis {
  trend: 'UP' | 'DOWN' | 'STABLE';
  percentage: number;
  forecastNext30Days: number;
  confidence: number;
  seasonality: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface AnomalyDetection {
  anomalyType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: Date;
  description: string;
  suggestedAction: string;
}

export interface PredictiveInsight {
  type: 'REVENUE' | 'EXPENSE' | 'CASH_FLOW' | 'GROWTH' | 'RISK';
  metric: string;
  currentValue: number;
  predictedValue: number;
  timeframe: string;
  confidence: number;
  actionItems: string[];
}

export interface CustomerSegmentation {
  segment: string;
  customers: string[];
  value: number;
  avgPurchaseFrequency: number;
  churnRisk: number;
  recommendations: string[];
}

/**
 * نظام التنبؤ المتقدم - Advanced Forecasting System
 */
export class AdvancedAnalyticsEngine {
  
  /**
   * تحليل الاتجاهات مع التنبؤ بـ 30 يوم مقبلة
   */
  static analyzeTrends(historicalData: number[]): TrendAnalysis {
    if (historicalData.length < 3) {
      return {
        trend: 'STABLE',
        percentage: 0,
        forecastNext30Days: historicalData[historicalData.length - 1],
        confidence: 0.3,
        seasonality: 'LOW'
      };
    }

    const recent = historicalData.slice(-7);
    const previous = historicalData.slice(-14, -7);
    
    const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
    const previousAvg = previous.reduce((a, b) => a + b) / previous.length;
    
    const percentageChange = ((recentAvg - previousAvg) / previousAvg) * 100;
    const trend = percentageChange > 5 ? 'UP' : percentageChange < -5 ? 'DOWN' : 'STABLE';

    // حساب الموسمية
    const variance = recent.reduce((sum, val) => sum + Math.pow(val - recentAvg, 2), 0) / recent.length;
    const stdDev = Math.sqrt(variance);
    const seasonality = stdDev > recentAvg * 0.3 ? 'HIGH' : stdDev > recentAvg * 0.15 ? 'MEDIUM' : 'LOW';

    // التنبؤ باستخدام Linear Regression
    const forecast = this.linearRegression(historicalData);

    return {
      trend,
      percentage: Math.abs(percentageChange),
      forecastNext30Days: forecast,
      confidence: Math.min(0.95, 0.5 + (historicalData.length * 0.05)),
      seasonality
    };
  }

  /**
   * كشف الشذوذ والمشاكل غير العادية
   */
  static detectAnomalies(invoices: Invoice[]): AnomalyDetection[] {
    const anomalies: AnomalyDetection[] = [];
    
    const amounts = invoices.map(inv => inv.totalAmount);
    const avg = amounts.reduce((a, b) => a + b) / amounts.length;
    const stdDev = Math.sqrt(amounts.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / amounts.length);

    // كشف القيم الشاذة
    invoices.forEach(invoice => {
      const zScore = Math.abs((invoice.totalAmount - avg) / stdDev);
      
      if (zScore > 3) {
        anomalies.push({
          anomalyType: 'UNUSUAL_AMOUNT',
          severity: 'HIGH',
          timestamp: new Date(invoice.date),
          description: `فاتورة ذات قيمة غير عادية: ${invoice.totalAmount}`,
          suggestedAction: 'تحقق من تفاصيل الفاتورة والعميل'
        });
      }

      // كشف الفواتير المتأخرة
      if (invoice.status === 'OVERDUE') {
        anomalies.push({
          anomalyType: 'OVERDUE_PAYMENT',
          severity: 'MEDIUM',
          timestamp: new Date(invoice.dueDate),
          description: `فاتورة متأخرة من ${invoice.customerName}`,
          suggestedAction: 'تواصل مع العميل بشأن الدفع المتأخر'
        });
      }
    });

    return anomalies;
  }

  /**
   * توليد رؤية مالية ذكية
   */
  static generateFinancialInsights(financials: FinancialSnapshot[]): PredictiveInsight[] {
    const insights: PredictiveInsight[] = [];
    
    if (financials.length < 2) return insights;

    // تحليل الإيرادات
    const revenues = financials.map(f => f.revenue);
    const revenueTrend = this.analyzeTrends(revenues);
    
    insights.push({
      type: 'REVENUE',
      metric: 'الإيرادات الشهرية',
      currentValue: revenues[revenues.length - 1],
      predictedValue: revenueTrend.forecastNext30Days,
      timeframe: '30 يوم قادم',
      confidence: revenueTrend.confidence,
      actionItems: [
        revenueTrend.trend === 'DOWN' 
          ? 'تحتاج إلى زيادة جهود التسويق'
          : 'استمر في الاستراتيجية الحالية',
        'راقب تكاليف التشغيل'
      ]
    });

    // تحليل النقدية
    const cashFlows = financials.map(f => f.cashFlow);
    const avgCashFlow = cashFlows.reduce((a, b) => a + b) / cashFlows.length;
    const lastCashFlow = cashFlows[cashFlows.length - 1];

    insights.push({
      type: 'CASH_FLOW',
      metric: 'تدفق النقد',
      currentValue: lastCashFlow,
      predictedValue: avgCashFlow,
      timeframe: 'متوسط الشهر القادم',
      confidence: 0.7,
      actionItems: [
        lastCashFlow < 0 ? 'تحتاج إلى تحسين تحصيل الديون' : 'الوضع المالي جيد',
        'الاحتفاظ بمخزون نقدي آمن'
      ]
    });

    return insights;
  }

  /**
   * تقسيم العملاء إلى فئات ذكية
   */
  static segmentCustomers(invoices: Invoice[], customers: any[]): CustomerSegmentation[] {
    const segments: CustomerSegmentation[] = [];
    
    const customerStats = new Map<string, any>();

    invoices.forEach(inv => {
      if (!customerStats.has(inv.customerName)) {
        customerStats.set(inv.customerName, {
          totalSpent: 0,
          purchases: 0,
          lastPurchaseDate: new Date(inv.date)
        });
      }
      
      const stat = customerStats.get(inv.customerName)!;
      stat.totalSpent += inv.totalAmount;
      stat.purchases += 1;
      stat.lastPurchaseDate = new Date(inv.date);
    });

    // تقسيم VIP
    segments.push({
      segment: 'VIP - القيمة العالية',
      customers: Array.from(customerStats.entries())
        .filter(([_, stat]) => stat.totalSpent > 50000)
        .map(([name]) => name),
      value: Array.from(customerStats.values())
        .filter(stat => stat.totalSpent > 50000)
        .reduce((sum, stat) => sum + stat.totalSpent, 0),
      avgPurchaseFrequency: 25,
      churnRisk: 0.1,
      recommendations: ['تقديم عروض حصرية', 'مدير حساب مخصص', 'خصومات سنوية']
    });

    // تقسيم العملاء الناشئين
    segments.push({
      segment: 'الناشئين',
      customers: Array.from(customerStats.entries())
        .filter(([_, stat]) => stat.purchases < 5)
        .map(([name]) => name),
      value: Array.from(customerStats.values())
        .filter(stat => stat.purchases < 5)
        .reduce((sum, stat) => sum + stat.totalSpent, 0),
      avgPurchaseFrequency: 1.5,
      churnRisk: 0.6,
      recommendations: ['برنامج تحفيز', 'عروض ترحيبية', 'دعم شخصي']
    });

    return segments;
  }

  /**
   * خطية التراجع - Linear Regression للتنبؤ
   */
  private static linearRegression(data: number[]): number {
    const n = data.length;
    const xValues = Array.from({ length: n }, (_, i) => i + 1);
    
    const xMean = xValues.reduce((a, b) => a + b) / n;
    const yMean = data.reduce((a, b) => a + b) / n;
    
    const numerator = xValues.reduce((sum, x, i) => sum + (x - xMean) * (data[i] - yMean), 0);
    const denominator = xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0);
    
    const slope = numerator / denominator;
    const intercept = yMean - slope * xMean;
    
    return slope * (n + 1) + intercept;
  }

  /**
   * توليد تقرير ملخص ذكي
   */
  static generateSummaryReport(
    financials: FinancialSnapshot[],
    invoices: Invoice[],
    products: Product[]
  ): string {
    const insights = this.generateFinancialInsights(financials);
    const anomalies = this.detectAnomalies(invoices);
    
    let report = `
📊 **التقرير الذكي للأداء** - ${new Date().toLocaleDateString('ar-SA')}

🎯 **الملخص التنفيذي:**
- عدد الفواتير: ${invoices.length}
- عدد المنتجات: ${products.length}
- الإيرادات الإجمالية: ${financials.reduce((sum, f) => sum + f.revenue, 0).toLocaleString('ar-SA')} ر.س

📈 **الاتجاهات:**
${insights.map(i => `- ${i.metric}: ${i.currentValue} → ${i.predictedValue} (${i.confidence * 100}% ثقة)`).join('\n')}

⚠️ **التنبيهات:**
${anomalies.slice(0, 5).map(a => `- [${a.severity}] ${a.description}: ${a.suggestedAction}`).join('\n')}

✅ **التوصيات:**
${insights.flatMap(i => i.actionItems).slice(0, 5).map(action => `- ${action}`).join('\n')}
    `;
    
    return report;
  }
}
