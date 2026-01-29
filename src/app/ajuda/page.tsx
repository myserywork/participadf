'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Header, Footer } from '@/components';
import { 
  HelpCircle,
  MessageSquarePlus,
  Search,
  Phone,
  Mail,
  Clock,
  MapPin,
  ChevronDown,
  FileText,
  Shield,
  Mic,
  Video,
  ImageIcon,
  User,
  Building2,
  ExternalLink,
  Sparkles,
  BookOpen,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    categoria: 'Geral',
    perguntas: [
      {
        pergunta: 'O que é a Ouvidoria Digital?',
        resposta: 'A Ouvidoria Digital é uma plataforma do Governo do Distrito Federal que permite aos cidadãos registrar manifestações como reclamações, sugestões, elogios, denúncias e solicitações de forma totalmente digital, acessível e inclusiva.'
      },
      {
        pergunta: 'Quem pode usar a Ouvidoria Digital?',
        resposta: 'Qualquer pessoa pode utilizar a Ouvidoria Digital, seja cidadão brasileiro ou estrangeiro, pessoa física ou jurídica. O serviço é gratuito e está disponível 24 horas por dia, 7 dias por semana.'
      },
      {
        pergunta: 'Qual o prazo para resposta da minha manifestação?',
        resposta: 'O prazo legal para resposta é de até 20 dias úteis, podendo ser prorrogado por mais 10 dias mediante justificativa, conforme a Lei de Acesso à Informação (Lei nº 12.527/2011).'
      }
    ]
  },
  {
    categoria: 'Tipos de Manifestação',
    perguntas: [
      {
        pergunta: 'Qual a diferença entre reclamação e denúncia?',
        resposta: 'A reclamação é utilizada quando você está insatisfeito com um serviço público ou atendimento recebido. Já a denúncia é para reportar irregularidades, ilegalidades ou condutas impróprias de agentes públicos ou prestadores de serviço.'
      },
      {
        pergunta: 'Posso fazer uma manifestação anônima?',
        resposta: 'Sim! Você pode optar por fazer uma manifestação anônima. Sua identidade será completamente preservada e você receberá um protocolo para acompanhar o andamento. No entanto, ao se identificar, você receberá atualizações por e-mail sobre sua manifestação.'
      },
      {
        pergunta: 'Quando devo usar cada tipo de manifestação?',
        resposta: 'Use RECLAMAÇÃO para insatisfações com serviços; SUGESTÃO para propor melhorias; ELOGIO para reconhecer bom atendimento; DENÚNCIA para irregularidades; e SOLICITAÇÃO para pedir informações ou serviços específicos.'
      }
    ]
  },
  {
    categoria: 'Anexos e Mídia',
    perguntas: [
      {
        pergunta: 'Quais tipos de arquivos posso anexar?',
        resposta: 'Você pode anexar imagens (JPG, PNG), documentos (PDF, DOC, DOCX), além de gravar áudios e vídeos diretamente na plataforma. O tamanho máximo por arquivo é de 10MB.'
      },
      {
        pergunta: 'Como gravar áudio ou vídeo na plataforma?',
        resposta: 'Na etapa de "Manifestação", você encontrará botões para gravar áudio e vídeo. Basta clicar no botão correspondente e permitir o acesso ao microfone ou câmera do seu dispositivo. A gravação de áudio tem limite de 5 minutos e o vídeo de 2 minutos.'
      }
    ]
  },
  {
    categoria: 'Acompanhamento',
    perguntas: [
      {
        pergunta: 'Como acompanhar minha manifestação?',
        resposta: 'Ao finalizar o registro, você receberá um número de protocolo único. Use esse número na página "Consultar" para verificar o status e andamento da sua manifestação a qualquer momento.'
      },
      {
        pergunta: 'Perdi meu número de protocolo, o que fazer?',
        resposta: 'Se você se identificou ao registrar a manifestação, o protocolo foi enviado para seu e-mail. Caso seja manifestação anônima e tenha perdido o protocolo, infelizmente não há como recuperá-lo por questões de privacidade.'
      }
    ]
  },
  {
    categoria: 'Acessibilidade',
    perguntas: [
      {
        pergunta: 'A plataforma é acessível para pessoas com deficiência?',
        resposta: 'Sim! A plataforma foi desenvolvida seguindo as diretrizes WCAG 2.1 nível AAA. Oferecemos recursos como alto contraste, ajuste de tamanho de fonte, navegação por teclado, compatibilidade com leitores de tela, e opções de gravação de áudio e vídeo para quem tem dificuldade com texto.'
      },
      {
        pergunta: 'Como ativar o modo de alto contraste?',
        resposta: 'Clique no ícone de engrenagem (⚙️) no topo da página para abrir o painel de acessibilidade. Lá você pode ativar o alto contraste, ajustar o tamanho da fonte e outras preferências visuais.'
      }
    ]
  }
];

