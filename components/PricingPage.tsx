import React, { useState } from 'react';
import { Shield, LayoutDashboard, ChevronRight, Check, X, HelpCircle, Database, Headphones, ShieldCheck } from 'lucide-react';
import { CanvasBackground } from './CanvasBackground';
import { User } from 'firebase/auth';

interface PricingPageProps {
  user: User | null;
  onNavigateToDashboard: () => void;
  onNavigateToHome: () => void;
  onNavigateToProduct: () => void;
  onNavigateToSolutions: () => void;
  onNavigateToSupport: () => void;
  onAuthModalOpen: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ 
  user, 
  onNavigateToDashboard, 
  onNavigateToHome, 
  onNavigateToProduct, 
  onNavigateToSolutions,
  onNavigateToSupport,
  onAuthModalOpen
}) => {
  const [isYearly, setIsYearly] = useState(false);

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
          <button className="text-blue-600 font-semibold transition-colors">Pricing</button>
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

      {/* Hero */}
      <div className="relative z-10 pt-12 md:pt-20 pb-20 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide mb-8 border border-blue-100">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          Flexible Plans
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 max-w-5xl mx-auto leading-[1.1]">
          Simple pricing for <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">secure storage</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          Start for free, upgrade when you need more power. No hidden fees, no surprise charges.
        </p>
        
        {/* Toggle (Functional) */}
        <div className="flex justify-center items-center gap-4 mb-12 select-none">
           <span 
             className={`text-sm font-semibold cursor-pointer transition-colors ${!isYearly ? 'text-slate-900' : 'text-slate-500'}`}
             onClick={() => setIsYearly(false)}
           >
             Monthly
           </span>
           
           <button 
              onClick={() => setIsYearly(!isYearly)}
              className={`w-14 h-8 rounded-full p-1 cursor-pointer flex items-center transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isYearly ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'}`}
              aria-label="Toggle billing cycle"
           >
              <div className="w-6 h-6 bg-white rounded-full shadow-sm"></div>
           </button>
           
           <span 
             className={`text-sm font-medium cursor-pointer transition-colors ${isYearly ? 'text-slate-900' : 'text-slate-500'}`}
             onClick={() => setIsYearly(true)}
           >
             Yearly <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full ml-1">-20%</span>
           </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="relative z-10 px-6 pb-24 bg-slate-50 pt-24 border-t border-slate-200">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Starter */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
                <p className="text-sm text-slate-500 mb-6">Perfect for personal backups.</p>
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold text-slate-900">$0</span>
                    <span className="text-slate-500">/mo</span>
                </div>
                <button 
                    onClick={user ? onNavigateToDashboard : onAuthModalOpen}
                    className="w-full py-3 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors mb-8"
                >
                    Get Started Free
                </button>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-slate-700"><Check size={18} className="text-emerald-500 shrink-0" /> 5GB Secure Storage</div>
                    <div className="flex items-center gap-3 text-sm text-slate-700"><Check size={18} className="text-emerald-500 shrink-0" /> 1 User Account</div>
                    <div className="flex items-center gap-3 text-sm text-slate-700"><Check size={18} className="text-emerald-500 shrink-0" /> Basic Encryption</div>
                    <div className="flex items-center gap-3 text-sm text-slate-400"><X size={18} className="shrink-0" /> Team Sharing</div>
                    <div className="flex items-center gap-3 text-sm text-slate-400"><X size={18} className="shrink-0" /> Priority Support</div>
                </div>
            </div>

            {/* Pro - Highlighted */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl relative transform md:-translate-y-4 flex flex-col">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-wider">Most Popular</div>
                <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                <p className="text-sm text-slate-400 mb-6">For power users and freelancers.</p>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-white transition-all duration-300">${isYearly ? '9' : '12'}</span>
                    <span className="text-slate-400">/mo</span>
                </div>
                <div className="h-4 mb-6">
                  {isYearly && <p className="text-xs text-emerald-400 font-medium animate-in fade-in slide-in-from-top-1">Billed $108 yearly (Save $36)</p>}
                </div>

                <button 
                    onClick={onAuthModalOpen}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 transition-colors mb-8"
                >
                    Start 14-Day Trial
                </button>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-slate-200"><Check size={18} className="text-emerald-400 shrink-0" /> 1TB Secure Storage</div>
                    <div className="flex items-center gap-3 text-sm text-slate-200"><Check size={18} className="text-emerald-400 shrink-0" /> 5 User Accounts</div>
                    <div className="flex items-center gap-3 text-sm text-slate-200"><Check size={18} className="text-emerald-400 shrink-0" /> Zero-knowledge Encryption</div>
                    <div className="flex items-center gap-3 text-sm text-slate-200"><Check size={18} className="text-emerald-400 shrink-0" /> Advanced Sharing Controls</div>
                    <div className="flex items-center gap-3 text-sm text-slate-200"><Check size={18} className="text-emerald-400 shrink-0" /> Email Support</div>
                </div>
            </div>

            {/* Business */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-lg transition-all duration-300 flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Business</h3>
                <p className="text-sm text-slate-500 mb-6">For teams and organizations.</p>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-slate-900 transition-all duration-300">${isYearly ? '23' : '29'}</span>
                    <span className="text-slate-500">/user/mo</span>
                </div>
                <div className="h-4 mb-6">
                   {isYearly && <p className="text-xs text-emerald-600 font-medium animate-in fade-in slide-in-from-top-1">Billed yearly</p>}
                </div>
                
                <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold transition-colors mb-8">
                    Contact Sales
                </button>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-slate-700"><Check size={18} className="text-emerald-500 shrink-0" /> Unlimited Storage</div>
                    <div className="flex items-center gap-3 text-sm text-slate-700"><Check size={18} className="text-emerald-500 shrink-0" /> Unlimited Users</div>
                    <div className="flex items-center gap-3 text-sm text-slate-700"><Check size={18} className="text-emerald-500 shrink-0" /> SSO & Audit Logs</div>
                    <div className="flex items-center gap-3 text-sm text-slate-700"><Check size={18} className="text-emerald-500 shrink-0" /> Custom Data Retention</div>
                    <div className="flex items-center gap-3 text-sm text-slate-700"><Check size={18} className="text-emerald-500 shrink-0" /> 24/7 Priority Support</div>
                </div>
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
             <p className="text-slate-500 text-sm">
                &copy; {new Date().getFullYear()} VaultDrive Inc.
             </p>
        </div>
      </footer>
    </div>
  );
};