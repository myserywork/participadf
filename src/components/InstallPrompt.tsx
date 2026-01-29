'use client';

/**
 * @component InstallPrompt
 * @description Componente para exibir prompt de instalação do PWA
 *
 * Funcionalidades:
 * - Detecta quando o app pode ser instalado
 * - Exibe banner atrativo convidando à instalação
 * - Permite dispensar o prompt temporariamente
 * - Persiste preferência do usuário
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  X,
  Smartphone,
  Wifi,
  Bell,
  Zap
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verifica se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Verifica se o usuário já dispensou o prompt recentemente
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60);
      // Mostra novamente após 24 horas
      if (hoursSinceDismissed < 24) {
        return;
      }
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Aguarda um pouco antes de mostrar o banner
      setTimeout(() => setShowBanner(true), 3000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
      }

      setShowBanner(false);
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (isInstalled || !showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-50"
      >
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-2xl shadow-blue-500/30 overflow-hidden">
          {/* Header com botão fechar */}
          <div className="flex items-start justify-between p-4 pb-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Instalar App</h3>
                <p className="text-blue-100 text-sm">Acesso rápido e offline</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Benefícios */}
          <div className="px-4 py-3">
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Zap, label: 'Mais rápido' },
                { icon: Wifi, label: 'Funciona offline' },
                { icon: Bell, label: 'Notificações' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/10"
                >
                  <item.icon className="w-4 h-4 text-blue-200" />
                  <span className="text-[10px] text-blue-100 text-center leading-tight">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Botão de instalação */}
          <div className="p-4 pt-2">
            <button
              onClick={handleInstall}
              className="w-full py-3 px-4 bg-white text-blue-600 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-lg"
            >
              <Download className="w-5 h-5" />
              Instalar Agora
            </button>
            <p className="text-center text-blue-200 text-xs mt-2">
              Grátis • Sem loja de apps
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Hook para usar o install prompt em outros componentes
 */
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Verifica se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
      }

      setDeferredPrompt(null);
      return outcome === 'accepted';
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
      return false;
    }
  };

  return { isInstallable, isInstalled, promptInstall };
}
