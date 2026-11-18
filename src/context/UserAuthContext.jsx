import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api.js';
import {
  signOutFirebaseGoogle,
  signInWithGooglePopup,
  formatFirebaseAuthError
} from '../services/firebaseAuth.js';

const UserAuthContext = createContext(null);

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register' | 'phone'

  const refreshUserSession = useCallback(async () => {
    const token = apiService.getUserToken();
    if (!token) {
      setUser(null);
      setAuthLoading(false);
      return null;
    }

    try {
      const res = await apiService.getUserSession();
      const loadedUser = res?.data?.user || null;
      setUser(loadedUser);
      return loadedUser;
    } catch {
      apiService.setUserToken('');
      setUser(null);
      return null;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUserSession();
  }, [refreshUserSession]);

  const openLoginBox = useCallback((preferredTab = 'login') => {
    const normalizedTab = preferredTab === 'register' || preferredTab === 'phone' ? preferredTab : 'login';
    setAuthModalTab(normalizedTab);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  const completeAuthSession = useCallback((authData) => {
    if (authData?.token) {
      apiService.setUserToken(authData.token);
    }
    if (authData?.user) {
      setUser(authData.user);
      if (!authData.user.registeredPhone) {
        setAuthModalTab('phone');
        setAuthModalOpen(true);
        return;
      }
    }
    setAuthModalOpen(false);
  }, []);

  const directGoogleSignUp = useCallback(async () => {
    try {
      const googleProof = await signInWithGooglePopup();
      const res = await apiService.googleAuthLogin({
        googleAccessToken: googleProof.googleAccessToken,
        firebaseIdToken: googleProof.firebaseIdToken
      });
      completeAuthSession(res.data);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: formatFirebaseAuthError(err)
      };
    }
  }, [completeAuthSession]);

  const updateSessionUser = useCallback((nextUser) => {
    setUser(nextUser);
  }, []);

  const logoutUser = useCallback(async () => {
    apiService.setUserToken('');
    setUser(null);
    await signOutFirebaseGoogle();
  }, []);

  const isAuthenticated = Boolean(user && (user.emailVerified || user.googleVerified));
  const needsPhoneRegistration = Boolean(user && !user.registeredPhone);

  return (
    <UserAuthContext.Provider
      value={{
        user,
        authLoading,
        isAuthenticated,
        needsPhoneRegistration,
        authModalOpen,
        authModalTab,
        setAuthModalTab,
        openLoginBox,
        closeAuthModal,
        completeAuthSession,
        directGoogleSignUp,
        refreshUserSession,
        updateSessionUser,
        logoutUser
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const ctx = useContext(UserAuthContext);
  if (!ctx) {
    throw new Error('useUserAuth must be used inside UserAuthProvider');
  }
  return ctx;
}
