#!/usr/bin/env python3
"""Generate secure keys for production."""

import secrets
import string
from django.core.management.utils import get_random_secret_key

print("=" * 60)
print("🔐 GENERATING SECURE KEYS FOR PRODUCTION")
print("=" * 60)

# 1. Django SECRET_KEY
print("\n1️⃣  DJANGO_SECRET_KEY (قوي جداً):")
django_secret = get_random_secret_key()
print(f"   {django_secret}")
print(f"   ✅ انسخ هذا وضعه في backend/.env")

# 2. Supabase Publishable Key (placeholder - يجب من Supabase)
print("\n2️⃣  SUPABASE_KEY (من Supabase Dashboard):")
print(f"   ⚠️  لا تستطيع توليده - روح: https://app.supabase.com")
print(f"   ⚠️  Settings > API > anon public")
print(f"   ✅ انسخ منها وضعه في .env")

# 3. Gemini API Key (placeholder - يجب من Google)
print("\n3️⃣  GEMINI_API_KEY (من Google AI Studio):")
print(f"   ⚠️  لا تستطيع توليده - روح: https://makersuite.google.com/app/apikeys")
print(f"   ✅ أنشئ key وضعه في backend/.env")

print("\n" + "=" * 60)
print("📋 القادم:")
print("=" * 60)
print("1. أبطل المفاتيح القديمة من Supabase و Google")
print("2. انسخ المفاتيح الجديدة")
print("3. حدّث الملفات:")
print("   - .env (Frontend)")
print("   - backend/.env (Backend)")
print("\n✅ لا تشارك المفاتيح في الدردشة!")
print("=" * 60)
