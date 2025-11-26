# 🚀 دليل النشر الإنتاجي الشامل - Zimam Smart ERP

هذا الدليل يغطي نشر التطبيق الكامل على بيئات الإنتاج المختلفة.

---

## 📋 المتطلبات الأساسية

### Frontend
- Node.js 18+
- npm 9+
- Vercel Account (للنشر السريع)

### Backend
- Python 3.11+
- PostgreSQL 15+
- Redis 7+ (للـ Celery)
- Docker و Docker Compose (اختياري لكن موصى)

---

## 🌐 خيارات النشر

### **الخيار 1: نشر سريع على Vercel (Frontend) + Railway/Heroku (Backend)**

هذا هو الأسهل والأسرع للـ MVP.

#### الخطوة 1: نشر Frontend على Vercel

```bash
# 1. تثبيت Vercel CLI
npm install -g vercel

# 2. تسجيل الدخول
vercel login

# 3. نشر المشروع
cd /path/to/zimam-erp
vercel --prod

# 4. تحديد متغيرات البيئة في Vercel Dashboard
# Settings > Environment Variables
vercel env add VITE_API_URL=https://api.yourdomain.com/api
vercel env add VITE_WS_URL=wss://api.yourdomain.com/ws
```

#### الخطوة 2: نشر Backend على Railway

```bash
# 1. إنشاء حساب Railway
# https://railway.app

# 2. ربط المستودع
# إضافة repo من GitHub

# 3. متغيرات البيئة (Railway Dashboard)
# توافق متغيرات البيئة:
DJANGO_SECRET_KEY=<strong_random_key>
DEBUG=False
DATABASE_URL=<railway_postgres_url>  # تُنشَأ تلقائياً
REDIS_URL=<railway_redis_url>        # تُنشَأ تلقائياً
GEMINI_API_KEY=<your_key>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=<your_email>
EMAIL_HOST_PASSWORD=<app_password>
FRONTEND_URL=https://zimam.vercel.app
ALLOWED_HOSTS=api.yourdomain.com,localhost
SENTRY_DSN=<optional_sentry_dsn>

# 4. Procfile (أنشئ في المشروع إذا لم يكن موجودًا)
# Procfile
release: python backend/manage.py migrate --noinput
web: cd backend && gunicorn zimam.wsgi:application --bind 0.0.0.0:${PORT}
worker: cd backend && celery -A zimam worker -l info
```

---

### **الخيار 2: نشر كامل على AWS (ECS/RDS/ElastiCache)**

أكثر تعقيداً لكن أقوى للإنتاج.

#### الخطوة 1: إعداد AWS Infrastructure

```bash
# 1. تثبيت AWS CLI و Terraform (أو استخدم Management Console)
brew install awscli terraform  # macOS
# أو على Windows: choco install awscli terraform

# 2. تسجيل الدخول
aws configure

# 3. إنشاء RDS PostgreSQL
aws rds create-db-instance \
  --db-instance-identifier zimam-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --allocated-storage 20 \
  --publicly-accessible false

# 4. إنشاء ElastiCache Redis
aws elasticache create-cache-cluster \
  --cache-cluster-id zimam-redis \
  --cache-node-type cache.t3.micro \
  --engine redis
```

#### الخطوة 2: نشر Backend على ECS

```bash
# 1. إنشاء ECR Repository
aws ecr create-repository --repository-name zimam-backend

# 2. بناء و push Docker image
docker build -t zimam-backend:latest ./backend
docker tag zimam-backend:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/zimam-backend:latest
docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/zimam-backend:latest

# 3. إنشاء ECS Cluster وتشغيل Task
# استخدم AWS Console أو AWS CLI (معقد، راجع AWS docs)
```

---

### **الخيار 3: نشر Docker Compose على VPS**

خيار متوسط التعقيد والتكلفة.

#### الخطوة 1: إعداد VPS (DigitalOcean, Linode, etc.)

```bash
# 1. إنشاء Droplet (DigitalOcean)
# اختر Ubuntu 22.04 LTS
# SSH key auth موصى

# 2. الاتصال بـ SSH
ssh root@your_vps_ip

# 3. تحديث النظام
apt update && apt upgrade -y

# 4. تثبيت Docker و Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt install docker-compose -y

# 5. إنشاء مستخدم جديد (غير root)
adduser deployer
usermod -aG docker deployer
```

#### الخطوة 2: نشر التطبيق

```bash
# 1. نسخ المشروع
git clone https://github.com/your_username/zimam-erp.git
cd zimam-erp

# 2. إنشاء .env للـ production
cat > .env << 'EOF'
VITE_API_URL=https://api.yourdomain.com/api
VITE_WS_URL=wss://api.yourdomain.com/ws
EOF

cat > backend/.env << 'EOF'
DEBUG=False
DJANGO_SECRET_KEY=<strong_random_key>
DATABASE_URL=postgresql://zimam_user:secure_password@db:5432/zimam_db
REDIS_URL=redis://redis:6379/0
GEMINI_API_KEY=<your_key>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=<your_email>
EMAIL_HOST_PASSWORD=<app_password>
FRONTEND_URL=https://zimam.yourdomain.com
ALLOWED_HOSTS=api.yourdomain.com,localhost
SENTRY_DSN=<optional>
EOF

# 3. تحديث docker-compose.yml للإنتاج
# استبدل ports بـ :80:80 و :443:443
# أضف SSL/TLS certificates (اختياري: Traefik / Let's Encrypt)

# 4. شغّل الحاويات
docker-compose up -d

# 5. تشغيل الـ migrations
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

#### الخطوة 3: إعداد Nginx كـ Reverse Proxy

```bash
# تثبيت Nginx
apt install nginx -y

