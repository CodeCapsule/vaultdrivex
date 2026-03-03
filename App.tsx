import React, { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { ProductPage } from './components/ProductPage';
import { SolutionsPage } from './components/SolutionsPage';
import { PricingPage } from './components/PricingPage';
import { SupportPage } from './components/SupportPage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { CheckoutPage } from './components/CheckoutPage';

type View = 'landing' | 'dashboard' | 'product' | 'solutions' | 'pricing' | 'support' | 'privacy' | 'terms' | 'checkout';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [view, setView] = useState<View>('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string; billingCycle: 'monthly' | 'yearly' } | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isOfflineMode) {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (isOfflineMode) return;
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [isOfflineMode]);

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
      id: 'offline-demo',
      email: 'demo@vaultdrive.com',
      user_metadata: {
        full_name: 'Demo User',
      },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
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
        onNavigateToPrivacy={() => setView('privacy')}
        onNavigateToTerms={() => setView('terms')}
        onAuthModalOpen={() => {
          setView('landing');
          setShowAuthModal(true);
        }}
      />
    );
  }

  if (view === 'privacy') {
    return (
      <PrivacyPolicy
        user={user}
        onNavigateToDashboard={() => setView('dashboard')}
        onNavigateToHome={() => setView('landing')}
        onNavigateToProduct={() => setView('product')}
        onNavigateToSolutions={() => setView('solutions')}
        onNavigateToPricing={() => setView('pricing')}
        onNavigateToSupport={() => setView('support')}
        onNavigateToTerms={() => setView('terms')}
        onAuthModalOpen={handleAuthModalOpen}
      />
    );
  }

  if (view === 'terms') {
    return (
      <TermsOfService
        user={user}
        onNavigateToDashboard={() => setView('dashboard')}
        onNavigateToHome={() => setView('landing')}
        onNavigateToProduct={() => setView('product')}
        onNavigateToSolutions={() => setView('solutions')}
        onNavigateToPricing={() => setView('pricing')}
        onNavigateToSupport={() => setView('support')}
        onNavigateToPrivacy={() => setView('privacy')}
        onAuthModalOpen={handleAuthModalOpen}
      />
    );
  }

  if (view === 'checkout' && selectedPlan) {
    return (
      <CheckoutPage
        user={user}
        planName={selectedPlan.name}
        price={selectedPlan.price}
        billingCycle={selectedPlan.billingCycle}
        onNavigateToHome={() => setView('landing')}
        onNavigateToPricing={() => setView('pricing')}
        onNavigateToSuccess={() => {
          alert('Payment Successful!'); // Placeholder for success state
          setView('dashboard');
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
        onNavigateToPrivacy={() => setView('privacy')}
        onNavigateToTerms={() => setView('terms')}
        onNavigateToCheckout={(plan) => {
          setSelectedPlan(plan);
          setView('checkout');
        }}
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
        onNavigateToPrivacy={() => setView('privacy')}
        onNavigateToTerms={() => setView('terms')}
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
        onNavigateToPrivacy={() => setView('privacy')}
        onNavigateToTerms={() => setView('terms')}
        onAuthModalOpen={() => {
          setView('landing');
          setShowAuthModal(true);
        }}
      />
    );
  }

  if (view === 'dashboard' && user) {
    return (
      <Dashboard
        user={user}
        onNavigateToProduct={() => setView('product')}
        onNavigateToSolutions={() => setView('solutions')}
        onNavigateToPricing={() => setView('pricing')}
        onNavigateToSupport={() => setView('support')}
        onNavigateToPrivacy={() => setView('privacy')}
        onNavigateToTerms={() => setView('terms')}
      />
    );
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
      onNavigateToPrivacy={() => setView('privacy')}
      onNavigateToTerms={() => setView('terms')}
      autoOpenModal={showAuthModal}
      onModalClose={() => setShowAuthModal(false)}
      onRunOfflineDemo={handleOfflineDemo}
    />
  );
};

export default App;