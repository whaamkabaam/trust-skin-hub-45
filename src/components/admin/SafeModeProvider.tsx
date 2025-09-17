import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';

interface SafeModeContextType {
  isSafeModeEnabled: boolean;
  enableSafeMode: (reason: string) => void;
  disableSafeMode: () => void;
  safeModeReason: string | null;
}

const SafeModeContext = createContext<SafeModeContextType | null>(null);

export function SafeModeProvider({ children }: { children: React.ReactNode }) {
  const [isSafeModeEnabled, setIsSafeModeEnabled] = useState(false);
  const [safeModeReason, setSafeModeReason] = useState<string | null>(null);

  const enableSafeMode = useCallback((reason: string) => {
    setIsSafeModeEnabled(true);
    setSafeModeReason(reason);
    toast.warning(`Safe Mode enabled: ${reason}`, {
      description: 'Some features have been disabled to prevent crashes. Refresh the page to exit safe mode.',
      duration: 8000
    });
  }, []);

  const disableSafeMode = useCallback(() => {
    setIsSafeModeEnabled(false);
    setSafeModeReason(null);
    toast.success('Safe Mode disabled');
  }, []);

  return (
    <SafeModeContext.Provider value={{
      isSafeModeEnabled,
      enableSafeMode,
      disableSafeMode,
      safeModeReason
    }}>
      {children}
    </SafeModeContext.Provider>
  );
}

export function useSafeMode() {
  const context = useContext(SafeModeContext);
  if (!context) {
    throw new Error('useSafeMode must be used within SafeModeProvider');
  }
  return context;
}