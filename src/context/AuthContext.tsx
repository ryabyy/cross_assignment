import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

interface AuthContextValue {
  isUnlocked: boolean;
  requestUnlock: () => Promise<boolean>;
  lock: () => void;
  biometryAvailable: boolean;
  biometryType?: string | null;
  initialized: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [biometryAvailable, setBiometryAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState<string | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const rnBiometrics = new ReactNativeBiometrics();
    console.debug('[Auth] Checking sensor availability...');
    rnBiometrics.isSensorAvailable().then(({ available, biometryType }) => {
      console.debug('[Auth] Sensor available:', available, 'type:', biometryType);
      setBiometryAvailable(Boolean(available));
      setBiometryType(available ? (biometryType ?? null) : null);
      if (!available) {
        console.debug('[Auth] Biometrics unavailable, keeping app unlocked');
        setIsUnlocked(true);
      }
      setInitialized(true);
    }).catch((e) => {
      console.warn('[Auth] isSensorAvailable error:', e);
      setBiometryAvailable(false);
      setBiometryType(null);
      setIsUnlocked(true);
      setInitialized(true);
    });
  }, []);

  const requestUnlock = useCallback(async (): Promise<boolean> => {
    if (!biometryAvailable) {
      console.debug('[Auth] requestUnlock bypassed (biometrics unavailable)');
      setIsUnlocked(true);
      return true;
    }
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      console.debug('[Auth] Showing simplePrompt...');
      const { success } = await rnBiometrics.simplePrompt({ promptMessage: 'Unlock with biometrics' });
      console.debug('[Auth] simplePrompt result success:', success);
      setIsUnlocked(!!success);
      return !!success;
    } catch (e) {
      console.warn('[Auth] simplePrompt error:', e);
      setIsUnlocked(false);
      return false;
    }
  }, [biometryAvailable]);

  const lock = useCallback(() => {
    if (biometryAvailable) setIsUnlocked(false);
  }, [biometryAvailable]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      const prev = appState.current;
      appState.current = nextState;
      console.debug('[Auth] AppState change:', prev, '->', nextState);
      if ((nextState === 'background' || nextState === 'inactive') && prev === 'active') {
        console.debug('[Auth] Locking due to background/inactive');
        lock();
      }
    });
    return () => sub.remove();
  }, [lock]);

  const value = useMemo(() => ({ isUnlocked, requestUnlock, lock, biometryAvailable, biometryType, initialized }), [isUnlocked, requestUnlock, lock, biometryAvailable, biometryType, initialized]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
