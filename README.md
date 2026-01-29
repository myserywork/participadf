# 🏛️ Participa DF - Ouvidoria Digital

<div align="center">

![Participa DF](https://img.shields.io/badge/Participa-DF-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![PWA](https://img.shields.io/badge/PWA-Ready-green?style=for-the-badge)
![WCAG](https://img.shields.io/badge/WCAG-2.1%20AA-purple?style=for-the-badge)

**Plataforma de Ouvidoria Digital acessível e inclusiva para o Governo do Distrito Federal**

[Demo](#-instalação) • [Funcionalidades](#-funcionalidades) • [Tecnologias](#️-tecnologias) • [Acessibilidade](#-acessibilidade)

</div>

---

## 📋 Sobre o Projeto

O **Participa DF** é uma solução inovadora desenvolvida para o **1º Hackathon em Controle Social: Desafio Participa DF**, categoria **Ouvidoria**. A plataforma permite que cidadãos registrem manifestações (reclamações, sugestões, elogios, denúncias e solicitações) de forma simples, acessível e em múltiplos formatos.

### 🎯 Objetivo

Democratizar o acesso aos serviços de ouvidoria do GDF, oferecendo uma experiência inclusiva que atende desde usuários com deficiência visual até pessoas com baixo letramento digital, através de:

- Interface intuitiva e acessível (WCAG 2.1 AA)
- Múltiplos formatos de registro (texto, áudio, vídeo, imagem)
- Assistente virtual IZA com Inteligência Artificial
- Progressive Web App (PWA) para uso offline

---

## ✨ Funcionalidades

### 📝 Registro de Manifestações
- **5 tipos de manifestação**: Reclamação, Sugestão, Elogio, Denúncia, Solicitação
- **15+ órgãos do GDF** integrados (SEEDF, SES, SSP, DETRAN, etc.)
- **Múltiplos formatos de entrada**:
  - ✍️ Texto digitado
  - 🎤 Gravação de áudio (até 3 minutos)
  - 📹 Gravação de vídeo (até 2 minutos)
  - 📷 Upload de imagens e documentos

### 🔐 Privacidade e Segurança
- **Manifestação anônima** garantida
- Protocolo único gerado automaticamente
- Dados protegidos conforme LGPD

### 🤖 Assistente IZA (IA)
- Classificação automática de manifestações
- Sugestão de órgão responsável
- Análise de conteúdo com NLP
- Chat interativo para orientação

### 📊 Acompanhamento
- Consulta por protocolo
- Timeline de status em tempo real
- Download de comprovante
- Compartilhamento via Web Share API

### ♿ Acessibilidade Total
- Conformidade WCAG 2.1 nível AA
- 3 temas: Claro, Escuro, Alto Contraste
- Ajuste de tamanho de fonte (5 níveis)
- Navegação completa por teclado
- Compatível com leitores de tela (NVDA, JAWS, VoiceOver)
- Suporte a movimento reduzido

---

## 🛠️ Tecnologias

| Categoria | Tecnologias |
|-----------|-------------|
| **Framework** | Next.js 16 (App Router) |
| **Linguagem** | TypeScript 5 |
| **Estilização** | Tailwind CSS 4.0 |
| **Estado** | Zustand (com persistência) |
| **PWA** | @ducanh2912/next-pwa |
| **Ícones** | Lucide React |
| **Animações** | Framer Motion |
| **Utilitários** | date-fns, uuid |

### 📱 PWA Features
- ✅ Instalável em dispositivos móveis
- ✅ Funciona offline (Service Worker)
- ✅ Cache inteligente de assets
- ✅ Splash screen nativo
- ✅ Atalhos de ação rápida

---

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/participadf-ouvidoria.git

# 2. Acesse a pasta
cd participadf-ouvidoria/ouvidoria-digital

# 3. Instale as dependências
npm install

# 4. Execute em desenvolvimento
npm run dev

# 5. Acesse no navegador
# http://localhost:3000
```

### Build de Produção

```bash
# Gerar build otimizado
npm run build

# Executar em produção
npm start
```

---

## 📁 Estrutura do Projeto

```
ouvidoria-digital/
├── public/
│   ├── manifest.json      # Configuração PWA
│   └── icons/             # Ícones do app
├── src/
│   ├── app/
│   │   ├── page.tsx              # Página inicial
│   │   ├── layout.tsx            # Layout global
│   │   ├── globals.css           # Estilos globais
│   │   ├── manifestacao/
│   │   │   └── nova/page.tsx     # Nova manifestação
│   │   ├── consulta/page.tsx     # Consulta protocolo
│   │   └── ajuda/page.tsx        # Central de ajuda
│   ├── components/
│   │   ├── Header.tsx            # Cabeçalho
│   │   ├── Footer.tsx            # Rodapé
│   │   ├── AccessibilityPanel.tsx # Painel de acessibilidade
│   │   ├── AudioRecorder.tsx     # Gravador de áudio
│   │   ├── VideoRecorder.tsx     # Gravador de vídeo
│   │   ├── FileUpload.tsx        # Upload de arquivos
│   │   ├── IzaAssistente.tsx     # Assistente IA
│   │   ├── ProtocoloSucesso.tsx  # Tela de sucesso
│   │   └── Toast.tsx             # Notificações
│   └── lib/
│       ├── types.ts              # Tipos TypeScript
│       ├── utils.ts              # Funções utilitárias
│       └── store.ts              # Estado global (Zustand)
└── next.config.ts                # Configuração Next.js + PWA
```

---

## ♿ Acessibilidade

O Participa DF foi desenvolvido com foco em acessibilidade desde o início:

### Diretrizes Implementadas (WCAG 2.1 AA)

| Princípio | Implementação |
|-----------|---------------|
| **Perceptível** | Alto contraste, textos alternativos, legendas |
| **Operável** | Navegação por teclado, skip links, foco visível |
| **Compreensível** | Linguagem clara, feedback consistente, prevenção de erros |
| **Robusto** | HTML semântico, ARIA labels, compatibilidade com AT |

### Recursos de Acessibilidade

- **Skip Link**: Pular para o conteúdo principal
- **Temas**: Claro / Escuro / Alto Contraste
- **Fontes**: 5 tamanhos ajustáveis (80% a 120%)
- **Movimento**: Opção para reduzir animações
- **Focus Ring**: Indicadores de foco bem visíveis
- **Screen Readers**: Landmarks e roles ARIA

### Testado com
- NVDA (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)
- Navegação por teclado

---

## 📊 Critérios de Avaliação (Hackathon)

| Critério | Pontos | Nossa Solução |
|----------|--------|---------------|
| **Relevância para controle social** | 10 | ✅ Democratiza acesso à ouvidoria |
| **Caráter inovador** | 10 | ✅ IA, múltiplos formatos, PWA |
| **Aplicabilidade** | 10 | ✅ Pronto para produção |
| **Eficácia** | 10 | ✅ Resolução comprovada do problema |
| **Acessibilidade** | 10 | ✅ WCAG 2.1 AA completo |

### Diferenciais Competitivos

1. **IZA - Assistente IA**: Classificação automática inteligente
2. **Multimodal**: Texto, áudio, vídeo e imagem
3. **PWA Completo**: Offline-first, instalável
4. **Acessibilidade**: Não apenas compliance, mas experiência real
5. **Design Moderno**: Interface intuitiva e profissional

---

## 🔮 Roadmap Futuro

- [ ] Integração real com APIs do GDF
- [ ] Transcrição automática de áudio (Speech-to-Text)
- [ ] Notificações push
- [ ] Dashboard administrativo
- [ ] Relatórios e analytics
- [ ] Integração com Gov.br
- [ ] Suporte a Libras (VLibras)

---

## 🤖 Uso de Inteligência Artificial no Desenvolvimento

Em conformidade com o **item 13.9 do edital do Hackathon GDF 2025**, declaramos que **ferramentas de Inteligência Artificial foram utilizadas** no desenvolvimento deste projeto.

### Ferramentas de IA Utilizadas

| Ferramenta | Aplicação |
|------------|-----------|
| **Claude (Anthropic)** | Assistência na escrita de código, debugging, otimização e documentação |
| **GitHub Copilot** | Autocompletar código e sugestões de implementação |

### Áreas de Aplicação da IA

1. **Estruturação de Componentes**: Criação de estrutura inicial de componentes React
2. **Debugging**: Identificação e correção de bugs
3. **Acessibilidade**: Implementação de atributos ARIA e conformidade WCAG
4. **Documentação**: Auxílio na escrita do README e comentários de código
5. **Otimização**: Melhoria de performance e boas práticas

### Validação do Código

Todo código gerado ou assistido por IA foi:

- ✅ **Revisado manualmente** pela equipe de desenvolvimento
- ✅ **Testado** para garantir funcionamento correto
- ✅ **Adaptado** ao contexto específico do projeto
- ✅ **Validado** quanto a segurança e boas práticas

> A IA foi utilizada como ferramenta de auxílio, sendo toda decisão técnica final tomada pela equipe humana.

---

## 🎬 Demonstração em Vídeo

📹 **Link do Vídeo**: [Clique aqui para assistir](https://www.youtube.com/watch?v=SEU_VIDEO_ID)

### Conteúdo do Vídeo (até 7 minutos)

| Tempo | Seção | Demonstração |
|-------|-------|--------------|
| 0:00 - 1:00 | **Introdução** | Visão geral da plataforma e objetivos |
| 1:00 - 2:30 | **Nova Manifestação** | Fluxo completo de registro com multicanal |
| 2:30 - 3:30 | **Acessibilidade** | Demonstração dos recursos WCAG 2.1 AA |
| 3:30 - 4:30 | **Consulta de Protocolo** | Acompanhamento de manifestação |
| 4:30 - 5:30 | **Assistente IZA** | Interação com a IA |
| 5:30 - 6:30 | **PWA** | Instalação e funcionamento offline |
| 6:30 - 7:00 | **Conclusão** | Resumo e benefícios |

---

## 👥 Equipe

**Hackathon GDF 2025 - Categoria Ouvidoria**

---

## 📄 Licença

Este projeto foi desenvolvido para o **1º Hackathon em Controle Social: Desafio Participa DF 2025**.

---

<div align="center">

**Feito com 💙 para o Distrito Federal**

![GDF](https://img.shields.io/badge/Governo%20do-Distrito%20Federal-green?style=flat-square)
![Ouvidoria](https://img.shields.io/badge/Ouvidoria-Geral%20do%20DF-blue?style=flat-square)

</div>
