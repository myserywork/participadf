'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  HelpCircle,
  Menu,
  X,
  Settings,
  MessageSquarePlus,
  Sun,
  Moon,
  Download,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AccessibilityPanel from './AccessibilityPanel';
import { useInstallPrompt } from './InstallPrompt';
import { useAcessibilidadeStore } from '@/lib/store';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isA11yPanelOpen, setIsA11yPanelOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { config, setTema } = useAcessibilidadeStore();
  const { isInstallable, promptInstall } = useInstallPrompt();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Bloqueia scroll quando menu mobile está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/manifestacao/nova', label: 'Nova Manifestação', icon: MessageSquarePlus, highlight: true },
    { href: '/consulta', label: 'Consultar', icon: Search },
    { href: '/ajuda', label: 'Ajuda', icon: HelpCircle },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const toggleTheme = () => {
    const themes: Array<'light' | 'dark' | 'high-contrast'> = ['light', 'dark', 'high-contrast'];
    const currentIndex = themes.indexOf(config.tema);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTema(themes[nextIndex]);
  };

  const isHeroPage = pathname === '/';

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 safe-top ${
          isScrolled || !isHeroPage
            ? 'bg-[var(--bg-elevated)]/95 backdrop-blur-md border-b border-[var(--border-primary)] shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3"
              aria-label="Participa DF - Voltar para página inicial"
            >
              <Image
                src="/icons/icon-72x72.svg"
                alt=""
                width={40}
                height={40}
                className="rounded-xl"
                priority
              />
              <span className={`font-bold text-lg hidden sm:block ${
                isScrolled || !isHeroPage ? 'text-[var(--text-primary)]' : 'text-white'
              }`}>
                Participa DF
              </span>
            </Link>

            {/* Navegação Desktop */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Navegação principal">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-pill ${
                      active
                        ? 'active'
                        : isScrolled || !isHeroPage
                          ? ''
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Install PWA Button - Desktop only */}
              {isInstallable && (
                <button
                  onClick={promptInstall}
                  className={`hidden md:flex btn-icon border-0 ${
                    isScrolled || !isHeroPage
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                  }`}
                  aria-label="Instalar aplicativo"
                  title="Instalar App"
                >
                  <Download className="w-5 h-5" aria-hidden="true" />
                </button>
              )}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`btn-icon border-0 ${
                  isScrolled || !isHeroPage
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                aria-label={`Tema atual: ${config.tema}. Clique para alternar`}
              >
                {config.tema === 'dark' ? (
                  <Moon className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Sun className="w-5 h-5" aria-hidden="true" />
                )}
              </button>

              {/* Accessibility Button */}
              <button
                onClick={() => setIsA11yPanelOpen(true)}
                className={`btn-icon border-0 ${
                  isScrolled || !isHeroPage
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                aria-label="Abrir configurações de acessibilidade"
              >
                <Settings className="w-5 h-5" aria-hidden="true" />
              </button>

              {/* CTA Button - Desktop */}
              <Link
                href="/manifestacao/nova"
                className="hidden lg:flex btn-primary py-2.5 px-5 text-sm"
              >
                <MessageSquarePlus className="w-4 h-4" aria-hidden="true" />
                <span>Nova Manifestação</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                className={`lg:hidden btn-icon border-0 ${
                  isScrolled || !isHeroPage
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                    : 'bg-white/10 text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <Menu className="w-6 h-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Full Screen Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Menu Panel */}
              <motion.div
                id="mobile-menu"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="lg:hidden fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[var(--bg-elevated)] z-50 shadow-2xl flex flex-col"
              >
                {/* Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/icons/icon-72x72.svg"
                      alt=""
                      width={36}
                      height={36}
                      className="rounded-lg"
                    />
                    <span className="font-bold text-[var(--text-primary)]">Menu</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                    aria-label="Fechar menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto p-4" aria-label="Menu de navegação mobile">
                  <div className="space-y-1">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-4 py-4 rounded-2xl font-medium transition-all ${
                            active
                              ? 'bg-[var(--brand-primary)] text-white shadow-lg shadow-blue-500/20'
                              : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                          }`}
                          aria-current={active ? 'page' : undefined}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              active ? 'bg-white/20' : 'bg-[var(--bg-tertiary)]'
                            }`}>
                              <Icon className="w-5 h-5" aria-hidden="true" />
                            </div>
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight className={`w-5 h-5 ${active ? 'text-white/70' : 'text-[var(--text-tertiary)]'}`} />
                        </Link>
                      );
                    })}
                  </div>

                  {/* Divider */}
                  <div className="my-6 border-t border-[var(--border-primary)]" />

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    {/* Install Button */}
                    {isInstallable && (
                      <button
                        onClick={() => {
                          promptInstall();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/20"
                      >
                        <Download className="w-5 h-5" aria-hidden="true" />
                        Instalar App
                      </button>
                    )}

                    {/* CTA Button */}
                    <Link
                      href="/manifestacao/nova"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20"
                    >
                      <MessageSquarePlus className="w-5 h-5" aria-hidden="true" />
                      Nova Manifestação
                    </Link>
                  </div>
                </nav>

                {/* Footer Info */}
                <div className="p-4 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                  <p className="text-xs text-[var(--text-tertiary)] text-center">
                    Central de Atendimento: <strong className="text-[var(--text-secondary)]">162</strong>
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Accessibility Panel */}
      <AccessibilityPanel
        isOpen={isA11yPanelOpen}
        onClose={() => setIsA11yPanelOpen(false)}
      />
    </>
  );
}
