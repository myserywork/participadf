/**
 * @fileoverview Stores Zustand para gerenciamento de estado global
 *
 * Este módulo contém todas as stores do aplicativo:
 * - AcessibilidadeStore: Configurações de acessibilidade (WCAG 2.1)
 * - ManifestacaoFormStore: Estado do formulário de manifestação
 * - ManifestacaoStore: Lista de manifestações persistidas
 * - ToastStore: Sistema de notificações
 * - UIStore: Estado da interface
 *
 * @author Equipe Participa DF
 * @version 1.0.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConfiguracoesAcessibilidade, Manifestacao, NovaManifestacaoForm, TipoManifestacao, Anexo } from './types';
import { gerarId } from './utils';

// ============================================
// Store de Acessibilidade (WCAG 2.1 AA)
// ============================================
/**
 * Interface do estado de acessibilidade
 * Gerencia todas as preferências de acessibilidade do usuário
 * conforme diretrizes WCAG 2.1 nível AA
 */
interface AcessibilidadeState {
  /** Configurações atuais de acessibilidade */
  config: ConfiguracoesAcessibilidade;
  /** Define o tema visual (light, dark, high-contrast) */
  setTema: (tema: ConfiguracoesAcessibilidade['tema']) => void;
  /** Define o tamanho da fonte (small, medium, large, extra-large) */
  setTamanhoFonte: (tamanho: ConfiguracoesAcessibilidade['tamanhoFonte']) => void;
  /** Alterna modo de compatibilidade com leitor de tela */
  toggleLeitorTela: () => void;
  /** Alterna redução de animações (prefers-reduced-motion) */
  toggleReducaoMovimento: () => void;
  /** Alterna modo de alto contraste */
  toggleAltoContraste: () => void;
  /** Restaura configurações padrão */
  resetConfig: () => void;
}

const defaultAcessibilidade: ConfiguracoesAcessibilidade = {
  tema: 'light',
  tamanhoFonte: 'medium',
  leitorTela: false,
  reducaoMovimento: false,
  altoContraste: false,
};

export const useAcessibilidadeStore = create<AcessibilidadeState>()(
  persist(
    (set) => ({
      config: defaultAcessibilidade,
      
      setTema: (tema) => set((state) => ({
        config: { ...state.config, tema }
      })),
      
      setTamanhoFonte: (tamanhoFonte) => set((state) => ({
        config: { ...state.config, tamanhoFonte }
      })),
      
      toggleLeitorTela: () => set((state) => ({
        config: { ...state.config, leitorTela: !state.config.leitorTela }
      })),
      
      toggleReducaoMovimento: () => set((state) => ({
        config: { ...state.config, reducaoMovimento: !state.config.reducaoMovimento }
      })),
      
      toggleAltoContraste: () => set((state) => ({
        config: { 
          ...state.config, 
          altoContraste: !state.config.altoContraste,
          tema: !state.config.altoContraste ? 'high-contrast' : 'light'
        }
      })),
      
      resetConfig: () => set({ config: defaultAcessibilidade }),
    }),
    {
      name: 'participadf-acessibilidade',
    }
  )
);

// ============================================
// Store de Manifestação (formulário wizard)
// ============================================

/**
 * Interface do estado do formulário de manifestação
 * Gerencia o fluxo wizard de 5 etapas para registro de manifestação
 */
interface ManifestacaoFormState {
  /** Dados parciais do formulário */
  form: Partial<NovaManifestacaoForm>;
  /** Lista de anexos (imagem, áudio, vídeo, documento) */
  anexos: Anexo[];
  /** Etapa atual do wizard (1-5) */
  etapaAtual: number;
  /** Indica se está enviando o formulário */
  isSubmitting: boolean;
  /** Mensagem de erro, se houver */
  error: string | null;
  
  // Ações do formulário
  setTipo: (tipo: TipoManifestacao) => void;
  setAssunto: (assunto: string) => void;
  setDescricao: (descricao: string) => void;
  setAnonimo: (anonimo: boolean) => void;
  setDadosManifestante: (dados: { nome?: string; email?: string; telefone?: string }) => void;
  setOrgaoDestino: (orgao: string) => void;
  setPrecisaLibras: (precisa: boolean) => void;
  setPrecisaAudioDescricao: (precisa: boolean) => void;
  
  // Anexos
  addAnexo: (anexo: Anexo) => void;
  removeAnexo: (id: string) => void;
  clearAnexos: () => void;
  
  // Navegação
  proximaEtapa: () => void;
  etapaAnterior: () => void;
  irParaEtapa: (etapa: number) => void;
  
  // Submissão
  setSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string | null) => void;
  resetForm: () => void;
}

const defaultForm: Partial<NovaManifestacaoForm> = {
  anonimo: false,
  precisaLibras: false,
  precisaAudioDescricao: false,
};

