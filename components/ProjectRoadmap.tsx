import React from 'react';
import { CheckCircle2, Circle, Clock, Calendar } from 'lucide-react';
import { useLanguage } from '../i18n';

const ProjectRoadmap: React.FC = () => {
  const { t, language } = useLanguage();

  const stepsEn = [
    {
      phase: t('phase1'),
      timeline: "Months 1-3",
      status: "completed",
      items: [
        "Setup Django Rest Framework & PostgreSQL Schema",
        "React PWA Shell Implementation",
        "ZATCA (KSA) E-Invoicing Basic Integration",
        "ETA (Egypt) Integration Middleware"
      ]
    },
    {
      phase: t('phase2'),
      timeline: "Months 4-6",
      status: "active",
      items: [
        "Inventory & Warehousing Module",
        "Gemini AI Integration (Inventory Predictor)",
        "POS (Point of Sale) with Offline Mode",
        "Basic Financial Reports (GL, P&L)"
      ]
    },
    {
      phase: t('phase3'),
      timeline: "Months 7-9",
      status: "pending",
      items: [
        "WhatsApp Business API Full Integration",
        "Smart Financial Assistant (Background Worker)",
        "OCR Service for Purchase Invoices",
        "Multi-Branch & Franchise Support"
      ]
    },
    {
      phase: t('phase4'),
      timeline: "Months 10-12",
      status: "pending",
      items: [
        "Dedicated Native Mobile Apps (React Native)",
        "Advanced AI Forecasting (Multi-variable)",
        "Marketplace Integration (Salla, Zid)",
        "Enterprise Role-Based Access Control (RBAC)"
      ]
    }
  ];

  const stepsAr = [
    {
      phase: t('phase1'),
      timeline: "الأشهر 1-3",
      status: "completed",
      items: [
        "إعداد إطار عمل Django Rest وقاعدة بيانات PostgreSQL",
        "تنفيذ واجهة تطبيق الويب التقدمي (React PWA)",
        "تكامل الفوترة الإلكترونية الأساسي (زاتكا - السعودية)",
        "برمجيات الوسيط للتكامل مع الضرائب المصرية (ETA)"
      ]
    },
    {
      phase: t('phase2'),
      timeline: "الأشهر 4-6",
      status: "active",
      items: [
        "وحدة المخزون والمستودعات",
        "تكامل ذكاء Gemini الاصطناعي (التنبؤ بالمخزون)",
        "نقاط البيع (POS) مع وضع عدم الاتصال",
        "التقارير المالية الأساسية (الأستاذ العام، الأرباح والخسائر)"
      ]
    },
    {
      phase: t('phase3'),
      timeline: "الأشهر 7-9",
      status: "pending",
      items: [
        "تكامل واجهة برمجة تطبيقات واتساب للأعمال",
        "المساعد المالي الذكي (خدمة خلفية)",
        "خدمة OCR لفواتير المشتريات",
        "دعم الفروع المتعددة والامتياز التجاري"
      ]
    },
    {
      phase: t('phase4'),
      timeline: "الأشهر 10-12",
      status: "pending",
      items: [
        "تطبيقات جوال أصلية مخصصة (React Native)",
        "تنبؤ متقدم بالذكاء الاصطناعي (متعدد المتغيرات)",
        "تكامل الأسواق الإلكترونية (سلة، زد)",
        "نظام التحكم في الوصول القائم على الأدوار للمؤسسات (RBAC)"
      ]
    }
  ];

  const steps = language === 'ar' ? stepsAr : stepsEn;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('roadmap_title')}</h1>
        <p className="text-gray-500 mt-2">{t('roadmap_desc')}</p>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute start-8 top-0 bottom-0 w-0.5 bg-gray-200 md:start-1/2"></div>

        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={index} className={`relative flex items-center md:justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Icon Marker */}
              <div className="absolute start-8 -translate-x-1/2 md:start-1/2 w-8 h-8 rounded-full bg-white border-4 border-primary-100 flex items-center justify-center z-10">
                {step.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 fill-green-50" />
                ) : step.status === 'active' ? (
                  <Clock className="w-5 h-5 text-amber-600 fill-amber-50" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
              </div>

              {/* Empty Spacer for Layout */}
              <div className="hidden md:block w-5/12"></div>

              {/* Content Card */}
              <div className="ms-16 md:ms-0 w-full md:w-5/12">
                <div className={`
                  p-6 rounded-xl border shadow-sm transition-all hover:shadow-md
                  ${step.status === 'active' ? 'bg-white border-amber-200 ring-4 ring-amber-50' : 'bg-white border-gray-200'}
                `}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`
                      text-xs font-bold uppercase tracking-wider px-2 py-1 rounded
                      ${step.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        step.status === 'active' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}
                    `}>
                      {step.status}
                    </span>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 me-1" />
                      {step.timeline}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{step.phase}</h3>
                  
                  <ul className="space-y-2">
                    {step.items.map((item, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 me-2 flex-shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectRoadmap;