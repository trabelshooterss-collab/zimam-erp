
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Lock, FileText } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  const { t, dir } = useLanguage();

  const sections = [
    {
      icon: <FileText size={24} className="text-blue-500" />,
      title: 'introduction_title',
      content: 'introduction_content',
    },
    {
      icon: <Lock size={24} className="text-blue-500" />,
      title: 'data_collection_title',
      content: 'data_collection_content',
    },
    {
      icon: <Shield size={24} className="text-blue-500" />,
      title: 'data_security_title',
      content: 'data_security_content',
    },
    // Add more sections as needed
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-sans"
      dir={dir}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Shield size={48} className="mx-auto text-blue-600 dark:text-blue-500" />
          <h1 className="mt-4 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            {t('privacy_policy')}
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            {t('privacy_subtitle')}
          </p>
          <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
            {t('last_updated')}: November 29, 2025
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 space-y-10">
          {sections.map((section, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-6">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                {section.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t(section.title)}
                </h2>
                <p className="mt-3 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t(section.content)}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center text-gray-500 dark:text-gray-400">
          <p>{t('contact_us_privacy')}: <a href="mailto:trabelshooterss@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">trabelshooterss@gmail.com</a></p>
        </div>
      </div>
    </motion.div>
  );
};

// Add placeholder translations to your language files
/*
en: {
  ...
  "privacy_policy": "Privacy Policy",
  "privacy_subtitle": "Your trust is important to us. Here's how we protect your data.",
  "last_updated": "Last Updated",
  "introduction_title": "Introduction",
  "introduction_content": "This Privacy Policy explains how Zimam AI ERP ('we', 'us', or 'our') collects, uses, and discloses information about you when you access or use our services. We are committed to protecting your personal information and your right to privacy.",
  "data_collection_title": "Information We Collect",
  "data_collection_content": "We collect information you provide directly to us, such as when you create an account, subscribe to a plan, or contact customer support. This may include your name, email address, payment information, and company details. We also collect technical data automatically, like IP address and device type.",
  "data_security_title": "How We Protect Your Information",
  "data_security_content": "We implement a variety of security measures to maintain the safety of your personal information. Your data is stored on secure servers and protected by encryption and access controls. However, no method of transmission over the Internet is 100% secure.",
  "contact_us_privacy": "If you have any questions about this Privacy Policy, please contact us at",
  ...
},
ar: {
  ...
  "privacy_policy": "سياسة الخصوصية",
  "privacy_subtitle": "ثقتك تهمنا. إليك كيف نحمي بياناتك.",
  "last_updated": "آخر تحديث",
  "introduction_title": "مقدمة",
  "introduction_content": "توضح سياسة الخصوصية هذه كيف يقوم نظام زمام (المشار إليه بـ 'نحن' أو 'شركتنا') بجمع واستخدام والكشف عن معلوماتك عند استخدامك لخدماتنا. نحن ملتزمون بحماية معلوماتك الشخصية وحقك في الخصوصية.",
  "data_collection_title": "المعلومات التي نجمعها",
  "data_collection_content": "نقوم بجمع المعلومات التي تقدمها لنا مباشرة، مثل عند إنشاء حساب أو الاشتراك في باقة أو الاتصال بدعم العملاء. قد يشمل ذلك اسمك وعنوان بريدك الإلكتروني ومعلومات الدفع وتفاصيل شركتك. كما نجمع البيانات الفنية تلقائيًا، مثل عنوان IP ونوع الجهاز.",
  "data_security_title": "كيف نحمي معلوماتك",
  "data_security_content": "نحن نطبق مجموعة متنوعة من الإجراءات الأمنية للحفاظ على سلامة معلوماتك الشخصية. يتم تخزين بياناتك على خوادم آمنة ومحمية بالتشفير وضوابط الوصول. ومع ذلك، لا توجد وسيلة نقل عبر الإنترنت آمنة بنسبة 100٪.",
  "contact_us_privacy": "إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا عبر",
  ...
}
*/

export default PrivacyPage;
