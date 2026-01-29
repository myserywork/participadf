'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, X } from 'lucide-react';
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
  conteudo?: string;
  className?: string;
}

// Simulação da IA IZA para classificação automática
function classificarComIZA(texto: string): ClassificacaoIA {
  const textoLower = texto.toLowerCase();
  
  // Palavras-chave por tipo de manifestação
  const keywords: Record<TipoManifestacao, string[]> = {
    reclamacao: ['ruim', 'péssimo', 'insatisfeito', 'demora', 'falta', 'não funciona', 'problema', 'falha', 'pior', 'descaso', 'absurdo', 'buraco', 'esgoto', 'lixo'],
    sugestao: ['sugiro', 'poderia', 'melhorar', 'ideia', 'proposta', 'seria bom', 'gostaria que', 'recomendo'],
    elogio: ['parabéns', 'excelente', 'ótimo', 'bom trabalho', 'agradeço', 'satisfeito', 'eficiente', 'atencioso', 'maravilhoso'],
    denuncia: ['irregularidade', 'corrupção', 'desvio', 'fraude', 'ilegal', 'crime', 'abuso', 'assédio', 'tráfico'],
    solicitacao: ['solicito', 'preciso', 'necessito', 'requeiro', 'peço', 'gostaria de', 'quero', 'desejo']
  };

  // Palavras-chave por órgão
  const orgaoKeywords: { [key: string]: string[] } = {
    'SEEDF': ['escola', 'educação', 'professor', 'aluno', 'matrícula', 'ensino', 'aula'],
    'SES': ['hospital', 'saúde', 'médico', 'UBS', 'posto de saúde', 'remédio', 'consulta', 'exame', 'dengue', 'vacina'],
    'SSP': ['segurança', 'polícia', 'delegacia', 'crime', 'violência', 'assalto', 'furto', 'roubo'],
    'DETRAN': ['carro', 'veículo', 'CNH', 'multa', 'habilitação', 'trânsito', 'licenciamento', 'semáforo'],
    'CAESB': ['água', 'esgoto', 'vazamento', 'falta de água', 'conta de água'],
    'CEB': ['luz', 'energia', 'falta de luz', 'conta de luz', 'poste', 'iluminação'],
    'NOVACAP': ['buraco', 'asfalto', 'obra', 'calçada', 'praça', 'parque', 'árvore'],
    'SLU': ['lixo', 'coleta', 'reciclagem', 'limpeza urbana', 'entulho'],
    'SEAGRI': ['agricultura', 'rural', 'fazenda', 'produtor'],
    'SEMOB': ['ônibus', 'transporte público', 'tarifa', 'linha', 'horário', 'metrô', 'terminal'],
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
    justificativa: `Identifiquei características de uma **${tipoDetectado.toUpperCase()}** relacionada ao órgão **${orgaoDetectado}**.`,
    palavrasChave: palavrasEncontradas.slice(0, 5)
  };
}

