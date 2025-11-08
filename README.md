# Landing Page Dinâmica para Campanhas de Doação

Este é um projeto de landing page de alta conversão, construído com Next.js e Firebase, projetado para ser 100% personalizável através de um painel de administração integrado. A plataforma permite que qualquer pessoa, mesmo sem conhecimento técnico, crie e gerencie uma página de doações completa, com integração para pagamentos via PIX, atualizações de notícias com Inteligência Artificial e total controle sobre o conteúdo e aparência do site.

## ✨ Funcionalidades Principais

- **Painel de Administração Completo**: Gerencie todo o conteúdo do site sem tocar em uma linha de código.
- **Conteúdo Dinâmico**: Altere textos, títulos, imagens, cores, valores de doação, depoimentos e perguntas frequentes diretamente pelo painel.
- **Integração PIX**: Conecte-se a qualquer API de geração de PIX para processar doações de forma automatizada.
- **Atualização de Notícias com IA**: Utilize Inteligência Artificial (Google Gemini via Genkit) para gerar e atualizar automaticamente a seção de notícias da sua campanha com base em um tópico.
- **Prova Social Dinâmica**: Exiba notificações de doações em tempo real para incentivar novos doadores.
- **Responsividade**: Design totalmente adaptado para funcionar perfeitamente em desktops, tablets e celulares.
- **Alta Performance**: Construído com Next.js e App Router para uma experiência de usuário rápida e otimizada.
- **Segurança**: Autenticação de administrador para proteger o painel e regras de segurança no Firestore para proteger os dados.

## 🚀 Tecnologias Utilizadas

- **Frontend**: [Next.js](https://nextjs.org/) (com App Router) e [React](https://react.dev/)
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Banco de Dados**: [Firebase](https://firebase.google.com/) (Firestore e Authentication)
- **Inteligência Artificial**: [Genkit](https://firebase.google.com/docs/genkit) (com Google Gemini)
- **Validação de Formulários**: [React Hook Form](https://react-hook-form.com/) e [Zod](https://zod.dev/)

## 🔧 Configuração e Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 20 ou superior)
- Um projeto Firebase. Se você não tiver um, crie gratuitamente no [Firebase Console](https://console.firebase.google.com/).

### Passo a Passo

1.  **Clone o Repositório**
    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    cd seu-repositorio
    ```

2.  **Instale as Dependências**
    ```bash
    npm install
    ```

3.  **Configure o Firebase**

    - No [Firebase Console](https://console.firebase.google.com/), navegue até as **Configurações do Projeto** (`Project Settings`).
    - Na aba **Geral** (`General`), encontre a seção "Seus apps" (`Your apps`) e copie o objeto de configuração do Firebase para a Web.
    - Cole essa configuração no arquivo `src/firebase/config.ts`.
    - Ative o **Firebase Authentication** com o provedor "E-mail/Senha".
    - Ative o **Firestore** no modo de produção.

4.  **Configure as Variáveis de Ambiente**

    - Crie um arquivo `.env.local` na raiz do projeto.
    - Adicione as credenciais do Firebase Admin SDK para permitir que as Ações de Servidor (Server Actions) funcionem. Você pode gerar uma chave privada no Firebase Console em **Configurações do Projeto > Contas de serviço**.

    ```env
    # Credenciais do Firebase Admin (obrigatórias para o painel admin)
    FIREBASE_PROJECT_ID="seu-project-id"
    FIREBEASE_CLIENT_EMAIL="firebase-adminsdk-...@seu-project-id.iam.gserviceaccount.com"
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...sua-chave-privada...\n-----END PRIVATE KEY-----\n"

    # Chave da API do Google AI (obrigatória para o Genkit funcionar)
    GEMINI_API_KEY="sua-api-key-do-google-ai-studio"
    ```

5.  **Crie o Primeiro Usuário Administrador**

    - No painel do **Firebase Authentication**, adicione manualmente o primeiro usuário que terá acesso ao painel de administração.

6.  **Execute o Projeto**
    ```bash
    npm run dev
    ```
    - A aplicação estará disponível em `http://localhost:9002`.
    - O painel de administração estará em `http://localhost:9002/admin`.

## 📂 Estrutura do Projeto

```
src
├── app
│   ├── admin                 # Rotas e componentes do painel de administração
│   ├── api                   # Rotas de API (ex: proxy para o PIX)
│   ├── components            # Componentes React reutilizáveis da landing page
│   ├── (public pages)        # Arquivos de rota para páginas públicas (home, contribuir, pix)
│   ├── actions.ts            # Ações de servidor (Server Actions)
│   ├── globals.css           # Estilos globais e variáveis de tema do Tailwind
│   └── layout.tsx            # Layout principal da aplicação
├── ai
│   ├── flows                 # Lógica de Inteligência Artificial com Genkit
│   └── genkit.ts             # Configuração do Genkit
├── firebase
│   ├── admin-sdk.ts          # Configuração do Firebase Admin SDK (para o lado do servidor)
│   ├── client-sdk.ts         # Configuração do Firebase SDK (para o lado do cliente)
│   ├── config.ts             # Objeto de configuração do Firebase (para o cliente)
│   └── hooks.ts              # Hooks React para interagir com o Firebase
├── hooks                     # Hooks customizados (ex: useToast)
├── lib
│   ├── initial-data.ts       # Dados iniciais para uma nova instância do site
│   └── utils.ts              # Funções utilitárias (ex: `cn` para classes)
└── services                  # (Depreciado) Lógica de serviços externos
```

## ⚙️ Como Usar o Painel de Administração

Acesse `/admin` e faça login com as credenciais criadas no Firebase.

O painel é dividido em seções, cada uma correspondendo a uma parte da landing page:

- **Integrações**: Configure os endpoints de API para PIX e tokens para serviços de terceiros (como o Utmify para rastreamento).
- **Aparência e Cores**: Altere as cores primária, secundária, de destaque e de fundo do site.
- **Cabeçalho**: Edite o título da página, logo, imagem de fundo e os textos principais.
- **Doações**: Adicione ou remova opções de doação com valores e descrições pré-definidas.
- **Notícias**: Edite manualmente as notícias ou use o botão "Atualizar com IA" para gerar novos artigos sobre um tema específico.
- **Visualizador de Impacto**: Edite os números e as descrições que mostram o impacto da campanha (ex: "289 apoiadores").
- **Seção Sobre**: Altere o conteúdo da seção que explica a causa.
- **Depoimentos**: Adicione, edite ou remova depoimentos para aumentar a credibilidade.
- **FAQ**: Gerencie as perguntas e respostas frequentes.
- **Rodapé**: Configure os links, informações de contato e textos do rodapé.

Qualquer alteração feita é salva em tempo real no Firestore e refletida imediatamente no site.
