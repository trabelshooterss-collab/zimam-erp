#!/usr/bin/env python
"""
خادم وهمي بسيط لتطوير Zimam - Mock API Server
"""

import json
import sys
import traceback
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse
import base64

class MockAPIHandler(BaseHTTPRequestHandler):
    """معالج الطلبات الوهمية"""
    
    # مستخدمو الاختبار
    MOCK_USERS = {
        'admin@zimam.com': {'password': 'password123', 'id': 1, 'name': 'Admin'},
        'test@zimam.com': {'password': 'test123', 'id': 2, 'name': 'Test User'},
    }
    
    def do_POST(self):
        """معالجة طلبات POST"""
        try:
            path = urlparse(self.path).path
            
            # قراءة جسم الطلب
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            
            try:
                data = json.loads(body) if body else {}
            except json.JSONDecodeError as e:
                print(f"❌ JSON Parse Error: {e}")
                self.send_error_response(400, 'Invalid JSON')
                return
            
            # طلبات تسجيل الدخول
            if path == '/api/auth/login/':
                self.handle_login(data)
            else:
                self.send_error_response(404, 'Not Found')
        except Exception as e:
            print(f"🔥 Exception in do_POST: {e}")
            traceback.print_exc()
            self.send_error_response(500, f'Server Error: {str(e)}')
    
    def do_GET(self):
        """معالجة طلبات GET"""
        try:
            path = urlparse(self.path).path
            
            # جلب المستخدم الحالي
            if path == '/api/users/me/':
                self.handle_get_current_user()
            
            # جلب المنتجات
            elif path == '/api/inventory/products/':
                self.handle_get_products()
            
            # جلب العملاء
            elif path == '/api/sales/customers/':
                self.handle_get_customers()
            
            # جلب الفواتير
            elif path == '/api/sales/invoices/':
                self.handle_get_invoices()
            
            else:
                self.send_error_response(404, 'Not Found')
        except Exception as e:
            print(f"🔥 Exception in do_GET: {e}")
            traceback.print_exc()
            self.send_error_response(500, f'Server Error: {str(e)}')
    
    def do_OPTIONS(self):
        """معالجة طلبات CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
    
    def handle_login(self, data):
        """معالجة تسجيل الدخول"""
        email = (data.get('email') or '').strip()
        password = (data.get('password') or '').strip()
        
        print(f"\n🔓 محاولة تسجيل دخول:")
        print(f"   البريد المستلم: '{email}'")
        print(f"   كلمة المرور المستلمة: '{password}'")
        print(f"   البريد فارغ: {not email}")
        print(f"   كلمة المرور فارغة: {not password}")
        
        if not email or not password:
            print(f"❌ بيانات ناقصة!")
            self.send_error_response(400, 'Email and password are required')
            return
        
        print(f"   البيانات المتاحة في السيستم: {list(self.MOCK_USERS.keys())}")
        
        # التحقق من بيانات المستخدم
        if email in self.MOCK_USERS:
            user = self.MOCK_USERS[email]
            expected_password = user['password']
            print(f"   المستخدم '{email}' موجود")
            print(f"   كلمة المرور المتوقعة: '{expected_password}'")
            print(f"   المطابقة: {user['password'] == password}")
            
            if user['password'] == password:
                # إنشاء توكن وهمي (نسخة مبسطة)
                token = base64.b64encode(f"{email}:{password}".encode()).decode()
                
                response_data = {
                    'success': True,
                    'access': token,
                    'refresh': 'refresh_token_mock',
                    'user': {
                        'id': user['id'],
                        'email': email,
                        'first_name': user['name'],
                        'last_name': 'User'
                    }
                }
                print(f"✅ تم تسجيل الدخول بنجاح: {email}")
                print(f"   الرد: {response_data}")
                
                self.send_json_response(200, response_data)
                return
            else:
                print(f"   ❌ كلمة المرور غير متطابقة!")
        else:
            print(f"   ❌ المستخدم '{email}' غير موجود!")
        
        print(f"❌ فشل تسجيل الدخول: {email}\n")
        self.send_error_response(401, 'Invalid email or password')
    
    def handle_get_current_user(self):
        """جلب المستخدم الحالي"""
        auth_header = self.headers.get('Authorization', '')
        
        if auth_header.startswith('Bearer '):
            token = auth_header[7:]
            try:
                # فك تشفير التوكن البسيط
                decoded = base64.b64decode(token).decode()
                email = decoded.split(':')[0]
                
                if email in self.MOCK_USERS:
                    self.send_json_response(200, {
                        'id': self.MOCK_USERS[email]['id'],
                        'email': email,
                        'first_name': self.MOCK_USERS[email]['name'],
                        'last_name': 'User'
                    })
                    return
            except:
                pass
        
        self.send_error_response(401, 'Invalid token')
    
    def handle_get_products(self):
        """جلب المنتجات"""
        products = [
            {
                'id': 1,
                'name': 'آيفون 15 برو',
                'sku': 'IP15P001',
                'category': 'هواتف',
                'current_stock': 3,
                'reorder_point': 10,
                'cost_price': 4000,
                'selling_price': 5000,
                'last_restocked': '2024-12-20'
            },
            {
                'id': 2,
                'name': 'سامسونج S24',
                'sku': 'SS24U001',
                'category': 'هواتف',
                'current_stock': 15,
                'reorder_point': 10,
                'cost_price': 3500,
                'selling_price': 4500,
                'last_restocked': '2024-12-18'
            },
            {
                'id': 3,
                'name': 'لابتوب ديل',
                'sku': 'DLX15P001',
                'category': 'أجهزة',
                'current_stock': 8,
                'reorder_point': 5,
                'cost_price': 3000,
                'selling_price': 4000,
                'last_restocked': '2024-12-15'
            }
        ]
        self.send_json_response(200, products)
    
    def handle_get_customers(self):
        """جلب العملاء"""
        customers = [
            {
                'id': 1,
                'name': 'أحمد محمد',
                'email': 'ahmed@example.com',
                'phone': '01234567890',
                'type': 'customer',
                'address': 'القاهرة',
                'balance': 500
            },
            {
                'id': 2,
                'name': 'محمد علي',
                'email': 'mohammed@example.com',
                'phone': '01234567891',
                'type': 'customer',
                'address': 'الجيزة',
                'balance': 1000
            }
        ]
        self.send_json_response(200, customers)
    
    def handle_get_invoices(self):
        """جلب الفواتير"""
        invoices = [
            {
                'id': 1,
                'type': 'SALES',
                'customer_name': 'أحمد محمد',
                'date': '2024-01-15',
                'due_date': '2024-02-15',
                'total_amount': 5000,
                'tax_amount': 250,
                'status': 'PAID'
            },
            {
                'id': 2,
                'type': 'SALES',
                'customer_name': 'محمد علي',
                'date': '2024-01-16',
                'due_date': '2024-02-16',
                'total_amount': 4500,
                'tax_amount': 225,
                'status': 'PENDING'
            }
        ]
        self.send_json_response(200, invoices)
    
    def send_json_response(self, status_code, data):
        """إرسال استجابة JSON"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        response = json.dumps(data, ensure_ascii=False)
        self.wfile.write(response.encode('utf-8'))
    
    def send_error_response(self, status_code, error):
        """إرسال استجابة خطأ"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        response = json.dumps({'error': error}, ensure_ascii=False)
        self.wfile.write(response.encode('utf-8'))
    
    def log_message(self, format, *args):
        """تسجيل الرسائل"""
        print(f"[{self.client_address[0]}] {format % args}")


def run_server(port=8000):
    """تشغيل الخادم"""
    server_address = ('localhost', port)
    httpd = HTTPServer(server_address, MockAPIHandler)
    
    print(f"""
╔════════════════════════════════════════════════╗
║   🚀 خادم Zimam الوهمي (Mock Server) 🚀       ║
╚════════════════════════════════════════════════╝

✅ الخادم مشغّل على: http://localhost:{port}

📝 بيانات تسجيل الدخول للاختبار:
   📧 البريد: admin@zimam.com
   🔐 كلمة المرور: password123
   
   أو
   
   📧 البريد: test@zimam.com
   🔐 كلمة المرور: test123

🔌 نقاط النهاية المتاحة:
   ✓ POST /api/auth/login/ - تسجيل الدخول
   ✓ GET /api/users/me/ - المستخدم الحالي
   ✓ GET /api/inventory/products/ - المنتجات
   ✓ GET /api/sales/customers/ - العملاء
   ✓ GET /api/sales/invoices/ - الفواتير

⏹️  اضغط CTRL+C لإيقاف الخادم
""")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\n\n✅ تم إيقاف الخادم')
        httpd.shutdown()


if __name__ == '__main__':
    run_server()
