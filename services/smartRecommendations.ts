/**
 * Smart Recommendation Engine - محرك التوصيات الذكية
 * يوفر توصيات مخصصة بناءً على سلوك العملاء والبيانات التاريخية
 */

import { Product, Invoice, Person } from '../types';

export interface Recommendation {
  id: string;
  type: 'PRODUCT' | 'SUPPLIER' | 'PRICING' | 'INVENTORY' | 'CUSTOMER_CARE';
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  impact: {
    revenue?: number;
    savings?: number;
    efficiency?: number;
  };
  actionItems: string[];
  estimatedOutcome: string;
  confidence: number; // 0-1
}

export interface ProductRecommendation extends Recommendation {
  productId: string;
  reason: string;
  suggestedAction: string;
}

export interface CustomerInsight {
  customerId: string;
  customerName: string;
  totalSpent: number;
  purchaseFrequency: number;
  avgOrderValue: number;
  preferredCategories: string[];
  nextBuyPrediction: Date;
  likelyProducts: string[];
  churnScore: number; // 0-1
  loyaltyScore: number; // 0-1
}

export class SmartRecommendationEngine {
  
  /**
   * توصيات المنتجات المسايقة (Cross-selling & Upselling)
   */
  static recommendProductCombos(
    products: Product[],
    invoices: Invoice[]
  ): ProductRecommendation[] {
    const recommendations: ProductRecommendation[] = [];
    
    // تحليل أزواج المنتجات التي تُشترى معاً
    const productPairs = new Map<string, number>();
    
    invoices.forEach(invoice => {
      const productIds = invoice.items.map(item => item.productId);
      for (let i = 0; i < productIds.length; i++) {
        for (let j = i + 1; j < productIds.length; j++) {
          const pair = [productIds[i], productIds[j]].sort().join('-');
          productPairs.set(pair, (productPairs.get(pair) || 0) + 1);
        }
      }
    });

    // تحديد الأزواج الشائعة
    Array.from(productPairs.entries())
      .filter(([_, count]) => count >= 3)
      .forEach(([pair, count]) => {
        const [id1, id2] = pair.split('-');
        const product1 = products.find(p => p.id === id1);
        const product2 = products.find(p => p.id === id2);

        if (product1 && product2) {
          const upturnedRevenue = (product1.sellingPrice + product2.sellingPrice) * 0.1 * count;
          
          recommendations.push({
            id: `combo-${id1}-${id2}`,
            type: 'PRODUCT',
            title: `عرض المجموعة: ${product1.name} + ${product2.name}`,
            description: `هذان المنتجان يُشتريان معاً بشكل متكرر (${count} مرات)`,
            priority: count >= 5 ? 'HIGH' : 'MEDIUM',
            productId: id1,
            reason: `تم شراء ${product2.name} مع هذا المنتج ${count} مرات`,
            suggestedAction: `قدّم خصم 5-10% عند شراء كليهما معاً`,
            impact: {
              revenue: upturnedRevenue
            },
            actionItems: [
              `إنشاء عرض مجموعة خاص`,
              `تحديث صفحة المنتج`,
              `إرسال إشعار للعملاء`
            ],
            estimatedOutcome: `زيادة المبيعات بـ ${Math.round(upturnedRevenue)} ر.س`,
            confidence: Math.min(0.95, count / 10)
          });
        }
      });

    return recommendations;
  }

