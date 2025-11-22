
import React, { createContext, useState, useContext, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

export const translations: any = {
  en: {
    app_name: 'Zimam',
    dashboard: 'Dashboard',
    inventory: 'AI Inventory',
    pos: 'Point of Sale',
    invoices: 'Invoices (ZATCA)',
    purchases: 'Purchases',
    customers: 'Customers',
    suppliers: 'Suppliers',
    accounting: 'Accounting',
    whatsapp: 'WhatsApp OCR',
    roadmap: 'Roadmap',
    settings: 'Settings',
    
    // Developer Info
    dev_by: 'Developed by',
    dev_name: 'Mohamed Said',
    contact_us: 'Contact Support',

    // Auth
    login_title: 'Sign in to Zimam',
    login_subtitle: 'Take control of your business',
    register_title: 'Create Account',
    register_subtitle: 'Start your journey with Zimam',
    full_name: 'Full Name',
    email_address: 'Email Address',
    password: 'Password',
    login_btn: 'Sign in',
    register_btn: 'Create Account',
    toggle_register: "Don't have an account? Sign up",
    toggle_login: 'Already have an account? Sign in',
    auth_footer: 'Protected by enterprise-grade security',

    // AI Assistant
    ai_assistant_menu: 'AI Assistant',
    ai_assistant_title: 'Zimam AI',
    ai_assistant_desc: 'Your intelligent business copilot.',
    chat_welcome: 'Hello! I am Zimam AI. How can I help you control your business today?',
    chat_placeholder: 'Ask about inventory, sales, or accounting...',
    new_chat: 'New Chat',
    chat_error: 'Sorry, I encountered an error. Please try again.',
    mode_general: 'General AI',
    mode_data: 'Chat with Data',
    mode_data_desc: 'Connects to DB (SQL)',

    // Common
    currency_sar: 'SAR',
    unknown: 'Unknown',
    date: 'Date',
    status: 'Status',
    amount: 'Amount',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    balance: 'Balance',
    actions: 'Actions',

    // Dashboard
    fin_overview: 'Financial Overview',
    welcome_msg: "Welcome to Zimam. Here's your command center.",
    refresh_ai: 'Refresh AI Insights',
    analyzing: 'Analyzing...',
    smart_assistant: 'Smart Assistant',
    no_insights: 'No insights generated yet.',
    rev_vs_exp: 'Revenue vs Expenses',
    cash_flow: 'Cash Flow Trend',
    action: 'Action',
    chart_revenue: 'Revenue',
    chart_expenses: 'Expenses',
    market_pulse: 'Market Pulse',
    live_search: 'Powered by Google Search',
    sources: 'Sources',
    no_news: 'Unable to fetch news.',
    sim_lab: 'Financial Simulator',
    sim_desc: 'What-If Scenarios',
    run_sim: 'Run Simulation',
    sim_placeholder: 'e.g. What if sales drop 20%?',
    sim_result: 'Simulation Result',
    impact_rev: 'Revenue Impact',
    impact_prof: 'Profit Impact',

    // Inventory
    inventory_mgmt: 'Inventory Control',
    inventory_desc: 'Track stock and leverage AI with Real-time Market Search.',
    run_ai: 'Run AI Predictor',
    run_ai_live: 'Live Prediction',
    analyzing_web: 'Scanning Market...',
    ai_complete: 'Analysis Complete',
    ai_desc: "Market trends analyzed. See 'AI Suggestion' column.",
    col_product: 'Product',
    col_category: 'Category',
    col_stock: 'Stock',
    col_reorder: 'Reorder',
    col_ai: 'AI Suggestion',
    col_value: 'Value',
    run_predictor: 'Run predictor...',
    adjust_stock: 'Adjust',
    new_stock: 'New Qty',
    reason: 'Reason',
    confirm_adjust: 'Confirm',
    reason_damage: 'Damage',
    reason_theft: 'Theft/Loss',
    reason_correction: 'Correction',
    cancel_adj: 'Cancel',
    visual_audit: 'Visual Audit',
    upload_shelf: 'Upload Shelf Photo',
    market_check: 'Check Price',
    market_check_res: 'Market Analysis',
    apply_count: 'Apply Count',
    apply_price: 'Apply Price',

    // WhatsApp
    wa_automation: 'WhatsApp Automation',
    wa_desc: 'Upload invoice images to auto-draft entries.',
    sim_incoming: '1. Simulate Incoming Media',
    click_upload: 'Click to upload Invoice',
    supports: 'Supports JPG, PNG',
    process_gemini: 'Process with AI',
    extracting: 'Extracting...',
    extracted_data: 'Extracted Data',
    vendor: 'Vendor',
    total: 'Total',
    create_draft: 'Create Draft',
    waiting: 'Waiting...',

    // Invoices
    manage_billing: 'Billing & Compliance (ZATCA/ETA).',
    new_invoice: '+ New Invoice',
    col_id: 'Invoice #',
    col_client: 'Client',
    col_amount: 'Amount',
    col_status: 'Status',
    col_compliance: 'Compliance',
    col_actions: 'Actions',
    status_paid: 'PAID',
    status_pending: 'PENDING',
    status_refunded: 'REFUNDED',
    create_invoice_title: 'New Tax Invoice',
    cancel: 'Cancel',
    create: 'Create & Sign',
    sim_signing: 'Signing...',
    lbl_uuid: 'UUID',
    lbl_hash: 'Hash',
    refund: 'Refund',

    // Roadmap
    roadmap_title: 'Product Roadmap',
    roadmap_desc: 'Strategic timeline for Zimam ERP.',
    phase1: 'Phase 1: Foundation',
    phase2: 'Phase 2: Operations',
    phase3: "Phase 3: Genius Features",
    phase4: 'Phase 4: Scaling',

    // POS
    pos_title: 'Point of Sale',
    search_products: 'Search...',
    current_order: 'Order',
    clear_cart: 'Clear',
    subtotal: 'Subtotal',
    tax_vat: 'VAT (15%)',
    grand_total: 'Total',
    checkout: 'Checkout',
    empty_cart: 'Empty Cart',
    add_to_cart: 'Add',
    item: 'item',
    receipt_title: 'Tax Invoice',
    print: 'Print',
    close: 'Close',
    new_sale: 'New Sale',

    // Settings
    settings_title: 'Configuration',
    settings_desc: 'Manage company and compliance.',
    tab_general: 'Profile',
    tab_compliance: 'Compliance',
    company_name: 'Company Name',
    tax_id: 'Tax Number (TRN)',
    currency: 'Currency',
    save_changes: 'Save',
    zatca_integration: 'ZATCA (KSA)',
    zatca_status: 'Connected',
    eta_integration: 'ETA (Egypt)',
    eta_status: 'Active',
    digital_seal: 'Digital Seal',
    csr_config: 'CSR Config',
    sim_mode: 'Simulation',
    phase_2_ksa: 'Phase 2 - KSA',
    einvoicing_egypt: 'eInvoicing - Egypt',
    
    // Compliance Chat
    comp_assistant: 'Compliance Assistant',
    comp_desc: 'Ask about regulations.',
    ask_comp_placeholder: 'e.g. ZATCA Phase 2 deadlines...',
    searching_web: 'Searching...',

    // Purchases
    purchases_title: 'Purchase Orders',
    purchases_desc: 'Manage supplier orders.',
    new_po: '+ New PO',
    po_id: 'PO #',
    supplier: 'Supplier',
    expected_date: 'Expected',
    status_ordered: 'Ordered',
    status_received: 'Received',
    status_received_action: 'Receive',
    negotiate: 'Negotiate',
    negotiation_draft: 'Negotiation Draft',
    copy_email: 'Copy Email',

    // People
    add_customer: '+ Customer',
    add_supplier: '+ Supplier',
    receivable: 'Receivable',
    payable: 'Payable',
    
    // Accounting
    accounting_title: 'General Ledger',
    accounting_desc: 'Financial records.',
    journal_entries: 'Entries',
    entry_id: 'Entry #',
    account: 'Account',
    debit: 'Debit',
    credit: 'Credit',
    description: 'Description',
    total_debit: 'Total Debit',
    total_credit: 'Total Credit',

    // Voice
    listening: 'Listening...',
    speak_now: 'Speak Now',
    voice_cmd: 'Voice Command',

    // Connection
    online: 'Online',
    offline: 'Offline',
    offline_mode: 'Offline Mode Active',
    data_saved: 'Data Saved Locally'
  },
  ar: {
    app_name: 'زِمام',
    dashboard: 'القيادة',
    inventory: 'المخزون الذكي',
    pos: 'نقاط البيع',
    invoices: 'الفواتير (زاتكا)',
    purchases: 'المشتريات',
    customers: 'العملاء',
    suppliers: 'الموردين',
    accounting: 'الحسابات',
    whatsapp: 'واتساب OCR',
    roadmap: 'خارطة الطريق',
    settings: 'الإعدادات',
    
    // Developer Info
    dev_by: 'تطوير',
    dev_name: 'محمد سعيد',
    contact_us: 'تواصل مع المطور',

    // Auth
    login_title: 'تسجيل الدخول لنظام زِمام',
    login_subtitle: 'تحكم في أعمالك بذكاء',
    register_title: 'حساب جديد',
    register_subtitle: 'ابدأ رحلتك مع زِمام',
    full_name: 'الاسم الكامل',
    email_address: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    login_btn: 'دخول',
    register_btn: 'إنشاء حساب',
    toggle_register: 'ليس لديك حساب؟ سجل الآن',
    toggle_login: 'لديك حساب بالفعل؟ دخول',
    auth_footer: 'جميع الحقوق محفوظة - محمد سعيد',

    // AI Assistant
    ai_assistant_menu: 'المساعد الذكي',
    ai_assistant_title: 'زِمام AI',
    ai_assistant_desc: 'مستشارك الذكي للأعمال.',
    chat_welcome: 'أهلاً! أنا زِمام AI. كيف يمكنني مساعدتك في السيطرة على أعمالك اليوم؟',
    chat_placeholder: 'اسأل عن أي شيء...',
    new_chat: 'محادثة جديدة',
    chat_error: 'عذراً، حدث خطأ.',
    mode_general: 'ذكاء عام',
    mode_data: 'بياناتي (SQL)',
    mode_data_desc: 'متصل بقاعدة البيانات',

    // Common
    currency_sar: 'ر.س',
    unknown: 'غير معروف',
    date: 'التاريخ',
    status: 'الحالة',
    amount: 'المبلغ',
    name: 'الاسم',
    phone: 'الهاتف',
    email: 'البريد',
    balance: 'الرصيد',
    actions: 'إجراءات',

    // Dashboard
    fin_overview: 'نظرة عامة',
    welcome_msg: 'أهلاً بك في غرفة القيادة.',
    refresh_ai: 'تحديث الذكاء',
    analyzing: 'جاري التحليل...',
    smart_assistant: 'المساعد المالي',
    no_insights: 'لا توجد بيانات بعد.',
    rev_vs_exp: 'الإيرادات والمصروفات',
    cash_flow: 'التدفق النقدي',
    action: 'إجراء',
    chart_revenue: 'إيراد',
    chart_expenses: 'مصروف',
    market_pulse: 'نبض السوق',
    live_search: 'بحث حي من Google',
    sources: 'المصادر',
    no_news: 'لا توجد أخبار.',
    sim_lab: 'مختبر المحاكاة',
    sim_desc: 'سيناريوهات ماذا لو',
    run_sim: 'تشغيل المحاكاة',
    sim_placeholder: 'مثال: لو الدولار زاد 10%؟',
    sim_result: 'نتيجة المحاكاة',
    impact_rev: 'تأثير الإيراد',
    impact_prof: 'تأثير الربح',

    // Inventory
    inventory_mgmt: 'التحكم بالمخزون',
    inventory_desc: 'تتبع ذكي للمخزون مع ربط بالسوق.',
    run_ai: 'تنبؤ ذكي',
    run_ai_live: 'فحص السوق',
    analyzing_web: 'جاري المسح...',
    ai_complete: 'تم التحليل',
    ai_desc: 'تم تحليل السوق والعطلات. راجع الاقتراحات.',
    col_product: 'المنتج',
    col_category: 'الفئة',
    col_stock: 'المخزون',
    col_reorder: 'حد الطلب',
    col_ai: 'اقتراح AI',
    col_value: 'القيمة',
    run_predictor: 'تشغيل...',
    adjust_stock: 'تسوية',
    new_stock: 'كمية',
    reason: 'سبب',
    confirm_adjust: 'تأكيد',
    reason_damage: 'تالف',
    reason_theft: 'عجز/فقد',
    reason_correction: 'جرد',
    cancel_adj: 'إلغاء',
    visual_audit: 'جرد بصري',
    upload_shelf: 'صور الرف',
    market_check: 'فحص السعر',
    market_check_res: 'تحليل السوق',
    apply_count: 'تحديث المخزون',
    apply_price: 'تحديث السعر',

    // WhatsApp
    wa_automation: 'أتمتة واتساب',
    wa_desc: 'تحويل صور الفواتير لقيود شراء.',
    sim_incoming: '1. محاكاة وارد',
    click_upload: 'رفع صورة الفاتورة',
    supports: 'JPG, PNG',
    process_gemini: 'معالجة (AI)',
    extracting: 'استخراج...',
    extracted_data: 'البيانات',
    vendor: 'المورد',
    total: 'الإجمالي',
    create_draft: 'مسودة شراء',
    waiting: 'انتظار...',

    // Invoices
    manage_billing: 'فوترة معتمدة (زاتكا/مصر).',
    new_invoice: '+ فاتورة',
    col_id: 'رقم',
    col_client: 'العميل',
    col_amount: 'المبلغ',
    col_status: 'الحالة',
    col_compliance: 'الامتثال',
    col_actions: 'إجراءات',
    status_paid: 'مدفوع',
    status_pending: 'انتظار',
    status_refunded: 'مرتجع',
    create_invoice_title: 'فاتورة ضريبية',
    cancel: 'إلغاء',
    create: 'إصدار وتوقيع',
    sim_signing: 'تشفير...',
    lbl_uuid: 'UUID',
    lbl_hash: 'Hash',
    refund: 'استرجاع',

    // Roadmap
    roadmap_title: 'خارطة الطريق',
    roadmap_desc: 'مستقبل نظام زِمام.',
    phase1: 'م1: التأسيس',
    phase2: 'م2: العمليات',
    phase3: 'م3: الذكاء',
    phase4: 'م4: التوسع',

    // POS
    pos_title: 'الكاشير (POS)',
    search_products: 'بحث...',
    current_order: 'الطلب',
    clear_cart: 'مسح',
    subtotal: 'فرعي',
    tax_vat: 'ضريبة (15%)',
    grand_total: 'الإجمالي',
    checkout: 'دفع',
    empty_cart: 'فارغة',
    add_to_cart: 'أضف',
    item: 'ع',
    receipt_title: 'فاتورة ضريبية مبسطة',
    print: 'طباعة',
    close: 'إغلاق',
    new_sale: 'عملية جديدة',

    // Settings
    settings_title: 'الإعدادات',
    settings_desc: 'الشركة والربط الحكومي.',
    tab_general: 'الملف',
    tab_compliance: 'الربط',
    company_name: 'المنشأة',
    tax_id: 'الرقم الضريبي',
    currency: 'العملة',
    save_changes: 'حفظ',
    zatca_integration: 'زاتكا (السعودية)',
    zatca_status: 'متصل',
    eta_integration: 'الضرائب (مصر)',
    eta_status: 'نشط',
    digital_seal: 'الختم الرقمي',
    csr_config: 'CSR',
    sim_mode: 'محاكاة',
    phase_2_ksa: 'المرحلة الثانية',
    einvoicing_egypt: 'الفاتورة الإلكترونية',
    
    // Compliance Chat
    comp_assistant: 'مساعد الامتثال',
    comp_desc: 'اسأل عن اللوائح.',
    ask_comp_placeholder: 'مثال: متطلبات المرحلة الثانية...',
    searching_web: 'جاري البحث...',

    // Purchases
    purchases_title: 'أوامر الشراء',
    purchases_desc: 'طلبات الموردين.',
    new_po: '+ طلب شراء',
    po_id: 'رقم',
    supplier: 'المورد',
    expected_date: 'المتوقع',
    status_ordered: 'مطلوب',
    status_received: 'مستلم',
    status_received_action: 'استلام',
    negotiate: 'تفاوض آلي',
    negotiation_draft: 'مسودة التفاوض',
    copy_email: 'نسخ النص',

    // People
    add_customer: '+ عميل',
    add_supplier: '+ مورد',
    receivable: 'لنا',
    payable: 'علينا',
    
    // Accounting
    accounting_title: 'القيود اليومية',
    accounting_desc: 'السجل المالي.',
    journal_entries: 'القيود',
    entry_id: 'قيد #',
    account: 'الحساب',
    debit: 'مدين',
    credit: 'دائن',
    description: 'البيان',
    total_debit: 'مجموع مدين',
    total_credit: 'مجموع دائن',

    // Voice
    listening: 'أستمع إليك...',
    speak_now: 'تحدث الآن',
    voice_cmd: 'أوامر صوتية',

    // Connection
    online: 'متصل بالإنترنت',
    offline: 'وضع عدم الاتصال',
    offline_mode: 'تعمل بدون إنترنت',
    data_saved: 'يتم الحفظ محلياً'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
