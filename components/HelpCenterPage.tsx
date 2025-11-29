
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { HelpCircle, BookOpen, Video, Send, ChevronDown, Search } from 'lucide-react';

const HelpCenterPage: React.FC = () => {
  const { t, dir } = useLanguage();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'faq_q1',
      a: 'faq_a1',
    },
    {
      q: 'faq_q2',
      a: 'faq_a2',
    },
    {
      q: 'faq_q3',
      a: 'faq_a3',
    },
    {
        q: 'faq_q4',
        a: 'faq_a4',
    },
  ];

  const resources = [
    {
      icon: <BookOpen size={24} className="text-indigo-500" />,
      title: 'resource_title1',
      description: 'resource_desc1',
      link: '#',
    },
    {
      icon: <Video size={24} className="text-rose-500" />,
      title: 'resource_title2',
      description: 'resource_desc2',
      link: '#',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-sans"
      dir={dir}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header and Search */}
        <div className="relative text-center mb-16 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg">
          <HelpCircle size={48} className="mx-auto text-indigo-600 dark:text-indigo-400" />
          <h1 className="mt-4 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            {t('help_center_title')}
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {t('help_center_subtitle')}
          </p>
          <div className="mt-8 max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input 
                type="search" 
                placeholder={t('search_help_placeholder')}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('faq_title')}</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full flex justify-between items-center p-6 text-left"
                  >
                    <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">{t(faq.q)}</span>
                    <ChevronDown
                      className={`transform transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open: { opacity: 1, height: 'auto', y: 0 },
                          collapsed: { opacity: 0, height: 0, y: -10 },
                        }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6 text-gray-600 dark:text-gray-300"
                      >
                        {t(faq.a)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Resources and Contact Section */}
          <div className="space-y-8">
             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('other_resources')}</h2>
             {resources.map((res, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">{res.icon}</div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{t(res.title)}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t(res.description)}</p>
                        <a href={res.link} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-2 inline-block">{t('learn_more')} &rarr;</a>
                    </div>
                </div>
             ))}

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100 mb-4">{t('contact_support_title')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('contact_support_desc')}</p>
              <button className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700">
                <Send size={18} /> {t('contact_support_btn')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Add placeholder translations to your language files
/*
en: {
  "help_center_title": "Help Center",
  "help_center_subtitle": "Get answers to your questions and find resources to help you get the most out of Zimam AI.",
  "search_help_placeholder": "Search for topics...",
  "faq_title": "Frequently Asked Questions",
  "faq_q1": "How do I add a new product to my inventory?",
  "faq_a1": "Navigate to the 'Inventory' section from the main menu, then click the 'Add New Product' button. Fill in the product details such as name, SKU, price, and quantity, then click 'Save'.",
  "faq_q2": "Can I integrate my own payment gateway?",
  "faq_a2": "Our Premium and Global plans offer API access that allows for custom integrations, including payment gateways. Please refer to our API documentation for more details.",
  "faq_q3": "How does the AI Assistant work?",
  "faq_a3": "The AI Assistant analyzes your sales, inventory, and financial data to provide actionable insights. It can suggest marketing campaigns, predict stock shortages, and generate financial reports automatically.",
  "faq_q4": "How can I change my subscription plan?",
  "faq_a4": "Go to 'Settings' > 'Subscription'. From there, you can see your current plan and choose to upgrade, downgrade, or switch your billing cycle.",
  "other_resources": "Other Resources",
  "resource_title1": "User Guides",
  "resource_desc1": "In-depth documentation for every feature.",
  "resource_title2": "Video Tutorials",
  "resource_desc2": "Watch step-by-step guides on our platform.",
  "learn_more": "Learn more",
  "contact_support_title": "Can't find an answer?",
  "contact_support_desc": "Our support team is here to help you with any questions.",
  "contact_support_btn": "Contact Support"
},
ar: {
  "help_center_title": "مركز المساعدة",
  "help_center_subtitle": "احصل على إجابات لأسئلتك واعثر على موارد لمساعدتك في تحقيق أقصى استفادة من نظام زمام.",
  "search_help_placeholder": "ابحث عن مواضيع...",
  "faq_title": "الأسئلة الشائعة",
  "faq_q1": "كيف أضيف منتجًا جديدًا إلى مخزوني؟",
  "faq_a1": "انتقل إلى قسم 'المخزون' من القائمة الرئيسية، ثم انقر على زر 'إضافة منتج جديد'. املأ تفاصيل المنتج مثل الاسم والرمز والسعر والكمية، ثم انقر على 'حفظ'.",
  "faq_q2": "هل يمكنني ربط بوابة الدفع الخاصة بي؟",
  "faq_a2": "تقدم باقاتنا 'بريميوم' و'عالمية' وصولاً إلى API الذي يسمح بالتكاملات المخصصة، بما في ذلك بوابات الدفع. يرجى الرجوع إلى وثائق API الخاصة بنا لمزيد من التفاصيل.",
  "faq_q3": "كيف يعمل المساعد الذكي؟",
  "faq_a3": "يحلل المساعد الذكي بيانات المبيعات والمخزون والبيانات المالية لتقديم رؤى قابلة للتنفيذ. يمكنه اقتراح حملات تسويقية، والتنبؤ بنقص المخزون، وإنشاء تقارير مالية تلقائيًا.",
  "faq_q4": "كيف يمكنني تغيير خطة اشتراكي؟",
  "faq_a4": "اذهب إلى 'الإعدادات' > 'الاشتراك'. من هناك، يمكنك رؤية خطتك الحالية واختيار الترقية أو التخفيض أو تغيير دورة الفوترة الخاصة بك.",
  "other_resources": "مصادر أخرى",
  "resource_title1": "أدلة المستخدم",
  "resource_desc1": "وثائق متعمقة لكل ميزة.",
  "resource_title2": "شروحات الفيديو",
  "resource_desc2": "شاهد أدلة خطوة بخطوة على منصتنا.",
  "learn_more": "اعرف المزيد",
  "contact_support_title": "لم تجد إجابة؟",
  "contact_support_desc": "فريق الدعم لدينا هنا لمساعدتك في أي أسئلة.",
  "contact_support_btn": "تواصل مع الدعم"
}
*/

export default HelpCenterPage;
