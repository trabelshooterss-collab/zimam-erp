# تكوين البيئة والنشر - Zimam Smart ERP

## 📋 متطلبات النظام

### Frontend
- Node.js >= 18.0.0
- npm >= 9.0.0 أو yarn >= 3.6.0
- React 18.2+
- TypeScript 5.2+

### Backend
- Python >= 3.10
- PostgreSQL >= 13
- Redis >= 6.0
- Django 4.2.7+

## 🔧 إعدادات التطوير المحلي

### 1. إعداد Frontend

```bash
# تثبيت المتطلبات
npm install

# متغيرات البيئة (.env)
cat > .env << EOF
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws
VITE_GOOGLE_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
EOF

# تشغيل سيرفر التطوير
npm run dev
```

### 2. إعداد Backend

```bash
# الانتقال للمجلد
cd backend

# إنشاء بيئة افتراضية
python -m venv venv

# تفعيل البيئة
# على Windows:
venv\Scripts\activate
# على Linux/Mac:
source venv/bin/activate

# تثبيت المتطلبات
pip install -r requirements.txt

# متغيرات البيئة (.env)
cat > .env << EOF
DEBUG=True
DJANGO_SECRET_KEY=your_secret_key_here_change_in_production
DATABASE_URL=postgresql://user:password@localhost:5432/zimam_db
REDIS_URL=redis://localhost:6379/0
GEMINI_API_KEY=your_gemini_key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:3000
EOF

# تشغيل الهجرات
python manage.py migrate

# إنشاء مستخدم admin
python manage.py createsuperuser

# تشغيل السيرفر
python manage.py runserver 0.0.0.0:8000
```

## 🐳 النشر باستخدام Docker

### Dockerfile - Frontend

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g http-server
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["http-server", "dist", "-p", "3000"]
```

### Dockerfile - Backend

```dockerfile
FROM python:3.11-slim
WORKDIR /app

# تثبيت المتطلبات النظام
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# تثبيت المتطلبات Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# نسخ التطبيق
COPY . .

# جمع الملفات الثابتة
RUN python manage.py collectstatic --noinput

EXPOSE 8000
CMD ["gunicorn", "zimam.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: zimam_db
      POSTGRES_USER: zimam_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    command: gunicorn zimam.wsgi:application --bind 0.0.0.0:8000 --workers 4
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://zimam_user:secure_password@db:5432/zimam_db
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:8000/api
      - VITE_WS_URL=ws://localhost:8000/ws
    depends_on:
      - backend

volumes:
  postgres_data:
```

## 🌐 النشر على الخوادم الإنتاجية

### على Vercel (Frontend)

```bash
# تثبيت Vercel CLI
npm install -g vercel

# النشر
vercel

# متغيرات البيئة الإنتاجية
vercel env add VITE_API_URL
vercel env add VITE_GOOGLE_API_KEY
```

### على AWS (Backend)

#### استخدام Elastic Beanstalk:

```bash
# تثبيت AWS EB CLI
pip install awsebcli

# تهيئة التطبيق
eb init -p python-3.11 zimam-api

# إنشاء البيئة
eb create zimam-prod

# النشر
eb deploy
```

#### متغيرات البيئة الآمنة:

```bash
eb setenv DEBUG=False
eb setenv DJANGO_SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
eb setenv DATABASE_URL=your_rds_connection_string
eb setenv REDIS_URL=your_elasticache_connection_string
```

### على Heroku (اختياري - للتطوير السريع)

```bash
# تثبيت Heroku CLI
# ثم:

heroku login
heroku create zimam-app
heroku addons:create heroku-postgresql:standard-0
heroku addons:create heroku-redis:premium-0

# النشر
git push heroku main
```

## 📊 إعدادات قاعدة البيانات

### تحسين الأداء

```sql
-- إنشاء الفهارس
CREATE INDEX idx_invoice_date ON apps_sales_invoice(date DESC);
CREATE INDEX idx_product_stock ON apps_inventory_product(current_stock);
CREATE INDEX idx_customer_company ON apps_sales_customer(company_id);

-- تفعيل PostGIS للموقع الجغرافي (اختياري)
CREATE EXTENSION IF NOT EXISTS postgis;
```

## 🔐 الأمان الإنتاجي

### قائمة التحقق

- [ ] تعطيل DEBUG
- [ ] تعيين SECRET_KEY عشوائي قوي
- [ ] تفعيل HTTPS فقط
- [ ] تكوين CORS بشكل صحيح
- [ ] تفعيل CSRF Protection
- [ ] تحديث كل المكتبات
- [ ] تفعيل WAF (Web Application Firewall)
- [ ] إضافة Rate Limiting
- [ ] تفعيل Logging والمراقبة
- [ ] اختبار الاختراق

### إعدادات Django الآمنة

```python
# في settings.py الإنتاجية

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# HSTS
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
```

## 📈 المراقبة والتسجيل

### Sentry (لتتبع الأخطاء)

```python
# في settings.py
import sentry_sdk

sentry_sdk.init(
    dsn="your_sentry_dsn",
    traces_sample_rate=0.1,
    environment="production"
)
```

### ELK Stack (للسجلات)

```yaml
# docker-compose.yml إضافي
elasticsearch:
  image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
  environment:
    - discovery.type=single-node

kibana:
  image: docker.elastic.co/kibana/kibana:8.0.0
  ports:
    - "5601:5601"
```

## 📱 إنشاء تطبيق Mobile

### استخدام React Native

```bash
# إنشاء مشروع جديد
npx react-native init ZimamMobile

# إضافة المكتبات المطلوبة
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install axios react-query
npm install zustand

# تشغيل على الأندرويد
npx react-native run-android

# تشغيل على iOS
npx react-native run-ios
```

## 🧪 الاختبار

### اختبارات Frontend

```bash
# تثبيت Jest و React Testing Library
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# تشغيل الاختبارات
npm test

# التغطية
npm test -- --coverage
```

### اختبارات Backend

```bash
# تشغيل الاختبارات
python manage.py test

# مع التغطية
coverage run --source='.' manage.py test
coverage report
```

## 🚀 CI/CD Pipeline

### GitHub Actions (.github/workflows/deploy.yml)

```yaml
name: Deploy

on:
  push:
    branches: [main, production]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install and test Frontend
        run: |
          npm install
          npm run build
          npm test
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install and test Backend
        run: |
          cd backend
          pip install -r requirements.txt
          python manage.py test
      
      - name: Deploy to Production
        if: github.ref == 'refs/heads/production'
        run: |
          # أوامر النشر
          echo "Deploying to production..."
```

## 📊 خارطة الطريق

- [ ] إطلاق الإصدار 2.0 (Pro Edition)
- [ ] تطبيق Mobile
- [ ] دعم الدفع بـ Stripe/PayPal
- [ ] سوق منتجات داخلي
- [ ] التكامل مع منصات التجارة الإلكترونية
- [ ] تحليلات ML متقدمة
- [ ] دعم Blockchain للمعاملات

---

**آخر تحديث:** 26 نوفمبر 2024
