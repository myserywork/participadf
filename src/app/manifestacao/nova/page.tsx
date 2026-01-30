'use client';

import { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, Footer, AudioRecorder, VideoRecorder, FileUpload, AnexosList, ProtocoloSucesso, MapaLocalizacao, SeletorAssunto } from '@/components';
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
  MapPin,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Tag,
  ClipboardList,
  Send,
  Search,
  X,
  Phone,
  Info,
  ChevronRight,
  FileQuestion,
  ExternalLink
} from 'lucide-react';
import { TipoManifestacao, OrgaoGDF, ORGAOS_GDF, Anexo, Manifestacao } from '@/lib/types';
import { gerarProtocolo, validarCPF, validarEmail, validarTelefone, gerarId } from '@/lib/utils';
import { useManifestacaoStore } from '@/lib/store';
import {
  Assunto,
  CampoComplementar,
  sugerirAssuntosPorRelato
} from '@/lib/assuntos';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════════════════

interface Step {
  id: number;
  key: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  dinamico?: boolean;
}

const STEPS_BASE: Step[] = [
  { id: 1, key: 'relato', title: 'Relato', icon: MessageSquare },
  { id: 2, key: 'assunto', title: 'Assunto', icon: Tag },
  { id: 3, key: 'complementar', title: 'Informações Complementares', icon: FileQuestion, dinamico: true },
  { id: 4, key: 'local', title: 'Local do Fato', icon: MapPin, dinamico: true },
  { id: 5, key: 'resumo', title: 'Resumo', icon: ClipboardList },
  { id: 6, key: 'identificacao', title: 'Identificação', icon: User },
  { id: 7, key: 'anexos', title: 'Anexos', icon: Paperclip },
  { id: 8, key: 'protocolo', title: 'Protocolo', icon: Send },
];

const TIPOS_INFO: Record<TipoManifestacao, { titulo: string; emoji: string }> = {
  denuncia: { titulo: 'Denúncia', emoji: '⚠️' },
  reclamacao: { titulo: 'Reclamação', emoji: '😤' },
  solicitacao: { titulo: 'Solicitação', emoji: '📋' },
  sugestao: { titulo: 'Sugestão', emoji: '💡' },
  elogio: { titulo: 'Elogio', emoji: '⭐' }
};

const REGIOES_ADMINISTRATIVAS = [
  'RA-I - Plano Piloto',
  'RA-II - Gama',
  'RA-III - Taguatinga',
  'RA-IV - Brazlândia',
  'RA-V - Sobradinho',
  'RA-VI - Planaltina',
  'RA-VII - Paranoá',
  'RA-VIII - Núcleo Bandeirante',
  'RA-IX - Ceilândia',
  'RA-X - Guará',
  'RA-XI - Cruzeiro',
  'RA-XII - Samambaia',
  'RA-XIII - Santa Maria',
  'RA-XIV - São Sebastião',
  'RA-XV - Recanto das Emas',
  'RA-XVI - Lago Sul',
  'RA-XVII - Riacho Fundo',
  'RA-XVIII - Lago Norte',
  'RA-XIX - Candangolândia',
  'RA-XX - Águas Claras',
  'RA-XXI - Riacho Fundo II',
  'RA-XXII - Sudoeste/Octogonal',
  'RA-XXIII - Varjão',
  'RA-XXIV - Park Way',
  'RA-XXV - SCIA/Estrutural',
  'RA-XXVI - Sobradinho II',
  'RA-XXVII - Jardim Botânico',
  'RA-XXVIII - Itapoã',
  'RA-XXIX - SIA',
  'RA-XXX - Vicente Pires',
  'RA-XXXI - Fercal',
  'RA-XXXII - Sol Nascente/Pôr do Sol',
  'RA-XXXIII - Arniqueira'
];

const MIN_CHARS = 20;
const MAX_CHARS = 13000;
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

