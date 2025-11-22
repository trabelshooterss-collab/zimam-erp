
import { GoogleGenAI, Type } from "@google/genai";
import { Product, FinancialSnapshot, InventoryPrediction, FinancialInsight, MarketPulseResult, SimulationResult, VisualAuditResult, VoiceCommandAction } from '../types';

// Initialize the Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const GeminiService = {
  /**
   * Connect to Django Backend (Real SQL Data)
   */
  async askZimamBackend(question: string): Promise<string> {
    try {
      // Ensure your Django server is running on port 8000
      // In production, replace with your actual domain
      const response = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // Future: Add JWT here
        },
        body: JSON.stringify({ question })
      });

      const data = await response.json();
      if (data.success) {
        return data.answer;
      } else {
        return "عذراً، السيرفر لا يستجيب حالياً. تأكد من تشغيل الباك إند.";
      }
    } catch (error) {
      console.error("Backend Connection Error", error);
      return "فشل الاتصال بقاعدة البيانات (Network Error).";
    }
  },

  /**
   * AI Inventory Predictor (Enhanced with Google Search)
   */
  async predictInventoryNeeds(products: Product[], language: 'en' | 'ar'): Promise<InventoryPrediction[]> {
    const model = "gemini-2.5-flash";
    const langInstruction = language === 'ar' 
      ? "The 'reasoning' field MUST be written in Arabic." 
      : "The 'reasoning' field MUST be written in English.";

    const prompt = `
      You are an advanced AI Supply Chain Architect for the MENA region (Saudi Arabia & Egypt).
      Task: Use Google Search to identify current date and upcoming holidays (Ramadan, Eid). Analyze inventory. Predict 'suggestedReorderPoint'.
      ${langInstruction}
      Inventory Data: ${JSON.stringify(products.map(p => ({ name: p.name, category: p.category, currentStock: p.currentStock, baseReorderPoint: p.reorderPoint })))}
      IMPORTANT: Return raw JSON Array. No Markdown.
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });
      let text = response.text || "[]";
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(text);
    } catch (error) {
      console.error("AI Prediction Failed", error);
      return [];
    }
  },

  /**
   * Smart Financial Assistant
   */
  async analyzeFinances(data: FinancialSnapshot[], language: 'en' | 'ar'): Promise<FinancialInsight[]> {
    const model = "gemini-2.5-flash";
    const langInstruction = language === 'ar' 
      ? "Output JSON only. Fields in Arabic." 
      : "Output JSON only. Fields in English.";

    const prompt = `Virtual CFO Analysis. Analyze trends. Provide 3 insights. ${langInstruction} Data: ${JSON.stringify(data)}`;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                severity: { type: Type.STRING, enum: ["info", "warning", "critical"] },
                actionItem: { type: Type.STRING }
              }
            }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    } catch (error) {
      return [];
    }
  },

  /**
   * Market Pulse
   */
  async getMarketPulse(language: 'en' | 'ar'): Promise<MarketPulseResult> {
    const model = "gemini-2.5-flash";
    const promptText = language === 'ar'
      ? "ابحث عن آخر أخبار الأعمال والضرائب في السعودية ومصر."
      : "Search latest business news and tax regulations in Saudi Arabia and Egypt.";

    try {
      const response = await ai.models.generateContent({
        model,
        contents: { role: 'user', parts: [{ text: promptText }] },
        config: { tools: [{ googleSearch: {} }] }
      });
      // @ts-ignore
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks.map((c: any) => c.web ? { title: c.web.title, uri: c.web.uri } : null).filter((x: any) => x !== null);
      return { content: response.text || "", sources };
    } catch (error) {
      return { content: "Service busy.", sources: [] };
    }
  },

  async askComplianceQuestion(question: string, language: 'en' | 'ar'): Promise<MarketPulseResult> {
    const model = "gemini-2.5-flash";
    try {
      const response = await ai.models.generateContent({
        model,
        contents: { role: 'user', parts: [{ text: `Answer using Google Search: ${question} (Lang: ${language})` }] },
        config: { tools: [{ googleSearch: {} }] }
      });
      // @ts-ignore
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks.map((c: any) => c.web ? { title: c.web.title, uri: c.web.uri } : null).filter((x: any) => x !== null);
      return { content: response.text || "", sources };
    } catch (error) {
      return { content: "Error.", sources: [] };
    }
  },

  async parseInvoiceImage(base64Image: string): Promise<{ total: number, vendor: string, date: string }> {
    const model = "gemini-2.5-flash";
    try {
      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: base64Image } },
            { text: "Extract Vendor, Total, Date." }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              vendor: { type: Type.STRING },
              total: { type: Type.NUMBER },
              date: { type: Type.STRING }
            }
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      throw error;
    }
  },

  createChatSession(language: 'en' | 'ar') {
    const model = "gemini-3-pro-preview";
    return ai.chats.create({
      model,
      config: { systemInstruction: language === 'ar' ? "مساعد ERP ذكي." : "Intelligent ERP Assistant." }
    });
  },

  // --- GENIUS MODE FEATURES ---

  /**
   * 1. Visual Shelf Audit (Multimodal)
   * Counts items in image and compares with system stock.
   */
  async analyzeShelfImage(base64Image: string, systemStock: number, productName: string, language: 'en' | 'ar'): Promise<VisualAuditResult> {
    const model = "gemini-2.5-flash";
    const prompt = language === 'ar' 
      ? `قم بعد وحدات المنتج '${productName}' في الصورة. مخزون النظام يقول ${systemStock}. هل هناك تطابق؟ قدم نصيحة.` 
      : `Count visible units of '${productName}' in this image. System says ${systemStock}. Is there a discrepancy? Advise.`;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: base64Image } },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              detectedCount: { type: Type.INTEGER },
              discrepancy: { type: Type.INTEGER },
              advice: { type: Type.STRING }
            }
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("Visual Audit Failed", error);
      return { detectedCount: 0, discrepancy: 0, advice: "Failed to analyze image." };
    }
  },

  /**
   * 2. Autonomous Negotiator
   * Drafts email based on product and market context.
   */
  async draftNegotiation(supplierName: string, productName: string, currentCost: number, language: 'en' | 'ar'): Promise<string> {
    const model = "gemini-2.5-flash";
    const prompt = language === 'ar'
      ? `أكتب مسودة بريد إلكتروني احترافية للمورد '${supplierName}'. نحن نطلب كمية كبيرة من '${productName}' (سعرنا الحالي ${currentCost}). تفاوض للحصول على خصم 5-10%. كن ودوداً وحازماً.`
      : `Draft a professional negotiation email to supplier '${supplierName}'. We are reordering '${productName}' (current cost ${currentCost}). Negotiate a 5-10% discount for bulk order. Be friendly but firm.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt
    });
    return response.text || "";
  },

  /**
   * 3. Financial Simulator (What-If)
   */
  async simulateFinancialScenario(scenario: string, currentRevenue: number, language: 'en' | 'ar'): Promise<SimulationResult> {
    const model = "gemini-2.5-flash";
    const prompt = `
      Scenario: ${scenario}
      Current Monthly Revenue: ${currentRevenue}
      Task: Estimate quantitative impact on Revenue and Profit Margin. Provide a recommendation.
      Language: ${language}
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              scenario: { type: Type.STRING },
              impactOnRevenue: { type: Type.STRING },
              impactOnProfit: { type: Type.STRING },
              recommendation: { type: Type.STRING }
            }
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (e) {
      return { scenario, impactOnRevenue: "Unknown", impactOnProfit: "Unknown", recommendation: "Simulation failed." };
    }
  },

  /**
   * 4. Dynamic Pricing Check
   */
  async checkCompetitorPrices(productName: string, currentPrice: number, language: 'en' | 'ar'): Promise<string> {
    const model = "gemini-2.5-flash";
    const prompt = language === 'ar'
      ? `ابحث عن سعر '${productName}' في السعودية/مصر حالياً. سعري هو ${currentPrice}. هل يجب أن أرفع السعر أم أخفضه؟`
      : `Search current market price for '${productName}' in KSA/Egypt. My price is ${currentPrice}. Should I increase or decrease?`;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });
      return response.text || "No data found.";
    } catch (e) {
      return "Error checking prices.";
    }
  },

  /**
   * 5. Voice Commander (Intent Recognition)
   */
  async parseVoiceCommand(transcript: string, language: 'en' | 'ar'): Promise<VoiceCommandAction> {
    const model = "gemini-2.5-flash";
    const prompt = `
      Analyze voice command: "${transcript}"
      Map to intent: ADD_TO_CART, CHECK_STOCK, NAVIGATE, UNKNOWN.
      Extract data (productName, qty, customerName, page).
      Lang: ${language}
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              intent: { type: Type.STRING, enum: ['ADD_TO_CART', 'CHECK_STOCK', 'NAVIGATE', 'UNKNOWN'] },
              data: { type: Type.OBJECT },
              response: { type: Type.STRING }
            }
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (e) {
      return { intent: 'UNKNOWN', data: {}, response: "I didn't understand that." };
    }
  }
};
