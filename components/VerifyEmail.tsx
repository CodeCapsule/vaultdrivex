import React, { useState } from 'react';
import { signOut, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';
import { Mail, RefreshCw, LogOut, Loader2, Send } from 'lucide-react';

interface VerifyEmailProps {
  email: string | null;
  onVerified: () => Promise<void>;
}

export const VerifyEmail: React.FC<VerifyEmailProps> = ({ email, onVerified }) => {
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');

  const handleCheckVerification = async () => {
    setChecking(true);
    setMessage('');
    try {
      // Call the parent handler to reload user from Firebase and update App state
      await onVerified();
      
      // After reload, check the updated auth object
      if (auth.currentUser?.emailVerified) {
        // Success! The App component will detect the change and render Dashboard automatically.
        // We don't need to do anything here.
      } else {
        setMessage("Email not verified yet. Please check your inbox.");
      }
    } catch (error) {
      console.error("Error checking verification:", error);
      setMessage("Error checking status. Try logging out and back in.");
    } finally {
      setChecking(false);
    }
  };

  const handleResendEmail = async () => {
    setResending(true);
    setMessage('');
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setMessage("Verification email resent! Please check your inbox.");
      }
    } catch (error: any) {
      console.error("Error resending email:", error);
      if (error.code === 'auth/too-many-requests') {
        setMessage("Too many requests. Please wait a moment before trying again.");
      } else {
        setMessage("Failed to resend email.");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center border border-gray-100">
        <div className="inline-block p-4 bg-blue-50 rounded-full mb-6">
          <Mail className="text-blue-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h2>
        <p className="text-gray-600 mb-8">
          We have sent a verification email to <span className="font-medium text-gray-900">{email}</span>. 
          Please verify your email address to access your dashboard.
        </p>

        {message && (
          <div className={`mb-6 p-3 text-sm rounded-lg ${message.includes('resent') ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
            {message}
          </div>
        )}
        
        <div className="space-y-3">
          <button
            onClick={handleCheckVerification}
            disabled={checking}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all disabled:opacity-70"
          >
            {checking ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
            {checking ? 'Checking...' : "I've Verified, Refresh"}
          </button>

          <button
            onClick={handleResendEmail}
            disabled={resending}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-all disabled:opacity-70"
          >
            {resending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {resending ? 'Sending...' : "Resend Verification Email"}
          </button>

          <button
            onClick={() => signOut(auth)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
          >
            <LogOut size={18} />
            Sign Out & Login Again
          </button>
        </div>
      </div>
    </div>
  );
};