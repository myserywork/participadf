'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2, CheckCircle2, HelpCircle, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { TipoManifestacao, OrgaoGDF } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface ClassificacaoIA {
  tipoSugerido: TipoManifestacao;
  orgaoSugerido: OrgaoGDF;
  confianca: number;
  justificativa: string;
  palavrasChave: string[];
}

interface IzaAssistenteProps {
  onClassificacao?: (classificacao: ClassificacaoIA) => void;
  onRelatoChange?: (texto: string) => void;
  conteudo?: string;
  className?: string;
  modo?: 'completo' | 'compacto';
}

// Mapeamento de tipos para exibição
const TIPO_LABEL: Record<TipoManifestacao, { nome: string; emoji: string; cor: string }> = {
  reclamacao: { nome: 'Reclamação', emoji: '😤', cor: 'from-amber-500 to-orange-500' },
  sugestao: { nome: 'Sugestão', emoji: '💡', cor: 'from-purple-500 to-violet-500' },
  elogio: { nome: 'Elogio', emoji: '⭐', cor: 'from-green-500 to-emerald-500' },
  denuncia: { nome: 'Denúncia', emoji: '⚠️', cor: 'from-red-500 to-rose-500' },
  solicitacao: { nome: 'Solicitação', emoji: '📋', cor: 'from-blue-500 to-cyan-500' }
};

// Simulação da IA IZA para classificação automática
function classificarComIZA(texto: string): ClassificacaoIA {
  const textoLower = texto.toLowerCase();

  // Palavras-chave por tipo de manifestação
  const keywords: Record<TipoManifestacao, string[]> = {
    reclamacao: ['ruim', 'péssimo', 'insatisfeito', 'demora', 'falta', 'não funciona', 'problema', 'falha', 'pior', 'descaso', 'absurdo', 'buraco', 'esgoto', 'lixo', 'abandonado', 'quebrado', 'estragado', 'não atende', 'demorado', 'atrasado'],
    sugestao: ['sugiro', 'poderia', 'melhorar', 'ideia', 'proposta', 'seria bom', 'gostaria que', 'recomendo', 'propor', 'implementar', 'criar', 'desenvolver'],
    elogio: ['parabéns', 'excelente', 'ótimo', 'bom trabalho', 'agradeço', 'satisfeito', 'eficiente', 'atencioso', 'maravilhoso', 'obrigado', 'prestativo', 'rápido', 'competente'],
    denuncia: ['irregularidade', 'corrupção', 'desvio', 'fraude', 'ilegal', 'crime', 'abuso', 'assédio', 'tráfico', 'violação', 'ilícito', 'propina', 'suborno'],
    solicitacao: ['solicito', 'preciso', 'necessito', 'requeiro', 'peço', 'gostaria de', 'quero', 'desejo', 'informação', 'documento', 'atendimento', 'serviço']
  };

  // Palavras-chave por órgão
  const orgaoKeywords: { [key: string]: string[] } = {
    'SEEDF': ['escola', 'educação', 'professor', 'aluno', 'matrícula', 'ensino', 'aula', 'creche', 'estudante'],
    'SES': ['hospital', 'saúde', 'médico', 'UBS', 'posto de saúde', 'remédio', 'consulta', 'exame', 'dengue', 'vacina', 'enfermeiro', 'clínica'],
    'SSP': ['segurança', 'polícia', 'delegacia', 'crime', 'violência', 'assalto', 'furto', 'roubo', 'bombeiro'],
    'DETRAN': ['carro', 'veículo', 'CNH', 'multa', 'habilitação', 'trânsito', 'licenciamento', 'semáforo', 'placa', 'motorista'],
    'CAESB': ['água', 'esgoto', 'vazamento', 'falta de água', 'conta de água', 'saneamento', 'hidrômetro'],
    'CEB': ['luz', 'energia', 'falta de luz', 'conta de luz', 'poste', 'iluminação', 'elétrica', 'apagão'],
    'NOVACAP': ['buraco', 'asfalto', 'obra', 'calçada', 'praça', 'parque', 'árvore', 'poda', 'infraestrutura'],
    'SLU': ['lixo', 'coleta', 'reciclagem', 'limpeza urbana', 'entulho', 'container', 'gari'],
    'SEAGRI': ['agricultura', 'rural', 'fazenda', 'produtor', 'agrícola'],
    'SEMOB': ['ônibus', 'transporte público', 'tarifa', 'linha', 'horário', 'metrô', 'terminal', 'passe livre', 'BRT'],
    'Outro': []
  };

  // Calcular tipo
  let tipoDetectado: TipoManifestacao = 'solicitacao';
  let maxScore = 0;

  for (const [tipo, palavras] of Object.entries(keywords)) {
    const score = palavras.filter(p => textoLower.includes(p)).length;
    if (score > maxScore) {
      maxScore = score;
      tipoDetectado = tipo as TipoManifestacao;
    }
  }

  // Calcular órgão
  let orgaoDetectado: OrgaoGDF = 'Outro';
  let maxOrgaoScore = 0;

  for (const [orgao, palavras] of Object.entries(orgaoKeywords)) {
    const score = palavras.filter((p: string) => textoLower.includes(p)).length;
    if (score > maxOrgaoScore) {
      maxOrgaoScore = score;
      orgaoDetectado = orgao as OrgaoGDF;
    }
  }

  // Extrair palavras-chave encontradas
  const palavrasEncontradas = Object.values(keywords)
    .flat()
    .filter(p => textoLower.includes(p));

  // Calcular confiança baseada na quantidade de matches
  const confianca = Math.min(0.95, 0.5 + (maxScore * 0.1) + (maxOrgaoScore * 0.1));

  return {
    tipoSugerido: tipoDetectado,
    orgaoSugerido: orgaoDetectado,
    confianca,
    justificativa: `Identifiquei características de ${TIPO_LABEL[tipoDetectado].nome.toLowerCase()} relacionada ao órgão ${orgaoDetectado}.`,
    palavrasChave: palavrasEncontradas.slice(0, 5)
  };
}

