import React from 'react';
import { Shield, LayoutDashboard, ChevronRight, FileText, Lock, Eye, ShieldCheck, Globe, Mail } from 'lucide-react';
import { CanvasBackground } from './CanvasBackground';
import { User } from '@supabase/supabase-js';

interface PrivacyPolicyProps {
    user: User | null;
    onNavigateToDashboard: () => void;
    onNavigateToHome: () => void;
    onNavigateToProduct: () => void;
    onNavigateToSolutions: () => void;
    onNavigateToPricing: () => void;
    onNavigateToSupport: () => void;
    onNavigateToTerms: () => void;
    onAuthModalOpen: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
    user,
    onNavigateToDashboard,
    onNavigateToHome,
    onNavigateToProduct,
    onNavigateToSolutions,
    onNavigateToPricing,
    onNavigateToSupport,
    onNavigateToTerms,
    onAuthModalOpen
}) => {
    return (
        <div className="min-h-screen bg-white relative font-sans text-slate-900 selection:bg-blue-100 overflow-x-hidden">
            <CanvasBackground />

            {/* Navbar */}
            <nav className="relative z-10 max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                <div
                    className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-slate-900 cursor-pointer"
                    onClick={onNavigateToHome}
                >
                    <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-500/30">
                        <Shield size={20} fill="currentColor" />
                    </div>
                    VaultDrive
                </div>

                <div className="hidden md:flex items-center gap-10 text-sm font-medium text-slate-500">
                    <button onClick={onNavigateToProduct} className="hover:text-blue-600 transition-colors">Product</button>
                    <button onClick={onNavigateToSolutions} className="hover:text-blue-600 transition-colors">Solutions</button>
                    <button onClick={onNavigateToPricing} className="hover:text-blue-600 transition-colors">Pricing</button>
                    <button onClick={onNavigateToSupport} className="hover:text-blue-600 transition-colors">Support</button>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <button
                            onClick={onNavigateToDashboard}
                            className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-xl shadow-emerald-200"
                        >
                            Go to Dashboard
                            <LayoutDashboard size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={onAuthModalOpen}
                            className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-200"
                        >
                            Get Started
                            <ChevronRight size={16} />
                        </button>
                    )}
                </div>
            </nav>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide mb-8 border border-blue-100">
                    <FileText size={14} />
                    Last Updated: March 2026
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
                    Privacy Policy
                </h1>
                <p className="text-lg text-slate-500 mb-12 leading-relaxed">
                    At VaultDrive, we take your privacy seriously. This policy explains how we collect, use, and protect your data, with a commitment to our zero-knowledge security architecture.
                </p>

                <div className="space-y-12">
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                <Globe size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">1. Introduction</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            VaultDrive ("we," "our," or "us") provides a secure cloud storage and collaboration platform. Your privacy is a fundamental right, and we design our products to minimize the collection of personal information while maximizing security.
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                <Eye size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">2. Data We Collect</h2>
                        </div>
                        <div className="space-y-4 text-slate-600 leading-relaxed">
                            <p>
                                We collect information necessary to provide and improve our services:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Account Information:</strong> Email address and profile information provided during registration.</li>
                                <li><strong>Usage Data:</strong> Technical information about your device, IP address (anonymized), and how you interact with our platform to ensure stability and performance.</li>
                                <li><strong>Payment Information:</strong> Processed through secure third-party providers (e.g., Stripe). We do not store your full credit card details.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/30">
                                    <Lock size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-100">3. Zero-Knowledge Security</h2>
                            </div>
                            <p className="text-slate-300 leading-relaxed mb-4">
                                Our core commitment is <strong>Zero-Knowledge Encryption</strong>. This means:
                            </p>
                            <ul className="space-y-3 text-slate-400 text-sm">
                                <li className="flex items-start gap-3">
                                    <ShieldCheck size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <span>Your files are encrypted on your device <strong>before</strong> they are uploaded.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <ShieldCheck size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <span>We do not have access to your encryption keys.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <ShieldCheck size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <span>Neither VaultDrive employees nor any third party can read your stored content.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                <Shield size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">4. Data Sharing and Disclosure</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            We do not sell your personal data. We only share information with trusted service providers who help us operate our platform (e.g., hosting, payment processing) and who are contractually bound to protect your data. We may disclose information if required by law, but because of our zero-knowledge architecture, we cannot disclose your encrypted files.
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                <Mail size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">5. Contact Us</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            If you have any questions about this Privacy Policy or our data practices, please contact our data protection officer at:
                        </p>
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                            <p className="font-bold text-slate-900">VaultDrive Legal Department</p>
                            <p className="text-slate-500">privacy@vaultdrive.com</p>
                            <p className="text-slate-500">123 Security Ave, Suite 400</p>
                            <p className="text-slate-500">San Francisco, CA 94105</p>
                        </div>
                    </section>
                </div>
            </div>

            <footer className="bg-white border-t border-slate-200 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg flex items-center justify-center text-white">
                            <Shield size={20} fill="currentColor" />
                        </div>
                        <span className="font-bold text-xl text-slate-900 tracking-tight">VaultDrive</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                        <button onClick={() => { }} className="text-blue-600 font-semibold transition-colors">Privacy Policy</button>
                        <button onClick={onNavigateToTerms} className="text-slate-500 hover:text-blue-600 transition-colors">Terms of Service</button>
                        <button onClick={onNavigateToPricing} className="text-slate-500 hover:text-blue-600 transition-colors">Pricing</button>
                    </div>
                    <p className="text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} VaultDrive Inc.
                    </p>
                </div>
            </footer>
        </div >
    );
};
