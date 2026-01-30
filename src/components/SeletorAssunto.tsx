'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  Lightbulb,
  Heart,
  GraduationCap,
  Shield,
  Bus,
  Droplets,
  Zap,
  Trash2,
  Construction,
  Car,
  Trees,
  Users,
  FileText,
  HelpCircle,
  Building2
} from 'lucide-react';
import { Assunto, ASSUNTOS, CATEGORIAS_ASSUNTOS, buscarAssuntos } from '@/lib/assuntos';

// Ícones por categoria
const CATEGORIA_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'Iluminação Pública': Lightbulb,
  'Saúde': Heart,
  'Educação': GraduationCap,
  'Segurança Pública': Shield,
  'Transporte Público': Bus,
  'Saneamento e Água': Droplets,
  'Energia Elétrica': Zap,
  'Limpeza Urbana': Trash2,
  'Infraestrutura e Obras': Construction,
  'Trânsito e Veículos': Car,
  'Meio Ambiente': Trees,
  'Assistência Social': Users,
  'Serviços Administrativos': FileText,
  'Outros': HelpCircle
};

// Cores por categoria
const CATEGORIA_COLORS: Record<string, string> = {
  'Iluminação Pública': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Saúde': 'bg-red-100 text-red-700 border-red-200',
  'Educação': 'bg-purple-100 text-purple-700 border-purple-200',
  'Segurança Pública': 'bg-slate-100 text-slate-700 border-slate-200',
  'Transporte Público': 'bg-blue-100 text-blue-700 border-blue-200',
  'Saneamento e Água': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'Energia Elétrica': 'bg-amber-100 text-amber-700 border-amber-200',
  'Limpeza Urbana': 'bg-green-100 text-green-700 border-green-200',
  'Infraestrutura e Obras': 'bg-orange-100 text-orange-700 border-orange-200',
  'Trânsito e Veículos': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Meio Ambiente': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Assistência Social': 'bg-pink-100 text-pink-700 border-pink-200',
  'Serviços Administrativos': 'bg-gray-100 text-gray-700 border-gray-200',
  'Outros': 'bg-neutral-100 text-neutral-700 border-neutral-200'
};

interface SeletorAssuntoProps {
  value: Assunto | null;
  onChange: (assunto: Assunto | null) => void;
  sugestoes: Assunto[];
  erro?: string;
}

type ViewMode = 'sugestoes' | 'categorias' | 'assuntos' | 'busca';

