// GeminiService: do not initialize provider SDK in browser. Proxy requests
// through backend endpoints which hold the real API key.

const API_PROXY_BASE = import.meta.env.VITE_API_URL || '/api';

async function proxyPost(path: string, body: any) {
  try {
    const res = await fetch(`${API_PROXY_BASE}/ai${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include'
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AI proxy error: ${res.status} ${text}`);
    }
    return await res.json();
  } catch (e) {
    console.error('AI proxy request failed', e);
    return null;
  }
}

export const GeminiService = {
  analyzeFinances: async (data: any) => {
    const r = await proxyPost('/generate', { task: 'analyze_finances', data });
    return r?.result || 'AI unavailable';
  },

  getMarketPulse: async () => {
    const r = await proxyPost('/generate', { task: 'market_pulse' });
    return r?.result || { content: 'بيانات السوق غير متوفرة حالياً', sources: [] };
  },

  predictInventoryTrends: async (products: any[]) => {
    const r = await proxyPost('/generate', { task: 'predict_inventory', products });
    return r?.result || [];
  },

  askAssistant: async (question: string, context: any) => {
    const r = await proxyPost('/chat', { question, context });
    return r?.reply || 'المساعد غير متاح';
  },

  createChatSession: () => {
    return {
      sendMessage: async (msg: string) => {
        const r = await proxyPost('/chat', { question: msg });
        return r || { reply: 'المساعد غير متصل' };
      }
    };
  }
};

// If a developer accidentally included a client API key, warn in console so
// they know to move calls to the backend. Do NOT use client-side keys in prod.
if (import.meta.env.VITE_GOOGLE_API_KEY) {
  console.warn('VITE_GOOGLE_API_KEY detected in client build — move AI calls to backend and remove the key from client env.');
}