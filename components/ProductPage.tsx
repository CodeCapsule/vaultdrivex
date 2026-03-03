import React from 'react';
import { Shield, LayoutDashboard, Check, Lock, Users, HardDrive, FileText, StickyNote, ChevronRight, MoreHorizontal, CheckCircle2, Plus, Globe, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { CanvasBackground } from './CanvasBackground';
import { User } from '@supabase/supabase-js';

interface ProductPageProps {
  user: User | null;
  onNavigateToDashboard: () => void;
  onNavigateToHome: () => void;
  onNavigateToSolutions: () => void;
  onNavigateToPricing: () => void;
  onNavigateToSupport: () => void;
  onNavigateToPrivacy: () => void;
  onNavigateToTerms: () => void;
  onAuthModalOpen: () => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  user,
  onNavigateToDashboard,
  onNavigateToHome,
  onNavigateToSolutions,
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
          <button className="text-blue-600 font-semibold transition-colors">Product</button>
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

      {/* Hero */}
      <div className="relative z-10 pt-12 md:pt-20 pb-32 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide mb-8 border border-blue-100">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          Enterprise-Grade Security
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 max-w-5xl mx-auto leading-[1.1]">
          The intelligent workspace for <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">digital assets</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-16 leading-relaxed">
          VaultDrive transcends traditional storage by integrating advanced file management, military-grade encryption, and seamless collaboration.
        </p>
      </div>

      {/* Feature 1: Files */}
      <div className="py-24 px-6 relative bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20 relative z-10">
          <div className="flex-1 space-y-8">
            <div className="w-14 h-14 bg-white border border-slate-200 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <HardDrive size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">Advanced Asset <br />Management</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Streamline your workflow with intelligent organization. Upload, categorize, and preview enterprise documents with our high-performance filing system.
              </p>
            </div>
            <div className="space-y-4">
              {[
                "Intuitive drag-and-drop interface",
                "Instantaneous file rendering",
                "Structured folder hierarchy"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <Check size={14} />
                  </div>
                  <span className="text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full perspective-1000">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all duration-500 group-hover:rotate-y-2 group-hover:scale-[1.02]">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="px-3 py-1 bg-white rounded-md shadow-sm border border-slate-100 text-xs font-bold text-blue-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                    Live Sync
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">My Files</h4>
                      <p className="text-xs text-slate-400">/Secure/Work/Projects</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: "Financial_Report_Q3.pdf", size: "2.4 MB", type: "pdf", color: "text-red-500", bg: "bg-red-50" },
                      { name: "Brand_Assets_v2.zip", size: "156 MB", type: "zip", color: "text-amber-500", bg: "bg-amber-50" },
                      { name: "Project_Timeline.docx", size: "450 KB", type: "doc", color: "text-blue-500", bg: "bg-blue-50" }
                    ].map((file, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group/item">
                        <div className={`w-12 h-12 ${file.bg} ${file.color} rounded-lg flex items-center justify-center`}>
                          <FileText size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-700 text-sm group-hover/item:text-blue-600 transition-colors">{file.name}</div>
                          <div className="text-xs text-slate-400">{file.size} • Last edited just now</div>
                        </div>
                        <MoreHorizontal size={16} className="text-slate-300 group-hover/item:text-slate-600" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 px-6 relative bg-white border-t border-slate-100">
        {/* Faint Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Zero-Knowledge Architecture</h3>
              <p className="text-slate-500 leading-relaxed">
                Your data is encrypted client-side before it ever reaches our servers. We cannot see your files, and neither can intruders. You hold the only keys.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Global Edge Distribution</h3>
              <p className="text-slate-500 leading-relaxed">
                Access your secure vault from anywhere with low latency. Our intelligent edge network routes your encrypted data to the nearest node for lightning-fast sync.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Advanced Compliance</h3>
              <p className="text-slate-500 leading-relaxed">
                Automated SOC2 and HIPAA compliance reporting. Immutable audit logs track every file access, modification, and sharing event.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Seamless Integration</h3>
              <p className="text-slate-500 leading-relaxed">
                Connect VaultDrive with your identity provider (Okta, Azure AD) and existing workflow tools. No clunky VPNs required.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 pb-24 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-3xl p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to secure your workspace?</h2>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                Join over 10,000 forward-thinking companies who trust VaultDrive with their most critical assets.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={user ? onNavigateToDashboard : onAuthModalOpen}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 flex items-center gap-2"
                >
                  Get Started Now <ArrowRight size={20} />
                </button>
                <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-full font-bold text-lg transition-all hover:scale-105">
                  Contact Sales
                </button>
              </div>
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