const GUIAS = [
  {
    icon: MessageSquarePlus,
    titulo: 'Como fazer uma manifestação',
    descricao: 'Passo a passo completo para registrar sua manifestação',
    cor: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Search,
    titulo: 'Como consultar o protocolo',
    descricao: 'Aprenda a acompanhar o andamento da sua manifestação',
    cor: 'from-purple-500 to-violet-500'
  },
  {
    icon: Mic,
    titulo: 'Usando recursos de mídia',
    descricao: 'Como gravar áudio, vídeo e enviar fotos',
    cor: 'from-pink-500 to-rose-500'
  },
  {
    icon: Shield,
    titulo: 'Privacidade e segurança',
    descricao: 'Entenda como seus dados são protegidos',
    cor: 'from-green-500 to-emerald-500'
  }
];

export default function AjudaPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [activeCategoria, setActiveCategoria] = useState('Geral');

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <div className="animated-bg" aria-hidden="true" />
      <Header />
      
      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          </div>
          
          <div className="relative container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md mb-6">
                <HelpCircle className="w-10 h-10 text-white" aria-hidden="true" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Central de Ajuda
              </h1>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Encontre respostas para suas dúvidas e aprenda a usar todos os recursos da Ouvidoria Digital
              </p>
            </motion.div>
          </div>
          
          {/* Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none" className="w-full h-12 md:h-20">
              <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H0Z" fill="var(--bg-primary)"/>
            </svg>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {GUIAS.map((guia, index) => (
                <motion.div
                  key={guia.titulo}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-6 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-primary)] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${guia.cor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <guia.icon className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-[var(--text-primary)] mb-2">{guia.titulo}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{guia.descricao}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 px-4 bg-[var(--bg-secondary)]" id="faq">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
                Perguntas Frequentes
              </h2>
              <p className="text-[var(--text-secondary)]">
                Encontre respostas rápidas para as dúvidas mais comuns
              </p>
            </motion.div>

            {/* Categorias */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {FAQ_ITEMS.map((cat) => (
                <button
                  key={cat.categoria}
                  onClick={() => setActiveCategoria(cat.categoria)}
                  className={`nav-pill ${activeCategoria === cat.categoria ? 'active' : ''}`}
                >
                  {cat.categoria}
                </button>
              ))}
            </div>

            {/* Perguntas */}
            <div className="space-y-3">
              {FAQ_ITEMS.find(c => c.categoria === activeCategoria)?.perguntas.map((item, index) => {
                const faqId = `${activeCategoria}-${index}`;
                const isOpen = openFaq === faqId;
                
                return (
                  <motion.div
                    key={faqId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-primary)] overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(faqId)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--bg-secondary)] transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold text-[var(--text-primary)] pr-4">
                        {item.pergunta}
                      </span>
                      <ChevronDown 
                        className={`w-5 h-5 text-[var(--text-tertiary)] flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                        aria-hidden="true"
                      />
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-5 pb-5 pt-0">
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                              {item.resposta}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contato */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
                Ainda precisa de ajuda?
              </h2>
              <p className="text-[var(--text-secondary)]">
                Nossa equipe está pronta para atender você
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Telefone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="form-card text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                  <Phone className="w-8 h-8 text-white" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-xl text-[var(--text-primary)] mb-2">Ligue para nós</h3>
                <p className="text-4xl font-bold text-[var(--brand-primary)] mb-2">162</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Central de Atendimento GDF
                </p>
              </motion.div>

              {/* E-mail */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="form-card text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-white" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-xl text-[var(--text-primary)] mb-2">E-mail</h3>
                <a 
                  href="mailto:ouvidoria@cg.df.gov.br"
                  className="text-[var(--brand-primary)] hover:underline font-medium"
                >
                  ouvidoria@cg.df.gov.br
                </a>
                <p className="text-sm text-[var(--text-secondary)] mt-2">
                  Resposta em até 2 dias úteis
                </p>
              </motion.div>

              {/* Horário */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="form-card text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-white" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-xl text-[var(--text-primary)] mb-2">Horário</h3>
                <p className="text-[var(--text-primary)] font-medium">Segunda a Sexta</p>
                <p className="text-[var(--brand-primary)] font-bold">8h às 18h</p>
                <p className="text-sm text-[var(--text-secondary)] mt-2">
                  Plataforma online 24h
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 mb-12 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Pronto para fazer sua manifestação?
            </h2>
            <p className="text-white/80 mb-8">
              É rápido, fácil e você pode acompanhar todo o processo online
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/manifestacao/nova"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:shadow-lg transition-all hover:scale-105"
              >
                <MessageSquarePlus className="w-5 h-5" aria-hidden="true" />
                Nova Manifestação
              </Link>
              <Link
                href="/consulta"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:shadow-lg transition-all hover:scale-105"
              >
                <Search className="w-5 h-5" aria-hidden="true" />
                Consultar Protocolo
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}