import React, { useState, useRef } from 'react';
import { MessageSquare, Upload, Check, Loader2, FileText } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { useLanguage } from '../i18n';

const WhatsAppOCR: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ vendor: string; total: number; date: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setSelectedImage(evt.target.result as string);
          setResult(null); // Reset previous result
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!selectedImage) return;
    
    setProcessing(true);
    try {
      // Strip the data:image/jpeg;base64, part for the API
      const base64Data = selectedImage.split(',')[1];
      const data = await GeminiService.parseInvoiceImage(base64Data);
      setResult(data);
    } catch (error) {
      alert("Failed to process image. Please try a clearer image.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-8 h-8 text-green-500" />
          {t('wa_automation')}
        </h1>
        <p className="text-gray-500 mt-1">
          {t('wa_desc')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Area */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">{t('sim_incoming')}</h2>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-colors
              ${selectedImage ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-primary-500 hover:bg-gray-50'}
            `}
          >
            {selectedImage ? (
              <img src={selectedImage} alt="Preview" className="h-full w-full object-contain rounded-lg" />
            ) : (
              <div className="text-center p-6">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">{t('click_upload')}</p>
                <p className="text-xs text-gray-400 mt-1">{t('supports')}</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileSelect}
            />
          </div>

          <button 
            onClick={processImage}
            disabled={!selectedImage || processing}
            className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? <Loader2 className="animate-spin w-5 h-5" /> : <Check className="w-5 h-5" />}
            {processing ? t('extracting') : t('process_gemini')}
          </button>
        </div>

        {/* Result Area */}
        <div className="space-y-6">
          <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg h-full relative overflow-hidden">
            <div className="absolute top-0 end-0 p-32 bg-green-500 rounded-full blur-3xl opacity-10 -me-16 -mt-16"></div>
            
            <h2 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-400" />
              {t('extracted_data')}
            </h2>

            {result ? (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider">{t('vendor')}</label>
                  <div className="text-2xl font-bold text-white mt-1">{result.vendor || t('unknown')}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider">{t('total')}</label>
                    <div className="text-2xl font-bold text-green-400 mt-1">{result.total?.toLocaleString()} {t('currency_sar')}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider">{t('date')}</label>
                    <div className="text-xl text-white mt-1">{result.date}</div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-700">
                  <button className="w-full bg-white text-gray-900 hover:bg-gray-100 py-2 rounded-lg font-semibold text-sm">
                    {t('create_draft')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-60">
                <p>{t('waiting')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppOCR;