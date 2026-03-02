import React, { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  signOut, 
  signInAnonymously, 
  User, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { supabase } from '../supabase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { 
  ArrowRight, Lock, Mail, AlertTriangle, Loader2, Shield, ChevronRight, 
  PlayCircle, LayoutDashboard, Copy, FolderKey, Activity, HardDrive, Search,
  Plus, FileText, MoreHorizontal, CheckCircle2, Command, Zap, Globe, Check, Database
} from 'lucide-react';
import { Modal } from './Modal';
import { CanvasBackground } from './CanvasBackground';

interface AuthProps {
  currentUser?: User | null;
  onNavigateToDashboard?: () => void;
  onNavigateToProduct?: () => void;
  onNavigateToSolutions?: () => void;
  onNavigateToPricing?: () => void;
  onNavigateToSupport?: () => void;
  autoOpenModal?: boolean;
  onModalClose?: () => void;
  onRunOfflineDemo?: () => void;
}

export const Auth: React.FC<AuthProps> = ({ 
    currentUser, 
    onNavigateToDashboard, 
    onNavigateToProduct, 
    onNavigateToSolutions, 
    onNavigateToPricing, 
    onNavigateToSupport,
    autoOpenModal = false,
    onModalClose,
    onRunOfflineDemo
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (autoOpenModal) {
        setShowAuthModal(true);
    }
  }, [autoOpenModal]);

  const handleCloseModal = () => {
      setShowAuthModal(false);
      setErrorCode('');
      setError('');
      if (onModalClose) onModalClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorCode('');
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        await signInWithEmailAndPassword(auth, email, password);
        handleCloseModal();
      } else {
        // SIGN UP
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 1. Send Verification Email IMMEDIATELY after account creation
        await sendEmailVerification(user);

        // 2. Try to Create User Doc
        try {
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            plan: 'free',
            createdAt: serverTimestamp()
          });
        } catch (dbError: any) {
          console.error("Database Setup Error:", dbError);
          if (dbError.code === 'permission-denied') {
             console.warn("Firestore permissions denied. User created in Auth but not in DB.");
          }
        }
        
        // 3. Force logout so they can't access dashboard until verified
        await signOut(auth);
        
        // Switch to login view with success message
        setIsLogin(true);
        alert("Account created! We've sent you a verification link. Please check your email.");
        handleCloseModal();
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      setErrorCode(err.code);
      if (err.code === 'auth/email-already-in-use') {
        setError("User already exists. Please sign in instead.");
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError("Email or password is incorrect.");
      } else if (err.code === 'auth/operation-not-allowed') {
        setError("Email/Password Sign-in is not enabled. Please enable it in the Firebase Console.");
      } else if (err.code === 'permission-denied') {
        setError("Access denied. Please check your Firebase Firestore Rules.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setErrorCode('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Ensure user document exists in Firestore (merge: true avoids overwriting existing data)
      try {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          plan: 'free' 
        }, { merge: true });
      } catch (dbError) {
        console.error("Error creating user doc:", dbError);
        // Continue, as auth was successful
      }

      handleCloseModal();
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setErrorCode(err.code);
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign in was cancelled.");
      } else if (err.code === 'auth/popup-blocked') {
        setError("Popup was blocked by your browser.");
      } else if (err.code === 'auth/unauthorized-domain') {
        setError(`The domain ${window.location.hostname} is not authorized.`);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLiveDemo = async () => {
    setLoading(true);
    try {
      await signInAnonymously(auth);
      if (onNavigateToDashboard) {
        onNavigateToDashboard();
      }
    } catch (err: any) {
      // Check if error is due to anonymous auth being disabled
      const isRestricted = err.code === 'auth/admin-restricted-operation' || 
                           err.code === 'auth/operation-not-allowed' ||
                           (err.message && err.message.includes('admin-restricted-operation'));
      
      // FALLBACK TO OFFLINE DEMO IF PROVIDER DISABLED
      if (isRestricted && onRunOfflineDemo) {
         console.warn("Anonymous Auth disabled in Firebase. Switching to Offline Demo Mode.");
         onRunOfflineDemo();
         setLoading(false);
         return;
      }
      
      console.error("Auth Error:", err);
      
      if (isRestricted) {
         alert("Access Denied: Please enable 'Anonymous' sign-in provider in your Firebase Console.");
      } else {
         alert("Failed to start Live Demo: " + (err.message || "Unknown error"));
      }
      setLoading(false);
    }
  };

  const handleSupabaseLogin = async () => {
    setError('');
    setErrorCode('');
    setLoading(true);
    try {
      if (isLogin) {
        const { data, error: sbError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (sbError) throw sbError;
        if (data.user) {
          // For this demo, we'll just alert success as the app is primarily Firebase-driven
          // but we've successfully authenticated with Supabase.
          alert("Successfully authenticated with Supabase!");
          handleCloseModal();
        }
      } else {
        const { data, error: sbError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (sbError) throw sbError;
        alert("Supabase account created! Please check your email for verification.");
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error("Supabase Auth Error:", err);
      setError(err.message || "Supabase authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-white relative font-sans text-slate-900 selection:bg-blue-100 overflow-x-hidden">
      {/* Animated Canvas Background */}
      <CanvasBackground />
      
      {/* Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-slate-900">
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
           {currentUser ? (
              <button 
                onClick={onNavigateToDashboard} 
                className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-xl shadow-emerald-200"
              >
                Go to Dashboard
                <LayoutDashboard size={16} />
              </button>
           ) : (
              <button 
                onClick={() => setShowAuthModal(true)} 
                className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-200"
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Login</span>
                <ChevronRight size={16} className="hidden sm:block" />
              </button>
           )}
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 pt-12 md:pt-20 pb-32 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide mb-8 border border-blue-100">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          Secure Storage • Built for Teams
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 max-w-5xl mx-auto leading-[1.1]">
          The secure workspace for <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">modern teams</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-16 leading-relaxed">
          Enterprise-grade security meets consumer-grade design. Securely manage assets, control permissions, and scale your organization with zero compromise.
        </p>

        {/* Hero Buttons - Conditional Rendering */}
        <div className="flex flex-col items-center justify-center gap-6 mt-12">
            {currentUser ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
                <div className="bg-white rounded-full shadow-sm px-6 py-2 flex items-center gap-2 mb-6 border border-slate-100">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-slate-600 font-medium text-sm">Welcome back, <span className="text-slate-900 font-bold">{displayName}</span></span>
                </div>
                <button 
                  onClick={onNavigateToDashboard}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold text-lg shadow-xl shadow-emerald-900/20 transition-all hover:scale-105 flex items-center gap-3"
                >
                  Go to Dashboard <LayoutDashboard size={20} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                    onClick={() => setShowAuthModal(true)}
                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-emerald-900/20 flex items-center gap-2"
                >
                    Get Started Free <ArrowRight size={20} />
                </button>
                
                <button 
                    onClick={handleLiveDemo}
                    className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-full font-bold text-lg transition-all hover:scale-105 flex items-center gap-2 shadow-sm"
                >
                    <div className="flex items-center justify-center">
                      <PlayCircle size={24} className="text-emerald-600" />
                    </div>
                    Live Demo (No Login)
                </button>
              </div>
            )}
        </div>
      </div>

      {/* Feature Section */}
      <div className="relative bg-slate-50 py-24 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold tracking-wider uppercase border border-emerald-100">
              Live Preview
            </span>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Powerfully simple. <br/>
                Simply powerful.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                Experience a workspace that feels familiar but is fortified with military-grade security protocols at every layer.
              </p>
            </div>
            <div className="space-y-6 mt-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm text-blue-600">
                  <Lock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">End-to-End Encryption</h4>
                  <p className="text-sm text-slate-500">Data is encrypted before it leaves your device.</p>
                </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm text-blue-600">
                  <FolderKey size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Granular Permissions</h4>
                  <p className="text-sm text-slate-500">Role-based access control for every folder.</p>
                </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm text-blue-600">
                  <Activity size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Real-time Audit Logs</h4>
                  <p className="text-sm text-slate-500">Track every view, download, and file edit.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <div className="absolute top-10 -right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-10 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform hover:-translate-y-1 transition-transform duration-500">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80"></div>
                </div>
                <div className="flex-1 flex justify-center">
                   <div className="bg-white border border-slate-200 px-3 py-1 rounded-md text-xs text-slate-400 w-full max-w-xs text-center flex items-center justify-center gap-1">
                     <Lock size={10} /> vaultdrive.com/dashboard
                   </div>
                </div>
              </div>
              <div className="flex h-[400px]">
                <div className="w-48 bg-slate-50 border-r border-slate-100 p-4 hidden sm:block">
                  <div className="h-4 w-24 bg-slate-200 rounded mb-8"></div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                      <HardDrive size={16} /> Files
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 text-slate-400 text-sm font-medium">
                      <Activity size={16} /> Shared
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 text-slate-400 text-sm font-medium">
                       <FolderKey size={16} /> Recent
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-6 relative">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 text-lg">My Vault</h3>
                    <div className="flex gap-2">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-400"><Search size={16} /></div>
                      <div className="px-3 py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1">
                        <Plus size={14} /> Upload
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 border border-slate-100 rounded-xl flex items-center gap-3 shadow-sm">
                      <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="h-3 w-32 bg-slate-800 rounded mb-1.5 opacity-80"></div>
                        <div className="h-2 w-20 bg-slate-300 rounded opacity-50"></div>
                      </div>
                      <MoreHorizontal size={16} className="text-slate-300" />
                    </div>
                    <div className="p-3 border border-slate-100 rounded-xl flex items-center gap-3 shadow-sm">
                       <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="h-3 w-28 bg-slate-800 rounded mb-1.5 opacity-80"></div>
                        <div className="h-2 w-16 bg-slate-300 rounded opacity-50"></div>
                      </div>
                      <MoreHorizontal size={16} className="text-slate-300" />
                    </div>
                    <div className="p-3 border border-slate-100 rounded-xl flex items-center gap-3 shadow-sm">
                       <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center shrink-0">
                        <Lock size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="h-3 w-24 bg-slate-800 rounded mb-1.5 opacity-80"></div>
                        <div className="h-2 w-14 bg-slate-300 rounded opacity-50"></div>
                      </div>
                      <MoreHorizontal size={16} className="text-slate-300" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-slate-900 text-white px-4 py-3 rounded-lg text-xs font-medium flex items-center gap-2 shadow-lg">
                    <div className="bg-green-500 rounded-full p-0.5"><CheckCircle2 size={10} /></div>
                    File encrypted & saved
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-16 px-6 border-b border-slate-100">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by teams worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800"><Command size={24} /> ACME Corp</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800"><Activity size={24} /> Vertex</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800"><Zap size={24} /> TechFlow</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800"><Globe size={24} /> GlobalScale</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800"><HardDrive size={24} /> DataBase</div>
          </div>
        </div>
      </div>

      <div className="bg-white py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
           <div className="mb-8 flex justify-center text-blue-600">
             <Command size={40} />
           </div>
           <blockquote className="text-2xl font-medium text-slate-900 leading-normal mb-8">
             "VaultDrive transformed how we handle sensitive data. It's security that doesn't get in the way."
           </blockquote>
           <div className="flex items-center justify-center gap-4">
             <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
               <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
             </div>
             <div className="text-left">
               <div className="font-bold text-slate-900">Sarah Jenkins</div>
               <div className="text-slate-500 text-sm">CTO at TechFlow</div>
             </div>
           </div>
        </div>
      </div>

      <div className="bg-slate-50 py-24 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-500">Start for free, scale as you grow. No hidden fees.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Starter</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-slate-900">$0</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <p className="text-sm text-slate-500 mb-8">Perfect for individuals.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-slate-700"><Check size={16} className="text-blue-500" /> 5GB Storage</li>
                <li className="flex items-center gap-3 text-sm text-slate-700"><Check size={16} className="text-blue-500" /> Basic Encryption</li>
                <li className="flex items-center gap-3 text-sm text-slate-700"><Check size={16} className="text-blue-500" /> Community Support</li>
              </ul>
              <button onClick={() => onNavigateToPricing?.()} className="w-full py-2.5 border border-slate-200 rounded-xl text-slate-700 font-semibold hover:border-slate-300 transition-colors">Compare Plans</button>
            </div>
            <div className="bg-slate-900 p-8 rounded-2xl shadow-xl transform md:-translate-y-4 border border-slate-800 relative">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-wider">Popular</div>
              <h3 className="text-lg font-bold text-white mb-2">Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">$29</span>
                <span className="text-slate-400">/mo</span>
              </div>
              <p className="text-sm text-slate-400 mb-8">For growing teams.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-slate-300"><Check size={16} className="text-emerald-400" /> 1TB Storage</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><Check size={16} className="text-emerald-400" /> Advanced Rules</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><Check size={16} className="text-emerald-400" /> Priority Support</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><Check size={16} className="text-emerald-400" /> 30-day Version History</li>
              </ul>
              <button onClick={() => setShowAuthModal(true)} className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-emerald-900/20">Get Started</button>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Business</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-slate-900">$99</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <p className="text-sm text-slate-500 mb-8">For large organizations.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-slate-700"><Check size={16} className="text-blue-500" /> Unlimited Storage</li>
                <li className="flex items-center gap-3 text-sm text-slate-700"><Check size={16} className="text-blue-500" /> SSO & Audit Logs</li>
                <li className="flex items-center gap-3 text-sm text-slate-700"><Check size={16} className="text-blue-500" /> 24/7 Dedicated Support</li>
              </ul>
              <button className="w-full py-2.5 border border-slate-200 rounded-xl text-slate-700 font-semibold hover:border-slate-300 transition-colors">Contact Sales</button>
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
            <div className="flex flex-col md:flex-row items-center gap-6">
                <p className="text-slate-500 text-sm font-medium text-center md:text-left">
                    The secure choice for modern businesses. Trusted by teams globally.
                </p>
                {currentUser ? (
                    <button 
                      onClick={onNavigateToDashboard}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 shadow-sm"
                    >
                      Dashboard <ArrowRight size={16} />
                    </button>
                ) : (
                    <button 
                      onClick={() => setShowAuthModal(true)} 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 shadow-sm"
                    >
                        Get Started <ArrowRight size={16} />
                    </button>
                )}
            </div>
            <div className="flex items-center gap-8 text-sm font-medium text-slate-600">
                <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
                <button onClick={onNavigateToPricing} className="hover:text-slate-900 transition-colors">Pricing</button>
                <button onClick={onNavigateToSupport} className="hover:text-slate-900 transition-colors">Support</button>
            </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
             <p>&copy; {new Date().getFullYear()} VaultDrive Inc. All rights reserved.</p>
             <p className="font-medium text-slate-500">Created by Rex Punlagao</p>
        </div>
      </footer>

      {/* Auth Modal */}
      <Modal isOpen={showAuthModal} onClose={handleCloseModal} hideHeader={true}>
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                 <Lock className="text-emerald-500" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Enter your credentials to access your vault.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 mb-6">
              <button
                onClick={() => { setIsLogin(true); setError(''); }}
                className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${isLogin ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Sign In
                {isLogin && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full"></div>}
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(''); }}
                className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${!isLogin ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Sign Up
                {!isLogin && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full"></div>}
              </button>
            </div>

            {/* ERROR DISPLAY */}
            {errorCode === 'auth/unauthorized-domain' ? (
               <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-left shadow-sm">
                  <div className="flex items-center gap-2 text-amber-800 font-bold mb-2">
                     <AlertTriangle size={18} />
                     <span>Action Required</span>
                  </div>
                  <p className="text-sm text-amber-700 mb-3">
                     This domain <strong>{window.location.hostname}</strong> is not authorized to use Google Sign-In.
                  </p>
                  <div className="bg-white p-2 rounded border border-amber-200 flex items-center justify-between mb-3">
                     <code className="text-xs font-mono text-slate-600 truncate mr-2">{window.location.hostname}</code>
                     <button 
                       onClick={() => navigator.clipboard.writeText(window.location.hostname)} 
                       className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded flex items-center gap-1 font-medium transition-colors"
                       title="Copy domain"
                     >
                       <Copy size={12} /> Copy
                     </button>
                  </div>
                  <p className="text-xs text-amber-600 leading-relaxed">
                     Go to <strong>Firebase Console &gt; Authentication &gt; Settings &gt; Authorized Domains</strong> and add the domain above.
                  </p>
               </div>
            ) : error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-700 text-sm text-left">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1.5">
                   <label className="block text-xs font-bold text-slate-700">Password</label>
                   {isLogin && <a href="#" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">Forgot password?</a>}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900 tracking-widest"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30 active:scale-[0.98]"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
            
            <div className="relative mt-8 mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                <span className="bg-white px-3">Or continue with</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-70 disabled:cursor-not-allowed mb-3"
            >
               {/* Google Logo Placeholder */}
               <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.489 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.989 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
               Continue with Google
            </button>

            <button 
              type="button"
              onClick={handleSupabaseLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#3ecf8e] text-white font-semibold rounded-lg hover:bg-[#34b27b] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
               <Database size={20} />
               Continue with Supabase
            </button>

            <p className="text-center text-xs text-slate-400 mt-6">
              By continuing, you agree to VaultDrive's <a href="#" className="text-emerald-600 font-medium hover:underline">Terms of Service</a> and <a href="#" className="text-emerald-600 font-medium hover:underline">Privacy Policy</a>.
            </p>
      </Modal>

    </div>
  );
};