import { createClient } from '@supabase/supabase-js';

// هحط الرابط والمفتاح مباشرة عشان نتخطى مشكلة ملف .env
const supabaseUrl = 'https://scwpavlyxhzlnibhlscv.supabase.co';
const supabaseKey = 'sb_publishable_XxOHa131BTuLJMX8TEe0IA_qCnYgBPm';

export const supabase = createClient(supabaseUrl, supabaseKey);