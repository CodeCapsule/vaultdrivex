import React, { useState, useEffect } from 'react';
import { signOut, updateProfile, User } from 'firebase/auth';
import { auth } from '../firebase';
import { supabase } from '../supabase';
import { ViewState } from '../types';
import { MyFiles } from './MyFiles';
import { MyNotes } from './MyNotes';
import { TeamMembers } from './TeamMembers';
import { Overview } from './Overview';
import { Shield, ChevronDown, LogOut, Sparkles, LayoutDashboard, FileText, StickyNote, Users, User as UserIcon, Settings, Database } from 'lucide-react';
import { CanvasBackground } from './CanvasBackground';
import { Modal } from './Modal';

interface DashboardProps {
    user: User;
    onNavigateToProduct?: () => void;
    onNavigateToSolutions?: () => void;
    onNavigateToPricing?: () => void;
    onNavigateToSupport?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
    user,
    onNavigateToProduct, 
    onNavigateToSolutions, 
    onNavigateToPricing, 
    onNavigateToSupport 
}) => {
  const [activeView, setActiveView] = useState<ViewState>(ViewState.OVERVIEW);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  
  // Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user.displayName || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const isOfflineDemo = user.uid === 'offline-demo';

  useEffect(() => {
    const checkSupabase = async () => {
      try {
        const { data, error } = await supabase.from('_dummy_check').select('*').limit(1);
        // Even if table doesn't exist, if we get a response (even 404), the client is "connected" to the endpoint
        setSupabaseStatus('connected');
      } catch (e) {
        setSupabaseStatus('error');
      }
    };
    checkSupabase();
  }, []);

  const handleLogout = () => {
    if (isOfflineDemo) {
        window.location.reload(); // Simple reload to clear offline state
        return;
    }
    signOut(auth);
  };
  
  const handleUpdateProfile = async () => {
    if (isOfflineDemo) {
        // Mock update
        setIsSavingProfile(true);
        setTimeout(() => {
            setIsSavingProfile(false);
            setIsProfileModalOpen(false);
            alert("Profile updated (Simulation)");
        }, 1000);
        return;
    }

    if(!auth.currentUser) return;
    setIsSavingProfile(true);
    try {
        await updateProfile(auth.currentUser, {
            displayName: newDisplayName
        });
        setIsProfileModalOpen(false);
    } catch (error) {
        console.error("Error updating profile", error);
        alert("Failed to update profile");
    } finally {
        setIsSavingProfile(false);
    }
  };

  const Tab = ({ view, label, icon: Icon }: { view: ViewState, label: string, icon: React.ElementType }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
        activeView === view 
          ? 'bg-white text-gray-900 shadow-sm border border-gray-200' 
          : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
      }`}
    >
      <Icon size={18} className={activeView === view ? 'text-blue-600' : 'text-gray-400'} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50/80 font-sans relative overflow-x-hidden">
      <CanvasBackground />
      
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 w-48 cursor-pointer" onClick={() => setActiveView(ViewState.OVERVIEW)}>
            <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-500/20">
              <Shield size={22} fill="currentColor" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">VaultDrive</span>
          </div>

          {/* Centered Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <button onClick={onNavigateToProduct} className="hover:text-blue-600 transition-colors">Product</button>
            <button onClick={onNavigateToSolutions} className="hover:text-blue-600 transition-colors">Solutions</button>
            <button onClick={onNavigateToPricing} className="hover:text-blue-600 transition-colors">Pricing</button>
            <button onClick={onNavigateToSupport} className="hover:text-blue-600 transition-colors">Support</button>
          </div>

          {/* Right Action - Empty div to balance the logo width and keep links centered */}
          <div className="flex items-center gap-4 w-48 justify-end">
             {/* Get Started button removed as user is logged in */}
          </div>
        </div>
      </nav>

      {/* Demo Mode Banner */}
      {(user.isAnonymous || isOfflineDemo) && (
        <div className="flex justify-center mt-6 mb-8 relative z-40 pointer-events-none">
          <div className="bg-slate-800 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 uppercase tracking-wider border border-slate-700/50 backdrop-blur-sm pointer-events-auto">
            <Sparkles size={12} className="text-emerald-400" />
            {isOfflineDemo ? 'Offline Demo Mode' : 'Demo Mode'} — Data is not saved permanently
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
        
          {/* Header & User Menu */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                supabaseStatus === 'connected' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                supabaseStatus === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 
                'bg-gray-50 text-gray-400 border-gray-100'
              }`}>
                <Database size={10} />
                Supabase: {supabaseStatus}
              </div>
            </div>
            <p className="text-gray-500 text-lg">Manage your files and team members.</p>
            
            {/* Tabs moved here */}
            <div className="flex flex-wrap gap-2 mt-8">
              <Tab view={ViewState.OVERVIEW} label="Overview" icon={LayoutDashboard} />
              <Tab view={ViewState.FILES} label="Files" icon={FileText} />
              <Tab view={ViewState.NOTES} label="Notes" icon={StickyNote} />
              <Tab view={ViewState.TEAM} label="Team" icon={Users} />
            </div>
          </div>

          {/* User Profile Card */}
          <div className="relative">
             <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-center gap-3"
             >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold border border-white shadow-sm">
                   {user.isAnonymous ? 'D' : (user.displayName?.[0] || user.email?.[0]?.toUpperCase() || 'U')}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user.displayName || (user.isAnonymous ? 'Demo User' : user.email?.split('@')[0])}
                </span>
                <ChevronDown size={14} className="text-gray-400" />
             </button>

             {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-gray-50 mb-1 bg-gray-50/50">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Signed in as</p>
                   <p className="text-sm font-semibold text-gray-900 truncate">{user.email || 'Anonymous'}</p>
                </div>
                
                <div className="px-1 space-y-0.5">
                  <button 
                    onClick={() => { setShowUserMenu(false); setIsProfileModalOpen(true); }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium flex items-center gap-2"
                  >
                    <UserIcon size={16} className="text-gray-400"/>
                    Edit Profile
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium flex items-center gap-2">
                    <Settings size={16} className="text-gray-400" />
                    Settings
                  </button>
                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 font-medium"
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* View Content */}
        <div className="animate-in fade-in duration-300 slide-in-from-bottom-4">
          {activeView === ViewState.OVERVIEW && <Overview onNavigate={setActiveView} user={user} />}
          {activeView === ViewState.FILES && <MyFiles user={user} />}
          {activeView === ViewState.NOTES && <MyNotes user={user} />}
          {activeView === ViewState.TEAM && <TeamMembers user={user} />}
        </div>

        {/* Edit Profile Modal */}
        <Modal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            title="Edit Profile"
            footer={
                <>
                    <button onClick={() => setIsProfileModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button onClick={handleUpdateProfile} disabled={isSavingProfile} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                        {isSavingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                </>
            }
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                    <input 
                        type="text" 
                        value={newDisplayName}
                        onChange={(e) => setNewDisplayName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Enter your name"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                        type="email" 
                        value={user.email || ''}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                </div>
            </div>
        </Modal>

      </main>
    </div>
  );
};