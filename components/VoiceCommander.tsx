
import React, { useState } from 'react';
import { Mic, MicOff, Loader2, Command } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { useLanguage } from '../i18n';
import { useStore } from '../context/StoreContext';

interface VoiceCommanderProps {
  setActiveTab: (tab: string) => void;
}

const VoiceCommander: React.FC<VoiceCommanderProps> = ({ setActiveTab }) => {
  const { t, language } = useLanguage();
  const { addToCartByName } = useStore();
  const [isListening, setIsListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Browser doesn't support speech recognition. Try Chrome.");
      return;
    }
    
    setIsListening(true);
    setResult(null);
    
    // @ts-ignore
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';
    recognition.continuous = false;
    
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      handleVoiceCommand(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  const handleVoiceCommand = async (text: string) => {
    setProcessing(true);
    try {
      const response = await GeminiService.parseVoiceCommand(text, language);
      
      // Execute Actions
      let feedback = response.response;

      if (response.intent === 'NAVIGATE' && response.data?.page) {
        // Map extracted page to tab IDs
        const pageMap: Record<string, string> = {
           'dashboard': 'dashboard',
           'pos': 'pos',
           'inventory': 'inventory',
           'invoices': 'invoices',
           'accounting': 'accounting',
           'settings': 'settings'
        };
        const target = pageMap[response.data.page.toLowerCase()];
        if (target) {
           setActiveTab(target);
        }
      } else if (response.intent === 'ADD_TO_CART' && response.data?.productName) {
         const qty = response.data.qty || 1;
         const success = addToCartByName(response.data.productName, qty);
         if (!success) {
             feedback = language === 'ar' ? 'لم أجد المنتج أو المخزون غير كافٍ' : 'Product not found or out of stock';
         }
      }

      setResult(`${text} -> ${feedback}`);
      setTimeout(() => setResult(null), 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-6 end-6 z-50">
      {result && (
        <div className="absolute bottom-16 end-0 bg-black/80 text-white text-sm p-3 rounded-lg shadow-lg w-64 mb-2 animate-in fade-in slide-in-from-bottom-2">
           <div className="flex items-start gap-2">
             <Command className="w-4 h-4 mt-1 text-primary-400" />
             <p>{result}</p>
           </div>
        </div>
      )}
      
      <button
        onClick={isListening ? () => setIsListening(false) : startListening}
        className={`
          p-4 rounded-full shadow-lg transition-all duration-300 border-4
          ${isListening 
            ? 'bg-red-500 border-red-200 text-white animate-pulse scale-110' 
            : processing 
              ? 'bg-amber-500 border-amber-200 text-white'
              : 'bg-primary-600 border-white text-white hover:bg-primary-700 hover:scale-105'}
        `}
        title={t('voice_cmd')}
      >
        {processing ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : isListening ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default VoiceCommander;
