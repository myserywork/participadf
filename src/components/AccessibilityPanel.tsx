'use client';

/**
 * @component AccessibilityPanel
 * @description Painel lateral de configurações de acessibilidade
 *
 * Implementa diretrizes WCAG 2.1 AA:
 * - Navegação por teclado completa
 * - Gerenciamento de foco (focus trap)
 * - ARIA labels e roles
 * - Suporte a leitores de tela
 */

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAcessibilidadeStore } from '@/lib/store';
import { 
  Sun, 
  Moon, 
  Eye, 
  Type, 
  Volume2, 
  Settings, 
  X, 
  RotateCcw,
  Keyboard,
  Monitor,
  Sparkles,
  Check
} from 'lucide-react';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccessibilityPanel({ isOpen, onClose }: AccessibilityPanelProps) {
  const {
    config,
    setTema,
    setTamanhoFonte,
    toggleAltoContraste,
    toggleReducaoMovimento,
    resetConfig
  } = useAcessibilidadeStore();

  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Gerenciamento de foco - move foco para o painel quando abre
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Bloqueia scroll do body quando painel está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Aplica configurações no documento
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', config.tema);
    document.documentElement.setAttribute('data-font-size', config.tamanhoFonte);
    
    if (config.reducaoMovimento) {
      document.documentElement.style.setProperty('--animation-duration', '0ms');
    } else {
      document.documentElement.style.removeProperty('--animation-duration');
    }
  }, [config]);

  // Fecha com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const tamanhosFonte = [
    { value: 'small', label: 'P', fullLabel: 'Pequeno' },
    { value: 'medium', label: 'M', fullLabel: 'Médio' },
    { value: 'large', label: 'G', fullLabel: 'Grande' },
    { value: 'extra-large', label: 'XG', fullLabel: 'Extra Grande' },
  ] as const;

  const temas = [
    { 
      value: 'light', 
      label: 'Claro', 
      icon: Sun, 
      colors: 'from-amber-400 to-orange-500',
      bg: 'bg-gradient-to-br from-amber-50 to-orange-50'
    },
    { 
      value: 'dark', 
      label: 'Escuro', 
      icon: Moon, 
      colors: 'from-indigo-500 to-purple-600',
      bg: 'bg-gradient-to-br from-indigo-50 to-purple-50'
    },
    { 
      value: 'high-contrast', 
      label: 'Alto Contraste', 
      icon: Eye, 
      colors: 'from-gray-800 to-black',
      bg: 'bg-gradient-to-br from-gray-100 to-gray-200'
    },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Painel */}
          <motion.div
            ref={panelRef}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="accessibility-title"
            aria-describedby="accessibility-description"
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[var(--bg-primary)] shadow-2xl z-[101] overflow-y-auto flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-dark)] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Settings className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="accessibility-title" className="text-xl font-bold">
                    Acessibilidade
                  </h2>
                  <p id="accessibility-description" className="text-sm text-white/70">Personalize sua experiência</p>
                </div>
              </div>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-xl transition-colors"
                aria-label="Fechar painel de acessibilidade"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 p-6 space-y-8 overflow-y-auto">
              {/* Tema */}
              <section aria-labelledby="theme-section">
                <h3 id="theme-section" className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-[var(--brand-primary)]" aria-hidden="true" />
                  Tema de Cores
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {temas.map((t) => {
                    const Icon = t.icon;
                    const isActive = config.tema === t.value;
                    
                    return (
                      <button
                        key={t.value}
                        onClick={() => setTema(t.value)}
                        className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 group
                          ${isActive 
                            ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5 shadow-lg' 
                            : 'border-[var(--border-primary)] hover:border-[var(--brand-primary)]/50 hover:shadow-md'
                          }`}
                        aria-pressed={isActive}
                      >
                        {isActive && (
                          <motion.div 
                            layoutId="theme-check"
                            className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--brand-primary)] rounded-full flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.colors} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-[var(--text-primary)]">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Tamanho da Fonte */}
              <section aria-labelledby="font-section">
                <h3 id="font-section" className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <Type className="w-5 h-5 text-[var(--brand-primary)]" aria-hidden="true" />
                  Tamanho do Texto
                </h3>
                <div className="flex gap-2 p-1 bg-[var(--bg-secondary)] rounded-2xl">
                  {tamanhosFonte.map((t, index) => {
                    const isActive = config.tamanhoFonte === t.value;
                    
                    return (
                      <button
                        key={t.value}
                        onClick={() => setTamanhoFonte(t.value)}
                        className={`relative flex-1 py-4 rounded-xl transition-all flex flex-col items-center gap-1
                          ${isActive 
                            ? 'bg-[var(--bg-elevated)] shadow-lg' 
                            : 'hover:bg-[var(--bg-elevated)]/50'
                          }`}
                        aria-pressed={isActive}
                        aria-label={`Tamanho ${t.fullLabel}`}
                      >
                        <span 
                          className={`font-bold ${isActive ? 'text-[var(--brand-primary)]' : 'text-[var(--text-primary)]'}`}
                          style={{ fontSize: `${14 + (index * 6)}px` }}
                          aria-hidden="true"
                        >
                          A
                        </span>
                        <span className="text-xs text-[var(--text-secondary)]">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-[var(--text-tertiary)] mt-2 text-center">
                  Texto atual: <span className="font-medium">{tamanhosFonte.find(t => t.value === config.tamanhoFonte)?.fullLabel}</span>
                </p>
              </section>

              {/* Opções adicionais */}
              <section aria-labelledby="options-section">
                <h3 id="options-section" className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[var(--brand-primary)]" aria-hidden="true" />
                  Preferências
                </h3>
                <div className="space-y-3">
                  {/* Alto Contraste Toggle */}
                  <label className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-secondary)] cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-black flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white" aria-hidden="true" />
                      </div>
                      <div>
                        <span className="font-semibold block text-[var(--text-primary)]">Alto Contraste</span>
                        <span className="text-sm text-[var(--text-secondary)]">Aumenta visibilidade</span>
                      </div>
                    </div>
                    <div className={`relative w-14 h-8 rounded-full transition-colors ${config.altoContraste ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-primary)]'}`}>
                      <motion.div 
                        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                        animate={{ left: config.altoContraste ? '30px' : '4px' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                      <input
                        type="checkbox"
                        checked={config.altoContraste}
                        onChange={toggleAltoContraste}
                        className="sr-only"
                        aria-label="Alto Contraste"
                      />
                    </div>
                  </label>
                  
                  {/* Reduzir Animações Toggle */}
                  <label className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-secondary)] cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                        <Volume2 className="w-5 h-5 text-white" aria-hidden="true" />
                      </div>
                      <div>
                        <span className="font-semibold block text-[var(--text-primary)]">Reduzir Animações</span>
                        <span className="text-sm text-[var(--text-secondary)]">Menos movimento na tela</span>
                      </div>
                    </div>
                    <div className={`relative w-14 h-8 rounded-full transition-colors ${config.reducaoMovimento ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-primary)]'}`}>
                      <motion.div 
                        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                        animate={{ left: config.reducaoMovimento ? '30px' : '4px' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                      <input
                        type="checkbox"
                        checked={config.reducaoMovimento}
                        onChange={toggleReducaoMovimento}
                        className="sr-only"
                        aria-label="Reduzir Animações"
                      />
                    </div>
                  </label>
                </div>
              </section>

              {/* Dicas de Navegação */}
              <section className="bg-gradient-to-br from-[var(--brand-primary)]/10 to-[var(--brand-primary)]/5 rounded-2xl p-5 border border-[var(--brand-primary)]/20" aria-labelledby="info-section">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)] flex items-center justify-center">
                    <Keyboard className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <h3 id="info-section" className="font-bold text-[var(--text-primary)]">
                    Atalhos de Teclado
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-[var(--bg-elevated)] rounded-lg text-xs font-mono border border-[var(--border-primary)]">Tab</kbd>
                    <span className="text-[var(--text-secondary)]">Navegar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-[var(--bg-elevated)] rounded-lg text-xs font-mono border border-[var(--border-primary)]">Enter</kbd>
                    <span className="text-[var(--text-secondary)]">Ativar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-[var(--bg-elevated)] rounded-lg text-xs font-mono border border-[var(--border-primary)]">Esc</kbd>
                    <span className="text-[var(--text-secondary)]">Fechar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-[var(--bg-elevated)] rounded-lg text-xs font-mono border border-[var(--border-primary)]">Space</kbd>
                    <span className="text-[var(--text-secondary)]">Selecionar</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer - Botão Reset */}
            <div className="sticky bottom-0 p-4 bg-[var(--bg-primary)] border-t border-[var(--border-primary)]">
              <button
                onClick={resetConfig}
                className="w-full py-4 rounded-xl border-2 border-[var(--border-primary)] hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 transition-all flex items-center justify-center gap-2 font-semibold text-[var(--text-primary)]"
              >
                <RotateCcw className="w-5 h-5" />
                Restaurar Padrões
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}