'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header, Footer } from '@/components';
import { 
  Search, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  Loader2,
  Calendar,
  Building2,
  User,
  MessageSquare,
  ArrowRight,
  Ticket,
  Copy,
  CheckCheck,
  Info
} from 'lucide-react';
import { useManifestacaoStore } from '@/lib/store';
import { formatarData } from '@/lib/utils';
import { Manifestacao, StatusManifestacao } from '@/lib/types';

const STATUS_CONFIG: Record<StatusManifestacao, { label: string; cor: string; bg: string; icon: typeof CheckCircle2 }> = {
  'registrada': { 
    label: 'Registrada', 
    cor: 'text-blue-600', 
    bg: 'bg-blue-100',
    icon: FileText 
  },
  'em-analise': { 
    label: 'Em Análise', 
    cor: 'text-amber-600', 
    bg: 'bg-amber-100',
    icon: Clock 
  },
  'encaminhada': { 
    label: 'Encaminhada', 
    cor: 'text-purple-600', 
    bg: 'bg-purple-100',
    icon: ArrowRight 
  },
  'respondida': { 
    label: 'Respondida', 
    cor: 'text-green-600', 
    bg: 'bg-green-100',
    icon: CheckCircle2 
  },
  'arquivada': { 
    label: 'Arquivada', 
    cor: 'text-gray-600', 
    bg: 'bg-gray-100',
    icon: XCircle 
  }
};

