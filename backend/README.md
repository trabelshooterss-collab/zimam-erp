
# Zimam ERP Backend

هذا هو الخلفية (Backend) لنظام Zimam ERP المبني باستخدام Django REST Framework.

## الميزات الرئيسية

- نظام متعدد المستأجرين (Multi-tenant)
- نظام مصادقة قوي مع JWT والمصادقة الثنائية
- نظام إدارة مخزون متقدم مع التنبؤ بالذكاء الاصطناعي
- نظام مبيعات متكامل مع الامتثال لمتطلبات ZATCA وETA
- نظام محاسبة شامل مع التقارير المالية
- نظام مشتريات متكامل
- نظام إدارة علاقات العملاء والموردين

## المتطلبات

- Python 3.9+
- Django 4.2+
- PostgreSQL 12+
- Redis 6+
- Celery

## التثبيت

1. إنشاء بيئة افتراضية:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scriptsctivate
```

2. تثبيت الاعتماديات:
```bash
pip install -r requirements.txt
```

3. إعداد متغيرات البيئة:
```bash
cp .env.example .env
# تعديل متغيرات البيئة في ملف .env
```

4. تهيئة قاعدة البيانات:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. إنشاء مستخدم مدير:
```bash
python manage.py createsuperuser
```

6. تشغيل الخادم:
```bash
python manage.py runserver
```

7. تشغيل Celery (في نافذة منفصلة):
```bash
celery -A zimam worker -l info
```

## هيكل المشروع

```
backend/
├── zimam/                # إعدادات المشروع الرئيسية
│   ├── __init__.py
│   ├── settings.py         # إعدادات Django
│   ├── urls.py           # مسارات المشروع الرئيسية
│   ├── wsgi.py           # WSGI configuration
│   └── celery.py         # إعدادات Celery
├── apps/                 # تطبيقات المشروع
│   ├── authentication/    # نظام المصادقة
│   ├── users/            # نظام المستخدمين
│   ├── companies/        # نظام الشركات
│   ├── inventory/        # نظام المخزون
│   ├── sales/            # نظام المبيعات
│   ├── accounting/        # نظام المحاسبة
│   └── purchases/        # نظام المشتريات
├── templates/             # قوالب HTML
├── static/               # ملفات ثابتة
├── media/                # ملفات مرفوعة
├── requirements.txt       # الاعتماديات
├── .env.example          # مثال متغيرات البيئة
└── manage.py             # أداة إدارة Django
```

## واجهات برمجة التطبيقات (APIs)

- `/api/auth/` - نظام المصادقة
- `/api/users/` - نظام المستخدمين
- `/api/companies/` - نظام الشركات
- `/api/inventory/` - نظام المخزون
- `/api/sales/` - نظام المبيعات
- `/api/accounting/` - نظام المحاسبة
- `/api/purchases/` - نظام المشتريات

## الامتثال المحلي

- ZATCA (هيئة الزكاة والضريبة والجمارك - السعودية)
- ETA (هيئة الضرائب المصرية)

## الترخيص

هذا المشروع مرخص تحت ترخيص MIT.
