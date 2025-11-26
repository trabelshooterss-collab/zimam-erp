# ⚠️ تنبيه أمني — مفاتيح سُررِبة

## الوضع الحالي (الحرج)

تم اكتشاف **مفاتيح وأسرار مسررّبة** في ملف `pass.txt` كان موجودًا في المستودع:

```
- مفتاح Supabase Publishable: sb_publishable_XxOHa131BTuLJMX8TEe0IA_qCnYgBPm
- URL Supabase: https://scwpavlyxhzlnibhlscv.supabase.co
- مفتاح Django آخر محتمل: lto4oZwtw2S3gMCy
```

⚠️ **هذه المفاتيح الآن مكشوفة للعام إذا تم دفع commit بها إلى GitHub أو أي مستودع عام.**

---

## الخطوات الفورية المطلوبة (الآن!)

### 1. **تدوير مفاتيح Supabase**
```bash
# اذهب إلى Supabase Console
# https://app.supabase.com

# 1. انسخ مفتاح جديد API أو أبطل المفتاح القديم:
#    Settings > API > Revoke current key
# 2. ولد مفتاح جديد
# 3. حدّث .env محليًا و CI/CD secrets

# أو عبر CLI (إن كان مثبتًا):
supabase projects revoke-key --project-ref scwpavlyxhzlnibhlscv
```

### 2. **تدوير مفاتيح Google Gemini (إن كانت مستخدمة)**
```bash
# اذهب إلى Google AI Studio
# https://makersuite.google.com/app/apikeys

# احذف المفتاح القديم وأنشئ جديد
# حدّث GEMINI_API_KEY في البيئة
```

### 3. **حدّث Django SECRET_KEY**
```bash
# في الـ production environment فقط (ليس محلياً):
# إنشاء SECRET_KEY جديد قوي:
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# النتيجة: نسخها وحدّثها في CI/CD secrets أو environment
```

### 4. **تنظيف سجل Git (إزالة الملفات من التاريخ)**
إذا تم دفع هذه الملفات إلى GitHub:

```bash
# تنظيف الـ commit history (احذر: قد تحتاج إلى force push)
git filter-repo --path pass.txt --invert-paths

# أو استخدم BFG Repo-Cleaner:
bfg --delete-files pass.txt
git reflog expire --expire=now --all
git gc --aggressive --prune=now
git push origin --force --all
```

---

## قائمة التحقق الأمنية

- [ ] حذفت `pass.txt` من المستودع ✅ (تم بالفعل)
- [ ] أضفت `.gitignore` لمنع تسرب مستقبلي ✅ (تم بالفعل)
- [ ] ❌ **دوّرت مفاتيح Supabase** ← افعل الآن!
- [ ] ❌ **دوّرت مفاتيح Google Gemini** ← افعل الآن!
- [ ] ❌ **حدّثت DJANGO_SECRET_KEY في production** ← افعل الآن!
- [ ] ❌ **نظّفت git history** ← افعل إذا تم الدفع لـ GitHub
- [ ] تحديث جميع CI/CD secrets و environment variables

---

## أفضل الممارسات الآن

### ✅ ملفات البيئة الآمنة

```bash
# استخدم .env (محلي فقط)
# أضفها إلى .gitignore (✅ تم بالفعل)
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

### ✅ CI/CD Secrets

```bash
# في GitHub:
# Settings > Secrets and variables > Actions
# أضف:
DJANGO_SECRET_KEY=<random_strong_key>
GEMINI_API_KEY=<new_key>
SUPABASE_KEY=<new_key>
DATABASE_URL=postgresql://...
```

### ✅ Deployment Secrets (Vercel, Railway, etc.)

```bash
# Vercel CLI:
vercel env add DJANGO_SECRET_KEY
vercel env add GEMINI_API_KEY

# Railway / Heroku:
# استخدم لوحة التحكم أو CLI
```

---

## التحقق من الالتزام

### الأوامر التحقق السريعة

```bash
# ابحث عن أي hardcoded secrets متبقية:
git log -p -S "django-insecure-" | head -20
git log -p -S "sk-" | head -20  # OpenAI keys
git log -p -S "sb_publishable" | head -20  # Supabase

# ابحث عن أسماء ملفات مريبة:
find . -name "*.key" -o -name "*.secret" -o -name "pass*" -o -name "*credentials*"
```

---

## المراجع والموارد

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Django Deployment Security Checklist](https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

**آخر تحديث:** 26 نوفمبر 2025  
**الأولوية:** 🔴 حرجة — يجب إكمالها قبل الذهاب للإنتاج!
