'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, Footer, AudioRecorder, VideoRecorder, FileUpload, AnexosList, IzaAssistente, ProtocoloSucesso } from '@/components';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  User, 
  FileText, 
  Paperclip, 
  Eye,
  Shield,
  AlertTriangle,
  Building2,
  Mic,
  Video,
  ImageIcon,
  UserX,
  Sparkles,
  Lock,
  CheckCircle2,
  Info
} from 'lucide-react';
import { TipoManifestacao, OrgaoGDF, ORGAOS_GDF, Anexo, Manifestacao } from '@/lib/types';
import { gerarProtocolo, validarCPF, validarEmail, validarTelefone, gerarId } from '@/lib/utils';
import { useManifestacaoStore } from '@/lib/store';

const STEPS = [
  { id: 1, title: 'Tipo', subtitle: 'Escolha o tipo', icon: FileText },
  { id: 2, title: 'Identificação', subtitle: 'Seus dados', icon: User },
  { id: 3, title: 'Manifestação', subtitle: 'Descreva', icon: Paperclip },
  { id: 4, title: 'Revisar', subtitle: 'Confirme', icon: Eye },
];

const TIPOS_INFO: Record<TipoManifestacao, { titulo: string; descricao: string; emoji: string; gradient: string }> = {
  denuncia: {
    titulo: 'Denúncia',
    descricao: 'Reporte irregularidades ou condutas impróprias',
    emoji: '⚠️',
    gradient: 'from-red-500 to-orange-500'
  },
  reclamacao: {
    titulo: 'Reclamação',
    descricao: 'Relate insatisfação com serviços públicos',
    emoji: '😤',
    gradient: 'from-amber-500 to-yellow-500'
  },
  solicitacao: {
    titulo: 'Solicitação',
    descricao: 'Peça informações ou serviços',
    emoji: '📋',
    gradient: 'from-blue-500 to-cyan-500'
  },
  sugestao: {
    titulo: 'Sugestão',
    descricao: 'Proponha melhorias para os serviços',
    emoji: '💡',
    gradient: 'from-purple-500 to-violet-500'
  },
  elogio: {
    titulo: 'Elogio',
    descricao: 'Reconheça o bom atendimento recebido',
    emoji: '⭐',
    gradient: 'from-green-500 to-emerald-500'
  }
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0
  })
};

function NovaManifestacaoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { adicionarManifestacao } = useManifestacaoStore();
  
  const [[currentStep, direction], setStep] = useState([1, 0]);
  const [manifestacaoCriada, setManifestacaoCriada] = useState<Manifestacao | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [tipo, setTipo] = useState<TipoManifestacao | null>(null);
  const [orgao, setOrgao] = useState<OrgaoGDF | ''>('');
  const [anonimo, setAnonimo] = useState(false);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [assunto, setAssunto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [aceitaTermos, setAceitaTermos] = useState(false);
  
  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const tipoParam = searchParams.get('tipo') as TipoManifestacao;
    if (tipoParam && TIPOS_INFO[tipoParam]) {
      setTipo(tipoParam);
    }
  }, [searchParams]);

  const paginate = (newDirection: number) => {
    if (currentStep + newDirection >= 1 && currentStep + newDirection <= 5) {
      setStep([currentStep + newDirection, newDirection]);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!tipo) newErrors.tipo = 'Selecione o tipo de manifestação';
        if (!orgao) newErrors.orgao = 'Selecione o órgão responsável';
        break;
      case 2:
        if (!anonimo) {
          if (!nome.trim()) newErrors.nome = 'Nome é obrigatório';
          if (!email.trim()) newErrors.email = 'E-mail é obrigatório';
          else if (!validarEmail(email)) newErrors.email = 'E-mail inválido';
          if (cpf && !validarCPF(cpf)) newErrors.cpf = 'CPF inválido';
          if (telefone && !validarTelefone(telefone)) newErrors.telefone = 'Telefone inválido';
        }
        break;
      case 3:
        if (!assunto.trim()) newErrors.assunto = 'Assunto é obrigatório';
        if (!descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
        else if (descricao.length < 20) newErrors.descricao = 'Descrição deve ter no mínimo 20 caracteres';
        break;
      case 4:
        if (!aceitaTermos) newErrors.termos = 'Você deve aceitar os termos para continuar';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 4) {
        handleSubmit();
      } else {
        paginate(1);
      }
    }
  };

  const handleBack = () => {
    paginate(-1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simula processamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const novaManifestacao: Manifestacao = {
      id: gerarId(),
      protocolo: gerarProtocolo(),
      tipo: tipo!,
      orgao: orgao as OrgaoGDF,
      status: 'registrada',
      anonimo,
      dadosManifestante: anonimo ? undefined : {
        nome,
        cpf: cpf || undefined,
        email,
        telefone: telefone || undefined
      },
      assunto,
      descricao,
      anexos,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    adicionarManifestacao(novaManifestacao);
    setManifestacaoCriada(novaManifestacao);
    setIsSubmitting(false);
    setStep([5, 1]);
  };

  const addAnexo = (anexo: Anexo) => {
    setAnexos(prev => [...prev, anexo]);
  };

  const removeAnexo = (id: string) => {
    setAnexos(prev => prev.filter(a => a.id !== id));
  };

  // Tela de sucesso
  if (currentStep === 5 && manifestacaoCriada) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
        <div className="animated-bg" aria-hidden="true" />
        <Header />
        <main id="main-content" className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <ProtocoloSucesso manifestacao={manifestacaoCriada} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <div className="animated-bg" aria-hidden="true" />
      <Header />
      
      <main id="main-content" className="flex-1 py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Page Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
              Nova Manifestação
            </h1>
            <p className="text-[var(--text-secondary)]">
              Preencha os dados abaixo para registrar sua manifestação
            </p>
          </motion.div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <motion.div 
                      className={`
                        w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center 
                        font-bold text-lg transition-all duration-300 shadow-md
                        ${currentStep > step.id 
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' 
                          : currentStep === step.id 
                            ? 'bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] text-white shadow-lg scale-110' 
                            : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'}
                      `}
                      animate={{ scale: currentStep === step.id ? 1.1 : 1 }}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-6 h-6" aria-hidden="true" />
                      ) : (
                        <step.icon className="w-6 h-6" aria-hidden="true" />
                      )}
                    </motion.div>
                    <span className={`mt-2 text-xs md:text-sm font-medium text-center hidden sm:block ${
                      currentStep >= step.id ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="flex-1 mx-2 md:mx-4">
                      <div className="h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: currentStep > step.id ? '100%' : '0%' }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Mobile step indicator */}
            <div className="sm:hidden text-center">
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                Passo {currentStep} de {STEPS.length}: {STEPS[currentStep - 1]?.title}
              </span>
            </div>
          </div>

          {/* Form Card */}
          <motion.div 
            className="form-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
              >
                {/* Step 1: Tipo */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-2">
                        Qual o tipo de manifestação?
                      </h2>
                      <p className="text-[var(--text-secondary)]">
                        Escolha a opção que melhor descreve sua necessidade
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(Object.keys(TIPOS_INFO) as TipoManifestacao[]).map((tipoKey) => (
                        <button
                          key={tipoKey}
                          onClick={() => setTipo(tipoKey)}
                          className={`
                            type-card group ${tipo === tipoKey ? 'selected' : ''}
                          `}
                          aria-pressed={tipo === tipoKey}
                        >
                          <div className={`
                            w-14 h-14 rounded-2xl flex items-center justify-center text-2xl
                            transition-all duration-300
                            ${tipo === tipoKey 
                              ? `bg-gradient-to-br ${TIPOS_INFO[tipoKey].gradient} shadow-lg` 
                              : 'bg-[var(--bg-tertiary)]'}
                          `}>
                            {TIPOS_INFO[tipoKey].emoji}
                          </div>
                          <h3 className="font-bold text-[var(--text-primary)]">
                            {TIPOS_INFO[tipoKey].titulo}
                          </h3>
                          <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                            {TIPOS_INFO[tipoKey].descricao}
                          </p>
                          {tipo === tipoKey && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 right-3 w-6 h-6 bg-[var(--brand-primary)] rounded-full flex items-center justify-center"
                            >
                              <Check className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                        </button>
                      ))}
                    </div>
                    {errors.tipo && (
                      <p className="text-[var(--error)] text-sm flex items-center gap-2" role="alert">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.tipo}
                      </p>
                    )}

                    <div className="pt-6 border-t border-[var(--border-primary)]">
                      <label htmlFor="orgao" className="block text-sm font-semibold text-[var(--text-primary)] mb-3">
                        <Building2 className="w-4 h-4 inline mr-2" aria-hidden="true" />
                        Órgão responsável
                      </label>
                      <select
                        id="orgao"
                        value={orgao}
                        onChange={(e) => setOrgao(e.target.value as OrgaoGDF)}
                        className="input-field"
                        aria-describedby={errors.orgao ? 'orgao-error' : undefined}
                      >
                        <option value="">Selecione o órgão</option>
                        {ORGAOS_GDF.map((org) => (
                          <option key={org} value={org}>{org}</option>
                        ))}
                      </select>
                      {errors.orgao && (
                        <p id="orgao-error" className="text-[var(--error)] text-sm mt-2 flex items-center gap-2" role="alert">
                          <AlertTriangle className="w-4 h-4" />
                          {errors.orgao}
                        </p>
                      )}
                    </div>

                    {/* IZA */}
                    <IzaAssistente 
                      conteudo={descricao}
                      onClassificacao={(classificacao) => {
                        setTipo(classificacao.tipoSugerido);
                        setOrgao(classificacao.orgaoSugerido);
                      }}
                    />
                  </div>
                )}

                {/* Step 2: Identificação */}
                {currentStep === 2 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-2">
                        Identificação
                      </h2>
                      <p className="text-[var(--text-secondary)]">
                        Seus dados são protegidos pela LGPD
                      </p>
                    </div>

                    {/* Opção de anonimato */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setAnonimo(false)}
                        className={`type-card ${!anonimo ? 'selected' : ''}`}
                        aria-pressed={!anonimo}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${!anonimo ? 'bg-blue-600' : 'bg-[var(--bg-tertiary)]'}`}>
                          <User className={`w-6 h-6 ${!anonimo ? 'text-white' : 'text-[var(--text-secondary)]'}`} />
                        </div>
                        <h3 className="font-bold">Identificado</h3>
                        <p className="text-sm text-[var(--text-secondary)]">Receba atualizações por e-mail</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAnonimo(true)}
                        className={`type-card ${anonimo ? 'selected' : ''}`}
                        aria-pressed={anonimo}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${anonimo ? 'bg-blue-600' : 'bg-[var(--bg-tertiary)]'}`}>
                          <UserX className={`w-6 h-6 ${anonimo ? 'text-white' : 'text-[var(--text-secondary)]'}`} />
                        </div>
                        <h3 className="font-bold">Anônimo</h3>
                        <p className="text-sm text-[var(--text-secondary)]">Sua identidade será preservada</p>
                      </button>
                    </div>

                    {anonimo ? (
                      <div className="p-6 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)]">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[var(--text-primary)] mb-1">Manifestação Anônima</h4>
                            <p className="text-sm text-[var(--text-secondary)]">
                              Sua identidade será completamente preservada. Você receberá um protocolo para 
                              acompanhar o andamento da manifestação sem precisar se identificar.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="input-group">
                            <label htmlFor="nome">Nome completo *</label>
                            <input
                              type="text"
                              id="nome"
                              value={nome}
                              onChange={(e) => setNome(e.target.value)}
                              className="input-field"
                              placeholder="Seu nome"
                              aria-required="true"
                            />
                            {errors.nome && <p className="error">{errors.nome}</p>}
                          </div>
                          
                          <div className="input-group">
                            <label htmlFor="cpf">CPF (opcional)</label>
                            <input
                              type="text"
                              id="cpf"
                              value={cpf}
                              onChange={(e) => setCpf(e.target.value.replace(/\D/g, '').slice(0, 11))}
                              className="input-field"
                              placeholder="000.000.000-00"
                            />
                            {errors.cpf && <p className="error">{errors.cpf}</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="input-group">
                            <label htmlFor="email">E-mail *</label>
                            <input
                              type="email"
                              id="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="input-field"
                              placeholder="seu@email.com"
                              aria-required="true"
                            />
                            {errors.email && <p className="error">{errors.email}</p>}
                          </div>
                          
                          <div className="input-group">
                            <label htmlFor="telefone">Telefone (opcional)</label>
                            <input
                              type="tel"
                              id="telefone"
                              value={telefone}
                              onChange={(e) => setTelefone(e.target.value)}
                              className="input-field"
                              placeholder="(61) 99999-9999"
                            />
                            {errors.telefone && <p className="error">{errors.telefone}</p>}
                          </div>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-xl flex items-start gap-3">
                          <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-blue-800">
                            Seus dados são protegidos pela Lei Geral de Proteção de Dados (LGPD) e 
                            serão utilizados apenas para acompanhamento da sua manifestação.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Conteúdo */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-2">
                        Descreva sua manifestação
                      </h2>
                      <p className="text-[var(--text-secondary)]">
                        Seja o mais detalhado possível para agilizar o atendimento
                      </p>
                    </div>

                    <div className="input-group">
                      <label htmlFor="assunto">Assunto *</label>
                      <input
                        type="text"
                        id="assunto"
                        value={assunto}
                        onChange={(e) => setAssunto(e.target.value)}
                        className="input-field"
                        placeholder="Resumo da sua manifestação"
                        maxLength={100}
                        aria-required="true"
                      />
                      <div className="flex justify-between">
                        {errors.assunto && <p className="error">{errors.assunto}</p>}
                        <span className="text-xs text-[var(--text-tertiary)] ml-auto">
                          {assunto.length}/100
                        </span>
                      </div>
                    </div>

                    <div className="input-group">
                      <label htmlFor="descricao">Descrição detalhada *</label>
                      <textarea
                        id="descricao"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="input-field min-h-[180px] resize-none"
                        placeholder="Descreva detalhadamente sua manifestação. Inclua datas, locais, pessoas envolvidas e qualquer informação relevante..."
                        maxLength={5000}
                        aria-required="true"
                      />
                      <div className="flex justify-between">
                        {errors.descricao && <p className="error">{errors.descricao}</p>}
                        <span className="text-xs text-[var(--text-tertiary)] ml-auto">
                          {descricao.length}/5000
                        </span>
                      </div>
                    </div>

                    {/* Anexos */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                        <Paperclip className="w-5 h-5" />
                        Anexos (opcional)
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <AudioRecorder
                          onSave={(anexo) => addAnexo(anexo)}
                        />
                        <VideoRecorder
                          onSave={(anexo) => addAnexo(anexo)}
                        />
                        <FileUpload
                          onFileSelect={(anexo) => addAnexo(anexo)}
                          acceptedTypes="image/*,.pdf,.doc,.docx"
                          maxSize={10 * 1024 * 1024}
                        />
                      </div>

                      {anexos.length > 0 && (
                        <AnexosList
                          anexos={anexos}
                          onRemove={removeAnexo}
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Revisão */}
                {currentStep === 4 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-2">
                        Revise sua manifestação
                      </h2>
                      <p className="text-[var(--text-secondary)]">
                        Confira os dados antes de enviar
                      </p>
                    </div>

                    {/* Resumo */}
                    <div className="space-y-4">
                      {/* Tipo */}
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{tipo && TIPOS_INFO[tipo].emoji}</span>
                          <div>
                            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">Tipo</p>
                            <p className="font-bold text-[var(--text-primary)]">
                              {tipo && TIPOS_INFO[tipo].titulo}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Building2 className="w-6 h-6 text-[var(--text-tertiary)]" />
                          <div>
                            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">Órgão</p>
                            <p className="font-medium text-[var(--text-primary)]">{orgao}</p>
                          </div>
                        </div>
                      </div>

                      {/* Manifestante */}
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-xl">
                        <div className="flex items-center gap-3">
                          {anonimo ? (
                            <UserX className="w-6 h-6 text-[var(--text-tertiary)]" />
                          ) : (
                            <User className="w-6 h-6 text-[var(--text-tertiary)]" />
                          )}
                          <div>
                            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">Manifestante</p>
                            <p className="font-medium text-[var(--text-primary)]">
                              {anonimo ? 'Anônimo' : nome}
                            </p>
                            {!anonimo && email && (
                              <p className="text-sm text-[var(--text-secondary)]">{email}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Conteúdo */}
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-xl">
                        <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-2">Assunto</p>
                        <p className="font-bold text-[var(--text-primary)] mb-4">{assunto}</p>
                        
                        <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-2">Descrição</p>
                        <p className="text-[var(--text-secondary)] whitespace-pre-wrap line-clamp-4">
                          {descricao}
                        </p>
                      </div>

                      {/* Anexos */}
                      {anexos.length > 0 && (
                        <div className="p-4 bg-[var(--bg-secondary)] rounded-xl">
                          <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-2">
                            Anexos ({anexos.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {anexos.map(anexo => (
                              <span key={anexo.id} className="badge badge-info">
                                {anexo.tipo === 'audio' && <Mic className="w-3 h-3" />}
                                {anexo.tipo === 'video' && <Video className="w-3 h-3" />}
                                {(anexo.tipo === 'imagem' || anexo.tipo === 'documento') && <ImageIcon className="w-3 h-3" />}
                                {anexo.nome}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Termos */}
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={aceitaTermos}
                          onChange={(e) => setAceitaTermos(e.target.checked)}
                          className="mt-1 w-5 h-5 rounded border-2 border-yellow-400 text-yellow-600 focus:ring-yellow-500"
                        />
                        <span className="text-sm text-yellow-800">
                          Declaro que as informações prestadas são verdadeiras e assumo inteira 
                          responsabilidade pelas mesmas, ciente de que a prestação de informações 
                          falsas poderá acarretar penalidades legais.
                        </span>
                      </label>
                      {errors.termos && (
                        <p className="text-[var(--error)] text-sm mt-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          {errors.termos}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-[var(--border-primary)]">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`btn-secondary ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </button>
              
              <div className="text-sm text-[var(--text-tertiary)]">
                Passo {currentStep} de {STEPS.length}
              </div>
              
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : currentStep === 4 ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Enviar Manifestação
                  </>
                ) : (
                  <>
                    Próximo
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function NovaManifestacaoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <NovaManifestacaoContent />
    </Suspense>
  );
}