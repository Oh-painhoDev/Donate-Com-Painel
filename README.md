# Landing Page Dinâmica para Campanhas de Doação com Painel Admin

Este é um projeto de landing page de alta conversão, construído com Next.js e Firebase, projetado para ser 100% personalizável através de um painel de administração integrado. A plataforma permite que qualquer pessoa, mesmo sem conhecimento técnico, crie e gerencie uma página de doações completa, com integração para pagamentos via PIX, atualizações de notícias com Inteligência Artificial e total controle sobre o conteúdo e aparência do site.

## ✨ Funcionalidades Principais

- **Painel de Administração Completo**: Gerencie todo o conteúdo do site (textos, cores, imagens, valores de doação) sem tocar em uma linha de código.
- **Conteúdo 100% Dinâmico**: Altere títulos, logotipos, imagens de fundo, opções de doação, depoimentos e perguntas frequentes diretamente pelo painel.
- **Integração PIX Pronta**: Conecte-se a qualquer API de geração de PIX para processar doações de forma segura e automatizada através de uma rota de API backend.
- **Gerador de Notícias com IA**: Utilize Inteligência Artificial (Google Gemini via Genkit) para gerar e atualizar automaticamente a seção de notícias da sua campanha com base em um tópico.
- **Prova Social Dinâmica**: Exiba notificações de doações em tempo real (simuladas) para criar um senso de urgência e incentivar novos doadores.
- **Design Responsivo**: Totalmente adaptado para funcionar perfeitamente em desktops, tablets e celulares.
- **Alta Performance**: Construído com Next.js (App Router) e Turbopack para uma experiência de usuário extremamente rápida e otimizada.
- **Segurança**: Autenticação de administrador para proteger o painel e regras de segurança no Firestore para proteger os dados da página.

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

3.  **Configure o Firebase no Cliente**
    - No seu projeto dentro do [Firebase Console](https://console.firebase.google.com/), navegue até **Configurações do Projeto** (`Project Settings`).
    - Na aba **Geral** (`General`), na seção "Seus apps" (`Your apps`), selecione ou crie um aplicativo Web.
    - Copie o objeto de configuração do Firebase (o `firebaseConfig`).
    - Cole essa configuração no arquivo `src/firebase/config.ts`, substituindo o conteúdo existente.

4.  **Ative os Serviços do Firebase**
    - No console do Firebase, vá para a seção **Build**.
    - Ative o **Authentication**: na aba "Sign-in method", habilite o provedor "E-mail/senha".
    - Ative o **Firestore Database**: crie um novo banco de dados no modo de produção. As regras de segurança iniciais já estão no arquivo `firestore.rules`.

5.  **Configure as Variáveis de Ambiente**
    - Crie um arquivo chamado `.env.local` na raiz do projeto.
    - Adicione as credenciais do Firebase Admin SDK. Elas são **obrigatórias** para o painel de administração funcionar. Você pode gerar uma chave privada no Firebase Console em **Configurações do Projeto > Contas de serviço > Gerar nova chave privada**.
    - Adicione também sua chave de API do Google AI Studio para que a funcionalidade de notícias com IA funcione.

    ```env
    # Credenciais do Firebase Admin (obrigatórias para o painel admin)
    FIREBASE_PROJECT_ID="seu-project-id"
    FIREBASE_CLIENT_EMAIL="firebase-adminsdk-...@seu-project-id.iam.gserviceaccount.com"
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...sua-chave-privada-aqui...\n-----END PRIVATE KEY-----\n"

    # Chave da API do Google AI (obrigatória para o Genkit funcionar)
    GEMINI_API_KEY="sua-api-key-do-google-ai-studio"
    ```

6.  **Crie o Primeiro Usuário Administrador**
    - No painel do **Firebase Authentication**, vá para a aba **Users** e clique em **Add user**.
    - Adicione manualmente o primeiro usuário (e-mail e senha) que terá acesso ao painel de administração.

7.  **Execute o Projeto**
    ```bash
    npm run dev
    ```
    - A aplicação estará disponível em `http://localhost:9002` (ou outra porta, se a 9002 estiver ocupada).
    - O painel de administração estará em `http://localhost:9002/admin`.

## 📂 Estrutura do Projeto

```
src
├── app
│   ├── admin                 # Rotas e componentes do painel de administração.
│   │   ├── login             # Página de login do admin.
│   │   └── settings          # Página principal de gerenciamento de conteúdo.
│   ├── api                   # Rotas de API do Next.js.
│   │   └── create-vision     # Endpoint backend para gerar o PIX de forma segura.
│   ├── (public)              # Arquivos de rota para páginas públicas (home, doacao-pix).
│   ├── components            # Componentes React específicos da página principal.
│   └── layout.tsx            # Layout principal da aplicação.
├── ai
│   ├── flows                 # Lógica de Inteligência Artificial com Genkit (ex: gerar notícias).
│   └── genkit.ts             # Configuração e inicialização do Genkit.
├── components
│   └── ui                    # Componentes da biblioteca ShadCN/UI.
├── firebase
│   ├── admin-sdk.ts          # Configuração do Firebase Admin SDK (para uso no lado do servidor).
│   ├── client-sdk.ts         # Configuração do Firebase SDK (para uso no lado do cliente).
│   ├── config.ts             # Objeto de configuração do Firebase para o cliente.
│   ├── hooks.ts              # Hooks React customizados para interagir com o Firebase.
│   └── provider.tsx          # Provider React para o contexto do Firebase.
├── hooks                     # Hooks customizados (ex: useToast, useMobile).
└── lib
    ├── initial-data.ts       # Dados iniciais para uma nova instância do site.
    └── utils.ts              # Funções utilitárias (ex: `cn` para classes do Tailwind).
```

## ⚙️ Como Usar o Painel de Administração

Acesse `/admin` e faça login com as credenciais do usuário que você criou no Firebase Authentication.

O painel é uma página única dividida em seções, cada uma correspondendo a uma parte da landing page. Use o menu lateral para navegar rapidamente:

-   **Aparência e Cores**: Altere as cores primária, secundária, de destaque e de fundo do site.
-   **Cabeçalho**: Edite o título da página, logo, imagem de fundo e os textos principais.
-   **Doações**: Adicione ou remova opções de doação com valores e descrições pré-definidas.
-   **Notícias**: Edite manualmente as notícias ou use o botão **"Atualizar Notícias com IA"** para gerar novos artigos sobre um tema específico.
-   **Visualizador de Impacto**: Edite os números e as descrições que mostram o impacto da campanha (ex: "289 apoiadores").
-   **Seção Sobre**: Altere o conteúdo da seção que explica a causa.
-   **Depoimentos**: Adicione, edite ou remova depoimentos para aumentar a credibilidade.
-   **FAQ**: Gerencie as perguntas e respostas frequentes.
-   **Rodapé**: Configure os links, informações de contato e textos do rodapé.

Qualquer alteração feita é salva em tempo real no Firestore e refletida imediatamente no site. Clique em **"Salvar Todas as Alterações"** no final da página para persistir suas mudanças.
