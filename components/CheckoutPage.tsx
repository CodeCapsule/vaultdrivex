import React, { useState, useEffect } from 'react';
import { Shield, Lock, ChevronRight, CheckCircle2, ShieldCheck, ArrowLeft, Loader2, Sparkles, PartyPopper, Check } from 'lucide-react';
import { CanvasBackground } from './CanvasBackground';
import { User } from '@supabase/supabase-js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { StripePaymentForm } from './StripePaymentForm';

// Initialize Stripe outside to avoid re-mounting
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

interface CheckoutPageProps {
    user: User | null;
    planName: string;
    price: string;
    billingCycle: 'monthly' | 'yearly';
    onNavigateToHome: () => void;
    onNavigateToPricing: () => void;
    onNavigateToSuccess: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
    user,
    planName,
    price,
    billingCycle,
    onNavigateToHome,
    onNavigateToPricing,
    onNavigateToSuccess
}) => {
    const [showSuccess, setShowSuccess] = useState(false);

    const handlePaymentSuccess = () => {
        setShowSuccess(true);
        setTimeout(() => {
            onNavigateToSuccess();
        }, 4000);
    };

    // Stripe Elements appearance configuration for "Premium" look
    const appearance = {
        theme: 'stripe' as const,
        variables: {
            colorPrimary: '#2563eb', // Blue 600
            colorBackground: '#f8fafc', // Slate 50
            colorText: '#0f172a', // Slate 900
            colorDanger: '#df1b41',
            fontFamily: 'Inter, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '12px',
        },
    };

    // Calculate amount for Stripe (in cents)
    const amountInCents = parseInt(price.replace(/[^0-9]/g, '')) * 100 || 2900;

    const options = {
        mode: 'payment' as const,
        amount: amountInCents,
        currency: 'usd',
        appearance,
    };

    if (showSuccess) {
        return (
            <div className="min-h-screen bg-white relative flex items-center justify-center p-6 overflow-hidden">
                <CanvasBackground />
                <div className="relative z-10 text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/40">
                        <Check size={48} className="text-white" strokeWidth={3} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-4 font-display">Payment Confirmed!</h1>
                    <p className="text-xl text-slate-500 mb-10 max-w-md mx-auto">
                        Welcome to the Pro tier. Your vault capacity has been upgraded.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-bold animate-pulse">
                        <Loader2 size={16} className="animate-spin" />
                        Initializing Premium Account...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white relative font-sans text-slate-900 selection:bg-blue-100 overflow-x-hidden">
            <CanvasBackground />

            {/* Navbar Minimal */}
            <nav className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div
                    className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-slate-900 cursor-pointer"
                    onClick={onNavigateToHome}
                >
                    <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-500/30">
                        <Shield size={20} fill="currentColor" />
                    </div>
                    VaultDrive
                </div>

                <button
                    onClick={onNavigateToPricing}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Pricing
                </button>
            </nav>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">

                {/* Left Side: Order Summary & Trust */}
                <div className="flex flex-col">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide mb-8 border border-blue-100 w-fit">
                        <Sparkles size={14} className="text-blue-600" />
                        Complete Your Upgrade
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-6 font-display">
                        Premium Verification
                    </h1>
                    <p className="text-lg text-slate-500 mb-12 leading-relaxed">
                        VaultDrive uses Stripe's banking-grade security to ensure your payment details remain fully encrypted and private.
                    </p>

                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 mb-10">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Order Summary</h3>
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex flex-col">
                                <span className="font-bold text-xl text-slate-900">VaultDrive {planName}</span>
                                <span className="text-sm text-slate-500 capitalize">{billingCycle} Billing cycle</span>
                            </div>
                            <span className="text-2xl font-bold text-slate-900">{price}</span>
                        </div>

                        <div className="h-px bg-slate-200 my-6"></div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle2 size={18} className="text-emerald-500" />
                                <span>Unlimited End-to-End Encryption</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle2 size={18} className="text-emerald-500" />
                                <span>Advanced Security Controls</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <span className="font-bold text-slate-900">Amount Due</span>
                            <span className="font-black text-2xl text-blue-600">{price}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col gap-3">
                            <ShieldCheck size={24} className="text-blue-600" />
                            <div className="text-sm">
                                <p className="font-bold text-slate-900">Zero-Knowledge</p>
                                <p className="text-slate-500">Encrypted keys only.</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col gap-3">
                            <Lock size={24} className="text-emerald-500" />
                            <div className="text-sm">
                                <p className="font-bold text-slate-900">Tier-1 Security</p>
                                <p className="text-slate-500">PCI Level 1 compliant.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Payment Form (Stripe Elements) */}
                <div className="relative">
                    <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-2xl shadow-blue-900/10">
                        <h2 className="text-xl font-bold text-slate-900 mb-8">Secure Payment</h2>

                        {stripePromise ? (
                            <Elements stripe={stripePromise} options={options}>
                                <StripePaymentForm price={price} onSuccess={handlePaymentSuccess} />
                            </Elements>
                        ) : (
                            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-slate-500 text-sm">Stripe configuration missing. Please check your environment variables.</p>
                            </div>
                        )}

                        <p className="text-[10px] text-center text-slate-400 mt-8 leading-relaxed uppercase tracking-widest font-bold">
                            Secure 256-bit SSL Encrypted Connection
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
