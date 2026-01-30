'use client';

/**
 * @component InstallPrompt
 * @description Componente para exibir prompt de instalação do PWA
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  X,
  Smartphone,
  Wifi,
  Bell,
  Zap,
  Share,
  PlusSquare
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Detecta o tipo de dispositivo/navegador
function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return { isIOS: false, isAndroid: false, isMobile: false, isStandalone: false };
  }

  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
  const isAndroid = /Android/.test(ua);
  const isMobile = isIOS || isAndroid || /webOS|BlackBerry|Opera Mini|IEMobile/.test(ua);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true;

  return { isIOS, isAndroid, isMobile, isStandalone };
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({ isIOS: false, isAndroid: false, isMobile: false, isStandalone: false });
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    const info = getDeviceInfo();
    setDeviceInfo(info);

    // Verifica se já está instalado
    if (info.isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Verifica se o usuário já dispensou o prompt recentemente
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60);
      if (hoursSinceDismissed < 24) {
        return;
      }
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), 3000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Para iOS, mostra o banner após 5 segundos se for mobile
    if (info.isIOS && info.isMobile) {
      setTimeout(() => setShowBanner(true), 5000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deviceInfo.isIOS) {
      setShowIOSInstructions(true);
      return;
    }

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
    setShowIOSInstructions(false);
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
          {/* Header */}
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

          {/* Instruções iOS */}
          {showIOSInstructions ? (
            <div className="p-4 space-y-3">
              <p className="text-white text-sm font-medium">Para instalar no iPhone/iPad:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-white/10 rounded-lg">
                  <Share className="w-5 h-5 text-blue-200" />
                  <span className="text-sm text-white">1. Toque no botão <strong>Compartilhar</strong></span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-white/10 rounded-lg">
                  <PlusSquare className="w-5 h-5 text-blue-200" />
                  <span className="text-sm text-white">2. Selecione <strong>Adicionar à Tela de Início</strong></span>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="w-full py-2 text-blue-200 text-sm hover:text-white transition-colors"
              >
                Entendi
              </button>
            </div>
          ) : (
            <>
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

              {/* Botão */}
              <div className="p-4 pt-2">
                <button
                  onClick={handleInstall}
                  className="w-full py-3 px-4 bg-white text-blue-600 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  {deviceInfo.isIOS ? 'Como Instalar' : 'Instalar Agora'}
                </button>
                <p className="text-center text-blue-200 text-xs mt-2">
                  Grátis • Sem loja de apps
                </p>
              </div>
            </>
          )}
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
  const [deviceInfo, setDeviceInfo] = useState({ isIOS: false, isAndroid: false, isMobile: false, isStandalone: false });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const info = getDeviceInfo();
    setDeviceInfo(info);

    // Verifica se já está instalado
    if (info.isStandalone) {
      setIsInstalled(true);
      return;
    }

    // No mobile, sempre mostra como instalável (iOS ou Android)
    if (info.isMobile) {
      setIsInstallable(true);
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
    // Para iOS, retorna informação especial
    if (deviceInfo.isIOS) {
      // Mostra alerta com instruções
      alert('Para instalar no iPhone/iPad:\n\n1. Toque no botão Compartilhar (📤)\n2. Selecione "Adicionar à Tela de Início"');
      return false;
    }

    if (!deferredPrompt) {
      // Fallback para Android sem prompt
      if (deviceInfo.isAndroid) {
        alert('Para instalar:\n\n1. Toque no menu (⋮) do navegador\n2. Selecione "Instalar app" ou "Adicionar à tela inicial"');
      }
      return false;
    }

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

  return { isInstallable, isInstalled, promptInstall, isIOS: deviceInfo.isIOS };
}
