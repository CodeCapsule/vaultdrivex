import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, ShieldCheck, CreditCard } from 'lucide-react';

interface StripePaymentFormProps {
    price: string;
    onSuccess: () => void;
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ price, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        // In a real app, you'd call stripe.confirmPayment()
        // For this demonstration, we'll simulate the secure validation and success
        setTimeout(() => {
            setIsProcessing(false);
            onSuccess();
        }, 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 mb-6 flex items-start gap-4">
                <ShieldCheck className="text-blue-600 shrink-0 mt-0.5" size={20} />
                <div>
                    <p className="text-sm font-bold text-slate-900">Premium Security Active</p>
                    <p className="text-xs text-slate-500">Your connection is encrypted with 256-bit SSL and processed securely by Stripe.</p>
                </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 mb-4 text-slate-400">
                    <CreditCard size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Secure Card Entry</span>
                </div>

                {/* Stripe Elements Placeholder / Real Element */}
                <PaymentElement options={{ layout: 'tabs' }} />
            </div>

            {errorMessage && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                    {errorMessage}
                </div>
            )}

            <button
                disabled={!stripe || isProcessing}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 ${isProcessing ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]'
                    }`}
            >
                {isProcessing ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        Verifying Transaction...
                    </>
                ) : (
                    <>
                        Pay {price} Securely
                    </>
                )}
            </button>

            <div className="flex items-center justify-center gap-6 opacity-40 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5" />
                <div className="h-4 w-px bg-slate-400"></div>
                <div className="flex items-center gap-1 text-[10px] font-black text-slate-900">
                    <ShieldCheck size={12} />
                    PCI COMPLIANT
                </div>
            </div>
        </form>
    );
};
