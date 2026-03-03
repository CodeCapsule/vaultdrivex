import React, { useState } from 'react';
import { Shield, Lock, CreditCard, ChevronRight, CheckCircle2, ShieldCheck, Globe, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { CanvasBackground } from './CanvasBackground';
import { User } from '@supabase/supabase-js';

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
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        cardNumber: '',
        expiry: '',
        cvc: '',
        zip: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            onNavigateToSuccess();
        }, 2500);
    };

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

                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-6">
                        Secure Checkout
                    </h1>
                    <p className="text-lg text-slate-500 mb-12 leading-relaxed">
                        You're one step away from unlocking premium security features. Your privacy is our priority.
                    </p>

                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 mb-10">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Order Summary</h3>
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex flex-col">
                                <span className="font-bold text-xl text-slate-900">VaultDrive {planName}</span>
                                <span className="text-sm text-slate-500 capitalize">{billingCycle} Billing</span>
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
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle2 size={18} className="text-emerald-500" />
                                <span>24/7 Priority Support</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <span className="font-bold text-slate-900">Total Today</span>
                            <span className="font-black text-2xl text-blue-600">{price}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col gap-3">
                            <ShieldCheck size={24} className="text-blue-600" />
                            <div className="text-sm">
                                <p className="font-bold text-slate-900">Zero-Knowledge</p>
                                <p className="text-slate-500">We never store your keys.</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col gap-3">
                            <Lock size={24} className="text-emerald-500" />
                            <div className="text-sm">
                                <p className="font-bold text-slate-900">Tier-1 Security</p>
                                <p className="text-slate-500">PCI DSS Level 1 compliant.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Payment Form */}
                <div className="relative">
                    <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-2xl shadow-blue-900/10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-slate-900">Payment Details</h2>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-5 bg-slate-100 rounded border border-slate-200 overflow-hidden relative grayscale opacity-50">
                                        <CreditCard size={14} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <div className="w-8 h-5 bg-slate-100 rounded border border-slate-200 overflow-hidden relative grayscale opacity-50">
                                        <Globe size={14} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Account Owner</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Full Name"
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Card Number</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        placeholder="0000 0000 0000 0000"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-400 pl-12"
                                    />
                                    <CreditCard size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Expiry</label>
                                    <input
                                        type="text"
                                        name="expiry"
                                        placeholder="MM/YY"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">CVC</label>
                                    <input
                                        type="text"
                                        name="cvc"
                                        placeholder="•••"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 pb-4">
                                <label className="text-sm font-semibold text-slate-700">ZIP Code</label>
                                <input
                                    type="text"
                                    name="zip"
                                    placeholder="94105"
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className={`w-full py-4 rounded-xl font-bold text-white shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 ${isProcessing ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Securely Processing...
                                    </>
                                ) : (
                                    <>
                                        Pay {price}
                                        <ChevronRight size={20} />
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-center text-slate-400 mt-6 leading-relaxed">
                                By clicking "Pay", you agree to VaultDrive's Terms of Service and Privacy Policy. Payments are processed securely via SSL encryption.
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            <footer className="relative z-10 py-12 px-6 border-t border-slate-100 mt-20">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 opacity-50 grayscale scale-95">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Shield size={16} />
                        VaultDrive Secure Payments
                    </div>
                    <div className="flex gap-8 text-xs font-semibold text-slate-500">
                        <span>PCI DSS COMPLIANT</span>
                        <span>256-BIT AES ENCRYPTION</span>
                        <span>GDPR COMPLIANT</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};