  /**
   * توصيات إعادة الطلب الذكية
   */
  static recommendRestocking(
    products: Product[],
    invoices: Invoice[]
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    products.forEach(product => {
      // حساب معدل البيع
      const productInvoices = invoices.filter(inv => 
        inv.items.some(item => item.productId === product.id)
      );
      
      const totalSold = productInvoices.reduce((sum, inv) => 
        sum + (inv.items.find(item => item.productId === product.id)?.quantity || 0), 0
      );

      const daysInDataset = 90; // افترض 90 يوم من البيانات
      const dailySalesRate = totalSold / daysInDataset;
      const daysUntilStockout = product.currentStock / dailySalesRate;

      // إذا كان المخزون سينتهي في أقل من 14 يوم
      if (daysUntilStockout < 14) {
        const recommendedQuantity = Math.ceil(dailySalesRate * 30); // 30 يوم
        const costToReorder = recommendedQuantity * product.costPrice;
        const potentialLostSales = Math.max(0, dailySalesRate * (14 - daysUntilStockout)) * product.sellingPrice;

        recommendations.push({
          id: `restock-${product.id}`,
          type: 'INVENTORY',
          title: `⏰ أعد طلب ${product.name} فوراً`,
          description: `المخزون سينتهي في ${Math.round(daysUntilStockout)} يوم`,
          priority: daysUntilStockout < 3 ? 'CRITICAL' : daysUntilStockout < 7 ? 'HIGH' : 'MEDIUM',
          impact: {
            revenue: potentialLostSales,
            savings: 0
          },
          actionItems: [
            `اطلب ${recommendedQuantity} وحدة`,
            `تابع مع الموردين الموثوقين`,
            `ضع تنبيهات على المتجر إذا لزم الأمر`
          ],
          estimatedOutcome: `تجنب خسارة ${Math.round(potentialLostSales)} ر.س من المبيعات`,
          confidence: Math.min(0.98, totalSold > 0 ? 0.9 : 0.5)
        });
      }
    });

    return recommendations;
  }

  /**
   * توصيات تحسين الأسعار
   */
  static recommendPricing(
    products: Product[],
    invoices: Invoice[]
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    const costMargins = products.map(p => ({
      ...p,
      margin: ((p.sellingPrice - p.costPrice) / p.costPrice) * 100,
      volume: invoices.reduce((sum, inv) => 
        sum + (inv.items.find(item => item.productId === p.id)?.quantity || 0), 0
      )
    }));

    // المنتجات ذات الهامش المنخفض
    costMargins.filter(p => p.margin < 20 && p.volume > 10).forEach(product => {
      const suggestedPrice = Math.round(product.costPrice * 1.35);
      const priceIncrease = suggestedPrice - product.sellingPrice;
      const estimatedRevenueGain = priceIncrease * product.volume * 0.9; // 90% من الحجم الحالي

      recommendations.push({
        id: `pricing-${product.id}`,
        type: 'PRICING',
        title: `📈 زيادة سعر ${product.name}`,
        description: `الهامش الحالي منخفض (${product.margin.toFixed(1)}%)`,
        priority: product.volume > 50 ? 'HIGH' : 'MEDIUM',
        impact: {
          revenue: estimatedRevenueGain
        },
        actionItems: [
          `ارفع السعر من ${product.sellingPrice} إلى ${suggestedPrice}`,
          `راقب تأثر حجم المبيعات`,
          `قدّم حسومات للعملاء المخلصين`
        ],
        estimatedOutcome: `زيادة الهامش إلى 35% وإيرادات إضافية: ${Math.round(estimatedRevenueGain)} ر.س`,
        confidence: 0.75
      });
    });

    return recommendations;
  }