export const useManifestacaoFormStore = create<ManifestacaoFormState>()((set) => ({
  form: defaultForm,
  anexos: [],
  etapaAtual: 1,
  isSubmitting: false,
  error: null,
  
  setTipo: (tipo) => set((state) => ({
    form: { ...state.form, tipo }
  })),
  
  setAssunto: (assunto) => set((state) => ({
    form: { ...state.form, assunto }
  })),
  
  setDescricao: (descricao) => set((state) => ({
    form: { ...state.form, descricao }
  })),
  
  setAnonimo: (anonimo) => set((state) => ({
    form: { ...state.form, anonimo }
  })),
  
  setDadosManifestante: (dados) => set((state) => ({
    form: { ...state.form, ...dados }
  })),
  
  setOrgaoDestino: (orgaoDestino) => set((state) => ({
    form: { ...state.form, orgaoDestino }
  })),
  
  setPrecisaLibras: (precisaLibras) => set((state) => ({
    form: { ...state.form, precisaLibras }
  })),
  
  setPrecisaAudioDescricao: (precisaAudioDescricao) => set((state) => ({
    form: { ...state.form, precisaAudioDescricao }
  })),
  
  addAnexo: (anexo) => set((state) => ({
    anexos: [...state.anexos, anexo]
  })),
  
  removeAnexo: (id) => set((state) => ({
    anexos: state.anexos.filter((a) => a.id !== id)
  })),
  
  clearAnexos: () => set({ anexos: [] }),
  
  proximaEtapa: () => set((state) => ({
    etapaAtual: Math.min(state.etapaAtual + 1, 5)
  })),
  
  etapaAnterior: () => set((state) => ({
    etapaAtual: Math.max(state.etapaAtual - 1, 1)
  })),
  
  irParaEtapa: (etapa) => set({
    etapaAtual: Math.max(1, Math.min(etapa, 5))
  }),
  
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  
  setError: (error) => set({ error }),
  
  resetForm: () => set({
    form: defaultForm,
    anexos: [],
    etapaAtual: 1,
    isSubmitting: false,
    error: null,
  }),
}));

// ============================================
// Store de Manifestações (persistência)
// ============================================

/**
 * Interface do estado de manifestações
 * Armazena e gerencia todas as manifestações do usuário
 * Dados persistidos em localStorage para acesso offline
 */
interface ManifestacaoState {
  /** Lista de todas as manifestações registradas */
  manifestacoes: Manifestacao[];
  /** Manifestação atualmente selecionada/visualizada */
  manifestacaoAtual: Manifestacao | null;

  /**
   * Adiciona nova manifestação à lista
   * @param manifestacao - Dados completos da manifestação
   */
  adicionarManifestacao: (manifestacao: Manifestacao) => void;

  /**
   * Busca manifestação pelo número de protocolo
   * @param protocolo - Protocolo no formato PARTICIPADF-AAAAMM-XXXXXXXX
   * @returns Manifestação encontrada ou undefined
   */
  buscarPorProtocolo: (protocolo: string) => Manifestacao | undefined;

  /**
   * Define a manifestação atual para visualização
   * @param manifestacao - Manifestação a ser exibida ou null para limpar
   */
  setManifestacaoAtual: (manifestacao: Manifestacao | null) => void;

  /**
   * Atualiza dados de uma manifestação existente
   * @param id - ID único da manifestação
   * @param data - Dados parciais para atualização
   */
  updateManifestacao: (id: string, data: Partial<Manifestacao>) => void;
}

export const useManifestacaoStore = create<ManifestacaoState>()(
  persist(
    (set, get) => ({
      manifestacoes: [],
      manifestacaoAtual: null,
      
      adicionarManifestacao: (manifestacao) => {
        set((state) => ({
          manifestacoes: [manifestacao, ...state.manifestacoes],
          manifestacaoAtual: manifestacao,
        }));
      },
      
      buscarPorProtocolo: (protocolo) => {
        return get().manifestacoes.find(
          (m) => m.protocolo.toLowerCase() === protocolo.toLowerCase()
        );
      },
      
      setManifestacaoAtual: (manifestacao) => set({ manifestacaoAtual: manifestacao }),
      
      updateManifestacao: (id, data) => set((state) => ({
        manifestacoes: state.manifestacoes.map((m) =>
          m.id === id ? { ...m, ...data, updatedAt: new Date() } : m
        ),
      })),
    }),
    {
      name: 'participadf-manifestacoes',
    }
  )
);

// ============================================
// Store de Notificações/Toast
// ============================================
export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = gerarId();
    const newToast = { ...toast, id };
    
    set((state) => ({
      toasts: [...state.toasts, newToast]
    }));
    
    // Auto remove após duração
    const duration = toast.duration || 5000;
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
    }, duration);
  },
  
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),
  
  clearToasts: () => set({ toasts: [] }),
}));

// ============================================
// Store de UI
// ============================================
interface UIState {
  isSidebarOpen: boolean;
  isAccessibilityPanelOpen: boolean;
  isLoading: boolean;
  
  toggleSidebar: () => void;
  toggleAccessibilityPanel: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isSidebarOpen: false,
  isAccessibilityPanelOpen: false,
  isLoading: false,
  
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleAccessibilityPanel: () => set((state) => ({ isAccessibilityPanelOpen: !state.isAccessibilityPanelOpen })),
  setLoading: (isLoading) => set({ isLoading }),
}));
