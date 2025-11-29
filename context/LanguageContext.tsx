import React, { createContext, useContext, useState, useEffect } from 'react';

// --- 1. إعدادات اللغات (9 لغات) ---
export const LANGUAGES = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl', locale: 'ar-SA' },
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr', locale: 'en-US' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr', locale: 'de-DE' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr', locale: 'fr-FR' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', dir: 'ltr', locale: 'it-IT' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', dir: 'ltr', locale: 'pt-PT' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', dir: 'ltr', locale: 'hi-IN' },
  { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr', locale: 'zh-CN' },
  { code: 'ph', name: 'Pilipino', flag: '🇵🇭', dir: 'ltr', locale: 'fil-PH' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr', locale: 'es-ES' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', dir: 'ltr', locale: 'ru-RU' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', dir: 'ltr', locale: 'ja-JP' },
  { code: 'ko', name: '한국어', flag: '🇰🇷', dir: 'ltr', locale: 'ko-KR' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', dir: 'ltr', locale: 'tr-TR' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷', dir: 'rtl', locale: 'fa-IR' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰', dir: 'rtl', locale: 'ur-PK' },
];

// --- 2. القاموس الكامل (نصوص بمشاعر) ---
const TRANSLATIONS: any = {
  ar: {
    // Login
    login_title: "مرحباً بعودتك 👋",
    login_subtitle: "سجل الدخول للمتابعة إلى لوحة التحكم.",
    email_label: "البريد الإلكتروني",
    password_label: "كلمة المرور",
    forgot_password: "نسيت كلمة المرور؟",
    login_btn: "تسجيل الدخول",
    developed_by: "تم التطوير بواسطة",
    loading_system: "جاري الاتصال بالنظام...",
    
    // Dashboard & AI (نصوص حية)
    dashboard: "لوحة التحكم", pos: "نقاط البيع", purchases: "المشتريات", people: "العملاء", accounting: "الحسابات", settings: "الإعدادات", logout: "خروج",
    ai_header: "مستشار زمام الذكي",
    ai_msg: "صباح الخير يا محمد. تحليلي للسوق يشير لارتفاع الطلب على الإلكترونيات. مخزون الآيفون 15 حرج جداً، أنصحك بالشراء فوراً قبل غلاء الأسعار.",
    
    // Stats
    total_sales: "إجمالي المبيعات", new_customers: "عملاء جدد", stock_alert: "تنبيه المخزون", net_profit: "صافي الربح",
    currency: "ر.س", projected: "المتوقع", active: "نشط", critical: "حرج", excellent: "ممتاز",
    
    // UI
    search: "بحث شامل...", notifications: "الإشعارات", mark_read: "تحديد كمقروء", view_details: "التفاصيل",
    
    // New Sections
    welcome_title: "أهلاً بك في زمام",
    welcome_subtitle: "نظام إدارة الأعمال الذكي المتكامل",
    start_now: "ابدأ الآن",
    subscription_plans: "باقات الاشتراك",
    work_orders: "أوامر العمل",
    marketing: "التسويق الذكي",
    admin_panel: "لوحة المطور",
    help_center: "مركز المساعدة",
    privacy_terms: "الخصوصية والشروط",
    
    // Subscription
    plan_basic: "أساسية", plan_pro: "احترافية", plan_premium: "بريميوم", plan_global: "عالمية",
    subscribe_now: "اشترك الآن", monthly: "شهري", yearly: "سنوي",
    
    // Work Orders
    create_work_order: "إنشاء أمر عمل", order_status: "حالة الطلب", technician: "الفني المسؤول",
    
    // Marketing
    create_campaign: "إنشاء حملة", campaign_roi: "العائد على الاستثمار", target_audience: "الجمهور المستهدف",
    
    // Admin
    manage_users: "إدارة المستخدمين", financial_reports: "التقارير المالية", support_tickets: "تذاكر الدعم",
    
    // Help
    faq: "الأسئلة الشائعة", contact_support: "تواصل مع الدعم", tutorials: "شروحات فيديو",
    
    // Privacy
    privacy_policy: "سياسة الخصوصية", terms_of_service: "شروط الخدمة",
    
    // Computer Vision & AR
    smart_inventory: "الجرد الذكي", ar_marketing: "تسويق بالواقع المعزز",
    scan_product: "مسح المنتج", ar_view: "عرض AR"
  },
  en: {
    login_title: "Welcome Back 👋",
    login_subtitle: "Sign in to continue to your dashboard.",
    email_label: "Email Address",
    password_label: "Password",
    forgot_password: "Forgot Password?",
    login_btn: "Sign In",
    developed_by: "Developed by",
    loading_system: "Connecting to System...",

    dashboard: "Dashboard", pos: "POS", purchases: "Purchases", people: "Customers", accounting: "Accounting", settings: "Settings", logout: "Logout",
    ai_header: "Zimam AI Consultant",
    ai_msg: "Good morning Mohamed. My market analysis indicates high demand for electronics. iPhone 15 stock is critical; I advise restocking immediately.",

    total_sales: "Total Sales", new_customers: "New Customers", stock_alert: "Stock Alert", net_profit: "Net Profit",
    currency: "USD", projected: "Projected", active: "Active", critical: "Critical", excellent: "Excellent",
    
    search: "Global Search...", notifications: "Notifications", mark_read: "Mark Read", view_details: "Details",

    // New Sections
    welcome_title: "Welcome to Zimam",
    welcome_subtitle: "Integrated Smart Business Management System",
    start_now: "Start Now",
    subscription_plans: "Subscription Plans",
    work_orders: "Work Orders",
    marketing: "Smart Marketing",
    admin_panel: "Developer Panel",
    help_center: "Help Center",
    privacy_terms: "Privacy & Terms",

    // Subscription
    plan_basic: "Basic", plan_pro: "Professional", plan_premium: "Premium", plan_global: "Global",
    subscribe_now: "Subscribe Now", monthly: "Monthly", yearly: "Yearly",

    // Work Orders
    create_work_order: "Create Work Order", order_status: "Order Status", technician: "Technician",

    // Marketing
    create_campaign: "Create Campaign", campaign_roi: "ROI", target_audience: "Target Audience",

    // Admin
    manage_users: "Manage Users", financial_reports: "Financial Reports", support_tickets: "Support Tickets",

    // Help
    faq: "FAQ", contact_support: "Contact Support", tutorials: "Video Tutorials",

    // Privacy
    privacy_policy: "Privacy Policy", terms_of_service: "Terms of Service",

    // Computer Vision & AR
    smart_inventory: "Smart Inventory", ar_marketing: "AR Marketing",
    scan_product: "Scan Product", ar_view: "AR View"
  },
  hi: {
    login_title: "वापसी पर स्वागत है 👋",
    login_subtitle: "डैशबोर्ड तक पहुंचने के लिए साइन इन करें।",
    email_label: "ईमेल पता",
    password_label: "पासवर्ड",
    forgot_password: "पासवर्ड भूल गए?",
    login_btn: "साइन इन करें",
    developed_by: "द्वारा विकसित",
    loading_system: "सिस्टम से कनेक्ट हो रहा है...",

    dashboard: "डैशबोर्ड", pos: "बिक्री केंद्र", purchases: "खरीद", people: "ग्राहक", accounting: "लेखांकन", settings: "सेटिंग्स", logout: "लॉग आउट",
    ai_header: "ज़िमाम एआई सलाहकार",
    ai_msg: "नमस्ते मोहम्मद। बाजार विश्लेषण इलेक्ट्रॉनिक्स की उच्च मांग दिखाता है। iPhone 15 का स्टॉक बहुत कम है, मैं तुरंत खरीदने की सलाह देता हूं।",

    total_sales: "कुल बिक्री", new_customers: "नए ग्राहक", stock_alert: "स्टॉक अलर्ट", net_profit: "शुद्ध लाभ",
    currency: "₹", projected: "अनुमानित", active: "सक्रिय", critical: "गंभीर", excellent: "उत्कृष्ट",
    
    search: "खोजें...", notifications: "सूचनाएं", mark_read: "पढ़ा हुआ", view_details: "विवरण",
    
    welcome_title: "ज़िमाम में आपका स्वागत है",
    welcome_subtitle: "एकीकृत स्मार्ट व्यवसाय प्रबंधन प्रणाली",
    start_now: "अभी शुरू करें",
    subscription_plans: "सदस्यता योजनाएं",
    work_orders: "कार्य आदेश",
    marketing: "स्मार्ट मार्केटिंग",
    admin_panel: "डेवलपर पैनल",
    help_center: "सहायता केंद्र",
    privacy_terms: "गोपनीयता और शर्तें",
    
    plan_basic: "बुनियादी", plan_pro: "पेशेवर", plan_premium: "प्रीमियम", plan_global: "वैश्विक",
    subscribe_now: "अभी सदस्यता लें", monthly: "मासिक", yearly: "वार्षिक",
    
    create_work_order: "कार्य आदेश बनाएं", order_status: "आदेश की स्थिति", technician: "तकनीशियन",
    
    create_campaign: "अभियान बनाएं", campaign_roi: "ROI", target_audience: "लक्षित दर्शक",
    
    manage_users: "उपयोगकर्ताओं का प्रबंधन करें", financial_reports: "वित्तीय रिपोर्ट", support_tickets: "समर्थन टिकट",
    
    faq: "सामान्य प्रश्न", contact_support: "समर्थन से संपर्क करें", tutorials: "वीडियो ट्यूटोरियल",
    
    privacy_policy: "गोपनीयता नीति", terms_of_service: "सेवा की शर्तें",
    
    smart_inventory: "स्मार्ट इन्वेंटरी", ar_marketing: "AR मार्केटिंग",
    scan_product: "उत्पाद स्कैन करें", ar_view: "AR दृश्य"
  },
  de: {
    login_title: "Willkommen zurück 👋", login_subtitle: "Bitte melden Sie sich an.", email_label: "E-Mail", password_label: "Passwort", login_btn: "Anmelden",
    ai_header: "Zimam KI-Berater", ai_msg: "Guten Morgen Mohamed. iPhone 15 Bestand ist kritisch. Bitte sofort nachbestellen.",
    dashboard: "Armaturenbrett", total_sales: "Gesamtumsatz", currency: "€", projected: "Prognose",
    welcome_title: "Willkommen bei Zimam", start_now: "Jetzt starten", subscription_plans: "Abonnements", work_orders: "Arbeitsaufträge", marketing: "Marketing", admin_panel: "Admin-Panel", help_center: "Hilfezentrum", privacy_terms: "Datenschutz & Bedingungen"
  },
  fr: {
    login_title: "Bon retour 👋", login_subtitle: "Connectez-vous pour continuer.", email_label: "E-mail", password_label: "Mot de passe", login_btn: "Se connecter",
    ai_header: "Consultant IA Zimam", ai_msg: "Bonjour Mohamed. Le stock d'iPhone 15 est critique. Je vous conseille de réapprovisionner immédiatement.",
    dashboard: "Tableau de bord", total_sales: "Ventes totales", currency: "€", projected: "Projeté",
    welcome_title: "Bienvenue sur Zimam", start_now: "Commencer", subscription_plans: "Abonnements", work_orders: "Ordres de travail", marketing: "Marketing", admin_panel: "Panneau Admin", help_center: "Centre d'aide", privacy_terms: "Confidentialité & Conditions"
  },
  it: {
    login_title: "Bentornato 👋", login_subtitle: "Accedi per continuare.", email_label: "Email", password_label: "Password", login_btn: "Accedi",
    ai_header: "Consulente IA Zimam", ai_msg: "Buongiorno Mohamed. Le scorte di iPhone 15 sono critiche. Consiglio di rifornire subito.",
    dashboard: "Cruscotto", total_sales: "Vendite totali", currency: "€", projected: "Previsto",
    welcome_title: "Benvenuto in Zimam", start_now: "Inizia ora", subscription_plans: "Piani di abbonamento", work_orders: "Ordini di lavoro", marketing: "Marketing", admin_panel: "Pannello Admin", help_center: "Centro assistenza", privacy_terms: "Privacy & Termini"
  },
  pt: {
    login_title: "Bem-vindo de volta 👋", login_subtitle: "Faça login para continuar.", email_label: "Email", password_label: "Senha", login_btn: "Entrar",
    ai_header: "Consultor IA Zimam", ai_msg: "Bom dia Mohamed. O estoque do iPhone 15 é crítico. Aconselho reabastecer imediatamente.",
    dashboard: "Painel", total_sales: "Vendas totais", currency: "R$", projected: "Projetado",
    welcome_title: "Bem-vindo ao Zimam", start_now: "Começar agora", subscription_plans: "Planos de assinatura", work_orders: "Ordens de serviço", marketing: "Marketing", admin_panel: "Painel Admin", help_center: "Central de ajuda", privacy_terms: "Privacidade & Termos"
  },
  zh: {
    login_title: "欢迎回来 👋", login_subtitle: "登录以继续。", email_label: "电子邮件", password_label: "密码", login_btn: "登录",
    ai_header: "Zimam AI 顾问", ai_msg: "早上好穆罕默德。iPhone 15 库存严重不足，建议立即补货。",
    dashboard: "仪表板", total_sales: "总销售额", currency: "¥", projected: "预计",
    welcome_title: "欢迎来到 Zimam", start_now: "立即开始", subscription_plans: "订阅计划", work_orders: "工单", marketing: "营销", admin_panel: "管理面板", help_center: "帮助中心", privacy_terms: "隐私与条款"
  },
  ph: {
    login_title: "Maligayang pagbabalik 👋", login_subtitle: "Mag-sign in upang magpatuloy.", email_label: "Email", password_label: "Password", login_btn: "Mag-sign In",
    ai_header: "Zimam AI Consultant", ai_msg: "Magandang umaga Mohamed. Ang stock ng iPhone 15 ay kritikal na. Ipinapayo ko na mag-restock agad.",
    dashboard: "Dashboard", total_sales: "Kabuuang Benta", currency: "₱", projected: "Inaasahan",
    welcome_title: "Maligayang pagdating sa Zimam", start_now: "Magsimula Ngayon", subscription_plans: "Mga Plano ng Subscription", work_orders: "Mga Order sa Trabaho", marketing: "Marketing", admin_panel: "Admin Panel", help_center: "Sentro ng Tulong", privacy_terms: "Privacy at Mga Tuntunin"
  },
  es: {
    login_title: "Bienvenido de nuevo 👋", login_subtitle: "Inicia sesión para continuar.", email_label: "Correo electrónico", password_label: "Contraseña", login_btn: "Iniciar sesión",
    ai_header: "Asesor IA Zimam", ai_msg: "Buenos días Mohamed. El stock de iPhone 15 es crítico. Aconsejo reponer inmediatamente.",
    dashboard: "Panel", total_sales: "Ventas totales", currency: "€", projected: "Proyectado",
    welcome_title: "Bienvenido a Zimam", start_now: "Empezar ahora", subscription_plans: "Planes de suscripción", work_orders: "Órdenes de trabajo", marketing: "Marketing", admin_panel: "Panel de administración", help_center: "Centro de ayuda", privacy_terms: "Privacidad y Términos"
  },
  ru: {
    login_title: "Добро пожаловать 👋", login_subtitle: "Войдите, чтобы продолжить.", email_label: "Электронная почта", password_label: "Пароль", login_btn: "Войти",
    ai_header: "Консультант ИИ Зимам", ai_msg: "Доброе утро, Мохаммед. Запасы iPhone 15 критические. Советую пополнить немедленно.",
    dashboard: "Панель управления", total_sales: "Общий объем продаж", currency: "₽", projected: "Прогноз",
    welcome_title: "Добро пожаловать в Zimam", start_now: "Начать сейчас", subscription_plans: "Планы подписки", work_orders: "Заказы на работу", marketing: "Маркетинг", admin_panel: "Панель администратора", help_center: "Центр помощи", privacy_terms: "Конфиденциальность и условия"
  },
  ja: {
    login_title: "おかえりなさい 👋", login_subtitle: "続行するにはサインインしてください。", email_label: "メールアドレス", password_label: "パスワード", login_btn: "サインイン",
    ai_header: "ジマムAIコンサルタント", ai_msg: "おはようございます、ムハンマド。iPhone 15の在庫は深刻です。すぐに補充することをお勧めします。",
    dashboard: "ダッシュボード", total_sales: "総売上", currency: "¥", projected: "予測",
    welcome_title: "Zimamへようこそ", start_now: "今すぐ開始", subscription_plans: "サブスクリプションプラン", work_orders: "作業指示書", marketing: "マーケティング", admin_panel: "管理パネル", help_center: "ヘルプセンター", privacy_terms: "プライバシーと利用規約"
  },
  ko: {
    login_title: "환영합니다 👋", login_subtitle: "계속하려면 로그인하세요.", email_label: "이메일", password_label: "비밀번호", login_btn: "로그인",
    ai_header: "지맘 AI 컨설턴트", ai_msg: "좋은 아침입니다, 무하마드. iPhone 15 재고는 위급합니다. 즉시 재입할 것을 권장합니다.",
    dashboard: "대시보드", total_sales: "총 판매", currency: "₩", projected: "예상",
    welcome_title: "Zimam에 오신 것을 환영합니다", start_now: "지금 시작", subscription_plans: "구독 요금제", work_orders: "작업 지시서", marketing: "마케팅", admin_panel: "관리자 패널", help_center: "고객 센터", privacy_terms: "개인정보 보호 및 약관"
  },
  tr: {
    login_title: "Tekrar Hoş Geldiniz 👋", login_subtitle: "Devam etmek için giriş yapın.", email_label: "E-posta", password_label: "Şifre", login_btn: "Giriş Yap",
    ai_header: "Zimam AI Danışmanı", ai_msg: "Günaydın Muhammed. iPhone 15 stoğu kritik. Hemen yeniden stok yapmanızı tavsiye ederim.",
    dashboard: "Panel", total_sales: "Toplam Satış", currency: "₺", projected: "Tahmin",
    welcome_title: "Zimam'a Hoş Geldiniz", start_now: "Şimdi Başla", subscription_plans: "Abonelik Planları", work_orders: "İş Emirleri", marketing: "Pazarlama", admin_panel: "Yönetici Paneli", help_center: "Yardım Merkezi", privacy_terms: "Gizlilik ve Şartlar"
  },
  fa: {
    login_title: "خوش آمدید 👋", login_subtitle: "برای ادامه وارد شوید.", email_label: "ایمیل", password_label: "رمز عبور", login_btn: "ورود",
    ai_header: "مشاور هوش مصنوعی زمام", ai_msg: "صبح بخیر محمد. موجودی آیفون 15 بحرانی است. توصیه می‌کنم فوراً موجودی را تکمیل کنید.",
    dashboard: "داشبورد", total_sales: "مجموع فروش", currency: "تومان", projected: "پیش‌بینی شده",
    welcome_title: "به زمام خوش آمدید", start_now: "شروع کنید", subscription_plans: "طرح‌های اشتراک", work_orders: "سفارشات کار", marketing: "بازاریابی", admin_panel: "پنل مدیریت", help_center: "مرکز کمک", privacy_terms: "حریم خصوصی و شرایط"
  },
  ur: {
    login_title: "خوش آمدید 👋", login_subtitle: "جاری رکھنے کے لیے سائن ان کریں۔", email_label: "ای میل", password_label: "پاس ورڈ", login_btn: "سائن ان کریں",
    ai_header: "زمام AI مشیر", ai_msg: "صبح بخیر محمد۔ آئی فون 15 کا اسٹاک خطرناک ہے۔ میں فوری اسٹاک کرنے کا مشورہ دیتا ہوں۔",
    dashboard: "ڈیش بورڈ", total_sales: "کل فروخت", currency: "روپے", projected: "تخمینی",
    welcome_title: "زمام میں خوش آمدید", start_now: "ابھی شروع کریں", subscription_plans: "سبسکرپشن پلانز", work_orders: "ورک آرڈرز", marketing: "مارکیٹنگ", admin_panel: "ایڈمن پینل", help_center: "ہیلپ سینٹر", privacy_terms: "پرائیویسی اور شرائط"
  }
};

type LanguageCode = string;

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  formatNumber: (num: number) => string;
  dir: 'rtl' | 'ltr';
  activeLangData: typeof LANGUAGES[0];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('ar');

  const activeLangData = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const t = (key: string) => {
    // محاولة جلب الترجمة، إذا لم توجد نعود للإنجليزية، ثم للمفتاح نفسه
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  // دالة تحويل الأرقام (هندية/عربية/لاتينية)
  const formatNumber = (num: number) => {
    try {
      return new Intl.NumberFormat(activeLangData.locale).format(num);
    } catch (error) {
      return num.toString();
    }
  };

  useEffect(() => {
    document.documentElement.dir = activeLangData.dir;
    document.documentElement.lang = language;
  }, [activeLangData, language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatNumber, dir: activeLangData.dir as 'rtl'|'ltr', activeLangData }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};