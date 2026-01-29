'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  MessageSquarePlus, 
  Search, 
  Mic, 
  Video, 
  ImageIcon, 
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  Eye,
  Zap,
  ChevronRight,
  Accessibility,
  Globe,
  Smartphone,
  Volume2,
  Languages,
  Check,
  ShieldCheck
} from 'lucide-react';
import { Header, Footer } from '@/components';

// Variants de animação e dados
const TIPOS_MANIFESTACAO = [
  { 
    tipo: 'denuncia', 
    emoji: '⚠️',
    titulo: 'Denúncia', 
    desc: 'Reporte irregularidades, ilícitos ou desvios de conduta.',
    color: 'bg-red-500',
    lightColor: 'bg-red-50 dark:bg-red-900/20',
    textColor: 'text-red-700 dark:text-red-400',
    borderColor: 'border-red-200 dark:border-red-800'
  },
  { 
    tipo: 'reclamacao', 
    emoji: '😤',
    titulo: 'Reclamação', 
    desc: 'Manifeste insatisfação com serviços públicos.',
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50 dark:bg-amber-900/20',
    textColor: 'text-amber-700 dark:text-amber-400',
    borderColor: 'border-amber-200 dark:border-amber-800'
  },
  { 
    tipo: 'solicitacao', 
    emoji: '📋',
    titulo: 'Solicitação', 
    desc: 'Peça acesso a atendimentos ou serviços.',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-700 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  { 
    tipo: 'sugestao', 
    emoji: '💡',
    titulo: 'Sugestão', 
    desc: 'Envie ideias para melhorias na gestão.',
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50 dark:bg-purple-900/20',
    textColor: 'text-purple-700 dark:text-purple-400',
    borderColor: 'border-purple-200 dark:border-purple-800'
  },
  { 
    tipo: 'elogio', 
    emoji: '⭐',
    titulo: 'Elogio', 
    desc: 'Demonstre satisfação com o atendimento.',
    color: 'bg-emerald-500',
    lightColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    borderColor: 'border-emerald-200 dark:border-emerald-800'
  }
];

const FEATURES = [
  {
    icon: Mic,
    title: 'Relate por Voz',
    description: 'Não quer digitar? Grave um áudio explicando a situação.',
    color: 'text-pink-600',
    bg: 'bg-pink-100'
  },
  {
    icon: Video,
    title: 'Vídeo em Libras',
    description: 'Envie relatos em vídeo, inclusive em Libras.',
    color: 'text-purple-600',
    bg: 'bg-purple-100'
  },
  {
    icon: ImageIcon,
    title: 'Anexos Visuais',
    description: 'Adicione fotos e documentos para comprovar.',
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  {
    icon: Smartphone,
    title: '100% Mobile',
    description: 'Acesse de qualquer lugar, direto do celular.',
    color: 'text-orange-600',
    bg: 'bg-orange-100'
  }
];

const STATS = [
  { value: '100%', label: 'Digital', icon: Globe },
  { value: '24h', label: 'Disponível', icon: Clock },
  { value: 'AAA', label: 'Acessível', icon: Accessibility },
  { value: 'GDF', label: 'Integrado', icon: ShieldCheck }
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] overflow-x-hidden selection:bg-[var(--brand-primary)] selection:text-white">
      <Header />
      
      <main id="main-content" className="flex-1">
        {/* Hero Section Moderno */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[var(--bg-primary)]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[var(--brand-primary)]/10 to-transparent blur-3xl" />
          </div>

          {/* Floating Blobs */}
          <motion.div style={{ y: y1 }} className="absolute top-20 left-[10%] w-72 h-72 bg-blue-400/20 rounded-full blur-[100px]" />
          <motion.div style={{ y: y2 }} className="absolute bottom-20 right-[10%] w-96 h-96 bg-purple-400/20 rounded-full blur-[100px]" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mb-8"
              >
                <Image
                  src="/participadf-branca.png"
                  alt="Participa DF - Ouvidoria Digital"
                  width={200}
                  height={60}
                  className="drop-shadow-2xl"
                  priority
                />
              </motion.div>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-8 hover:scale-105 transition-transform cursor-default"
              >
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-gray-600">Ouvidoria Ativa 24h</span>
              </motion.div>

              {/* Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-7xl font-extrabold tracking-tight text-[var(--text-primary)] mb-6 leading-[1.1]"
              >
                Sua voz transforma <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient-x">
                  o Distrito Federal
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl leading-relaxed"
              >
                Cidadania ativa na palma da sua mão. Registre denúncias, elogios ou sugestões e acompanhe tudo em tempo real com total transparência.
              </motion.p>

              {/* Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 w-full justify-center"
              >
                <Link
                  href="/manifestacao/nova"
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 font-bold text-lg rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <MessageSquarePlus className="w-5 h-5 text-white" />
                  <span className="text-white">Nova Manifestação</span>
                  <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  href="/consulta"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[var(--text-primary)] font-bold text-lg rounded-2xl border border-[var(--border-primary)] shadow-sm hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300"
                >
                  <Search className="w-5 h-5" />
                  Consultar Protocolo
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mt-16 pt-8 border-t border-[var(--border-primary)] grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full max-w-4xl"
              >
                {STATS.map((stat, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <stat.icon className="w-6 h-6 text-[var(--text-tertiary)]" />
                    <div className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</div>
                    <div className="text-xs uppercase tracking-wider text-[var(--text-tertiary)] font-semibold">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Tipos de Manifestação */}
        <section className="py-24 px-4 bg-[var(--bg-secondary)] relative">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
                  Como podemos ajudar?
                </h2>
                <p className="text-lg text-[var(--text-secondary)] max-w-xl">
                  Selecione o tipo de manifestação que melhor se adequa à sua necessidade atual.
                </p>
              </div>
              <Link href="/ajuda" className="text-[var(--brand-primary)] font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                Saber mais sobre os tipos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {TIPOS_MANIFESTACAO.map((t, i) => (
                <Link 
                  key={t.tipo}
                  href={`/manifestacao/nova?tipo=${t.tipo}`}
                  className={`group flex flex-col p-6 bg-[var(--bg-elevated)] rounded-3xl border border-[var(--border-primary)] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden`}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 ${t.lightColor} rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500`} />
                  
                  <span className="text-4xl mb-6 relative z-10 filter drop-shadow-sm">{t.emoji}</span>
                  
                  <h3 className={`text-xl font-bold ${t.textColor} mb-3 relative z-10`}>
                    {t.titulo}
                  </h3>
                  
                  <p className="text-sm text-[var(--text-secondary)] relative z-10 mb-6 flex-1">
                    {t.desc}
                  </p>
                  
                  <div className="flex items-center text-sm font-semibold text-[var(--text-primary)] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Começar <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-6">
                  <Sparkles className="w-4 h-4" /> Inovação
                </div>
                <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
                  Tecnologia para facilitar <br />
                  <span className="text-[var(--brand-primary)]">sua cidadania</span>
                </h2>
                <p className="text-lg text-[var(--text-secondary)] mb-8 leading-relaxed">
                  Desenvolvemos uma plataforma pensada para ser acessível, rápida e transparente. 
                  Você tem diversas formas de se comunicar com o governo.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {FEATURES.map((feat, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-[var(--bg-secondary)] transition-colors">
                      <div className={`w-12 h-12 rounded-xl ${feat.bg} flex items-center justify-center flex-shrink-0`}>
                        <feat.icon className={`w-6 h-6 ${feat.color}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-[var(--text-primary)] mb-1">{feat.title}</h4>
                        <p className="text-sm text-[var(--text-secondary)]">{feat.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative Image/Mockup Area */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[2rem] opacity-10 rotate-3 transform scale-95" />
                <div className="relative bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-[2rem] p-8 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8 border-b border-[var(--border-primary)] pb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      I
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[var(--text-primary)]">IZA Assistente</h3>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm text-[var(--text-secondary)]">Online agora</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3">
                       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex-shrink-0" />
                       <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                         <p className="text-sm text-[var(--text-primary)]">Olá! Sou a IZA. Posso ajudar você a classificar sua manifestação automaticamente. O que deseja relatar?</p>
                       </div>
                    </div>
                    <div className="flex gap-3 flex-row-reverse">
                       <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0" />
                       <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[80%]">
                         <p className="text-sm">O posto de saúde da minha quadra está sem médico hoje.</p>
                       </div>
                    </div>
                     <div className="flex gap-3">
                       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex-shrink-0" />
                       <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                         <div className="flex items-center gap-2 mb-2 text-amber-600 font-bold text-xs uppercase tracking-wide">
                           <Sparkles className="w-3 h-3" /> Sugestão de IA
                         </div>
                         <p className="text-sm text-[var(--text-primary)] mb-3">Isso parece ser uma <strong>Reclamação</strong> sobre a <strong>Secretaria de Saúde (SES)</strong>.</p>
                         <button className="text-xs font-bold text-white bg-blue-600 px-3 py-2 rounded-lg w-full hover:bg-blue-700 transition-colors">
                           Confirmar e Continuar
                         </button>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility Highlight */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 transform translate-x-20 pointer-events-none" />

           <div className="container mx-auto px-4 max-w-6xl relative z-10">
             <div className="flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="md:w-1/2">
                 <div className="flex items-center gap-2 text-amber-400 font-bold mb-4 uppercase tracking-wider text-sm">
                   <Accessibility className="w-5 h-5" /> Acessibilidade Total
                 </div>
                 <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                   Um governo para <br />
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                     todas as pessoas
                   </span>
                 </h2>
                 <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                   Seguimos rigorosamente os padrões WCAG 2.1 nível AAA.
                   Nossa plataforma se adapta a você, não o contrário.
                 </p>

                 <div className="grid grid-cols-2 gap-4">
                   {[
                     { icon: Eye, label: 'Alto Contraste' },
                     { icon: Volume2, label: 'Leitor de Tela' },
                     { icon: Languages, label: 'Linguagem Simples' },
                     { icon: Video, label: 'Libras' },
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10">
                       <item.icon className="w-5 h-5 text-amber-400" />
                       <span className="font-medium text-white">{item.label}</span>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="md:w-1/2 flex justify-center">
                 <div className="relative">
                    <div className="absolute -inset-4 bg-amber-400/20 rounded-full blur-2xl animate-pulse" />
                    <button
                      onClick={() => document.getElementById('accessibility-trigger')?.click()}
                      className="relative bg-white text-slate-900 p-8 rounded-3xl shadow-2xl hover:scale-105 transition-transform group"
                    >
                      <Accessibility className="w-20 h-20 text-slate-800 group-hover:text-blue-600 transition-colors" />
                      <div className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full">
                        <Check className="w-4 h-4" />
                      </div>
                    </button>
                 </div>
               </div>
             </div>
           </div>
        </section>

        {/* CTA Final */}
        <section className="py-24 px-4 text-center mb-20">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
              Pronto para exercer sua cidadania?
            </h2>
            <p className="text-lg text-[var(--text-secondary)] mb-10">
              Contribua para um Distrito Federal melhor. É rápido, fácil e seguro.
            </p>
            <Link
              href="/manifestacao/nova"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-blue-600 hover:bg-blue-700 font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-white">Começar Agora</span>
              <ArrowRight className="w-6 h-6 text-white" />
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}