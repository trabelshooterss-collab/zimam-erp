import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PaymentGatewayProps {
    planName: string;
    amount: number;
    onSuccess: () => void;
    onCancel: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ planName, amount, onSuccess, onCancel }) => {
    const { t, dir } = useLanguage();
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePayment = () => {
        setProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);
            setTimeout(onSuccess, 2000);
        }, 2000);
    };

    if (success) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-slate-900 p-8 rounded-3xl text-center max-w-sm w-full mx-4"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle size={40} className="text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Payment Successful!</h3>
                    <p className="text-slate-500 mb-6">Welcome to Zimam ERP {planName}</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" dir={dir}>
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden max-w-md w-full mx-4 shadow-2xl"
            >
                {/* Header */}
                <div className="bg-slate-50 dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Lock size={16} className="text-green-500" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Secure Payment</span>
                    </div>
                    <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="mb-8 text-center">
                        <p className="text-slate-500 text-sm uppercase tracking-wider mb-1">Total Amount</p>
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">${amount}</h2>
                        <p className="text-blue-500 font-medium mt-2">{planName} Plan</p>
                    </div>

                    {/* Payment Methods */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button className="p-4 border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex flex-col items-center gap-2 transition-all">
                            <CreditCard className="text-blue-500" />
                            <span className="text-xs font-bold text-blue-700 dark:text-blue-300">Credit Card</span>
                        </button>
                        <button className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            <span className="font-bold text-slate-700 dark:text-slate-300">PayPal</span>
                        </button>
                    </div>

                    {/* Form */}
                    <div className="space-y-4 mb-8">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Card Number</label>
                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-3 font-mono" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Expiry</label>
                                <input type="text" placeholder="MM/YY" className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-3 font-mono" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CVC</label>
                                <input type="text" placeholder="123" className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-3 font-mono" />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={processing}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>Processing...</>
                        ) : (
                            <>Pay Now</>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentGateway;
