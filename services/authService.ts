
import apiClient from './api';

// تسجيل الدخول
export const login = async (email: string, password: string, twoFactorCode?: string) => {
  try {
    const response = await apiClient.post('/auth/login/', {
      email,
      password,
      two_factor_code: twoFactorCode,
    });

    const { access, refresh, user } = response.data;

    // حفظ التوكنات في التخزين المحلي
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user', JSON.stringify(user));

    return { success: true, user };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'فشل تسجيل الدخول' 
    };
  }
};

// تسجيل الخروج
export const logout = async () => {
  try {
    await apiClient.post('/auth/logout/');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // إزالة التوكنات من التخزين المحلي
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
};

// تغيير كلمة المرور
export const changePassword = async (oldPassword: string, newPassword: string) => {
  try {
    await apiClient.post('/auth/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
    });

    return { success: true };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'فشل تغيير كلمة المرور' 
    };
  }
};

// الحصول على المستخدم الحالي
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/users/me/');
    return response.data;
  } catch (error: any) {
    console.error('Get current user error:', error);
    return null;
  }
};

// طلب إعادة تعيين كلمة المرور
export const requestPasswordReset = async (email: string) => {
  try {
    await apiClient.post('/auth/password-reset/', { email });
    return { success: true };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'فشل طلب إعادة تعيين كلمة المرور' 
    };
  }
};

// تأكيد إعادة تعيين كلمة المرور
export const confirmPasswordReset = async (token: string, password: string) => {
  try {
    await apiClient.post('/auth/password-reset-confirm/', { token, password });
    return { success: true };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'فشل تأكيد إعادة تعيين كلمة المرور' 
    };
  }
};

// إعداد المصادقة الثنائية
export const setupTwoFactorAuth = async () => {
  try {
    const response = await apiClient.post('/auth/2fa/setup/');
    return response.data;
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'فشل إعداد المصادقة الثنائية' 
    };
  }
};

// التحقق من رمز المصادقة الثنائية
export const verifyTwoFactorAuth = async (token: string) => {
  try {
    await apiClient.post('/auth/2fa/verify/', { token });
    return { success: true };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'فشل التحقق من رمز المصادقة الثنائية' 
    };
  }
};

// تعطيل المصادقة الثنائية
export const disableTwoFactorAuth = async () => {
  try {
    await apiClient.post('/auth/2fa/disable/');
    return { success: true };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'فشل تعطيل المصادقة الثنائية' 
    };
  };
};
