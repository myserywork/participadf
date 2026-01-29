'use client';

import { useState } from 'react';
import { CheckCircle, Copy, Download, Home, FileText, Share2, ArrowRight } from 'lucide-react';
import { Manifestacao } from '@/lib/types';
import { formatarData } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProtocoloSucessoProps {
  manifestacao: Manifestacao;
}

export default function ProtocoloSucesso({ manifestacao }: ProtocoloSucessoProps) {
  const [copiado, setCopiado] = useState(false);

  const copiarProtocolo = async () => {
    try {
      await navigator.clipboard.writeText(manifestacao.protocolo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = manifestacao.protocolo;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const compartilhar = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Protocolo de Manifestação - Participa DF',
          text: `Meu protocolo de manifestação: ${manifestacao.protocolo}`,
          url: `${window.location.origin}/consulta?protocolo=${manifestacao.protocolo}`
        });
      } catch {
        // Usuário cancelou ou erro
      }
    } else {
      copiarProtocolo();
    }
  };

  const gerarComprovante = () => {
    const conteudo = `
══════════════════════════════════════════════════════
              COMPROVANTE DE MANIFESTAÇÃO
               PARTICIPA DF - OUVIDORIA
══════════════════════════════════════════════════════

PROTOCOLO: ${manifestacao.protocolo}

DADOS DA MANIFESTAÇÃO
─────────────────────────────────────────────────────
Tipo: ${manifestacao.tipo.toUpperCase()}
Órgão: ${manifestacao.orgao}
Data: ${formatarData(manifestacao.createdAt)}
Status: ${manifestacao.status.toUpperCase()}

${manifestacao.anonimo ? 'Manifestação ANÔNIMA' : ''}

IMPORTANTE
─────────────────────────────────────────────────────
• Guarde este protocolo para consultar o andamento
• Prazo de resposta: até 20 dias úteis
• Consulte em: participadf.gov.br/consulta

══════════════════════════════════════════════════════
         Governo do Distrito Federal
           Ouvidoria-Geral do DF
              ouvidoria.df.gov.br
══════════════════════════════════════════════════════
    `.trim();

    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comprovante-${manifestacao.protocolo}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Animação de sucesso */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full mb-6 relative">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500" />
          </motion.div>
          <div className="absolute inset-0 rounded-full border-4 border-green-500/20 animate-ping-slow" />
        </div>
        
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Manifestação Registrada!
        </h1>
        <p className="text-[var(--text-secondary)]">
          Sua manifestação foi registrada com sucesso e será analisada em breve.
        </p>
      </motion.div>

      {/* Card do Protocolo */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 mb-8 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-xl group-hover:bg-white/20 transition-all duration-700" />
        <div className="relative z-10">
            <p className="text-blue-100 text-sm mb-2 font-medium uppercase tracking-wide">Seu número de protocolo</p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <span className="text-3xl md:text-4xl font-mono font-bold tracking-wider text-white drop-shadow-sm select-all">
                {manifestacao.protocolo}
            </span>
            <button
                onClick={copiarProtocolo}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-xl transition-all flex items-center gap-2 backdrop-blur-sm"
            >
                {copiado ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="text-sm font-semibold">{copiado ? 'Copiado!' : 'Copiar'}</span>
            </button>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div>
                <p className="text-blue-200 text-xs uppercase font-bold mb-1">Tipo</p>
                <p className="font-semibold capitalize text-lg leading-tight">{manifestacao.tipo}</p>
            </div>
            <div>
                <p className="text-blue-200 text-xs uppercase font-bold mb-1">Órgão</p>
                <p className="font-semibold text-lg leading-tight">{manifestacao.orgao}</p>
            </div>
            <div>
                <p className="text-blue-200 text-xs uppercase font-bold mb-1">Data</p>
                <p className="font-semibold">{formatarData(manifestacao.createdAt)}</p>
            </div>
            <div>
                <p className="text-blue-200 text-xs uppercase font-bold mb-1">Status</p>
                <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/20 border border-white/30 text-xs font-bold uppercase">
                    {manifestacao.status}
                </div>
            </div>
            </div>
        </div>
      </motion.div>

      {/* Aviso importante */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-5 mb-8"
      >
        <div className="flex gap-3">
            <div className="w-1 h-full bg-amber-400 rounded-full" />
            <div>
                <p className="text-amber-800 dark:text-amber-200 font-bold mb-1">Fique atento aos prazos</p>
                <ul className="text-amber-700 dark:text-amber-300/80 text-sm space-y-1">
                <li>• Guarde o número do protocolo para acompanhar sua manifestação em "Consultar".</li>
                <li>• O prazo de resposta é de até 20 dias úteis (prorrogáveis por mais 10).</li>
                </ul>
            </div>
        </div>
      </motion.div>

      {/* Ações */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
      >
        <button
          onClick={gerarComprovante}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-[var(--bg-elevated)] border border-[var(--border-primary)] hover:border-[var(--brand-primary)] hover:bg-[var(--bg-secondary)] rounded-2xl transition-all shadow-sm group"
        >
          <Download className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--brand-primary)]" />
          <span className="font-bold text-[var(--text-primary)]">Baixar Comprovante</span>
        </button>

        <button
          onClick={compartilhar}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-[var(--bg-elevated)] border border-[var(--border-primary)] hover:border-[var(--brand-primary)] hover:bg-[var(--bg-secondary)] rounded-2xl transition-all shadow-sm group"
        >
          <Share2 className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--brand-primary)]" />
          <span className="font-bold text-[var(--text-primary)]">Compartilhar</span>
        </button>

        <Link
          href={`/consulta?protocolo=${manifestacao.protocolo}`}
          className="col-span-1 sm:col-span-2 flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl transition-all shadow-lg shadow-blue-500/20 group"
        >
          <span className="font-bold text-white">Acompanhar Manifestação</span>
          <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
        </Link>
        
        <Link
          href="/"
          className="col-span-1 sm:col-span-2 flex items-center justify-center gap-2 py-2 text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors text-sm font-medium"
        >
          <Home className="w-4 h-4" />
          Voltar ao Início
        </Link>
      </motion.div>
    </div>
  );
}