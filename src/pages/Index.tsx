import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { Header } from '@/components/layout/Header';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { HomePage } from '@/components/pages/HomePage';
import { SubscriptionPage } from '@/components/pages/SubscriptionPage';
import { AccountPage } from '@/components/pages/AccountPage';
import { FashionPage } from '@/components/pages/FashionPage';
import { BeautyPage } from '@/components/pages/BeautyPage';
import { HomeDecorPage } from '@/components/pages/HomeDecorPage';
import { AuthModal } from '@/components/auth/AuthModal';
import { SubscriptionModal } from '@/components/auth/SubscriptionModal';
import { useToast } from '@/hooks/use-toast';

type PageType = 'home' | 'subscription' | 'login' | 'fashion' | 'beauty' | 'home-decor';

const AppContent = () => {
  const {
    user,
    profile,
    isAuthenticated,
    isSubscribed,
    loading,
    signInWithGoogle,
    signOut,
    refreshProfile
  } = useAuth();
  
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [credits, setCredits] = useState(1); // Free user gets 1 credit
  const { toast } = useToast();

  // Calculate credits based on subscription status
  useEffect(() => {
    if (isAuthenticated) {
      if (isSubscribed) {
        setCredits(999); // Unlimited credits for subscribed users
      } else {
        // Free users get 1 credit, check if they've used it
        const usedFeatures = localStorage.getItem('usedFeatures');
        if (usedFeatures) {
          setCredits(0);
        } else {
          setCredits(1);
        }
      }
    }
  }, [isAuthenticated, isSubscribed]);

  const handleAuthRequired = () => {
    if (!showAuthModal && !isAuthenticated) {
      setShowAuthModal(true);
    }
  };

  const handleSubscriptionRequired = () => {
    if (!showSubscriptionModal && !isSubscribed) {
      setShowSubscriptionModal(true);
    }
  };

  const handleFeatureSelect = (feature: 'fashion' | 'beauty' | 'home-decor') => {
    if (!isAuthenticated) {
      handleAuthRequired();
      return;
    }

    // Check if user has credits
    if (!isSubscribed && credits <= 0) {
      toast({
        title: "No credits remaining",
        description: "Upgrade to Premium for unlimited access to all features",
        variant: "destructive"
      });
      handleSubscriptionRequired();
      return;
    }

    // Use a credit for free users
    if (!isSubscribed) {
      setCredits(prev => prev - 1);
      localStorage.setItem('usedFeatures', 'true');
    }

    setCurrentPage(feature);
  };

  const handlePageChange = (page: 'home' | 'subscription' | 'login') => {
    if (page === 'login' && isAuthenticated) {
      // If already authenticated, show account page instead
      setCurrentPage('login');
    } else {
      setCurrentPage(page);
    }
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setShowAuthModal(false);
      toast({
        title: "Welcome to StyleAI!",
        description: "You're now logged in and ready to explore AI-powered styling features.",
      });
    } catch (error) {
      toast({
        title: "Sign-in failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-neon-primary/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full bg-neon-secondary/5 blur-3xl animate-pulse" />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {showSplash ? (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        ) : loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-2 border-neon-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <Header 
              credits={credits}
              maxCredits={isSubscribed ? 999 : 1}
              profile={profile || undefined}
              isSubscribed={isSubscribed}
            />
            
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
              {currentPage === 'home' && (
                <HomePage
                  isAuthenticated={isAuthenticated}
                  isSubscribed={isSubscribed}
                  onAuthRequired={handleAuthRequired}
                  onSubscriptionRequired={handleSubscriptionRequired}
                  profile={profile || undefined}
                  onProfileRefresh={refreshProfile}
                  onFeatureSelect={handleFeatureSelect}
                />
              )}
              
              {currentPage === 'subscription' && (
                <SubscriptionPage />
              )}
              
              {currentPage === 'login' && (
                <AccountPage
                  user={user ? {
                    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                    email: user.email || '',
                    avatar: user.user_metadata?.avatar_url
                  } : undefined}
                  profile={profile || undefined}
                  isSubscribed={isSubscribed}
                  onLogin={handleAuthRequired}
                  onLogout={signOut}
                  onShowDownloadHistory={() => {}}
                  onShowSettings={() => {}}
                  onShowSupport={() => {}}
                />
              )}

              {currentPage === 'fashion' && (
                <FashionPage onBack={handleBackToHome} />
              )}

              {currentPage === 'beauty' && (
                <BeautyPage onBack={handleBackToHome} />
              )}

              {currentPage === 'home-decor' && (
                <HomeDecorPage onBack={handleBackToHome} />
              )}
            </main>

            <BottomNavigation 
              currentPage={currentPage === 'fashion' || currentPage === 'beauty' || currentPage === 'home-decor' 
                ? 'home' 
                : currentPage}
              onPageChange={handlePageChange}
              isAuthenticated={isAuthenticated}
              user={user}
            />

            {/* Modals */}
            <AuthModal
              isOpen={showAuthModal}
              onClose={() => setShowAuthModal(false)}
              onGoogleSignIn={handleGoogleSignIn}
              loading={loading}
            />

            <SubscriptionModal
              isOpen={showSubscriptionModal}
              onClose={() => setShowSubscriptionModal(false)}
              onSubscribe={() => {
                setShowSubscriptionModal(false);
                setCurrentPage('subscription');
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

const Index = () => {
  return <AppContent />;
};

export default Index;