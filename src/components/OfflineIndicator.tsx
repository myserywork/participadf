'use client';

import { useState, useEffect } from 'react';
import { WifiOff, Wifi, CloudOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [pendingSync, setPendingSync] = useState(0);

  useEffect(() => {
    // Verificar estado inicial
    setIsOnline(navigator.onLine);

    // Verificar manifestações pendentes
    const checkPending = () => {
      try {
        const stored = localStorage.getItem('manifestacoes-pendentes');
        if (stored) {
          const pending = JSON.parse(stored);
          setPendingSync(Array.isArray(pending) ? pending.length : 0);
        }
      } catch {
        setPendingSync(0);
      }
    };

    checkPending();

    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      // Esconder banner após 3 segundos
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('storage', checkPending);

    // Mostrar banner inicial se offline
    if (!navigator.onLine) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('storage', checkPending);
    };
  }, []);

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className={`fixed top-0 left-0 right-0 z-[100] px-4 py-3 text-center text-white font-medium shadow-lg ${
            isOnline
              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
              : 'bg-gradient-to-r from-amber-500 to-orange-600'
          }`}
        >
          <div className="container mx-auto flex items-center justify-center gap-3">
            {isOnline ? (
              <>
                <Wifi className="w-5 h-5" />
                <span>Conexão restaurada!</span>
                {pendingSync > 0 && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full text-sm">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Sincronizando {pendingSync} item(s)...
                  </span>
                )}
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5" />
                <span>Você está offline</span>
                <span className="text-sm opacity-90">
                  - Suas manifestações serão salvas localmente
                </span>
              </>
            )}

            <button
              onClick={() => setShowBanner(false)}
              className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Fechar"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Indicador permanente quando offline */}
      {!isOnline && !showBanner && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setShowBanner(true)}
          className="fixed top-20 right-4 z-[90] p-3 bg-amber-500 text-white rounded-full shadow-lg hover:bg-amber-600 transition-colors"
          aria-label="Status offline"
        >
          <CloudOff className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// Hook para verificar se está online
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
