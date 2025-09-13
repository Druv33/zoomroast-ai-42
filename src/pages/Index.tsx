import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { Header } from '@/components/layout/Header';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { HomePage } from '@/components/pages/HomePage';
import { SubscriptionPage } from '@/components/pages/SubscriptionPage';
import { AccountPage } from '@/components/pages/AccountPage';
import { DownloadHistoryPage } from '@/components/pages/DownloadHistoryPage';
import { SettingsPage } from '@/components/pages/SettingsPage';
import { SupportPage } from '@/components/pages/SupportPage';
import { AuthModal } from '@/components/auth/AuthModal';
import { SubscriptionModal } from '@/components/auth/SubscriptionModal';

const AppContent = () => {
  const {
    user,
    profile,
    isAuthenticated,
    isSubscribed,
    loading,
    signInWithGoogle,
    signOut,
    subscribe,
    refreshProfile
  } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'subscription' | 'account' | 'download-history' | 'settings' | 'support'>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Prevent repeated auth modal triggers
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
                  onProfileRefresh={() => {
                    // Refresh profile data to update credits
                    refreshProfile();
                  }}
                />
              )}
              
              {currentPage === 'subscription' && (
                <SubscriptionPage />
              )}
              
              {currentPage === 'account' && (
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
                  onShowDownloadHistory={() => setCurrentPage('download-history')}
                  onShowSettings={() => setCurrentPage('settings')}
                  onShowSupport={() => setCurrentPage('support')}
                />
              )}

              {currentPage === 'download-history' && (
                <DownloadHistoryPage onBack={() => setCurrentPage('account')} />
              )}

              {currentPage === 'settings' && (
                <SettingsPage onBack={() => setCurrentPage('account')} />
              )}

              {currentPage === 'support' && (
                <SupportPage onBack={() => setCurrentPage('account')} />
              )}
            </main>

            <BottomNavigation 
              currentPage={currentPage === 'download-history' || currentPage === 'settings' || currentPage === 'support' ? 'account' : currentPage}
              onPageChange={(page) => setCurrentPage(page)}
              user={user}
            />

            {/* Modals */}
            <AuthModal
              isOpen={showAuthModal}
              onClose={() => setShowAuthModal(false)}
              onGoogleSignIn={signInWithGoogle}
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
