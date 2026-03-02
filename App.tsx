import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { VerifyEmail } from './components/VerifyEmail';
import { ProductPage } from './components/ProductPage';
import { SolutionsPage } from './components/SolutionsPage';
import { PricingPage } from './components/PricingPage';
import { SupportPage } from './components/SupportPage';

type View = 'landing' | 'dashboard' | 'product' | 'solutions' | 'pricing' | 'support';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [view, setView] = useState<View>('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // If we are in offline demo mode, ignore firebase auth updates (which might be null)
      if (isOfflineMode) return;
      
      setUser(currentUser);
      setAuthLoading(false);
      // Determine initial view based on auth state
      if (currentUser) {
        if (!currentUser.emailVerified && !currentUser.isAnonymous) {
          // Stay on landing/verify logic will handle render
          setView('landing'); 
        } else {
           // Default to landing, user can go to dashboard
           setView('landing'); 
        }
      } else {
        setView('landing');
      }
    });

    return () => unsubscribe();
  }, [isOfflineMode]);

  const handleVerificationCheck = async () => {
    if (auth.currentUser) {
      try {
        await auth.currentUser.reload();
        setUser({ ...auth.currentUser } as User); 
      } catch (e) {
        console.error("Error reloading user:", e);
      }
    }
  };

  const handleAuthModalOpen = () => {
      if (view !== 'landing') {
          setView('landing');
      }
      setShowAuthModal(true);
  };

  const handleOfflineDemo = () => {
    setIsOfflineMode(true);
    // Create a mock user object for offline demo
    const mockUser = {
        uid: 'offline-demo',
        email: 'demo@vaultdrive.com',
        displayName: 'Demo User',
        emailVerified: true,
        isAnonymous: true,
        photoURL: null,
        phoneNumber: null,
        providerId: 'firebase',
        metadata: { 
            creationTime: new Date().toISOString(), 
            lastSignInTime: new Date().toISOString() 
        }
    } as unknown as User;
    
    setUser(mockUser);
    setView('dashboard');
    setShowAuthModal(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // View Routing Logic

  if (view === 'support') {
    return (
        <SupportPage
          user={user}
          onNavigateToDashboard={() => setView('dashboard')}
          onNavigateToHome={() => setView('landing')}
          onNavigateToProduct={() => setView('product')}
          onNavigateToSolutions={() => setView('solutions')}
          onNavigateToPricing={() => setView('pricing')}
          onAuthModalOpen={() => {
              setView('landing');
              setShowAuthModal(true);
          }}
        />
    );
  }

  if (view === 'pricing') {
      return (
          <PricingPage
            user={user}
            onNavigateToDashboard={() => setView('dashboard')}
            onNavigateToHome={() => setView('landing')}
            onNavigateToProduct={() => setView('product')}
            onNavigateToSolutions={() => setView('solutions')}
            onNavigateToSupport={() => setView('support')}
            onAuthModalOpen={() => {
                setView('landing');
                setShowAuthModal(true);
            }}
          />
      );
  }

  if (view === 'solutions') {
    return (
      <SolutionsPage
        user={user}
        onNavigateToDashboard={() => setView('dashboard')}
        onNavigateToHome={() => setView('landing')}
        onNavigateToProduct={() => setView('product')}
        onNavigateToPricing={() => setView('pricing')}
        onNavigateToSupport={() => setView('support')}
        onAuthModalOpen={() => {
            setView('landing');
            setShowAuthModal(true);
        }}
      />
    );
  }

  if (view === 'product') {
    return (
      <ProductPage 
        user={user} 
        onNavigateToDashboard={() => setView('dashboard')} 
        onNavigateToHome={() => setView('landing')}
        onNavigateToSolutions={() => setView('solutions')}
        onNavigateToPricing={() => setView('pricing')}
        onNavigateToSupport={() => setView('support')}
        onAuthModalOpen={() => {
            setView('landing');
            setShowAuthModal(true);
        }}
      />
    );
  }

  if (view === 'dashboard' && user) {
     if (!user.emailVerified && !user.isAnonymous) {
         return <VerifyEmail email={user.email} onVerified={handleVerificationCheck} />;
     }
     return (
        <Dashboard 
            user={user}
            onNavigateToProduct={() => setView('product')} 
            onNavigateToSolutions={() => setView('solutions')}
            onNavigateToPricing={() => setView('pricing')}
            onNavigateToSupport={() => setView('support')}
        />
     );
  }

  if (user && !user.emailVerified && !user.isAnonymous) {
    return <VerifyEmail email={user.email} onVerified={handleVerificationCheck} />;
  }

  // Default: Landing / Auth
  return (
    <Auth 
        currentUser={user} 
        onNavigateToDashboard={() => setView('dashboard')} 
        onNavigateToProduct={() => setView('product')}
        onNavigateToSolutions={() => setView('solutions')}
        onNavigateToPricing={() => setView('pricing')}
        onNavigateToSupport={() => setView('support')}
        autoOpenModal={showAuthModal}
        onModalClose={() => setShowAuthModal(false)}
        onRunOfflineDemo={handleOfflineDemo}
    />
  );
};

export default App;