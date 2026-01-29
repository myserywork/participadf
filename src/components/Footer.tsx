'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ExternalLink,
  Heart
} from 'lucide-react';

const LINKS = {
  institucional: [
    { label: 'Portal GDF', href: 'https://www.df.gov.br', external: true },
    { label: 'Controladoria-Geral', href: 'https://www.cg.df.gov.br', external: true },
    { label: 'Lei de Acesso à Informação', href: 'https://www.cg.df.gov.br/lai/', external: true },
    { label: 'LGPD', href: 'https://www.cg.df.gov.br/lgpd/', external: true },
  ],
  servicos: [
    { label: 'Nova Manifestação', href: '/manifestacao/nova' },
    { label: 'Consultar Protocolo', href: '/consulta' },
    { label: 'Central de Ajuda', href: '/ajuda' },
    { label: 'Perguntas Frequentes', href: '/ajuda#faq' },
  ],
  contato: {
    telefone: '162',
    email: 'ouvidoria@cg.df.gov.br',
    endereco: 'SIG, Quadra 01, Lote 630/640, Brasília-DF',
    horario: 'Segunda a Sexta, 8h às 18h'
  },
  social: [
    { label: 'Facebook', icon: Facebook, href: 'https://facebook.com/controladoriagdf' },
    { label: 'Instagram', icon: Instagram, href: 'https://instagram.com/controladoriagdf' },
    { label: 'Twitter', icon: Twitter, href: 'https://twitter.com/controladoriagdf' },
    { label: 'YouTube', icon: Youtube, href: 'https://youtube.com/@TVCONTROLADORIADF' },
  ]
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]" role="contentinfo">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image
                src="/favicon.png"
                alt="Participa DF"
                width={48}
                height={48}
                className="rounded-xl"
              />
              <div>
                <span className="text-xl font-bold text-[var(--text-primary)]">Participa DF</span>
                <p className="text-sm text-[var(--text-secondary)]">Ouvidoria Digital</p>
              </div>
            </Link>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
              Plataforma oficial de ouvidoria do Governo do Distrito Federal. 
              Sua participação transforma nossa cidade.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-2">
              {LINKS.social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--brand-primary)] hover:text-white transition-all"
                  aria-label={`Seguir no ${social.label}`}
                >
                  <social.icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Institucionais */}
          <div>
            <h3 className="font-bold text-[var(--text-primary)] mb-4">Institucional</h3>
            <ul className="space-y-3">
              {LINKS.institucional.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors inline-flex items-center gap-1 text-sm"
                  >
                    {link.label}
                    {link.external && <ExternalLink className="w-3 h-3" aria-hidden="true" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="font-bold text-[var(--text-primary)] mb-4">Serviços</h3>
            <ul className="space-y-3">
              {LINKS.servicos.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-bold text-[var(--text-primary)] mb-4">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{LINKS.contato.telefone}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">Central de atendimento</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <a 
                    href={`mailto:${LINKS.contato.email}`}
                    className="text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors text-sm"
                  >
                    {LINKS.contato.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-[var(--text-secondary)]">{LINKS.contato.horario}</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-[var(--text-secondary)]">{LINKS.contato.endereco}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--border-primary)]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--text-secondary)]">
            <p>
              © {currentYear} Governo do Distrito Federal. Todos os direitos reservados.
            </p>
            <p className="flex items-center gap-1">
              Feito com <Heart className="w-4 h-4 text-red-500" aria-label="amor" /> para o cidadão brasiliense
            </p>
          </div>
        </div>
      </div>
      
      {/* Safe area padding for mobile */}
      <div className="safe-bottom bg-[var(--bg-secondary)]" />
    </footer>
  );
}