export default function IzaAssistente({ onClassificacao, conteudo, className }: IzaAssistenteProps) {
  const [mensagens, setMensagens] = useState<Array<{ tipo: 'user' | 'iza'; texto: string }>>([
    { 
      tipo: 'iza', 
      texto: 'Olá! Sou a IZA. Posso ajudar a classificar sua manifestação automaticamente ou tirar dúvidas.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [classificacao, setClassificacao] = useState<ClassificacaoIA | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const handleEnviar = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMensagens(prev => [...prev, { tipo: 'user', texto: userMessage }]);
    setInput('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const resultado = classificarComIZA(userMessage);
    setClassificacao(resultado);

    const resposta = `Com base no que você escreveu:\n\n` +
      `📌 Tipo: **${resultado.tipoSugerido.toUpperCase()}**\n` +
      `🏢 Órgão: **${resultado.orgaoSugerido}**\n\n` +
      `${resultado.justificativa}`;

    setMensagens(prev => [...prev, { tipo: 'iza', texto: resposta }]);
    setIsLoading(false);

    if (onClassificacao) {
      onClassificacao(resultado);
    }
  };

  const analisarConteudo = async () => {
    if (!conteudo?.trim()) return;

    setIsLoading(true);
    setMensagens(prev => [...prev, { 
      tipo: 'iza', 
      texto: 'Analisando o texto da sua manifestação...' 
    }]);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const resultado = classificarComIZA(conteudo);
    setClassificacao(resultado);

    const resposta = `Prontinho! Analisei seu texto:\n\n` +
      `📌 Sugiro registrar como **${resultado.tipoSugerido.toUpperCase()}**\n` +
      `🏢 Para o órgão **${resultado.orgaoSugerido}**\n\n` +
      `Já apliquei essas sugestões no formulário para você.`;

    setMensagens(prev => [...prev, { tipo: 'iza', texto: resposta }]);
    setIsLoading(false);

    if (onClassificacao) {
      onClassificacao(resultado);
    }
  };

  return (
    <div className={`overflow-hidden rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-elevated)] shadow-lg ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--brand-primary-dark)] to-[var(--brand-primary)] text-white px-6 py-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner">
          <Bot className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg leading-tight">IZA</h3>
          <p className="text-xs text-blue-100 font-medium opacity-90">Inteligência Artificial do GDF</p>
        </div>
        <Sparkles className="w-6 h-6 ml-auto text-yellow-300 animate-pulse" />
      </div>

      {/* Mensagens */}
      <div className="h-80 overflow-y-auto p-6 space-y-6 bg-[var(--bg-secondary)]/50">
        <AnimatePresence>
            {mensagens.map((msg, index) => (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                key={index}
                className={`flex gap-4 ${msg.tipo === 'user' ? 'justify-end' : 'justify-start'}`}
            >
                {msg.tipo === 'iza' && (
                <div className="w-8 h-8 bg-[var(--brand-primary)] rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                    <Bot className="w-5 h-5 text-white" />
                </div>
                )}
                
                <div
                className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed ${
                    msg.tipo === 'user' 
                    ? 'bg-[var(--brand-primary)] text-white rounded-br-sm' 
                    : 'bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded-bl-sm border border-[var(--border-primary)]'
                }`}
                >
                <div className="whitespace-pre-wrap markdown-content">
                    {msg.texto.split('\n').map((line, i) => (
                        <p key={i} className={i > 0 ? "mt-2" : ""}>
                            {line.split('**').map((part, j) => 
                                j % 2 === 1 ? <strong key={j} className="font-bold">{part}</strong> : part
                            )}
                        </p>
                    ))}
                </div>
                </div>
                
                {msg.tipo === 'user' && (
                <div className="w-8 h-8 bg-[var(--text-secondary)] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-5 h-5 text-white" />
                </div>
                )}
            </motion.div>
            ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 justify-start">
            <div className="w-8 h-8 bg-[var(--brand-primary)] rounded-full flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-[var(--bg-elevated)] rounded-2xl rounded-bl-sm px-5 py-3 shadow-sm border border-[var(--border-primary)] flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[var(--brand-primary)]" />
              <span className="text-xs text-[var(--text-secondary)] font-medium">Digitando...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Botão de análise automática */}
      {conteudo && !classificacao && (
        <div className="px-6 py-2 bg-[var(--bg-secondary)]/50">
          <button
            onClick={analisarConteudo}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.98] text-white rounded-xl transition-all shadow-md shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
          >
            <Sparkles className="w-4 h-4" />
            Analisar manifestação automaticamente
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-[var(--bg-elevated)] border-t border-[var(--border-primary)]">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleEnviar()}
            placeholder="Converse com a Iza..."
            className="flex-1 pl-5 pr-12 py-3 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] text-[var(--text-primary)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all placeholder:text-[var(--text-tertiary)]"
            disabled={isLoading}
          />
          <button
            onClick={handleEnviar}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1.5 p-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:scale-105 active:scale-95"
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4 translate-x-px translate-y-px" />
          </button>
        </div>
      </div>
    </div>
  );
}