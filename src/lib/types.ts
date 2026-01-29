/**
 * @fileoverview Definições de tipos TypeScript para o sistema de Ouvidoria
 *
 * Este módulo contém todas as interfaces e tipos utilizados na aplicação,
 * organizados conforme a Lei 13.460/2017 (Código de Defesa do Usuário de
 * Serviços Públicos).
 *
 * @author Equipe Participa DF
 * @version 1.0.0
 */

/**
 * Tipos de manifestação conforme Lei 13.460/2017
 * Art. 2º - Para os fins desta Lei, considera-se:
 *
 * - reclamacao: Demonstração de insatisfação relativa à prestação de serviço
 * - sugestao: Proposta de melhoria dos serviços públicos
 * - elogio: Demonstração de satisfação sobre serviço público recebido
 * - denuncia: Comunicação de prática de irregularidade ou ato ilícito
 * - solicitacao: Requerimento de adoção de providência
 */
export type TipoManifestacao =
  | 'reclamacao'
  | 'sugestao'
  | 'elogio'
  | 'denuncia'
  | 'solicitacao';

export interface TipoManifestacaoInfo {
  id: TipoManifestacao;
  nome: string;
  descricao: string;
  icone: string;
  cor: string;
}

export const TIPOS_MANIFESTACAO: TipoManifestacaoInfo[] = [
  {
    id: 'reclamacao',
    nome: 'Reclamação',
    descricao: 'Demonstração de insatisfação relativa a serviço público',
    icone: 'alert-circle',
    cor: '#F44336'
  },
  {
    id: 'sugestao',
    nome: 'Sugestão',
    descricao: 'Proposta de melhoria de serviço público',
    icone: 'lightbulb',
    cor: '#FF9800'
  },
  {
    id: 'elogio',
    nome: 'Elogio',
    descricao: 'Demonstração de satisfação sobre serviço público',
    icone: 'thumbs-up',
    cor: '#4CAF50'
  },
  {
    id: 'denuncia',
    nome: 'Denúncia',
    descricao: 'Comunicação de prática de irregularidade ou ilícito',
    icone: 'shield-alert',
    cor: '#9C27B0'
  },
  {
    id: 'solicitacao',
    nome: 'Solicitação',
    descricao: 'Pedido de providência ou atendimento de interesse individual',
    icone: 'file-text',
    cor: '#2196F3'
  }
];

// Status da manifestação
export type StatusManifestacao = 
  | 'registrada'
  | 'em-analise'
  | 'encaminhada'
  | 'respondida'
  | 'arquivada';

export interface StatusInfo {
  id: StatusManifestacao;
  nome: string;
  descricao: string;
  cor: string;
}

export const STATUS_MANIFESTACAO: StatusInfo[] = [
  {
    id: 'registrada',
    nome: 'Registrada',
    descricao: 'Manifestação registrada com sucesso',
    cor: '#2196F3'
  },
  {
    id: 'em-analise',
    nome: 'Em Análise',
    descricao: 'Manifestação sendo analisada pela ouvidoria',
    cor: '#FF9800'
  },
  {
    id: 'encaminhada',
    nome: 'Encaminhada',
    descricao: 'Encaminhada ao órgão responsável',
    cor: '#9C27B0'
  },
  {
    id: 'respondida',
    nome: 'Respondida',
    descricao: 'Resposta disponível para consulta',
    cor: '#4CAF50'
  },
  {
    id: 'arquivada',
    nome: 'Arquivada',
    descricao: 'Manifestação arquivada',
    cor: '#9E9E9E'
  }
];

// Órgãos do GDF - tipo string simples
export type OrgaoGDF = 
  | 'CGDF' 
  | 'SEDUH' 
  | 'SES' 
  | 'SEEDF' 
  | 'SSP' 
  | 'SEMOB' 
  | 'SEMA' 
  | 'SEAGRI' 
  | 'SEDES' 
  | 'SEEC' 
  | 'SECTI' 
  | 'SECEC' 
  | 'DETRAN'
  | 'CAESB'
  | 'CEB'
  | 'NOVACAP'
  | 'SLU'
  | 'Outro';

