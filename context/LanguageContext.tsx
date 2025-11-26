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
    search: "بحث شامل...", notifications: "الإشعارات", mark_read: "تحديد كمقروء", view_details: "التفاصيل"
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
    
    search: "Global Search...", notifications: "Notifications", mark_read: "Mark Read", view_details: "Details"
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
    
    search: "खोजें...", notifications: "सूचनाएं", mark_read: "पढ़ा हुआ", view_details: "विवरण"
  },
  de: {
    login_title: "Willkommen zurück 👋", login_subtitle: "Bitte melden Sie sich an.", email_label: "E-Mail", password_label: "Passwort", login_btn: "Anmelden",
    ai_header: "Zimam KI-Berater", ai_msg: "Guten Morgen Mohamed. iPhone 15 Bestand ist kritisch. Bitte sofort nachbestellen.",
    dashboard: "Armaturenbrett", total_sales: "Gesamtumsatz", currency: "€", projected: "Prognose"
  },
  fr: {
    login_title: "Bon retour 👋", login_subtitle: "Connectez-vous pour continuer.", email_label: "E-mail", password_label: "Mot de passe", login_btn: "Se connecter",
    ai_header: "Consultant IA Zimam", ai_msg: "Bonjour Mohamed. Le stock d'iPhone 15 est critique. Je vous conseille de réapprovisionner immédiatement.",
    dashboard: "Tableau de bord", total_sales: "Ventes totales", currency: "€", projected: "Projeté"
  },
  it: {
    login_title: "Bentornato 👋", login_subtitle: "Accedi per continuare.", email_label: "Email", password_label: "Password", login_btn: "Accedi",
    ai_header: "Consulente IA Zimam", ai_msg: "Buongiorno Mohamed. Le scorte di iPhone 15 sono critiche. Consiglio di rifornire subito.",
    dashboard: "Cruscotto", total_sales: "Vendite totali", currency: "€", projected: "Previsto"
  },
  pt: {
    login_title: "Bem-vindo de volta 👋", login_subtitle: "Faça login para continuar.", email_label: "Email", password_label: "Senha", login_btn: "Entrar",
    ai_header: "Consultor IA Zimam", ai_msg: "Bom dia Mohamed. O estoque do iPhone 15 é crítico. Aconselho reabastecer imediatamente.",
    dashboard: "Painel", total_sales: "Vendas totais", currency: "R$", projected: "Projetado"
  },
  zh: {
    login_title: "欢迎回来 👋", login_subtitle: "登录以继续。", email_label: "电子邮件", password_label: "密码", login_btn: "登录",
    ai_header: "Zimam AI 顾问", ai_msg: "早上好穆罕默德。iPhone 15 库存严重不足，建议立即补货。",
    dashboard: "仪表板", total_sales: "总销售额", currency: "¥", projected: "预计"
  },
  ph: {
    login_title: "Maligayang pagbabalik 👋", login_subtitle: "Mag-sign in upang magpatuloy.", email_label: "Email", password_label: "Password", login_btn: "Mag-sign In",
    ai_header: "Zimam AI Consultant", ai_msg: "Magandang umaga Mohamed. Ang stock ng iPhone 15 ay kritikal na. Ipinapayo ko na mag-restock agad.",
    dashboard: "Dashboard", total_sales: "Kabuuang Benta", currency: "₱", projected: "Inaasahan"
  },
  es: {
    login_title: "Bienvenido de nuevo 👋", login_subtitle: "Inicia sesión para continuar.", email_label: "Correo electrónico", password_label: "Contraseña", login_btn: "Iniciar sesión",
    ai_header: "Asesor IA Zimam", ai_msg: "Buenos días Mohamed. El stock de iPhone 15 es crítico. Aconsejo reponer inmediatamente.",
    dashboard: "Panel", total_sales: "Ventas totales", currency: "€", projected: "Proyectado"
  },
  ru: {
    login_title: "Добро пожаловать 👋", login_subtitle: "Войдите, чтобы продолжить.", email_label: "Электронная почта", password_label: "Пароль", login_btn: "Войти",
    ai_header: "Консультант ИИ Зимам", ai_msg: "Доброе утро, Мохаммед. Запасы iPhone 15 критические. Советую пополнить немедленно.",
    dashboard: "Панель управления", total_sales: "Общий объем продаж", currency: "₽", projected: "Прогноз"
  },
  ja: {
    login_title: "おかえりなさい 👋", login_subtitle: "続行するにはサインインしてください。", email_label: "メールアドレス", password_label: "パスワード", login_btn: "サインイン",
    ai_header: "ジマムAIコンサルタント", ai_msg: "おはようございます、ムハンマド。iPhone 15の在庫は深刻です。すぐに補充することをお勧めします。",
    dashboard: "ダッシュボード", total_sales: "総売上", currency: "¥", projected: "予測"
  },
  ko: {
    login_title: "환영합니다 👋", login_subtitle: "계속하려면 로그인하세요.", email_label: "이메일", password_label: "비밀번호", login_btn: "로그인",
    ai_header: "지맘 AI 컨설턴트", ai_msg: "좋은 아침입니다, 무하마드. iPhone 15 재고는 위급합니다. 즉시 재입할 것을 권장합니다.",
    dashboard: "대시보드", total_sales: "총 판매", currency: "₩", projected: "예상"
  },
  tr: {
    login_title: "Tekrar Hoş Geldiniz 👋", login_subtitle: "Devam etmek için giriş yapın.", email_label: "E-posta", password_label: "Şifre", login_btn: "Giriş Yap",
    ai_header: "Zimam AI Danışmanı", ai_msg: "Günaydın Muhammed. iPhone 15 stoğu kritik. Hemen yeniden stok yapmanızı tavsiye ederim.",
    dashboard: "Panel", total_sales: "Toplam Satış", currency: "₺", projected: "Tahmin"
  },
  fa: {
    login_title: "خوش آمدید 👋", login_subtitle: "برای ادامه وارد شوید.", email_label: "ایمیل", password_label: "رمز عبور", login_btn: "ورود",
    ai_header: "مشاور هوش مصنوعی زمام", ai_msg: "صبح بخیر محمد. موجودی آیفون 15 بحرانی است. توصیه می‌کنم فوراً موجودی را تکمیل کنید.",
    dashboard: "داشبورد", total_sales: "مجموع فروش", currency: "تومان", projected: "پیش‌بینی شده"
  },
  ur: {
    login_title: "خوش آمدید 👋", login_subtitle: "جاری رکھنے کے لیے سائن ان کریں۔", email_label: "ای میل", password_label: "پاس ورڈ", login_btn: "سائن ان کریں",
    ai_header: "زمام AI مشیر", ai_msg: "صبح بخیر محمد۔ آئی فون 15 کا اسٹاک خطرناک ہے۔ میں فوری اسٹاک کرنے کا مشورہ دیتا ہوں۔",
    dashboard: "ڈیش بورڈ", total_sales: "کل فروخت", currency: "روپے", projected: "تخمینی"
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