function ConsultaContent() {
  const searchParams = useSearchParams();
  const { buscarPorProtocolo } = useManifestacaoStore();
  
  const [protocolo, setProtocolo] = useState(searchParams.get('protocolo') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState<Manifestacao | null | 'not-found'>(null);
  const [erro, setErro] = useState('');
  const [copied, setCopied] = useState(false);

  const handleBuscar = async () => {
    if (!protocolo.trim()) {
      setErro('Digite o número do protocolo');
      return;
    }

    setErro('');
    setIsLoading(true);
    
    // Simula delay de busca
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const manifestacao = buscarPorProtocolo(protocolo.trim().toUpperCase());
    
    if (manifestacao) {
      setResultado(manifestacao);
    } else {
      setResultado('not-found');
    }
    
    setIsLoading(false);
  };

  const handleCopyProtocolo = async () => {
    if (resultado && resultado !== 'not-found') {
      await navigator.clipboard.writeText(resultado.protocolo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <div className="animated-bg" aria-hidden="true" />
      <Header />
      
      <main id="main-content" className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] mb-6 shadow-lg">
              <Search className="w-10 h-10 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">
              Consultar Manifestação
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
              Digite o número do protocolo para acompanhar o andamento da sua manifestação
            </p>
          </motion.div>

          {/* Search Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="form-card mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" aria-hidden="true" />
                <input
                  type="text"
                  value={protocolo}
                  onChange={(e) => {
                    setProtocolo(e.target.value.toUpperCase());
                    setErro('');
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="PARTICIPADF-XXXXXX-XXXXXXXX"
                  className="input-field pl-12 text-center sm:text-left font-mono tracking-wider"
                  aria-label="Número do protocolo"
                  aria-describedby={erro ? 'protocolo-error' : undefined}
                />
              </div>
              <button
                onClick={handleBuscar}
                disabled={isLoading}
                className="btn-primary min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" aria-hidden="true" />
                    Consultar
                  </>
                )}
              </button>
            </div>
            
            {erro && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                id="protocolo-error"
                className="text-[var(--error)] text-sm mt-3 flex items-center gap-2"
                role="alert"
              >
                <AlertCircle className="w-4 h-4" />
                {erro}
              </motion.p>
            )}
          </motion.div>

          {/* Resultado */}
          {resultado && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {resultado === 'not-found' ? (
                <div className="form-card text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
                    <Search className="w-10 h-10 text-[var(--text-tertiary)]" />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                    Manifestação não encontrada
                  </h2>
                  <p className="text-[var(--text-secondary)] mb-6">
                    Verifique se o número do protocolo foi digitado corretamente
                  </p>
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-xl inline-block">
                    <p className="text-sm text-[var(--text-tertiary)]">Protocolo buscado:</p>
                    <p className="font-mono font-bold text-[var(--text-primary)]">{protocolo}</p>
                  </div>
                </div>
              ) : (
                <div className="form-card space-y-6">
                  {/* Header do resultado */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-primary)]">
                    <div>
                      <p className="text-sm text-[var(--text-tertiary)] mb-1">Protocolo</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-mono font-bold text-[var(--text-primary)]">
                          {resultado.protocolo}
                        </p>
                        <button
                          onClick={handleCopyProtocolo}
                          className="btn-icon w-8 h-8 border-0"
                          aria-label={copied ? 'Copiado!' : 'Copiar protocolo'}
                        >
                          {copied ? (
                            <CheckCheck className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className={`
                      inline-flex items-center gap-2 px-4 py-2 rounded-full
                      ${STATUS_CONFIG[resultado.status].bg} ${STATUS_CONFIG[resultado.status].cor}
                    `}>
                      {(() => {
                        const StatusIcon = STATUS_CONFIG[resultado.status].icon;
                        return <StatusIcon className="w-5 h-5" aria-hidden="true" />;
                      })()}
                      <span className="font-semibold">
                        {STATUS_CONFIG[resultado.status].label}
                      </span>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-[var(--bg-secondary)] rounded-xl">
                      <FileText className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">Tipo</p>
                        <p className="font-semibold text-[var(--text-primary)] capitalize">
                          {resultado.tipo}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-[var(--bg-secondary)] rounded-xl">
                      <Building2 className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">Órgão</p>
                        <p className="font-semibold text-[var(--text-primary)]">
                          {resultado.orgao}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-[var(--bg-secondary)] rounded-xl">
                      <Calendar className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">Data de registro</p>
                        <p className="font-semibold text-[var(--text-primary)]">
                          {formatarData(resultado.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-[var(--bg-secondary)] rounded-xl">
                      <User className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">Manifestante</p>
                        <p className="font-semibold text-[var(--text-primary)]">
                          {resultado.anonimo ? 'Anônimo' : resultado.dadosManifestante?.nome || 'Não informado'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Assunto e descrição */}
                  <div className="pt-6 border-t border-[var(--border-primary)]">
                    <h3 className="font-bold text-lg text-[var(--text-primary)] mb-2">
                      {resultado.assunto}
                    </h3>
                    <p className="text-[var(--text-secondary)] whitespace-pre-wrap">
                      {resultado.descricao}
                    </p>
                  </div>

                  {/* Anexos */}
                  {resultado.anexos.length > 0 && (
                    <div className="pt-6 border-t border-[var(--border-primary)]">
                      <h4 className="font-semibold text-[var(--text-primary)] mb-3">
                        Anexos ({resultado.anexos.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {resultado.anexos.map((anexo) => (
                          <span 
                            key={anexo.id}
                            className="badge badge-info"
                          >
                            <FileText className="w-3 h-3" />
                            {anexo.nome}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resposta (se houver) */}
                  {resultado.resposta && (
                    <div className="pt-6 border-t border-[var(--border-primary)]">
                      <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="w-5 h-5 text-green-600" aria-hidden="true" />
                        <h4 className="font-semibold text-[var(--text-primary)]">Resposta</h4>
                      </div>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                        <p className="text-green-800">{resultado.resposta}</p>
                        {resultado.dataResposta && (
                          <p className="text-sm text-green-600 mt-3">
                            Respondido em {formatarData(resultado.dataResposta)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Timeline simplificada */}
                  <div className="pt-6 border-t border-[var(--border-primary)]">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-4">Histórico</h4>
                    <div className="relative pl-8">
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-[var(--border-primary)]" />
                      
                      <div className="relative mb-4">
                        <div className="absolute -left-5 w-4 h-4 rounded-full bg-green-500 border-4 border-[var(--bg-primary)]" />
                        <p className="font-medium text-[var(--text-primary)]">Manifestação registrada</p>
                        <p className="text-sm text-[var(--text-secondary)]">{formatarData(resultado.createdAt)}</p>
                      </div>
                      
                      {resultado.status !== 'registrada' && (
                        <div className="relative">
                          <div className={`absolute -left-5 w-4 h-4 rounded-full border-4 border-[var(--bg-primary)] ${
                            resultado.status === 'respondida' || resultado.status === 'arquivada'
                              ? 'bg-green-500'
                              : 'bg-[var(--brand-primary)]'
                          }`} />
                          <p className="font-medium text-[var(--text-primary)]">
                            {STATUS_CONFIG[resultado.status].label}
                          </p>
                          <p className="text-sm text-[var(--text-secondary)]">
                            {formatarData(resultado.updatedAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Info box */}
          {!resultado && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)]"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text-primary)] mb-2">
                    Como encontrar o protocolo?
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    O número do protocolo foi informado ao final do registro da sua manifestação. 
                    Ele também foi enviado para o seu e-mail, caso tenha se identificado.
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Formato: PARTICIPADF-AAAAMM-XXXXXXXX (ex: PARTICIPADF-202601-AB12CD34)
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function ConsultaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="w-12 h-12 border-4 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ConsultaContent />
    </Suspense>
  );
}