export const ORGAOS_GDF: OrgaoGDF[] = [
  'CGDF',
  'SEDUH',
  'SES',
  'SEEDF',
  'SSP',
  'SEMOB',
  'SEMA',
  'SEAGRI',
  'SEDES',
  'SEEC',
  'SECTI',
  'SECEC',
  'DETRAN',
  'CAESB',
  'CEB',
  'NOVACAP',
  'SLU',
  'Outro'
];

// Anexo de mídia
export interface Anexo {
  id: string;
  tipo: 'imagem' | 'audio' | 'video' | 'documento';
  nome: string;
  tamanho: number;
  url: string;
  mimetype: string;
  duracao?: number; // Para áudio/vídeo em segundos
  transcricao?: string; // Para áudio/vídeo
  createdAt: Date;
}

/**
 * Manifestação completa
 *
 * Representa uma manifestação registrada no sistema de ouvidoria.
 * Contém todos os dados necessários para o processamento e acompanhamento.
 */
export interface Manifestacao {
  /** Identificador único interno (UUID) */
  id: string;

  /** Número de protocolo para acompanhamento (formato: PARTICIPADF-AAAAMM-XXXXXXXX) */
  protocolo: string;

  /** Tipo de manifestação conforme Lei 13.460/2017 */
  tipo: TipoManifestacao;

  /** Status atual do processamento */
  status: StatusManifestacao;

  /** Órgão do GDF responsável pela resposta */
  orgao: OrgaoGDF;

  // ─── Conteúdo ────────────────────────────────────────────────────
  /** Resumo/título da manifestação */
  assunto: string;

  /** Descrição detalhada da manifestação */
  descricao: string;

  /** Lista de anexos (imagens, áudios, vídeos, documentos) */
  anexos: Anexo[];

  // ─── Identificação ───────────────────────────────────────────────
  /** Indica se a manifestação é anônima */
  anonimo: boolean;

  /** Dados do manifestante (quando não anônimo) */
  dadosManifestante?: {
    nome: string;
    email?: string;
    telefone?: string;
    cpf?: string;
  };

  // ─── Acessibilidade ──────────────────────────────────────────────
  /** Indica necessidade de tradução em Libras */
  precisaLibras?: boolean;

  /** Indica necessidade de audiodescrição */
  precisaAudioDescricao?: boolean;

  // ─── Metadados ───────────────────────────────────────────────────
  /** Data de criação da manifestação */
  createdAt: Date;

  /** Data da última atualização */
  updatedAt: Date;

  // ─── Resposta ────────────────────────────────────────────────────
  /** Texto da resposta do órgão */
  resposta?: string;

  /** Data da resposta */
  dataResposta?: Date;
}

// Formulário de nova manifestação
export interface NovaManifestacaoForm {
  tipo: TipoManifestacao;
  assunto: string;
  descricao: string;
  anonimo: boolean;
  nome?: string;
  email?: string;
  telefone?: string;
  orgaoDestino?: string;
  precisaLibras?: boolean;
  precisaAudioDescricao?: boolean;
}

// Resposta da API de consulta
export interface ConsultaProtocoloResponse {
  encontrado: boolean;
  manifestacao?: Manifestacao;
  mensagem?: string;
}

/**
 * Configurações de acessibilidade do usuário
 *
 * Implementa preferências conforme WCAG 2.1 AA:
 * - Critério 1.4.3: Contraste mínimo
 * - Critério 1.4.4: Redimensionamento de texto
 * - Critério 2.3.3: Animação de interações
 */
export interface ConfiguracoesAcessibilidade {
  /** Tema de cores da interface */
  tema: 'light' | 'dark' | 'high-contrast';

  /** Tamanho base da fonte para toda a aplicação */
  tamanhoFonte: 'small' | 'medium' | 'large' | 'extra-large';

  /** Modo de compatibilidade com leitores de tela */
  leitorTela: boolean;

  /** Redução de animações (prefers-reduced-motion) */
  reducaoMovimento: boolean;

  /** Modo de alto contraste ativo */
  altoContraste: boolean;
}

// Estatísticas para dashboard (uso futuro)
export interface EstatisticasOuvidoria {
  totalManifestacoes: number;
  porTipo: Record<TipoManifestacao, number>;
  porStatus: Record<StatusManifestacao, number>;
  tempoMedioResposta: number; // em dias
  satisfacaoMedia: number; // 0-5
}
