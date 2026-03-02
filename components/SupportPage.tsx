import React from 'react';
import { Shield, LayoutDashboard, ChevronRight, Search, Book, MessageCircle, FileQuestion, Mail, Zap, ChevronDown } from 'lucide-react';
import { CanvasBackground } from './CanvasBackground';
import { User } from '@supabase/supabase-js';

interface SupportPageProps {
  user: User | null;
  onNavigateToDashboard: () => void;
  onNavigateToHome: () => void;
  onNavigateToProduct: () => void;
  onNavigateToSolutions: () => void;
  onNavigateToPricing: () => void;
  onAuthModalOpen: () => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({
  user,
  onNavigateToDashboard,
  onNavigateToHome,
  onNavigateToProduct,
  onNavigateToSolutions,
  onNavigateToPricing,
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
          <button className="text-blue-600 font-semibold transition-colors">Support</button>
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
          24/7 Assistance
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 max-w-5xl mx-auto leading-[1.1]">
          How can we <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">help you today?</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          Search our knowledge base, read the docs, or get in touch with our expert support team.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search for articles, guides, and more..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl shadow-lg shadow-blue-900/5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
          />
        </div>
      </div>

      {/* Support Categories */}
      <div className="relative bg-slate-50 py-24 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Documentation */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Book size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Documentation</h3>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Detailed guides and API references to help you build and scale with VaultDrive.
              </p>
              <div className="flex items-center text-blue-600 font-semibold gap-2 group-hover:gap-3 transition-all">
                Browse Docs <ChevronRight size={16} />
              </div>
            </div>

            {/* Community */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
              <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <MessageCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Community Forum</h3>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Join the conversation. Ask questions, share ideas, and connect with other users.
              </p>
              <div className="flex items-center text-emerald-600 font-semibold gap-2 group-hover:gap-3 transition-all">
                Visit Forum <ChevronRight size={16} />
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <FileQuestion size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">FAQs</h3>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Quick answers to common questions about billing, account management, and security.
              </p>
              <div className="flex items-center text-purple-600 font-semibold gap-2 group-hover:gap-3 transition-all">
                View FAQs <ChevronRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Still need help?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl border border-slate-200 hover:border-blue-200 bg-slate-50/50 flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600 mb-4">
                <Mail size={24} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Email Support</h4>
              <p className="text-slate-500 text-sm mb-6">For general inquiries and account issues.</p>
              <button className="px-6 py-2 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                support@vaultdrive.com
              </button>
            </div>

            <div className="p-8 rounded-2xl border border-slate-200 hover:border-emerald-200 bg-slate-50/50 flex flex-col items-center">
              <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 mb-4">
                <Zap size={24} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Live Chat</h4>
              <p className="text-slate-500 text-sm mb-6">Available Mon-Fri, 9am - 5pm EST.</p>
              <button className="px-6 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                Start Chat
              </button>
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