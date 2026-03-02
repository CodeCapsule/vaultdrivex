import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { ViewState } from '../types';
import { ShieldCheck, HardDrive, Users, ArrowRight, Sparkles } from 'lucide-react';

interface OverviewProps {
  user: User;
  onNavigate: (view: ViewState) => void;
}

export const Overview: React.FC<OverviewProps> = ({ user, onNavigate }) => {
  const [fileCount, setFileCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);

  const isOfflineDemo = user.id === 'offline-demo';

  useEffect(() => {
    if (isOfflineDemo) {
      setFileCount(2);
      setMemberCount(2);
      return;
    }

    const fetchCounts = async () => {
      try {
        const [filesResult, membersResult] = await Promise.all([
          supabase.from('files').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('team_members').select('id', { count: 'exact', head: true }).eq('user_id', user.id)
        ]);
        setFileCount(filesResult.count || 0);
        setMemberCount(membersResult.count || 0);
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    };

    fetchCounts();
  }, [user, isOfflineDemo]);

  const isPro = user.email === 'imahinasyon321@gmail.com';

  return (
    <div className="space-y-8">

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Vault Status Card */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 border border-emerald-100">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Vault Status</h3>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">Your environment is secure and encrypted with military-grade protocols.</p>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Active Protection
          </span>
        </div>

        {/* Storage Card */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 border border-blue-100">
            <HardDrive size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Storage</h3>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            <span className="font-bold text-gray-900">{fileCount} files</span> stored securely on the cloud.
          </p>
          <div className="w-full bg-gray-100 h-2 rounded-full mb-3 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((fileCount / (isPro ? 10000 : 5)) * 100, 100)}%` }}></div>
          </div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{isPro ? 'Pro Subscription: Active' : 'Demo Limit: 100MB'}</p>
        </div>

        {/* Team Access Card */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 border border-indigo-100">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Team Access</h3>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            <span className="font-bold text-gray-900">{memberCount} active members</span> collaborating.
          </p>
          <button
            onClick={() => onNavigate(ViewState.TEAM)}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
          >
            View Team <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-3xl p-10 md:p-12 text-white relative overflow-hidden shadow-2xl">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sparkles size={14} />
            <span className="text-xs font-bold tracking-widest uppercase">Interactive Demo</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">Welcome to VaultDrive 2.0</h2>

          <p className="text-slate-400 text-lg mb-10 max-w-2xl leading-relaxed">
            Feel free to add files, create folders, and manage team members. <br />
            <span className="text-slate-300 font-semibold">Note:</span> Data is stored in your Supabase database and persists across sessions.
          </p>

          <button
            onClick={() => onNavigate(ViewState.FILES)}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xl shadow-emerald-900/20 transition-all hover:scale-105 flex items-center gap-2.5"
          >
            Start Exploring
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};