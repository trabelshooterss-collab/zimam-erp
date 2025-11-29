import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Globe, Shield, Zap, CreditCard } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PaymentGateway from './PaymentGateway';

interface SubscriptionPlansProps {
  onSubscribe: () => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ onSubscribe }) => {
  const { t, dir } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<{ name: string, price: number } | null>(null);

  const plans = [
    {
      id: 'basic',
      name: t('plan_basic'),
      price: billingCycle === 'monthly' ? 49 : 490,
      features: ['POS System', 'Basic Inventory', '5 Users', 'Email Support'],
      icon: Shield,
      color: 'blue'
    },
    {
      id: 'pro',
      name: t('plan_pro'),
      price: billingCycle === 'monthly' ? 99 : 990,
      features: ['Advanced Inventory', 'Accounting', '15 Users', 'Priority Support', 'AI Assistant (Basic)'],
      icon: Zap,
      color: 'purple',
      popular: true
    },
    {
      id: 'premium',
      name: t('plan_premium'),
      price: billingCycle === 'monthly' ? 199 : 1990,
      features: ['Full AI Suite', 'Multi-Branch', 'Unlimited Users', '24/7 Support', 'API Access'],
      icon: Star,
      color: 'orange'
    },
    {
      id: 'global',
      name: t('plan_global'),
      price: billingCycle === 'monthly' ? 299 : 2990,
      features: ['Global Tax Compliance', 'Multi-Currency', 'Dedicated Manager', 'Custom Integrations'],
      icon: Globe,
      color: 'green'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] py-20 px-6 font-sans" dir={dir}>
      {selectedPlan && (
        <PaymentGateway
          planName={selectedPlan.name}
          amount={selectedPlan.price}
          onSuccess={() => {
            setSelectedPlan(null);
            onSubscribe();
          }}
          onCancel={() => setSelectedPlan(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('subscription_plans')}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your business growth. Upgrade or cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{t('monthly')}</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-16 h-8 bg-slate-200 dark:bg-white/10 rounded-full relative transition-colors"
            >
              <motion.div
                animate={{ x: billingCycle === 'monthly' ? 4 : 36 }}
                className="w-6 h-6 bg-white rounded-full shadow-md absolute top-1 left-0"
              />
            </button>
            <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
              {t('yearly')} <span className="text-green-500 text-xs ml-1">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white dark:bg-[#111] rounded-3xl p-8 border transition-all hover:scale-105 hover:shadow-2xl ${plan.popular
                  ? 'border-blue-500 shadow-blue-500/20 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-white/10 shadow-xl'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-${plan.color}-500/10 text-${plan.color}-500`}>
                <plan.icon size={24} />
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                <span className="text-slate-500 text-sm">{t('currency')}/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setSelectedPlan({ name: plan.name, price: plan.price })}
                className={`w-full py-3 rounded-xl font-bold transition-colors ${plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white'
                  }`}
              >
                {t('subscribe_now')}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mt-20 text-center">
          <p className="text-slate-500 text-sm mb-6">Secure payment via</p>
          <div className="flex flex-wrap justify-center items-center gap-6 opacity-70 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300"><CreditCard size={20} /> Stripe</div>
            <div className="flex items-center gap-2 font-bold text-blue-600"><CreditCard size={20} /> PayPal</div>
            <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-2"></div>
            <div className="flex items-center gap-2 font-bold text-blue-800">Paymob</div>
            <div className="flex items-center gap-2 font-bold text-yellow-600">Fawry</div>
            <div className="flex items-center gap-2 font-bold text-blue-500">Mada</div>
            <div className="flex items-center gap-2 font-bold text-purple-600">STC Pay</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SubscriptionPlans;