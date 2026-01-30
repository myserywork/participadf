/**
 * Base de dados de assuntos/temas para manifestações
 * Baseado no sistema oficial Participa-DF
 */

export interface Assunto {
  id: string;
  nome: string;
  categoria: string;
  orgaoResponsavel: string;
  camposComplementares?: CampoComplementar[];
  requerLocal?: boolean;
}

export interface CampoComplementar {
  id: string;
  label: string;
  tipo: 'texto' | 'numero' | 'data' | 'select' | 'textarea';
  obrigatorio: boolean;
  placeholder?: string;
  opcoes?: string[];
  maxLength?: number;
}

export const CATEGORIAS_ASSUNTOS = [
  'Iluminação Pública',
  'Saúde',
  'Educação',
  'Segurança Pública',
  'Transporte Público',
  'Saneamento e Água',
  'Energia Elétrica',
  'Limpeza Urbana',
  'Infraestrutura e Obras',
  'Trânsito e Veículos',
  'Meio Ambiente',
  'Assistência Social',
  'Serviços Administrativos',
  'Outros'
];

export const ASSUNTOS: Assunto[] = [
  // Iluminação Pública
  {
    id: 'iluminacao-falta',
    nome: 'Falta de Iluminação Pública',
    categoria: 'Iluminação Pública',
    orgaoResponsavel: 'CEB',
    requerLocal: true,
    camposComplementares: [
      {
        id: 'protocolo-ceb',
        label: 'Protocolo de 1ª instância gerado pela CEB (se houver)',
        tipo: 'texto',
        obrigatorio: false,
        placeholder: 'Ex: 2024123456789'
      },
      {
        id: 'quantidade-postes',
        label: 'Quantidade de postes afetados',
        tipo: 'numero',
        obrigatorio: false,
        placeholder: 'Ex: 3'
      }
    ]
  },
  {
    id: 'iluminacao-funcionamento',
    nome: 'Iluminação Pública (Funcionamento)',
    categoria: 'Iluminação Pública',
    orgaoResponsavel: 'CEB',
    requerLocal: true,
    camposComplementares: [
      {
        id: 'problema-tipo',
        label: 'Tipo de problema',
        tipo: 'select',
        obrigatorio: true,
        opcoes: ['Lâmpada queimada', 'Lâmpada piscando', 'Poste danificado', 'Fiação exposta', 'Outro']
      }
    ]
  },
  {
    id: 'iluminacao-instalacao',
    nome: 'Iluminação Pública (Instalação de poste)',
    categoria: 'Iluminação Pública',
    orgaoResponsavel: 'CEB',
    requerLocal: true
  },
  {
    id: 'iluminacao-remanejamento',
    nome: 'Iluminação Pública (Remanejamento de poste)',
    categoria: 'Iluminação Pública',
    orgaoResponsavel: 'CEB',
    requerLocal: true,
    camposComplementares: [
      {
        id: 'motivo-remanejamento',
        label: 'Motivo do remanejamento',
        tipo: 'textarea',
        obrigatorio: true,
        placeholder: 'Descreva o motivo para remanejamento do poste',
        maxLength: 500
      }
    ]
  },

  // Saúde
  {
    id: 'saude-atendimento-ubs',
    nome: 'Atendimento em UBS/Posto de Saúde',
    categoria: 'Saúde',
    orgaoResponsavel: 'SES',
    requerLocal: true,
    camposComplementares: [
      {
        id: 'unidade-saude',
        label: 'Nome da unidade de saúde',
        tipo: 'texto',
        obrigatorio: true,
        placeholder: 'Ex: UBS 1 do Gama'
      },
      {
        id: 'data-atendimento',
        label: 'Data do atendimento',
        tipo: 'data',
        obrigatorio: false
      }
    ]
  },
  {
    id: 'saude-atendimento-hospital',
    nome: 'Atendimento em Hospital',
    categoria: 'Saúde',
    orgaoResponsavel: 'SES',
    requerLocal: true,
    camposComplementares: [
      {
        id: 'hospital-nome',
        label: 'Nome do hospital',
        tipo: 'texto',
        obrigatorio: true,
        placeholder: 'Ex: Hospital de Base do DF'
      },
      {
        id: 'setor-hospital',
        label: 'Setor/Ala',
        tipo: 'texto',
        obrigatorio: false,
        placeholder: 'Ex: Pronto Socorro'
      }
    ]
  },
  {
    id: 'saude-falta-medicamento',
    nome: 'Falta de Medicamento',
    categoria: 'Saúde',
    orgaoResponsavel: 'SES',
    camposComplementares: [
      {
        id: 'medicamento-nome',
        label: 'Nome do medicamento',
        tipo: 'texto',
        obrigatorio: true,
        placeholder: 'Nome comercial ou genérico'
      },
      {
        id: 'local-procurado',
        label: 'Local onde procurou',
        tipo: 'texto',
        obrigatorio: false,
        placeholder: 'Nome da farmácia ou unidade'
      }
    ]
  },
  {
    id: 'saude-agendamento-consulta',
    nome: 'Agendamento de Consulta/Exame',
    categoria: 'Saúde',
    orgaoResponsavel: 'SES',
    camposComplementares: [
      {
        id: 'especialidade',
        label: 'Especialidade médica',
        tipo: 'texto',
        obrigatorio: true,
        placeholder: 'Ex: Cardiologia, Ortopedia'
      },
      {
        id: 'tempo-espera',
        label: 'Tempo de espera informado',
        tipo: 'texto',
        obrigatorio: false,
        placeholder: 'Ex: 6 meses'
      }
    ]
  },
  {
    id: 'saude-dengue',
    nome: 'Dengue/Foco de Mosquito',
    categoria: 'Saúde',
    orgaoResponsavel: 'SES',
    requerLocal: true,
    camposComplementares: [
      {
        id: 'tipo-foco',
        label: 'Tipo de foco',
        tipo: 'select',
        obrigatorio: true,
        opcoes: ['Água parada', 'Terreno baldio', 'Entulho acumulado', 'Piscina abandonada', 'Caixa d\'água destampada', 'Outro']
      }
    ]
  },

  // Educação
  {
    id: 'educacao-matricula',
    nome: 'Matrícula Escolar',
    categoria: 'Educação',
    orgaoResponsavel: 'SEEDF',
    camposComplementares: [
      {
        id: 'serie-ano',
        label: 'Série/Ano desejado',
        tipo: 'texto',
        obrigatorio: true,
        placeholder: 'Ex: 5º ano do Ensino Fundamental'
      },
      {
        id: 'escola-pretendida',
        label: 'Escola pretendida',
        tipo: 'texto',
        obrigatorio: false,
        placeholder: 'Nome da escola'
      }
    ]
  },
  {
    id: 'educacao-infraestrutura',
    nome: 'Infraestrutura Escolar',
    categoria: 'Educação',
    orgaoResponsavel: 'SEEDF',
    requerLocal: true,
    camposComplementares: [
      {
        id: 'escola-nome',
        label: 'Nome da escola',
        tipo: 'texto',
        obrigatorio: true,
        placeholder: 'Nome completo da escola'
      },
      {
        id: 'problema-infra',
        label: 'Tipo de problema',
        tipo: 'select',
        obrigatorio: true,
        opcoes: ['Telhado danificado', 'Banheiro sem condições', 'Falta de água', 'Falta de energia', 'Acessibilidade', 'Quadra/Pátio', 'Outro']
      }
    ]
  },
  {
    id: 'educacao-transporte-escolar',
    nome: 'Transporte Escolar',
    categoria: 'Educação',
    orgaoResponsavel: 'SEEDF',
    camposComplementares: [
      {
        id: 'escola-nome',
        label: 'Nome da escola',
        tipo: 'texto',
        obrigatorio: true,
        placeholder: 'Nome completo da escola'
      },
      {
        id: 'rota-atual',
        label: 'Rota atual ou pretendida',
        tipo: 'texto',
        obrigatorio: false,
        placeholder: 'De onde para onde'
      }
    ]
  },
  {
    id: 'educacao-merenda',
    nome: 'Merenda Escolar',
    categoria: 'Educação',
    orgaoResponsavel: 'SEEDF',
    requerLocal: true,
    camposComplementares: [
      {
        id: 'escola-nome',
        label: 'Nome da escola',
        tipo: 'texto',
        obrigatorio: true,
        placeholder: 'Nome completo da escola'
      }
    ]
  },

  // Transporte Público
  {
    id: 'transporte-onibus-horario',
    nome: 'Ônibus - Horário/Frequência',
    categoria: 'Transporte Público',
    orgaoResponsavel: 'SEMOB',
    camposComplementares: [
      {
        id: 'linha-onibus',
        label: 'Número da linha',
        tipo: 'texto',
        obrigatorio: true,
        placeholder: 'Ex: 0.110'
      },
      {
        id: 'ponto-embarque',
        label: 'Ponto de embarque',
        tipo: 'texto',
        obrigatorio: false,
        placeholder: 'Local do ponto'
      }
    ]
  },
  {
    id: 'transporte-onibus-condicoes',
    nome: 'Ônibus - Condições do Veículo',
    categoria: 'Transporte Público',
    orgaoResponsavel: 'SEMOB',
    camposComplementares: [
      {
        id: 'linha-onibus',
        label: 'Número da linha',
        tipo: 'texto',
        obrigatorio: true,
        placeholder: 'Ex: 0.110'
      },
      {
        id: 'placa-veiculo',
        label: 'Placa do veículo (se souber)',
        tipo: 'texto',
        obrigatorio: false,
        placeholder: 'Ex: ABC1234'
      },
      {
        id: 'problema-veiculo',
        label: 'Tipo de problema',
        tipo: 'select',
        obrigatorio: true,
        opcoes: ['Ar condicionado', 'Bancos danificados', 'Sujeira', 'Acessibilidade', 'Superlotação', 'Outro']
      }
    ]
  },
  {
    id: 'transporte-metro',
    nome: 'Metrô-DF',
    categoria: 'Transporte Público',
    orgaoResponsavel: 'SEMOB',
    camposComplementares: [
      {
        id: 'estacao',
        label: 'Estação',
        tipo: 'texto',
        obrigatorio: true,
        placeholder: 'Nome da estação'
      }
    ]
  },
  {
    id: 'transporte-passe-livre',
    nome: 'Passe Livre Estudantil',
    categoria: 'Transporte Público',
    orgaoResponsavel: 'SEMOB',
    camposComplementares: [
      {
        id: 'situacao',
        label: 'Situação',
        tipo: 'select',
        obrigatorio: true,
        opcoes: ['Cartão não funciona', 'Cadastro negado', 'Renovação', 'Primeira via', 'Outro']
      }
    ]
  },

  // Saneamento e Água
  {
    id: 'agua-falta',
    nome: 'Falta de Água',
    categoria: 'Saneamento e Água',
    orgaoResponsavel: 'CAESB',
    requerLocal: true,
    camposComplementares: [
      {
        id: 'duracao-falta',
        label: 'Há quanto tempo está sem água',
        tipo: 'texto',
        obrigatorio: true,
        placeholder: 'Ex: 3 dias'
      },
      {
        id: 'protocolo-caesb',
        label: 'Protocolo CAESB (se houver)',
        tipo: 'texto',
        obrigatorio: false,
        placeholder: 'Número do protocolo'
      }
    ]
  },
  {
    id: 'agua-vazamento',
    nome: 'Vazamento de Água',
    categoria: 'Saneamento e Água',
    orgaoResponsavel: 'CAESB',
    requerLocal: true,
    camposComplementares: [
      {
        id: 'tipo-vazamento',
        label: 'Tipo de vazamento',
        tipo: 'select',
        obrigatorio: true,
        opcoes: ['Na rua/calçada', 'No hidrômetro', 'Em tubulação aparente', 'Outro']
      }
    ]
  },
  {
    id: 'esgoto-problema',
    nome: 'Problema com Esgoto',
    categoria: 'Saneamento e Água',
    orgaoResponsavel: 'CAESB',
    requerLocal: true,
    camposComplementares: [
      {
        id: 'tipo-problema-esgoto',
        label: 'Tipo de problema',
        tipo: 'select',
        obrigatorio: true,
        opcoes: ['Esgoto a céu aberto', 'Bueiro entupido', 'Mau cheiro', 'Transbordamento', 'Outro']
      }
    ]
  },

  // Limpeza Urbana
  {
    id: 'lixo-coleta',
    nome: 'Coleta de Lixo',
    categoria: 'Limpeza Urbana',
    orgaoResponsavel: 'SLU',
    requerLocal: true,
    camposComplementares: [
      {
        id: 'dias-sem-coleta',
        label: 'Dias sem coleta',
        tipo: 'numero',
        obrigatorio: true,
        placeholder: 'Quantidade de dias'
      }
    ]
  },
  {
    id: 'lixo-entulho',
    nome: 'Descarte Irregular de Entulho',
    categoria: 'Limpeza Urbana',
    orgaoResponsavel: 'SLU',
    requerLocal: true
  },
  {
    id: 'lixo-container',
    nome: 'Container/Lixeira Pública',
    categoria: 'Limpeza Urbana',
    orgaoResponsavel: 'SLU',
    requerLocal: true,
    camposComplementares: [
      {
        id: 'problema-container',
        label: 'Tipo de problema',
        tipo: 'select',
        obrigatorio: true,
        opcoes: ['Falta de container', 'Container quebrado', 'Container cheio', 'Outro']
      }
    ]
  },

  // Infraestrutura e Obras
  {
    id: 'buraco-via',
    nome: 'Buraco na Via/Calçada',
    categoria: 'Infraestrutura e Obras',
    orgaoResponsavel: 'NOVACAP',
    requerLocal: true,
    camposComplementares: [
      {
        id: 'tamanho-buraco',
        label: 'Tamanho aproximado',
        tipo: 'select',
        obrigatorio: true,
        opcoes: ['Pequeno (até 30cm)', 'Médio (30cm a 1m)', 'Grande (mais de 1m)']
      },
      {
        id: 'profundidade',
        label: 'Profundidade aproximada',
        tipo: 'select',
        obrigatorio: false,
        opcoes: ['Raso (até 10cm)', 'Médio (10 a 30cm)', 'Fundo (mais de 30cm)']
      }
    ]
  },
  {
    id: 'calcada-problema',
    nome: 'Problema em Calçada',
    categoria: 'Infraestrutura e Obras',
    orgaoResponsavel: 'NOVACAP',
    requerLocal: true
  },
  {
    id: 'arvore-poda',
    nome: 'Poda de Árvore',
    categoria: 'Infraestrutura e Obras',
    orgaoResponsavel: 'NOVACAP',
    requerLocal: true,
    camposComplementares: [
      {
        id: 'motivo-poda',
        label: 'Motivo da poda',
        tipo: 'select',
        obrigatorio: true,
        opcoes: ['Risco de queda', 'Bloqueando iluminação', 'Bloqueando visão de trânsito', 'Raízes danificando calçada', 'Galhos na fiação', 'Outro']
      }
    ]
  },
  {
    id: 'praca-parque',
    nome: 'Manutenção de Praça/Parque',
    categoria: 'Infraestrutura e Obras',
    orgaoResponsavel: 'NOVACAP',
    requerLocal: true,
    camposComplementares: [
      {
        id: 'problema-praca',
        label: 'Tipo de problema',
        tipo: 'select',
        obrigatorio: true,
        opcoes: ['Mato alto', 'Equipamentos quebrados', 'Falta de iluminação', 'Lixo/Sujeira', 'Bancos danificados', 'Outro']
      }
    ]
  },

  // Trânsito e Veículos
  {
    id: 'semaforo-problema',
    nome: 'Semáforo com Problema',
    categoria: 'Trânsito e Veículos',
    orgaoResponsavel: 'DETRAN',
    requerLocal: true,
    camposComplementares: [
      {
        id: 'problema-semaforo',
        label: 'Tipo de problema',
        tipo: 'select',
        obrigatorio: true,
        opcoes: ['Não funciona', 'Tempo inadequado', 'Lâmpada queimada', 'Sem sincronismo', 'Outro']
      }
    ]
  },
  {
    id: 'sinalizacao-falta',
    nome: 'Falta de Sinalização',
    categoria: 'Trânsito e Veículos',
    orgaoResponsavel: 'DETRAN',
    requerLocal: true,
    camposComplementares: [
      {
        id: 'tipo-sinalizacao',
        label: 'Tipo de sinalização necessária',
        tipo: 'select',
        obrigatorio: true,
        opcoes: ['Placa de pare', 'Faixa de pedestre', 'Lombada', 'Placa de velocidade', 'Outro']
      }
    ]
  },
  {
    id: 'detran-documento',
    nome: 'Documentação de Veículo',
    categoria: 'Trânsito e Veículos',
    orgaoResponsavel: 'DETRAN',
    camposComplementares: [
      {
        id: 'tipo-documento',
        label: 'Tipo de documento',
        tipo: 'select',
        obrigatorio: true,
        opcoes: ['CRLV', 'Transferência', 'Primeiro emplacamento', 'Baixa de veículo', 'Outro']
      }
    ]
  },
  {
    id: 'cnh-habilitacao',
    nome: 'CNH/Habilitação',
    categoria: 'Trânsito e Veículos',
    orgaoResponsavel: 'DETRAN',
    camposComplementares: [
      {
        id: 'tipo-servico-cnh',
        label: 'Tipo de serviço',
        tipo: 'select',
        obrigatorio: true,
        opcoes: ['Primeira habilitação', 'Renovação', 'Segunda via', 'Mudança de categoria', 'Outro']
      }
    ]
  },

  // Segurança Pública
  {
    id: 'policiamento-falta',
    nome: 'Falta de Policiamento',
    categoria: 'Segurança Pública',
    orgaoResponsavel: 'SSP',
    requerLocal: true
  },
  {
    id: 'seguranca-local-risco',
    nome: 'Local de Risco',
    categoria: 'Segurança Pública',
    orgaoResponsavel: 'SSP',
    requerLocal: true,
    camposComplementares: [
      {
        id: 'tipo-risco',
        label: 'Tipo de risco',
        tipo: 'select',
        obrigatorio: true,
        opcoes: ['Assaltos frequentes', 'Tráfico de drogas', 'Ponto de uso de drogas', 'Vandalismo', 'Outro']
      }
    ]
  },

  // Meio Ambiente
  {
    id: 'meio-ambiente-queimada',
    nome: 'Queimada',
    categoria: 'Meio Ambiente',
    orgaoResponsavel: 'SEMA',
    requerLocal: true
  },
  {
    id: 'meio-ambiente-poluicao',
    nome: 'Poluição',
    categoria: 'Meio Ambiente',
    orgaoResponsavel: 'SEMA',
    requerLocal: true,
    camposComplementares: [
      {
        id: 'tipo-poluicao',
        label: 'Tipo de poluição',
        tipo: 'select',
        obrigatorio: true,
        opcoes: ['Sonora', 'Do ar', 'Da água', 'Visual', 'Outro']
      }
    ]
  },

  // Outros
  {
    id: 'outros-geral',
    nome: 'Outro Assunto',
    categoria: 'Outros',
    orgaoResponsavel: 'Outro',
    camposComplementares: [
      {
        id: 'descricao-complementar',
        label: 'Informações complementares',
        tipo: 'textarea',
        obrigatorio: false,
        placeholder: 'Descreva informações adicionais que possam ajudar',
        maxLength: 1000
      }
    ]
  }
];

