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
  Download
} from 'lucide-react';
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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/manifestacao/nova', label: 'Nova Manifestação', icon: MessageSquarePlus },
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
      {/* Skip Link - Acessibilidade WCAG 2.4.1 */}
      <a 
        href="#main-content" 
        className="skip-link"
      >
        Pular para o conteúdo principal
      </a>

      <header 
        className={`sticky top-0 z-40 transition-all duration-300 safe-top ${
          isScrolled || !isHeroPage
            ? 'bg-[var(--bg-elevated)] border-b border-[var(--border-primary)] shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              aria-label="Participa DF - Voltar para página inicial"
            >
              <Image
                src="/favicon.png"
                alt="Participa DF"
                width={44}
                height={44}
                className="rounded-xl"
                priority
              />
            </Link>

            {/* Navegação Desktop */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
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
              {/* Install PWA Button */}
              {isInstallable && (
                <button
                  onClick={promptInstall}
                  className={`btn-icon border-0 ${
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
                className="hidden md:flex btn-primary py-2.5 px-5 text-sm"
              >
                <MessageSquarePlus className="w-4 h-4" aria-hidden="true" />
                <span>Nova Manifestação</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                className={`md:hidden btn-icon border-0 ${
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden absolute left-0 right-0 top-full bg-[var(--bg-elevated)] border-b border-[var(--border-primary)] shadow-lg z-50"
          >
          <nav 
            className="container mx-auto px-4 py-4 space-y-1 bg-[var(--bg-elevated)] border-t border-[var(--border-primary)]"
            aria-label="Menu de navegação mobile"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    active 
                      ? 'bg-[var(--brand-primary)] text-white' 
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                  aria-current={active ? 'page' : undefined}
                  tabIndex={isMobileMenuOpen ? 0 : -1}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
            
            {/* Mobile CTA */}
            <Link
              href="/manifestacao/nova"
              className="flex items-center justify-center gap-2 w-full mt-4 btn-primary py-3"
              tabIndex={isMobileMenuOpen ? 0 : -1}
            >
              <MessageSquarePlus className="w-5 h-5" aria-hidden="true" />
              Nova Manifestação
            </Link>

            {/* Mobile Install Button */}
            {isInstallable && (
              <button
                onClick={promptInstall}
                className="flex items-center justify-center gap-2 w-full mt-2 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                tabIndex={isMobileMenuOpen ? 0 : -1}
              >
                <Download className="w-5 h-5" aria-hidden="true" />
                Instalar App
              </button>
            )}
          </nav>
          </div>
        )}
      </header>

      {/* Accessibility Panel */}
      <AccessibilityPanel 
        isOpen={isA11yPanelOpen} 
        onClose={() => setIsA11yPanelOpen(false)} 
      />
    </>
  );
}