export default function SeletorAssunto({ value, onChange, sugestoes, erro }: SeletorAssuntoProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(sugestoes.length > 0 ? 'sugestoes' : 'categorias');
  const [categoriaExpandida, setCategoriaExpandida] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState<Assunto[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Agrupa assuntos por categoria
  const assuntosPorCategoria = useMemo(() => {
    const grouped: Record<string, Assunto[]> = {};
    CATEGORIAS_ASSUNTOS.forEach(cat => {
      grouped[cat] = ASSUNTOS.filter(a => a.categoria === cat);
    });
    return grouped;
  }, []);

  // Conta assuntos por categoria
  const contadorPorCategoria = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIAS_ASSUNTOS.forEach(cat => {
      counts[cat] = ASSUNTOS.filter(a => a.categoria === cat).length;
    });
    return counts;
  }, []);

  // Busca assuntos
  useEffect(() => {
    if (busca.length >= 2) {
      const resultados = buscarAssuntos(busca);
      setResultadosBusca(resultados);
      setViewMode('busca');
    } else {
      setResultadosBusca([]);
      if (viewMode === 'busca') {
        setViewMode(sugestoes.length > 0 ? 'sugestoes' : 'categorias');
      }
    }
  }, [busca, sugestoes.length, viewMode]);

  // Seleciona assunto
  const handleSelect = (assunto: Assunto) => {
    onChange(assunto);
    setBusca('');
    setCategoriaExpandida(null);
  };

  // Limpa seleção
  const handleClear = () => {
    onChange(null);
    setBusca('');
    setViewMode(sugestoes.length > 0 ? 'sugestoes' : 'categorias');
  };

  // Expande/colapsa categoria
  const toggleCategoria = (categoria: string) => {
    if (categoriaExpandida === categoria) {
      setCategoriaExpandida(null);
    } else {
      setCategoriaExpandida(categoria);
      setViewMode('assuntos');
    }
  };

  // Se já tem valor selecionado
  if (value) {
    const Icon = CATEGORIA_ICONS[value.categoria] || Building2;
    const colorClass = CATEGORIA_COLORS[value.categoria] || 'bg-gray-100 text-gray-700 border-gray-200';

    return (
      <div className="space-y-4">
        <div className="p-4 bg-green-50 border-2 border-green-300 rounded-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className="font-bold text-green-800">{value.nome}</p>
                </div>
                <p className="text-sm text-green-700">
                  {value.categoria} - Órgão: {value.orgaoResponsavel}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="p-2 hover:bg-green-100 rounded-lg transition-colors"
              aria-label="Alterar assunto"
            >
              <X className="w-5 h-5 text-green-600" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de busca */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Busque por assunto, categoria ou palavra-chave..."
          className={`
            w-full pl-12 pr-10 py-4 bg-white border-2 rounded-xl
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all text-gray-900 placeholder-gray-400
            ${erro ? 'border-red-300' : 'border-gray-200'}
          `}
        />
        {busca && (
          <button
            type="button"
            onClick={() => setBusca('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Navegação de abas */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        {sugestoes.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setViewMode('sugestoes');
              setBusca('');
              setCategoriaExpandida(null);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              viewMode === 'sugestoes'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Sugestões IA
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setViewMode('categorias');
            setBusca('');
            setCategoriaExpandida(null);
          }}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            viewMode === 'categorias' || viewMode === 'assuntos'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Por Categoria
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* Sugestões da IA */}
        {viewMode === 'sugestoes' && sugestoes.length > 0 && (
          <motion.div
            key="sugestoes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Com base no seu relato, identifiquei estes assuntos:
            </p>
            <div className="space-y-2">
              {sugestoes.map((assunto) => {
                const Icon = CATEGORIA_ICONS[assunto.categoria] || Building2;
                const colorClass = CATEGORIA_COLORS[assunto.categoria] || 'bg-gray-100 text-gray-700';

                return (
                  <button
                    key={assunto.id}
                    type="button"
                    onClick={() => handleSelect(assunto)}
                    className="w-full p-4 bg-white border-2 border-blue-200 rounded-xl text-left hover:border-blue-400 hover:bg-blue-50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 group-hover:text-blue-700">
                          {assunto.nome}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {assunto.categoria} - {assunto.orgaoResponsavel}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setViewMode('categorias')}
              className="w-full p-3 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Não encontrou? Ver todas as categorias
            </button>
          </motion.div>
        )}

        {/* Categorias */}
        {(viewMode === 'categorias' || viewMode === 'assuntos') && (
          <motion.div
            key="categorias"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            <p className="text-sm text-gray-600 mb-3">
              Selecione uma categoria para ver os assuntos disponíveis:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CATEGORIAS_ASSUNTOS.map((categoria) => {
                const Icon = CATEGORIA_ICONS[categoria] || Building2;
                const colorClass = CATEGORIA_COLORS[categoria] || 'bg-gray-100 text-gray-700 border-gray-200';
                const isExpanded = categoriaExpandida === categoria;
                const assuntos = assuntosPorCategoria[categoria] || [];

                return (
                  <div key={categoria} className="col-span-1">
                    <button
                      type="button"
                      onClick={() => toggleCategoria(categoria)}
                      className={`
                        w-full p-3 rounded-xl text-left transition-all flex items-center gap-3 border-2
                        ${isExpanded
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm truncate ${isExpanded ? 'text-blue-800' : 'text-gray-900'}`}>
                          {categoria}
                        </p>
                        <p className="text-xs text-gray-500">
                          {contadorPorCategoria[categoria]} assuntos
                        </p>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Lista de assuntos da categoria expandida */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 space-y-1 pl-4 border-l-2 border-blue-200 ml-6">
                            {assuntos.map((assunto) => (
                              <button
                                key={assunto.id}
                                type="button"
                                onClick={() => handleSelect(assunto)}
                                className="w-full p-3 text-left bg-white hover:bg-blue-50 rounded-lg transition-colors border border-gray-100 hover:border-blue-200"
                              >
                                <p className="font-medium text-sm text-gray-900">{assunto.nome}</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  Órgão: {assunto.orgaoResponsavel}
                                </p>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Resultados da busca */}
        {viewMode === 'busca' && (
          <motion.div
            key="busca"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            {resultadosBusca.length > 0 ? (
              <>
                <p className="text-sm text-gray-600 mb-3">
                  {resultadosBusca.length} resultado(s) para &quot;{busca}&quot;:
                </p>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {resultadosBusca.map((assunto) => {
                    const Icon = CATEGORIA_ICONS[assunto.categoria] || Building2;
                    const colorClass = CATEGORIA_COLORS[assunto.categoria] || 'bg-gray-100 text-gray-700';

                    return (
                      <button
                        key={assunto.id}
                        type="button"
                        onClick={() => handleSelect(assunto)}
                        className="w-full p-4 bg-white border border-gray-200 rounded-xl text-left hover:border-blue-300 hover:bg-blue-50 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${colorClass}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 group-hover:text-blue-700">
                              {assunto.nome}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {assunto.categoria} - {assunto.orgaoResponsavel}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Nenhum assunto encontrado para &quot;{busca}&quot;</p>
                <p className="text-sm text-gray-400 mt-1">Tente outras palavras ou navegue por categoria</p>
                <button
                  type="button"
                  onClick={() => {
                    setBusca('');
                    setViewMode('categorias');
                  }}
                  className="mt-4 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Ver todas as categorias
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {erro && (
        <p className="text-red-600 text-sm flex items-center gap-2">
          <X className="w-4 h-4" />
          {erro}
        </p>
      )}
    </div>
  );
}