/**
 * Busca assuntos por termo
 */
export function buscarAssuntos(termo: string): Assunto[] {
  if (termo.length < 3) return [];

  const termoLower = termo.toLowerCase();
  return ASSUNTOS.filter(assunto =>
    assunto.nome.toLowerCase().includes(termoLower) ||
    assunto.categoria.toLowerCase().includes(termoLower)
  );
}

/**
 * Sugere assuntos baseado no texto do relato usando palavras-chave
 */
export function sugerirAssuntosPorRelato(relato: string): Assunto[] {
  if (relato.length < 20) return [];

  const relatoLower = relato.toLowerCase();
  const sugestoes: { assunto: Assunto; score: number }[] = [];

  const palavrasChave: Record<string, string[]> = {
    'iluminacao-falta': ['luz', 'escuro', 'iluminação', 'poste apagado', 'sem luz', 'lâmpada queimada', 'falta de luz', 'poste'],
    'iluminacao-funcionamento': ['poste piscando', 'luz fraca', 'iluminação ruim'],
    'saude-atendimento-ubs': ['ubs', 'posto de saúde', 'atendimento médico', 'consulta', 'médico', 'saúde'],
    'saude-atendimento-hospital': ['hospital', 'emergência', 'pronto socorro', 'internação'],
    'saude-falta-medicamento': ['medicamento', 'remédio', 'falta remédio', 'farmácia'],
    'saude-dengue': ['dengue', 'mosquito', 'aedes', 'foco', 'água parada'],
    'educacao-matricula': ['matrícula', 'escola', 'vaga', 'estudar'],
    'educacao-infraestrutura': ['escola', 'estrutura', 'telhado', 'banheiro escola'],
    'transporte-onibus-horario': ['ônibus', 'horário', 'demora', 'linha', 'transporte'],
    'transporte-onibus-condicoes': ['ônibus sujo', 'ônibus quebrado', 'ar condicionado'],
    'transporte-metro': ['metrô', 'estação', 'metro-df'],
    'agua-falta': ['falta água', 'sem água', 'água', 'caesb', 'torneira seca'],
    'agua-vazamento': ['vazamento', 'água vazando', 'cano estourado'],
    'esgoto-problema': ['esgoto', 'bueiro', 'mau cheiro', 'esgoto aberto'],
    'lixo-coleta': ['lixo', 'coleta', 'lixo acumulado', 'gari'],
    'lixo-entulho': ['entulho', 'descarte irregular', 'lixão'],
    'buraco-via': ['buraco', 'asfalto', 'cratera', 'via danificada'],
    'calcada-problema': ['calçada', 'calçada quebrada', 'piso danificado'],
    'arvore-poda': ['árvore', 'poda', 'galho', 'árvore caindo'],
    'semaforo-problema': ['semáforo', 'sinal', 'farol'],
    'sinalizacao-falta': ['sinalização', 'placa', 'faixa de pedestre'],
    'policiamento-falta': ['polícia', 'policiamento', 'segurança', 'roubo', 'assalto'],
    'meio-ambiente-queimada': ['queimada', 'fogo', 'incêndio', 'fumaça'],
  };

  for (const [assuntoId, palavras] of Object.entries(palavrasChave)) {
    const assunto = ASSUNTOS.find(a => a.id === assuntoId);
    if (!assunto) continue;

    let score = 0;
    for (const palavra of palavras) {
      if (relatoLower.includes(palavra)) {
        score += 1;
      }
    }

    if (score > 0) {
      sugestoes.push({ assunto, score });
    }
  }

  // Ordena por score e retorna os top 5
  return sugestoes
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.assunto);
}

/**
 * Obtém assunto por ID
 */
export function getAssuntoPorId(id: string): Assunto | undefined {
  return ASSUNTOS.find(a => a.id === id);
}