// Mensagens da IZA por etapa
const IZA_MESSAGES: Record<string, { titulo: string; mensagem: string }> = {
  relato: {
    titulo: 'Olá! Sou a IZA',
    mensagem: 'Vou te ajudar no seu relato. Para que tudo ocorra bem, é importante que seu relato seja sobre um tema por vez e bem detalhado. Escreva pelo menos 20 caracteres.'
  },
  assunto: {
    titulo: 'Vamos classificar!',
    mensagem: 'Com base no seu relato, identifiquei alguns assuntos possíveis. Selecione o que melhor representa sua manifestação ou pesquise por outro.'
  },
  complementar: {
    titulo: 'Informações adicionais',
    mensagem: 'Preciso dessas informações complementares. Elas vão me ajudar a entregar a demanda no local correto.'
  },
  local: {
    titulo: 'Onde aconteceu?',
    mensagem: 'Informe a localização do fato. Quanto mais preciso, melhor será o atendimento.'
  },
  resumo: {
    titulo: 'Confira tudo!',
    mensagem: 'Revise todas as informações antes de prosseguir. Você ainda pode voltar e editar qualquer etapa.'
  },
  identificacao: {
    titulo: 'Identificação',
    mensagem: 'Você pode se identificar para acompanhar sua manifestação por e-mail, ou registrar de forma anônima. A escolha é sua!'
  },
  anexos: {
    titulo: 'Documentos e provas',
    mensagem: 'Se tiver fotos, vídeos ou documentos que comprovem sua manifestação, anexe aqui. Esta etapa é opcional.'
  },
  protocolo: {
    titulo: 'Quase lá!',
    mensagem: 'Revise os termos e finalize sua manifestação. Você receberá um número de protocolo para acompanhamento.'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE IZA ROBOT
// ═══════════════════════════════════════════════════════════════════════════

interface IzaRobotProps {
  stepKey: string;
  mensagemCustomizada?: string;
  compact?: boolean;
}

function IzaRobot({ stepKey, mensagemCustomizada, compact = false }: IzaRobotProps) {
  const info = IZA_MESSAGES[stepKey];

  if (compact) {
    return (
      <div className="flex items-start gap-3 p-4 bg-[var(--brand-primary)]/10 rounded-xl border border-[var(--brand-primary)]/20">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center flex-shrink-0 shadow-md">
          <span className="text-lg">🤖</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[var(--text-primary)] leading-relaxed">
            {mensagemCustomizada || info?.mensagem}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4">
      {/* Avatar da IZA */}
      <div className="flex-shrink-0">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center shadow-lg border-2 border-[var(--bg-primary)]">
          <span className="text-3xl">🤖</span>
        </div>
        <div className="text-center mt-1">
          <span className="text-xs font-bold text-[var(--brand-primary)]">IZA</span>
        </div>
      </div>

      {/* Balão de fala */}
      <div className="flex-1 relative">
        <div className="absolute left-0 top-4 -ml-2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-[var(--brand-primary)]/10 border-b-8 border-b-transparent" />
        <div className="bg-[var(--brand-primary)]/10 rounded-2xl rounded-tl-sm p-4 border border-[var(--brand-primary)]/20 shadow-sm">
          <p className="font-bold text-[var(--brand-primary)] mb-1 text-sm">{info?.titulo}</p>
          <p className="text-[var(--text-primary)] text-sm leading-relaxed">
            {mensagemCustomizada || info?.mensagem}
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE SIDEBAR NAVEGAÇÃO
// ═══════════════════════════════════════════════════════════════════════════

interface SidebarNavProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
  assuntoSelecionado: Assunto | null;
}

function SidebarNav({ steps, currentStep, onStepClick, assuntoSelecionado }: SidebarNavProps) {
  // Filtra passos dinâmicos baseado no assunto selecionado
  const stepsVisiveis = steps.filter(step => {
    if (step.key === 'complementar') {
      return assuntoSelecionado?.camposComplementares && assuntoSelecionado.camposComplementares.length > 0;
    }
    if (step.key === 'local') {
      return assuntoSelecionado?.requerLocal !== false;
    }
    return true;
  });

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-24">
        {/* IZA mini */}
        <div className="bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] rounded-2xl p-4 mb-4 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <p className="font-bold">IZA</p>
              <p className="text-xs opacity-70">Assistente Virtual</p>
            </div>
            <Sparkles className="w-4 h-4 text-[var(--brand-accent)] animate-pulse ml-auto" />
          </div>
        </div>

        {/* Lista de passos */}
        <nav className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-primary)] p-3 shadow-sm">
          <ul className="space-y-1">
            {stepsVisiveis.map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const isClickable = currentStep > step.id;

              return (
                <li key={step.id}>
                  <button
                    onClick={() => isClickable && onStepClick(step.id)}
                    disabled={!isClickable}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all
                      ${isCurrent
                        ? 'bg-[var(--brand-primary)] text-white shadow-md'
                        : isCompleted
                          ? 'bg-[var(--success)]/10 text-[var(--success)] hover:bg-[var(--success)]/20 cursor-pointer'
                          : 'text-[var(--text-tertiary)] cursor-not-allowed'
                      }
                    `}
                  >
                    <div className={`
                      w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                      ${isCurrent
                        ? 'bg-white/20 text-white'
                        : isCompleted
                          ? 'bg-[var(--success)] text-white'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
                      }
                    `}>
                      {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
                    </div>
                    <span className={`text-sm font-medium truncate ${step.dinamico ? 'italic' : ''}`}>
                      {step.title}
                    </span>
                    {step.dinamico && (
                      <span className="ml-auto text-xs opacity-50">*</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Ajuda */}
        <div className="mt-4 p-4 bg-[var(--warning)]/10 rounded-xl border border-[var(--warning)]/30">
          <div className="flex items-center gap-2 text-[var(--warning)] mb-2">
            <Phone className="w-4 h-4" />
            <span className="font-bold text-sm">Central 162</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Se você não conseguir fazer o seu registro, ligue na Central 162.
          </p>
        </div>
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE FORMULÁRIO COMPLEMENTAR
// ═══════════════════════════════════════════════════════════════════════════

interface FormComplementarProps {
  campos: CampoComplementar[];
  valores: Record<string, string>;
  onChange: (id: string, valor: string) => void;
  errors: Record<string, string>;
}

function FormComplementar({ campos, valores, onChange, errors }: FormComplementarProps) {
  return (
    <div className="space-y-4">
      {campos.map((campo) => (
        <div key={campo.id} className="space-y-2">
          <label htmlFor={campo.id} className="block text-sm font-semibold text-[var(--text-primary)]">
            {campo.label} {campo.obrigatorio && <span className="text-[var(--error)]">*</span>}
          </label>

          {campo.tipo === 'texto' && (
            <input
              type="text"
              id={campo.id}
              value={valores[campo.id] || ''}
              onChange={(e) => onChange(campo.id, e.target.value)}
              placeholder={campo.placeholder}
              maxLength={campo.maxLength}
              className={`
                w-full p-4 bg-[var(--bg-secondary)] border rounded-xl
                focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent
                transition-all text-[var(--text-primary)] placeholder-[var(--text-tertiary)]
                ${errors[campo.id] ? 'border-[var(--error)] bg-[var(--error-light)]' : 'border-[var(--border-primary)]'}
              `}
            />
          )}

          {campo.tipo === 'numero' && (
            <input
              type="number"
              id={campo.id}
              value={valores[campo.id] || ''}
              onChange={(e) => onChange(campo.id, e.target.value)}
              placeholder={campo.placeholder}
              className={`
                w-full p-4 bg-[var(--bg-secondary)] border rounded-xl
                focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent
                transition-all text-[var(--text-primary)] placeholder-[var(--text-tertiary)]
                ${errors[campo.id] ? 'border-[var(--error)] bg-[var(--error-light)]' : 'border-[var(--border-primary)]'}
              `}
            />
          )}

          {campo.tipo === 'data' && (
            <input
              type="date"
              id={campo.id}
              value={valores[campo.id] || ''}
              onChange={(e) => onChange(campo.id, e.target.value)}
              className={`
                w-full p-4 bg-[var(--bg-secondary)] border rounded-xl
                focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent
                transition-all text-[var(--text-primary)]
                ${errors[campo.id] ? 'border-[var(--error)] bg-[var(--error-light)]' : 'border-[var(--border-primary)]'}
              `}
            />
          )}

          {campo.tipo === 'select' && campo.opcoes && (
            <select
              id={campo.id}
              value={valores[campo.id] || ''}
              onChange={(e) => onChange(campo.id, e.target.value)}
              className={`
                w-full p-4 bg-[var(--bg-secondary)] border rounded-xl
                focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent
                transition-all text-[var(--text-primary)]
                ${errors[campo.id] ? 'border-[var(--error)] bg-[var(--error-light)]' : 'border-[var(--border-primary)]'}
              `}
            >
              <option value="">Selecione...</option>
              {campo.opcoes.map((opcao) => (
                <option key={opcao} value={opcao}>{opcao}</option>
              ))}
            </select>
          )}

          {campo.tipo === 'textarea' && (
            <textarea
              id={campo.id}
              value={valores[campo.id] || ''}
              onChange={(e) => onChange(campo.id, e.target.value)}
              placeholder={campo.placeholder}
              maxLength={campo.maxLength}
              className={`
                w-full min-h-[120px] p-4 bg-[var(--bg-secondary)] border rounded-xl resize-none
                focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent
                transition-all text-[var(--text-primary)] placeholder-[var(--text-tertiary)]
                ${errors[campo.id] ? 'border-[var(--error)] bg-[var(--error-light)]' : 'border-[var(--border-primary)]'}
              `}
            />
          )}

          {errors[campo.id] && (
            <p className="text-[var(--error)] text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {errors[campo.id]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

function NovaManifestacaoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { adicionarManifestacao } = useManifestacaoStore();

  // Estado de navegação
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [manifestacaoCriada, setManifestacaoCriada] = useState<Manifestacao | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Estado do formulário
  const [relato, setRelato] = useState('');
  const [assunto, setAssunto] = useState<Assunto | null>(null);
  const [assuntosSugeridos, setAssuntosSugeridos] = useState<Assunto[]>([]);
  const [tipo, setTipo] = useState<TipoManifestacao>('reclamacao');
  const [dadosComplementares, setDadosComplementares] = useState<Record<string, string>>({});
  const [regiaoAdministrativa, setRegiaoAdministrativa] = useState('');
  const [endereco, setEndereco] = useState('');
  const [descricaoLocal, setDescricaoLocal] = useState('');
  const [coordenadas, setCoordenadas] = useState<{ lat: number; lng: number } | null>(null);
  const [anonimo, setAnonimo] = useState(false);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [aceitaTermos, setAceitaTermos] = useState(false);

  // Erros
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calcula steps visíveis baseado no assunto
  const getStepsVisiveis = useCallback(() => {
    return STEPS_BASE.filter(step => {
      if (step.key === 'complementar') {
        return assunto?.camposComplementares && assunto.camposComplementares.length > 0;
      }
      if (step.key === 'local') {
        return assunto?.requerLocal !== false;
      }
      return true;
    });
  }, [assunto]);

  const stepsVisiveis = getStepsVisiveis();

  // Encontra o step atual na lista visível
  const getCurrentVisibleStep = useCallback(() => {
    const visibleIndex = stepsVisiveis.findIndex(s => s.id === currentStep);
    return visibleIndex >= 0 ? visibleIndex + 1 : 1;
  }, [stepsVisiveis, currentStep]);

  // Analisa o relato quando sair do step 1
  const analisarRelato = useCallback(async () => {
    if (relato.length < MIN_CHARS) return;

    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const sugestoes = sugerirAssuntosPorRelato(relato);
    setAssuntosSugeridos(sugestoes);

    // Detecta tipo baseado em palavras-chave
    const relatoLower = relato.toLowerCase();
    if (relatoLower.includes('parabéns') || relatoLower.includes('excelente') || relatoLower.includes('agradeço')) {
      setTipo('elogio');
    } else if (relatoLower.includes('sugiro') || relatoLower.includes('poderia') || relatoLower.includes('melhoria')) {
      setTipo('sugestao');
    } else if (relatoLower.includes('corrupção') || relatoLower.includes('fraude') || relatoLower.includes('irregularidade')) {
      setTipo('denuncia');
    } else if (relatoLower.includes('solicito') || relatoLower.includes('preciso') || relatoLower.includes('requeiro')) {
      setTipo('solicitacao');
    } else {
      setTipo('reclamacao');
    }

    setIsAnalyzing(false);
  }, [relato]);

  // Navegação
  const goToStep = (stepId: number) => {
    if (stepId < currentStep) {
      setDirection(-1);
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getNextStep = () => {
    const currentIndex = stepsVisiveis.findIndex(s => s.id === currentStep);
    if (currentIndex < stepsVisiveis.length - 1) {
      return stepsVisiveis[currentIndex + 1].id;
    }
    return currentStep;
  };

  const getPrevStep = () => {
    const currentIndex = stepsVisiveis.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      return stepsVisiveis[currentIndex - 1].id;
    }
    return currentStep;
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    const stepInfo = STEPS_BASE.find(s => s.id === currentStep);

    switch (stepInfo?.key) {
      case 'relato':
        if (!relato.trim()) {
          newErrors.relato = 'O relato é obrigatório';
        } else if (relato.length < MIN_CHARS) {
          newErrors.relato = `O relato deve ter no mínimo ${MIN_CHARS} caracteres`;
        } else if (relato.length > MAX_CHARS) {
          newErrors.relato = `O relato deve ter no máximo ${MAX_CHARS.toLocaleString()} caracteres`;
        }
        break;

      case 'assunto':
        if (!assunto) {
          newErrors.assunto = 'Selecione um assunto';
        }
        break;

      case 'complementar':
        if (assunto?.camposComplementares) {
          for (const campo of assunto.camposComplementares) {
            if (campo.obrigatorio && !dadosComplementares[campo.id]?.trim()) {
              newErrors[campo.id] = `${campo.label} é obrigatório`;
            }
          }
        }
        break;

      case 'local':
        if (assunto?.requerLocal && !descricaoLocal.trim()) {
          newErrors.descricaoLocal = 'Descrição do local é obrigatória';
        }
        break;

      case 'identificacao':
        if (!anonimo) {
          if (!nome.trim()) newErrors.nome = 'Nome é obrigatório';
          if (!email.trim()) newErrors.email = 'E-mail é obrigatório';
          else if (!validarEmail(email)) newErrors.email = 'E-mail inválido';
          if (cpf && !validarCPF(cpf)) newErrors.cpf = 'CPF inválido';
          if (telefone && !validarTelefone(telefone)) newErrors.telefone = 'Telefone inválido';
        }
        break;

      case 'protocolo':
        if (!aceitaTermos) {
          newErrors.termos = 'Você deve aceitar os termos para continuar';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    // Analisa ao sair do relato
    if (currentStep === 1) {
      await analisarRelato();
    }

    // Último passo = enviar
    const stepInfo = STEPS_BASE.find(s => s.id === currentStep);
    if (stepInfo?.key === 'protocolo') {
      handleSubmit();
      return;
    }

    setDirection(1);
    setCurrentStep(getNextStep());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep(getPrevStep());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const novaManifestacao: Manifestacao = {
      id: gerarId(),
      protocolo: gerarProtocolo(),
      tipo,
      orgao: (assunto?.orgaoResponsavel as OrgaoGDF) || 'Outro',
      status: 'registrada',
      anonimo,
      dadosManifestante: anonimo ? undefined : {
        nome,
        cpf: cpf || undefined,
        email,
        telefone: telefone || undefined
      },
      assunto: assunto?.nome || '',
      descricao: relato,
      anexos,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    adicionarManifestacao(novaManifestacao);
    setManifestacaoCriada(novaManifestacao);
    setIsSubmitting(false);
    setCurrentStep(99); // Indica sucesso
  };

  const addAnexo = (anexo: Anexo) => setAnexos(prev => [...prev, anexo]);
  const removeAnexo = (id: string) => setAnexos(prev => prev.filter(a => a.id !== id));

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  // Tela de sucesso
  if (currentStep === 99 && manifestacaoCriada) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg-secondary)]">
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

  const currentStepInfo = STEPS_BASE.find(s => s.id === currentStep);
  const charCount = relato.length;
  const progressPercent = ((getCurrentVisibleStep() - 1) / (stepsVisiveis.length - 1)) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-secondary)]">
      <Header />

      <main id="main-content" className="flex-1 py-6 md:py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
              <li><a href="/" className="hover:text-[var(--brand-primary)]">Início</a></li>
              <li>/</li>
              <li className="text-[var(--text-primary)] font-medium">{currentStepInfo?.title}</li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <SidebarNav
              steps={STEPS_BASE}
              currentStep={currentStep}
              onStepClick={goToStep}
              assuntoSelecionado={assunto}
            />

            {/* Conteúdo principal */}
            <div className="flex-1 min-w-0">
              {/* Progress bar mobile */}
              <div className="lg:hidden mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    Etapa {getCurrentVisibleStep()} de {stepsVisiveis.length}
                  </span>
                  <span className="text-sm text-[var(--text-tertiary)]">{currentStepInfo?.title}</span>
                </div>
                <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[var(--brand-primary)] rounded-full"
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* IZA mobile */}
              <div className="lg:hidden mb-6">
                <IzaRobot stepKey={currentStepInfo?.key || 'relato'} compact />
              </div>

              {/* Card do formulário */}
              <motion.div
                className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-primary)] shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 md:p-8"
                  >
                    {/* IZA desktop */}
                    <div className="hidden lg:block mb-8">
                      <IzaRobot stepKey={currentStepInfo?.key || 'relato'} />
                    </div>

                    {/* ═══ ETAPA 1: RELATO ═══ */}
                    {currentStepInfo?.key === 'relato' && (
                      <div className="space-y-6">
                        <div>
                          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                            Descreva sua manifestação
                          </h1>
                          <p className="text-[var(--text-secondary)] text-sm">
                            Escreva no mínimo {MIN_CHARS} caracteres. Seja detalhado e objetivo.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <textarea
                            id="relato"
                            value={relato}
                            onChange={(e) => setRelato(e.target.value)}
                            placeholder="Escreva no mínimo 20 caracteres..."
                            className={`
                              w-full min-h-[300px] p-4 bg-[var(--bg-secondary)] border-2 rounded-xl resize-none
                              focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent
                              transition-all text-[var(--text-primary)] placeholder-[var(--text-tertiary)] text-base leading-relaxed
                              ${errors.relato ? 'border-[var(--error)] bg-[var(--error-light)]' : 'border-[var(--border-primary)]'}
                            `}
                          />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {charCount < MIN_CHARS ? (
                                <span className="text-sm text-[var(--warning)]">
                                  Mínimo {MIN_CHARS - charCount} caracteres
                                </span>
                              ) : (
                                <span className="text-sm text-[var(--success)] flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Pronto para continuar
                                </span>
                              )}
                            </div>
                            <span className={`text-sm ${charCount > MAX_CHARS * 0.9 ? 'text-[var(--warning)]' : 'text-[var(--text-tertiary)]'}`}>
                              {charCount.toLocaleString()}/{MAX_CHARS.toLocaleString()}
                            </span>
                          </div>

                          {errors.relato && (
                            <p className="text-[var(--error)] text-sm flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              {errors.relato}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ═══ ETAPA 2: ASSUNTO ═══ */}
                    {currentStepInfo?.key === 'assunto' && (
                      <div className="space-y-6">
                        <div>
                          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                            Qual o assunto da sua manifestação?
                          </h1>
                          <p className="text-[var(--text-secondary)] text-sm">
                            Navegue pelas categorias ou busque pelo assunto desejado.
                          </p>
                        </div>

                        {isAnalyzing ? (
                          <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                              <Loader2 className="w-10 h-10 text-[var(--brand-primary)] animate-spin mx-auto mb-4" />
                              <p className="text-[var(--text-secondary)]">Analisando seu relato...</p>
                            </div>
                          </div>
                        ) : (
                          <SeletorAssunto
                            value={assunto}
                            onChange={setAssunto}
                            sugestoes={assuntosSugeridos}
                            erro={errors.assunto}
                          />
                        )}

                        {/* Tipo de manifestação detectado */}
                        {assunto && (
                          <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)]">
                            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-2">Tipo identificado:</p>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{TIPOS_INFO[tipo].emoji}</span>
                              <span className="font-bold text-[var(--text-primary)]">{TIPOS_INFO[tipo].titulo}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ═══ ETAPA 3: INFORMAÇÕES COMPLEMENTARES ═══ */}
                    {currentStepInfo?.key === 'complementar' && assunto?.camposComplementares && (
                      <div className="space-y-6">
                        <div>
                          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                            Informações complementares
                          </h1>
                          <p className="text-[var(--text-secondary)] text-sm">
                            Preencha os campos adicionais para {assunto.nome.toLowerCase()}.
                          </p>
                        </div>

                        <FormComplementar
                          campos={assunto.camposComplementares}
                          valores={dadosComplementares}
                          onChange={(id, valor) => setDadosComplementares(prev => ({ ...prev, [id]: valor }))}
                          errors={errors}
                        />
                      </div>
                    )}

                    {/* ═══ ETAPA 4: LOCAL DO FATO ═══ */}
                    {currentStepInfo?.key === 'local' && (
                      <div className="space-y-6">
                        <div>
                          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                            Local do fato
                          </h1>
                          <p className="text-[var(--text-secondary)] text-sm">
                            Marque no mapa ou busque o endereço onde ocorreu o fato.
                          </p>
                        </div>

                        {/* Mapa interativo */}
                        <MapaLocalizacao
                          onLocationSelect={(location) => {
                            setCoordenadas({ lat: location.lat, lng: location.lng });
                            setEndereco(location.endereco);
                            if (location.bairro) {
                              // Tenta encontrar a RA correspondente
                              const raMatch = REGIOES_ADMINISTRATIVAS.find(ra =>
                                location.bairro && ra.toLowerCase().includes(location.bairro.toLowerCase())
                              );
                              if (raMatch) {
                                setRegiaoAdministrativa(raMatch);
                              }
                            }
                          }}
                          initialLocation={coordenadas || undefined}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="regiao" className="block text-sm font-semibold text-[var(--text-primary)]">
                              Região Administrativa
                            </label>
                            <select
                              id="regiao"
                              value={regiaoAdministrativa}
                              onChange={(e) => setRegiaoAdministrativa(e.target.value)}
                              className="w-full p-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] text-[var(--text-primary)]"
                            >
                              <option value="">Selecione a região</option>
                              {REGIOES_ADMINISTRATIVAS.map((ra) => (
                                <option key={ra} value={ra}>{ra}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label htmlFor="endereco" className="block text-sm font-semibold text-[var(--text-primary)]">
                              Endereço
                            </label>
                            <input
                              type="text"
                              id="endereco"
                              value={endereco}
                              onChange={(e) => setEndereco(e.target.value)}
                              placeholder="Preenchido automaticamente pelo mapa"
                              className="w-full p-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
                              readOnly={!!coordenadas}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="descricaoLocal" className="block text-sm font-semibold text-[var(--text-primary)]">
                            Complemento / Ponto de referência <span className="text-[var(--error)]">*</span>
                          </label>
                          <textarea
                            id="descricaoLocal"
                            value={descricaoLocal}
                            onChange={(e) => setDescricaoLocal(e.target.value)}
                            placeholder="Ex: Em frente ao mercado, próximo à escola, quadra 5 conjunto B..."
                            className={`
                              w-full min-h-[100px] p-4 bg-[var(--bg-secondary)] border rounded-xl resize-none
                              focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)]
                              ${errors.descricaoLocal ? 'border-[var(--error)] bg-[var(--error-light)]' : 'border-[var(--border-primary)]'}
                            `}
                          />
                          {errors.descricaoLocal && (
                            <p className="text-[var(--error)] text-sm flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              {errors.descricaoLocal}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ═══ ETAPA 5: RESUMO ═══ */}
                    {currentStepInfo?.key === 'resumo' && (
                      <div className="space-y-6">
                        <div>
                          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                            Resumo da manifestação
                          </h1>
                          <p className="text-[var(--text-secondary)] text-sm">
                            Revise as informações antes de continuar.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)]">
                            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-1">Seu registro</p>
                            <p className="text-[var(--text-primary)] whitespace-pre-wrap line-clamp-6">{relato}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)]">
                              <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-1">Assunto</p>
                              <p className="font-bold text-[var(--text-primary)]">{assunto?.nome}</p>
                              <p className="text-sm text-[var(--text-tertiary)]">{assunto?.categoria}</p>
                            </div>

                            <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)]">
                              <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-1">Órgão responsável</p>
                              <p className="font-bold text-[var(--text-primary)]">{assunto?.orgaoResponsavel}</p>
                            </div>
                          </div>

                          {Object.keys(dadosComplementares).length > 0 && (
                            <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)]">
                              <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-2">Dados complementares</p>
                              <div className="space-y-1">
                                {Object.entries(dadosComplementares).map(([key, value]) => {
                                  const campo = assunto?.camposComplementares?.find(c => c.id === key);
                                  return value ? (
                                    <p key={key} className="text-sm text-[var(--text-primary)]">
                                      <span className="font-medium">{campo?.label}:</span> {value}
                                    </p>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}

                          {(regiaoAdministrativa || endereco || descricaoLocal) && (
                            <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)]">
                              <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-2">Local do fato</p>
                              {regiaoAdministrativa && <p className="text-sm text-[var(--text-primary)]">{regiaoAdministrativa}</p>}
                              {endereco && <p className="text-sm text-[var(--text-primary)]">{endereco}</p>}
                              {descricaoLocal && <p className="text-sm text-[var(--text-primary)]">{descricaoLocal}</p>}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => goToStep(1)}
                          className="text-[var(--brand-primary)] hover:opacity-80 text-sm font-medium flex items-center gap-1"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Editar informações
                        </button>
                      </div>
                    )}

                    {/* ═══ ETAPA 6: IDENTIFICAÇÃO ═══ */}
                    {currentStepInfo?.key === 'identificacao' && (
                      <div className="space-y-6">
                        <div>
                          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                            Identificação
                          </h1>
                          <p className="text-[var(--text-secondary)] text-sm">
                            Escolha se deseja se identificar ou permanecer anônimo.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setAnonimo(true)}
                            className={`
                              relative p-6 rounded-xl border-2 text-left transition-all
                              ${anonimo ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/10' : 'border-[var(--border-primary)] hover:border-[var(--border-secondary)]'}
                            `}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${anonimo ? 'bg-[var(--brand-primary)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'}`}>
                                <UserX className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="font-bold text-[var(--text-primary)]">Avançar sem identificação</p>
                                <p className="text-sm text-[var(--text-tertiary)] mt-1">
                                  Não será possível acompanhar o andamento
                                </p>
                              </div>
                            </div>
                            {anonimo && (
                              <div className="absolute top-3 right-3 w-6 h-6 bg-[var(--brand-primary)] rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setAnonimo(false)}
                            className={`
                              relative p-6 rounded-xl border-2 text-left transition-all
                              ${!anonimo ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/10' : 'border-[var(--border-primary)] hover:border-[var(--border-secondary)]'}
                            `}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${!anonimo ? 'bg-[var(--brand-primary)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'}`}>
                                <User className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="font-bold text-[var(--text-primary)]">Prefiro me identificar</p>
                                <p className="text-sm text-[var(--text-tertiary)] mt-1">
                                  Acompanhe por e-mail e receba atualizações
                                </p>
                              </div>
                            </div>
                            {!anonimo && (
                              <div className="absolute top-3 right-3 w-6 h-6 bg-[var(--brand-primary)] rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </button>
                        </div>

                        {anonimo ? (
                          <div className="p-5 bg-[var(--warning)]/10 rounded-xl border border-[var(--warning)]/30">
                            <div className="flex items-start gap-3">
                              <Shield className="w-5 h-5 text-[var(--warning)] flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-bold text-[var(--text-primary)] mb-1">Manifestação Anônima</p>
                                <p className="text-sm text-[var(--text-secondary)]">
                                  Conforme Art. 14 da Instrução Normativa CGDF N° 01 de 05/05/2017,
                                  manifestações anônimas não podem ter seu andamento acompanhado pelo manifestante.
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label htmlFor="nome" className="block text-sm font-semibold text-[var(--text-primary)]">
                                  Nome completo <span className="text-[var(--error)]">*</span>
                                </label>
                                <input
                                  type="text"
                                  id="nome"
                                  value={nome}
                                  onChange={(e) => setNome(e.target.value)}
                                  placeholder="Seu nome"
                                  className={`w-full p-4 bg-[var(--bg-secondary)] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] ${errors.nome ? 'border-[var(--error)]' : 'border-[var(--border-primary)]'}`}
                                />
                                {errors.nome && <p className="text-[var(--error)] text-sm">{errors.nome}</p>}
                              </div>

                              <div className="space-y-2">
                                <label htmlFor="cpf" className="block text-sm font-semibold text-[var(--text-primary)]">CPF</label>
                                <input
                                  type="text"
                                  id="cpf"
                                  value={formatCPF(cpf)}
                                  onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))}
                                  placeholder="000.000.000-00"
                                  className={`w-full p-4 bg-[var(--bg-secondary)] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] ${errors.cpf ? 'border-[var(--error)]' : 'border-[var(--border-primary)]'}`}
                                />
                                {errors.cpf && <p className="text-[var(--error)] text-sm">{errors.cpf}</p>}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-semibold text-[var(--text-primary)]">
                                  E-mail <span className="text-[var(--error)]">*</span>
                                </label>
                                <input
                                  type="email"
                                  id="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="seu@email.com"
                                  className={`w-full p-4 bg-[var(--bg-secondary)] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] ${errors.email ? 'border-[var(--error)]' : 'border-[var(--border-primary)]'}`}
                                />
                                {errors.email && <p className="text-[var(--error)] text-sm">{errors.email}</p>}
                              </div>

                              <div className="space-y-2">
                                <label htmlFor="telefone" className="block text-sm font-semibold text-[var(--text-primary)]">Telefone</label>
                                <input
                                  type="tel"
                                  id="telefone"
                                  value={formatTelefone(telefone)}
                                  onChange={(e) => setTelefone(e.target.value.replace(/\D/g, ''))}
                                  placeholder="(61) 99999-9999"
                                  className="w-full p-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
                                />
                              </div>
                            </div>

                            <div className="p-4 bg-[var(--info)]/10 rounded-xl border border-[var(--info)]/30 flex items-start gap-3">
                              <Lock className="w-5 h-5 text-[var(--info)] flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-[var(--text-primary)]">
                                Seus dados são protegidos pela LGPD e serão utilizados apenas para acompanhamento.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ═══ ETAPA 7: ANEXOS ═══ */}
                    {currentStepInfo?.key === 'anexos' && (
                      <div className="space-y-6">
                        <div>
                          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                            Anexar arquivos
                          </h1>
                          <p className="text-[var(--text-secondary)] text-sm">
                            Adicione fotos, documentos ou gravações que comprovem sua manifestação (opcional).
                          </p>
                        </div>

                        <div className="p-4 bg-[var(--warning)]/10 rounded-xl border border-[var(--warning)]/30">
                          <p className="text-sm text-[var(--text-primary)] flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--warning)]" />
                            <span>
                              <strong>Atenção:</strong> A partir desta etapa você não pode mais alterar seu texto.
                              Tamanho máximo: 25 MB. Formatos: pdf, png, jpg, jpeg, xlsx, docx, mp3, mp4.
                            </span>
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <AudioRecorder onSave={addAnexo} />
                          <VideoRecorder onSave={addAnexo} />
                          <FileUpload
                            onFileSelect={addAnexo}
                            acceptedTypes="image/*,.pdf,.doc,.docx,.xlsx,.mp3,.mp4"
                            maxSize={MAX_FILE_SIZE}
                          />
                        </div>

                        {anexos.length > 0 ? (
                          <AnexosList anexos={anexos} onRemove={removeAnexo} />
                        ) : (
                          <div className="p-8 bg-[var(--bg-secondary)] rounded-xl border-2 border-dashed border-[var(--border-primary)] text-center">
                            <Paperclip className="w-10 h-10 text-[var(--text-tertiary)] mx-auto mb-2" />
                            <p className="text-[var(--text-tertiary)] text-sm">Nenhum anexo adicionado</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ═══ ETAPA 8: PROTOCOLO (TERMOS) ═══ */}
                    {currentStepInfo?.key === 'protocolo' && (
                      <div className="space-y-6">
                        <div>
                          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                            Finalizar manifestação
                          </h1>
                          <p className="text-[var(--text-secondary)] text-sm">
                            Aceite os termos para enviar sua manifestação.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)]">
                            <p className="text-xs text-[var(--text-tertiary)] uppercase mb-1">Tipo</p>
                            <p className="font-bold text-[var(--text-primary)]">{TIPOS_INFO[tipo].emoji} {TIPOS_INFO[tipo].titulo}</p>
                          </div>
                          <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)]">
                            <p className="text-xs text-[var(--text-tertiary)] uppercase mb-1">Manifestante</p>
                            <p className="font-bold text-[var(--text-primary)]">{anonimo ? 'Anônimo' : nome}</p>
                          </div>
                        </div>

                        <div className="p-5 bg-[var(--warning)]/10 border border-[var(--warning)]/30 rounded-xl">
                          <label className="flex items-start gap-4 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={aceitaTermos}
                              onChange={(e) => setAceitaTermos(e.target.checked)}
                              className="mt-1 w-5 h-5 rounded border-2 border-[var(--warning)] text-[var(--warning)] focus:ring-[var(--warning)]"
                            />
                            <span className="text-sm text-[var(--text-primary)]">
                              Declaro que as informações prestadas são verdadeiras e assumo inteira responsabilidade
                              pelas mesmas, ciente de que a prestação de informações falsas poderá acarretar
                              penalidades legais conforme Art. 299 do Código Penal.
                            </span>
                          </label>
                          {errors.termos && (
                            <p className="text-[var(--error)] text-sm mt-3 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              {errors.termos}
                            </p>
                          )}
                        </div>

                        <div className="p-4 bg-[var(--info)]/10 rounded-xl border border-[var(--info)]/30">
                          <p className="text-sm text-[var(--text-primary)] flex items-start gap-2">
                            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--info)]" />
                            <span>
                              Após o envio, você receberá um número de protocolo. O prazo de resposta é de
                              até 30 dias úteis conforme Lei 13.460/2017.
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Botões de navegação */}
                <div className="px-6 md:px-8 pb-6 md:pb-8">
                  <div className="flex items-center justify-between pt-6 border-t border-[var(--border-primary)]">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={currentStep === 1}
                      className={`
                        flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                        ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'}
                      `}
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Voltar
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={isSubmitting || isAnalyzing}
                      className="flex items-center gap-2 px-8 py-3 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] disabled:bg-[var(--bg-tertiary)] disabled:text-[var(--text-tertiary)] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      {isSubmitting || isAnalyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {isAnalyzing ? 'Analisando...' : 'Enviando...'}
                        </>
                      ) : currentStepInfo?.key === 'protocolo' ? (
                        <>
                          Finalizar
                          <Send className="w-5 h-5" />
                        </>
                      ) : (
                        <>
                          Avançar
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function NovaManifestacaoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Carregando...</p>
        </div>
      </div>
    }>
      <NovaManifestacaoContent />
    </Suspense>
  );
}
