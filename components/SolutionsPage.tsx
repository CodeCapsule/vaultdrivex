import React from 'react';
import { Shield, LayoutDashboard, ChevronRight, Building2, Rocket, Globe2, Lock, Users, Zap, Briefcase, BarChart3, Server } from 'lucide-react';
import { CanvasBackground } from './CanvasBackground';
import { User } from '@supabase/supabase-js';

interface SolutionsPageProps {
  user: User | null;
  onNavigateToDashboard: () => void;
  onNavigateToHome: () => void;
  onNavigateToProduct: () => void;
  onNavigateToPricing: () => void;
  onNavigateToSupport: () => void;
  onNavigateToPrivacy: () => void;
  onNavigateToTerms: () => void;
  onAuthModalOpen: () => void;
}

export const SolutionsPage: React.FC<SolutionsPageProps> = ({
  user,
  onNavigateToDashboard,
  onNavigateToHome,
  onNavigateToProduct,
  onNavigateToPricing,
  onNavigateToSupport,
  onNavigateToPrivacy,
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
          <button className="text-blue-600 font-semibold transition-colors">Solutions</button>
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

      {/* Hero */}
      <div className="relative z-10 pt-12 md:pt-20 pb-32 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide mb-8 border border-blue-100">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          Tailored For You
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 max-w-5xl mx-auto leading-[1.1]">
          Tailored solutions for <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">every ambition</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-16 leading-relaxed">
          Whether you are scaling a startup, securing an enterprise, or managing remote teams, VaultDrive adapts to your workflow.
        </p>
      </div>

      {/* Solutions Grid */}
      <div className="relative z-10 py-24 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Enterprise Card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-transform">
              <Building2 size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Enterprise</h3>
            <p className="text-slate-500 mb-6 leading-relaxed">
              Bank-grade security protocols with SSO, comprehensive audit logs, and dedicated support for large organizations.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm font-medium text-slate-700"><Lock size={16} className="text-blue-500" /> Advanced Encryption</li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-700"><Server size={16} className="text-blue-500" /> On-premise Options</li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-700"><Users size={16} className="text-blue-500" /> Unlimited Seats</li>
            </ul>
            <button className="w-full py-2.5 border border-slate-200 rounded-lg text-slate-700 font-semibold hover:border-blue-500 hover:text-blue-600 transition-colors">Learn more</button>
          </div>

          {/* Startup Card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-50 to-transparent w-32 h-32 rounded-bl-full opacity-50"></div>
            <div className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform relative z-10">
              <Rocket size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 relative z-10">Startups</h3>
            <p className="text-slate-500 mb-6 leading-relaxed relative z-10">
              Move fast with scalable infrastructure. Start free and upgrade as your team grows without data migration headaches.
            </p>
            <ul className="space-y-3 mb-8 relative z-10">
              <li className="flex items-center gap-3 text-sm font-medium text-slate-700"><Zap size={16} className="text-blue-500" /> Rapid Deployment</li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-700"><Briefcase size={16} className="text-blue-500" /> Collaboration Tools</li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-700"><BarChart3 size={16} className="text-blue-500" /> Usage Analytics</li>
            </ul>
            <button className="w-full py-2.5 bg-blue-50 text-blue-700 rounded-lg font-semibold hover:bg-blue-100 transition-colors relative z-10">Get started</button>
          </div>

          {/* Remote Teams Card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 bg-emerald-500 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <Globe2 size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Remote Teams</h3>
            <p className="text-slate-500 mb-6 leading-relaxed">
              Collaborate from anywhere in the world with real-time syncing, offline access, and zero-latency file previews.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm font-medium text-slate-700"><Globe2 size={16} className="text-blue-500" /> Global CDN</li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-700"><Users size={16} className="text-blue-500" /> Real-time Collab</li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-700"><Lock size={16} className="text-blue-500" /> VPN Integration</li>
            </ul>
            <button className="w-full py-2.5 border border-slate-200 rounded-lg text-slate-700 font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-colors">View features</button>
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
            <button onClick={onNavigateToTerms} className="text-slate-500 hover:text-blue-600 transition-colors">Terms of Service</button>
          </div>
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} VaultDrive Inc.
          </p>
        </div>
      </footer>
    </div>
  );
};