  /**
   * تحليل العملاء بعمق
   */
  static analyzeCustomerInsights(
    customers: Person[],
    invoices: Invoice[]
  ): CustomerInsight[] {
    return customers.map(customer => {
      const customerInvoices = invoices.filter(inv => inv.customerName === customer.name);
      
      const totalSpent = customerInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
      const purchaseFrequency = customerInvoices.length;
      const avgOrderValue = purchaseFrequency > 0 ? totalSpent / purchaseFrequency : 0;
      
      // استخراج الفئات المفضلة
      const categories = new Map<string, number>();
      customerInvoices.forEach(inv => {
        inv.items.forEach(item => {
          // محاولة استخراج الفئة من اسم المنتج (بسيط)
          const category = item.productName.includes('آيفون') || item.productName.includes('سامسونج') 
            ? 'هواتف' 
            : 'أجهزة';
          categories.set(category, (categories.get(category) || 0) + 1);
        });
      });

      const preferredCategories = Array.from(categories.entries())
        .sort(([_, a], [__, b]) => b - a)
        .map(([cat]) => cat)
        .slice(0, 3);

      // حساب احتمالية الشراء التالي
      let nextBuyPrediction = new Date();
      if (purchaseFrequency > 1) {
        const dates = customerInvoices.map(inv => new Date(inv.date).getTime());
        const intervals = [];
        for (let i = 1; i < dates.length; i++) {
          intervals.push(dates[i] - dates[i - 1]);
        }
        const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
        nextBuyPrediction = new Date(Date.now() + avgInterval);
      }

      // حساب احتمال التوقف (Churn)
      const daysSinceLastPurchase = customerInvoices.length > 0
        ? (Date.now() - new Date(customerInvoices[customerInvoices.length - 1].date).getTime()) / (1000 * 60 * 60 * 24)
        : 1000;
      const avgDaysBetweenPurchases = purchaseFrequency > 1
        ? (Date.now() - new Date(customerInvoices[0].date).getTime()) / (1000 * 60 * 60 * 24) / purchaseFrequency
        : 30;
      
      const churnScore = Math.min(1, daysSinceLastPurchase / (avgDaysBetweenPurchases * 3));
      const loyaltyScore = Math.max(0, 1 - churnScore) * Math.min(1, purchaseFrequency / 10);

      return {
        customerId: customer.id,
        customerName: customer.name,
        totalSpent,
        purchaseFrequency,
        avgOrderValue,
        preferredCategories,
        nextBuyPrediction,
        likelyProducts: preferredCategories.map(cat => `منتج من فئة ${cat}`),
        churnScore,
        loyaltyScore
      };
    });
  }

  /**
   * توليد توصيات العناية بالعملاء
   */
  static recommendCustomerCare(
    insights: CustomerInsight[]
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // العملاء المعرضون للخسارة
    insights.filter(i => i.churnScore > 0.6).forEach(customer => {
      recommendations.push({
        id: `care-${customer.customerId}`,
        type: 'CUSTOMER_CARE',
        title: `🚨 استرجع ${customer.customerName}`,
        description: `يبدو أنه لم يشتري منذ فترة طويلة`,
        priority: 'HIGH',
        impact: {
          revenue: customer.totalSpent * 0.2
        },
        actionItems: [
          `أرسل عرض خاص حصري`,
          `تواصل شخصياً`,
          `استطلع سبب عدم الشراء`
        ],
        estimatedOutcome: `احتمال استرجاع 40% من العملاء المفقودين`,
        confidence: Math.min(0.9, customer.purchaseFrequency / 5)
      });
    });

    // العملاء المخلصين
    insights.filter(i => i.loyaltyScore > 0.8).forEach(customer => {
      recommendations.push({
        id: `loyalty-${customer.customerId}`,
        type: 'CUSTOMER_CARE',
        title: `⭐ مكافئ ${customer.customerName}`,
        description: `عميل مخلص بقيمة عالية`,
        priority: 'HIGH',
        impact: {
          revenue: customer.totalSpent * 0.15
        },
        actionItems: [
          `برنامج VIP خاص`,
          `هدية تقدير`,
          `خصومات حصرية`
        ],
        estimatedOutcome: `زيادة قيمة العميل بنسبة 30%`,
        confidence: 0.95
      });
    });

    return recommendations;
  }

  /**
   * توليد تقرير التوصيات الشامل
   */
  static generateRecommendationReport(
    products: Product[],
    invoices: Invoice[],
    customers: Person[]
  ): Recommendation[] {
    const allRecommendations: Recommendation[] = [];

    // جمع جميع الأنواع
    allRecommendations.push(
      ...this.recommendProductCombos(products, invoices),
      ...this.recommendRestocking(products, invoices),
      ...this.recommendPricing(products, invoices)
    );

    const insights = this.analyzeCustomerInsights(customers, invoices);
    allRecommendations.push(
      ...this.recommendCustomerCare(insights)
    );

    // ترتيب حسب الأولوية والتأثير
    return allRecommendations.sort((a, b) => {
      const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      const priorityDiff = priorityOrder[b.priority as keyof typeof priorityOrder] - 
                          priorityOrder[a.priority as keyof typeof priorityOrder];
      if (priorityDiff !== 0) return priorityDiff;
      
      const impactA = (a.impact.revenue || 0) + (a.impact.savings || 0);
      const impactB = (b.impact.revenue || 0) + (b.impact.savings || 0);
      return impactB - impactA;
    });
  }
}