# إنشاء كونفيج
cat > /etc/nginx/sites-available/zimam << 'EOF'
upstream backend {
    server 127.0.0.1:8000;
}

upstream frontend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
    }
}
EOF

# تفعيل الكونفيج
ln -s /etc/nginx/sites-available/zimam /etc/nginx/sites-enabled/
nginx -s reload
```

---

### **الخيار 4: نشر على Heroku (مبسّط)**

```bash
# 1. تثبيت Heroku CLI
brew install heroku  # macOS
# أو: https://devcenter.heroku.com/articles/heroku-cli

# 2. تسجيل الدخول
heroku login

# 3. إنشاء تطبيقين (frontend + backend)
heroku create zimam-frontend
heroku create zimam-backend

# 4. إضافة PostgreSQL و Redis
heroku addons:create heroku-postgresql:standard-0 -a zimam-backend
heroku addons:create heroku-redis:premium-0 -a zimam-backend

# 5. إضافة Procfile (في جذر المشروع)
cat > Procfile << 'EOF'
web: cd backend && gunicorn zimam.wsgi:application
worker: cd backend && celery -A zimam worker -l info
EOF

# 6. دفع إلى Heroku
git push heroku main

# 7. تشغيل الـ migrations
heroku run python backend/manage.py migrate -a zimam-backend
```

---

## 🔒 إجراءات الأمان الإنتاجية

### 1. SSL/TLS Certificates

```bash
# استخدم Let's Encrypt (مجاني)
apt install certbot python3-certbot-nginx -y
certbot certonly --nginx -d yourdomain.com -d api.yourdomain.com
```

### 2. Firewall و Security Groups

```bash
# ufw (إذا كان على VPS Linux)
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
ufw enable
```

### 3. Backups

```bash
# PostgreSQL Backup
pg_dump -U zimam_user -d zimam_db > backup_$(date +%Y%m%d).sql

# الأفضل: استخدم Automated Backups من Provider
# (Railway, AWS RDS, DigitalOcean) لديها automatic backup
```

---

## 📊 المراقبة والتسجيل

### 1. Sentry (لتتبع الأخطاء)

```bash
# أنشئ حساب Sentry
# https://sentry.io

# احصل على DSN وأضفه إلى البيئة:
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

### 2. Logging

```bash
# السجلات محفوظة في:
# /var/log/zimam/ (أو في حاويات Docker: docker logs <container>)

# عرض السجلات الفعلية:
docker-compose logs backend
docker-compose logs frontend
```

---

## 🔄 CD/CI Pipeline (GitHub Actions)

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        run: |
          npm install -g railway
          railway link --project <project_id> --token ${{ secrets.RAILWAY_TOKEN }}
          railway up
```

---

## ✅ قائمة التحقق قبل الإنتاج

- [ ] ✅ تم تدوير جميع المفاتيح السرية
- [ ] ✅ تم تعطيل DEBUG = False
- [ ] ✅ تم تعيين ALLOWED_HOSTS صحيح
- [ ] ✅ تم إعداد CORS strictly
- [ ] ✅ تم تحديث DJANGO_SECRET_KEY قوي
- [ ] ✅ تم تشغيل Database Migrations
- [ ] ✅ تم إنشاء Super User
- [ ] ✅ تم إعداد SSL/TLS
- [ ] ✅ تم اختبار الـ API endpoints
- [ ] ✅ تم اختبار الـ Frontend
- [ ] ✅ تم إعداد Backups
- [ ] ✅ تم تفعيل Logging و Monitoring

---

## 📞 استكشاف الأخطاء

### الخادم لا يرد

```bash
# تحقق من حالة الخدمة
docker-compose ps
docker logs <container_name>

# تحقق من المنافذ
netstat -tlnp | grep LISTEN
```

### خطأ في الـ Database

```bash
# تحقق من الاتصال
python backend/manage.py dbshell

# شغّل الـ migrations مرة أخرى
python backend/manage.py migrate
```

### الـ Gemini API لا يعمل

```bash
# تحقق من المفتاح
echo $GEMINI_API_KEY

# اختبر الاتصال:
curl -X POST http://localhost:8000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"task":"market_pulse"}'
```

---

## 🎉 تم! تطبيقك الآن في الإنتاج!

للدعم والأسئلة:
- 📚 [Django Deployment Docs](https://docs.djangoproject.com/en/4.2/howto/deployment/)
- 🚀 [Vercel Docs](https://vercel.com/docs)
- 🚂 [Railway Docs](https://docs.railway.app)

**آخر تحديث:** 26 نوفمبر 2025
