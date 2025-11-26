"""
WebSocket Server for Real-time Synchronization
معالج الاتصالات الفورية عبر WebSocket
"""

import json
import logging
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from datetime import datetime

logger = logging.getLogger(__name__)


class SyncConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time data synchronization
    معالج WebSocket للمزامنة الفورية للبيانات
    """
    
    async def connect(self):
        """
        Handle new WebSocket connections
        """
        self.user = None
        self.company_id = None
        
        try:
            # استخراج التوكن من الاستعلام
            query_string = self.scope.get('query_string', b'').decode()
            params = dict(param.split('=') for param in query_string.split('&') if '=' in param)
            token_str = params.get('token')
            
            if token_str:
                try:
                    token = Token.objects.get(key=token_str)
                    self.user = token.user
                    self.company_id = token.user.profile.company_id if hasattr(token.user, 'profile') else None
                except Token.DoesNotExist:
                    await self.close(code=4001)
                    return
            else:
                await self.close(code=4001)
                return
            
            # الانضمام للمجموعة
            self.room_group_name = f'sync_company_{self.company_id}'
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            
            await self.accept()
            logger.info(f'✅ متصل: {self.user.email} - {self.room_group_name}')
            
            # إرسال رسالة ترحيب
            await self.send(json.dumps({
                'type': 'SYNC_CONNECTED',
                'message': f'أهلاً {self.user.first_name}',
                'timestamp': datetime.now().isoformat()
            }))
            
        except Exception as e:
            logger.error(f'خطأ في الاتصال: {str(e)}')
            await self.close(code=4000)
    
    async def disconnect(self, close_code):
        """
        Handle WebSocket disconnections
        """
        if self.room_group_name:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
            logger.info(f'❌ قطع الاتصال: {self.user.email if self.user else "Unknown"}')
    
    async def receive(self, text_data):
        """
        Receive messages from WebSocket client
        """
        try:
            message = json.loads(text_data)
            message_type = message.get('type')
            
            if message_type == 'SYNC_REQUEST':
                await self.handle_sync_request(message)
            
            elif message_type == 'UPDATE':
                await self.handle_update(message)
            
            elif message_type == 'PING':
                await self.send(json.dumps({
                    'type': 'PONG',
                    'timestamp': datetime.now().isoformat()
                }))
            
            else:
                logger.warning(f'نوع رسالة غير معروف: {message_type}')
        
        except json.JSONDecodeError:
            logger.error('خطأ في فك تشفير JSON')
        except Exception as e:
            logger.error(f'خطأ في معالجة الرسالة: {str(e)}')
    
    async def handle_sync_request(self, message):
        """
        معالجة طلب المزامنة
        """
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'sync_message',
                'data': {
                    'type': 'SYNC_COMPLETE',
                    'userId': str(self.user.id),
                    'timestamp': datetime.now().isoformat(),
                    'entity': message.get('entity'),
                    'entityId': message.get('entityId')
                }
            }
        )
    
    async def handle_update(self, message):
        """
        معالجة التحديثات والبث إلى المستخدمين الآخرين
        """
        # حفظ التحديث في السجل
        await self.log_sync_action(message)
        
        # بث التحديث إلى جميع المتصلين في نفس الشركة
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'sync_message',
                'data': message,
                'user_id': str(self.user.id)
            }
        )
    
    async def sync_message(self, event):
        """
        معالج استقبال رسائل المزامنة من المجموعة
        """
        data = event['data']
        user_id = event.get('user_id')
        
        # عدم إرسال الرسالة للمستخدم الذي أرسلها
        if user_id and user_id == str(self.user.id):
            return
        
        await self.send(json.dumps(data))
    
    async def log_sync_action(self, message):
        """
        تسجيل إجراء المزامنة في قاعدة البيانات
        """
        try:
            from apps.inventory.models import SyncLog  # قد تحتاج لإنشاء هذا النموذج
            
            # حفظ السجل بشكل غير متزامن
            asyncio.create_task(self._save_sync_log(message))
        except Exception as e:
            logger.error(f'خطأ في تسجيل المزامنة: {str(e)}')
    
    async def _save_sync_log(self, message):
        """
        حفظ سجل المزامنة بشكل غير متزامن
        """
        from asgiref.sync import sync_to_async
        
        try:
            # هذا يحتاج لنموذج SyncLog
            pass
        except Exception as e:
            logger.error(f'خطأ في حفظ السجل: {str(e)}')


class NotificationConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time notifications
    معالج WebSocket للإشعارات الفورية
    """
    
    async def connect(self):
        """
        الاتصال والانضمام لمجموعة الإشعارات
        """
        self.user = None
        
        try:
            # استخراج التوكن
            query_string = self.scope.get('query_string', b'').decode()
            params = dict(param.split('=') for param in query_string.split('&') if '=' in param)
            token_str = params.get('token')
            
            if token_str:
                try:
                    token = Token.objects.get(key=token_str)
                    self.user = token.user
                except Token.DoesNotExist:
                    await self.close(code=4001)
                    return
            else:
                await self.close(code=4001)
                return
            
            # الانضمام لمجموعة الإشعارات الشخصية
            self.room_group_name = f'notifications_user_{self.user.id}'
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            
            await self.accept()
            logger.info(f'🔔 متصل للإشعارات: {self.user.email}')
            
        except Exception as e:
            logger.error(f'خطأ في اتصال الإشعارات: {str(e)}')
            await self.close(code=4000)
    
    async def disconnect(self, close_code):
        """
        قطع الاتصال
        """
        if self.room_group_name:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        """
        استقبال الرسائل
        """
        try:
            message = json.loads(text_data)
            
            # تحويل الرسالة إلى إشعار
            await self.send_notification(message)
        
        except json.JSONDecodeError:
            logger.error('خطأ في فك تشفير JSON للإشعار')
    
    async def notification_message(self, event):
        """
        معالج استقبال الإشعارات
        """
        await self.send(json.dumps({
            'type': event['notification_type'],
            'title': event['title'],
            'message': event['message'],
            'priority': event.get('priority', 'normal'),
            'timestamp': datetime.now().isoformat(),
            'data': event.get('data', {})
        }))
    
    async def send_notification(self, notification_data):
        """
        بث إشعار إلى المجموعة
        """
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'notification_message',
                'notification_type': notification_data.get('type', 'info'),
                'title': notification_data.get('title', 'إشعار جديد'),
                'message': notification_data.get('message', ''),
                'priority': notification_data.get('priority', 'normal'),
                'data': notification_data.get('data', {})
            }
        )


# دوال مساعدة لإرسال الإشعارات من أي مكان في التطبيق

async def send_notification_to_user(user_id, title, message, priority='normal', data=None):
    """
    إرسال إشعار لمستخدم محدد
    """
    channel_layer = get_channel_layer()
    
    await channel_layer.group_send(
        f'notifications_user_{user_id}',
        {
            'type': 'notification_message',
            'notification_type': 'alert',
            'title': title,
            'message': message,
            'priority': priority,
            'data': data or {}
        }
    )


async def send_notification_to_company(company_id, title, message, priority='normal', data=None):
    """
    إرسال إشعار لجميع مستخدمي شركة
    """
    channel_layer = get_channel_layer()
    
    await channel_layer.group_send(
        f'notifications_company_{company_id}',
        {
            'type': 'notification_message',
            'notification_type': 'company_alert',
            'title': title,
            'message': message,
            'priority': priority,
            'data': data or {}
        }
    )


async def broadcast_sync_update(company_id, entity_type, entity_id, action, data):
    """
    بث تحديث مزامنة إلى جميع مستخدمي الشركة
    """
    channel_layer = get_channel_layer()
    
    await channel_layer.group_send(
        f'sync_company_{company_id}',
        {
            'type': 'sync_message',
            'data': {
                'type': action,
                'entity': entity_type,
                'entityId': entity_id,
                'data': data,
                'timestamp': datetime.now().isoformat()
            }
        }
    )
