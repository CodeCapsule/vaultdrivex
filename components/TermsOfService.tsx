import React from 'react';
import { Shield, LayoutDashboard, ChevronRight, FileText, Scale, CheckCircle2, AlertCircle, Gavel, Mail } from 'lucide-react';
import { CanvasBackground } from './CanvasBackground';
import { User } from '@supabase/supabase-js';

interface TermsOfServiceProps {
    user: User | null;
    onNavigateToDashboard: () => void;
    onNavigateToHome: () => void;
    onNavigateToProduct: () => void;
    onNavigateToSolutions: () => void;
    onNavigateToPricing: () => void;
    onNavigateToSupport: () => void;
    onNavigateToPrivacy: () => void;
    onAuthModalOpen: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({
    user,
    onNavigateToDashboard,
    onNavigateToHome,
    onNavigateToProduct,
    onNavigateToSolutions,
    onNavigateToPricing,
    onNavigateToSupport,
    onNavigateToPrivacy,
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
                    Terms of Service
                </h1>
                <p className="text-lg text-slate-500 mb-12 leading-relaxed">
                    Please read these terms carefully before using VaultDrive. By accessing or using our platform, you agree to be bound by these terms.
                </p>

                <div className="space-y-12">
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                <CheckCircle2 size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">1. Acceptance of Terms</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            By using VaultDrive, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you are using the service on behalf of an organization, you represent that you have the authority to bind that organization to these terms.
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                <Scale size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">2. User Responsibilities</h2>
                        </div>
                        <div className="space-y-4 text-slate-600 leading-relaxed">
                            <p>
                                As a user of VaultDrive, you agree:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>To provide accurate and complete information during registration.</li>
                                <li>To keep your account credentials and encryption keys secure.</li>
                                <li>That you are solely responsible for all activity that occurs under your account.</li>
                                <li>Not to use the service for any illegal or unauthorized purposes.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-slate-50 border border-slate-200 p-8 rounded-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                <Shield size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">3. Account & Content Security</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            VaultDrive uses zero-knowledge encryption. We do not store or have access to your passwords or encryption keys.
                        </p>
                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-4">
                            <AlertCircle size={24} className="text-amber-600 shrink-0" />
                            <p className="text-sm text-amber-800 font-medium">
                                <strong>CRITICAL:</strong> If you lose your account password or encryption keys, we cannot recover your data. We do not have "master keys" or any bypass mechanisms.
                            </p>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                <Gavel size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">4. Prohibited Uses</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            You may not use VaultDrive to store or transmit material that:
                        </p>
                        <ul className="list-disc pl-6 mt-4 space-y-2 text-slate-600">
                            <li>Infringes on intellectual property rights.</li>
                            <li>Is defamatory, obscene, or threatening.</li>
                            <li>Contains viruses, malware, or other harmful code.</li>
                            <li>Interferes with the operation of our services.</li>
                        </ul>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                                <Scale size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">5. Limitation of Liability</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            To the maximum extent permitted by law, VaultDrive shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
                        </p>
                    </section>
                </div>

                <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-400 text-sm">
                        &copy; {new Date().getFullYear()} VaultDrive Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <button
                            onClick={onNavigateToPrivacy}
                            className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                        >
                            Privacy Policy
                        </button>
                        <button
                            onClick={onNavigateToHome}
                            className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                        >
                            Home
                        </button>
                    </div>
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
                        <button onClick={onNavigateToPrivacy} className="text-slate-500 hover:text-blue-600 transition-colors">Privacy Policy</button>
                        <button onClick={() => { }} className="text-blue-600 font-semibold transition-colors">Terms of Service</button>
                        <button onClick={onNavigateToPricing} className="text-slate-500 hover:text-blue-600 transition-colors">Pricing</button>
                    </div>
                    <p className="text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} VaultDrive Inc.
                    </p>
                </div>
            </footer>
        </div>
    );
};
