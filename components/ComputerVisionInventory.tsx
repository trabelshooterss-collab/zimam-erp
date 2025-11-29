
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ScanLine, X, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const mockShelfData = [
    { name: 'جنط ألمنيوم رياضي 18"', expected: 15, actual: 15, status: 'match' },
    { name: 'إطار ميشلان Primacy 4', expected: 32, actual: 30, status: 'mismatch' },
    { name: 'زيت محرك كاسترول 5W-30', expected: 4, actual: 4, status: 'match' },
    { name: 'فلتر هواء رياضي K&N', expected: 25, actual: 26, status: 'mismatch' },
];

const ComputerVisionInventory: React.FC = () => {
    const { theme } = useTheme();
    const [isScanning, setIsScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);
    const [scanResults, setScanResults] = useState<any[]>([]);

    const handleStartScan = () => {
        setIsScanning(true);
        setScanComplete(false);
        setScanResults([]);

        setTimeout(() => {
            setIsScanning(false);
            setScanComplete(true);
            setScanResults(mockShelfData);
        }, 4000); // Simulate 4-second scan
    };
    
    const handleReset = () => {
        setIsScanning(false);
        setScanComplete(false);
        setScanResults([]);
    }

    const getStatusPill = (status: string) => {
        if (status === 'match') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">الجرد بالكاميرا</h1>
            </div>

            <div className={`relative w-full aspect-video rounded-2xl border-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-200 border-slate-300'} overflow-hidden flex items-center justify-center`}>
                {/* Placeholder for camera feed */}
                <img src="https://images.unsplash.com/photo-1579583764894-18a5b3901d36?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-30" alt="Warehouse shelf"/>

                <AnimatePresence>
                    {isScanning && (
                        <motion.div 
                            initial={{ y: '-100%' }}
                            animate={{ y: '100%' }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 w-full h-1 bg-blue-500/70 shadow-[0_0_20px_5px_rgba(59,130,246,0.7)] z-10"
                        />
                    )}
                </AnimatePresence>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                     {!isScanning && !scanComplete && (
                        <button onClick={handleStartScan} className="flex flex-col items-center gap-4 text-white bg-black/30 backdrop-blur-sm p-8 rounded-3xl">
                            <Camera size={48} />
                            <span className="font-bold text-lg">بدء الجرد</span>
                        </button>
                     )}
                     {isScanning && (
                         <div className="flex flex-col items-center gap-4 text-white bg-black/30 backdrop-blur-sm p-8 rounded-3xl">
                            <motion.div animate={{rotate: 360}} transition={{repeat: Infinity, duration: 1, ease: 'linear'}}><RefreshCw size={48}/></motion.div>
                            <span className="font-bold text-lg">جاري المسح والتحليل...</span>
                        </div>
                     )}
                </div>
            </div>

            {scanComplete && (
                 <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-xl dark:text-white">نتائج الجرد</h2>
                        <button onClick={handleReset} className="text-sm font-medium text-blue-500 hover:underline">جرد جديد</button>
                    </div>
                     <table className="w-full text-sm text-right">
                        <thead className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            <tr>
                                <th className="p-3">المنتج</th>
                                <th className="p-3">الكمية المسجلة</th>
                                <th className="p-3">الكمية الفعلية</th>
                                <th className="p-3">الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scanResults.map((item, index) => (
                                <tr key={index} className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                                    <td className="p-3 font-medium dark:text-white">{item.name}</td>
                                    <td className="p-3 text-center dark:text-slate-300">{item.expected}</td>
                                    <td className="p-3 text-center font-bold dark:text-white">{item.actual}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 flex items-center gap-1.5 text-xs font-bold rounded-full ${getStatusPill(item.status)}`}>
                                            {item.status === 'match' ? <CheckCircle size={14}/> : <AlertTriangle size={14}/>}
                                            {item.status === 'match' ? 'مطابق' : 'يوجد فرق'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     <div className="mt-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                        <p className="text-sm font-bold">تم العثور على فروقات في <strong>{scanResults.filter(r => r.status === 'mismatch').length}</strong> منتجات. يرجى المراجعة.</p>
                     </div>
                 </motion.div>
            )}
        </motion.div>
    );
};

export default ComputerVisionInventory;
