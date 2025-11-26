from django.urls import path
from . import views

urlpatterns = [
    path('generate', views.GenerateView.as_view(), name='ai-generate'),
    path('chat', views.ChatView.as_view(), name='ai-chat'),
]