export default function IzaAssistente({
  onClassificacao,
  onRelatoChange,
  conteudo = '',
  className,
  modo = 'completo'
}: IzaAssistenteProps) {
  const [relato, setRelato] = useState(conteudo);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [classificacao, setClassificacao] = useState<ClassificacaoIA | null>(null);
  const [showOrientacoes, setShowOrientacoes] = useState(false);
  const [etapa, setEtapa] = useState<'relato' | 'resultado'>('relato');

  const MIN_CHARS = 20;
  const MAX_CHARS = 13000;

  useEffect(() => {
    if (conteudo) {
      setRelato(conteudo);
    }
  }, [conteudo]);

  const handleRelatoChange = (texto: string) => {
    if (texto.length <= MAX_CHARS) {
      setRelato(texto);
      onRelatoChange?.(texto);
    }
  };

  const analisarRelato = async () => {
    if (relato.length < MIN_CHARS) return;

    setIsAnalyzing(true);

    // Simula delay de processamento da IA
    await new Promise(resolve => setTimeout(resolve, 1800));

    const resultado = classificarComIZA(relato);
    setClassificacao(resultado);
    setEtapa('resultado');
    setIsAnalyzing(false);

    if (onClassificacao) {
      onClassificacao(resultado);
    }
  };

  const resetar = () => {
    setClassificacao(null);
    setEtapa('relato');
  };

  const podeAnalisar = relato.length >= MIN_CHARS && !isAnalyzing;
  const progresso = Math.min(100, (relato.length / MIN_CHARS) * 100);

  if (modo === 'compacto') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border border-[var(--border-primary)] bg-gradient-to-br from-blue-50 to-indigo-50 p-4 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center shadow-lg">
            <span className="text-2xl" role="img" aria-label="IZA">🤖</span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-[var(--text-primary)]">IZA - Assistente Virtual</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Posso ajudar a classificar sua manifestação automaticamente
            </p>
          </div>
          <Sparkles className="w-5 h-5 text-yellow-500" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`overflow-hidden rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-elevated)] shadow-xl ${className}`}
    >
      {/* Header com avatar da IZA */}
      <div className="bg-gradient-to-r from-[var(--brand-primary-dark)] to-[var(--brand-primary)] text-white p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/10">
            <span className="text-4xl" role="img" aria-label="IZA">🤖</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-xl">IZA</h3>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">IA</span>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              Olá! Sou a <strong>IZA</strong>, a inteligência artificial da Ouvidoria do GDF.
              Vou te ajudar a registrar sua manifestação de forma rápida e eficiente.
            </p>
          </div>
          <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse flex-shrink-0" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {etapa === 'relato' ? (
          <motion.div
            key="relato"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-6 space-y-4"
          >
            {/* Orientações colapsáveis */}
            <button
              onClick={() => setShowOrientacoes(!showOrientacoes)}
              className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Orientações para o seu registro</span>
              </div>
              {showOrientacoes ? (
                <ChevronUp className="w-5 h-5 text-blue-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-600" />
              )}
            </button>

            <AnimatePresence>
              {showOrientacoes && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-blue-50 rounded-xl text-sm text-blue-800 space-y-2">
                    <p><strong>Dicas para um bom relato:</strong></p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Descreva o fato de forma clara e objetiva</li>
                      <li>Informe quando e onde ocorreu</li>
                      <li>Mencione as pessoas ou setores envolvidos</li>
                      <li>Evite informações pessoais sensíveis no texto</li>
                      <li>Quanto mais detalhes, melhor a análise</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Área de texto */}
            <div className="relative">
              <label htmlFor="iza-relato" className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Descreva sua manifestação
              </label>
              <textarea
                id="iza-relato"
                value={relato}
                onChange={(e) => handleRelatoChange(e.target.value)}
                placeholder="Escreva aqui o que você deseja relatar. Seja o mais detalhado possível para que eu possa identificar corretamente o tipo de manifestação e o órgão responsável..."
                className="w-full min-h-[200px] p-4 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] text-[var(--text-primary)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all placeholder:text-[var(--text-tertiary)] resize-none"
                disabled={isAnalyzing}
              />

              {/* Contador e barra de progresso */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  {relato.length < MIN_CHARS && (
                    <span className="text-xs text-amber-600">
                      Mínimo de {MIN_CHARS} caracteres
                    </span>
                  )}
                  {relato.length >= MIN_CHARS && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Pronto para análise
                    </span>
                  )}
                </div>
                <span className={`text-xs ${relato.length > MAX_CHARS * 0.9 ? 'text-amber-600' : 'text-[var(--text-tertiary)]'}`}>
                  {relato.length.toLocaleString()}/{MAX_CHARS.toLocaleString()}
                </span>
              </div>

              {/* Barra de progresso mínimo */}
              {relato.length < MIN_CHARS && relato.length > 0 && (
                <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progresso}%` }}
                  />
                </div>
              )}
            </div>

            {/* Botão de análise */}
            <motion.button
              onClick={analisarRelato}
              disabled={!podeAnalisar}
              className={`
                w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-white
                transition-all duration-300 shadow-lg
                ${podeAnalisar
                  ? 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-dark)] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-gray-300 cursor-not-allowed'}
              `}
              whileTap={{ scale: podeAnalisar ? 0.98 : 1 }}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analisando com IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analisar com IZA
                </>
              )}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="resultado"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 space-y-4"
          >
            {/* Resultado da classificação */}
            <div className="text-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center"
              >
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </motion.div>
              <h4 className="font-bold text-lg text-[var(--text-primary)]">Análise concluída!</h4>
              <p className="text-sm text-[var(--text-secondary)]">
                Identifiquei o tipo e órgão sugeridos para sua manifestação
              </p>
            </div>

            {classificacao && (
              <div className="space-y-3">
                {/* Tipo identificado */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`p-4 bg-gradient-to-r ${TIPO_LABEL[classificacao.tipoSugerido].cor} rounded-2xl text-white shadow-lg`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{TIPO_LABEL[classificacao.tipoSugerido].emoji}</span>
                    <div>
                      <p className="text-xs opacity-80 uppercase tracking-wide">Tipo identificado</p>
                      <p className="font-bold text-xl">{TIPO_LABEL[classificacao.tipoSugerido].nome}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-xs opacity-80">Confiança</p>
                      <p className="font-bold">{Math.round(classificacao.confianca * 100)}%</p>
                    </div>
                  </div>
                </motion.div>

                {/* Órgão sugerido */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <span className="text-xl">🏛️</span>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">Órgão responsável</p>
                      <p className="font-bold text-[var(--text-primary)]">{classificacao.orgaoSugerido}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Palavras-chave */}
                {classificacao.palavrasChave.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)]"
                  >
                    <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-2">Palavras-chave identificadas</p>
                    <div className="flex flex-wrap gap-2">
                      {classificacao.palavrasChave.map((palavra, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {palavra}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Info */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center text-sm text-[var(--text-secondary)] bg-green-50 p-3 rounded-xl"
                >
                  ✅ As sugestões foram aplicadas automaticamente ao formulário
                </motion.p>

                {/* Botão para editar */}
                <button
                  onClick={resetar}
                  className="w-full py-3 text-[var(--brand-primary)] hover:bg-blue-50 rounded-xl transition-colors font-medium"
                >
                  Editar relato
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
