/*
 * 
 *  ═══════════════════════════════════════════════════
 *   [USUÁRIO]: Painho_Dev
 *   [DISCORD]: painhodev
 *   [CARGO]: Criador Profissional de Bugs
 *   [HABILIDADES]: Criar bugs novos, Consertar bugs antigos
 *   [STATUS]: Funcionou na minha máquina! 🤷
 *  ═══════════════════════════════════════════════════
 *            \
 *             \     ^__^
 *              \   (oo)\_______
 *                 (__)\       )\/\\
 *                     ||----Ō |
 *                     ||     ||
 * 
 * 
 */
'use client'
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { useEffect } from 'react';

// Metadata has been removed from this client component to fix the build error.
// Page titles and descriptions are now fully managed dynamically based on Firestore data in page.tsx.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const piadas = [
      "Meu código é tão rápido que o erro aparece antes da execução!",
      "Não é bug, é uma feature não documentada.",
      "Apaguei um bug e ganhei três novos. Produtividade 300% ✅",
      "Se funciona, não encosta. Se não funciona... também não encosta.",
      "console.log() é meu melhor amigo. Ele me entende.",
      "Prometi otimizar o código... e otimizei as desculpas.",
      "Meu código funciona na minha máquina, e é o que importa!",
      "Quem precisa de café quando se tem 43 erros no terminal?",
      "Código limpo é aquele que o cliente nunca vê.",
      "Quando o erro é misterioso, a culpa é do cache. Sempre."
    ];
    
    function mostrarResenha() {
      const piada = piadas[Math.floor(Math.random() * piadas.length)];
      const jokeLine = `  Piada: "${piada}"`.padEnd(49, ' ');
      console.clear();
      console.log("%c╔══════════════════════════════════════════════════╗", "color:#00ff88");
      console.log("%c║                💻 PAINHO DEV CONSOLE 💻           ║", "color:#00ff88; font-weight:bold;");
      console.log("%c║   [USUÁRIO]: Painho_Dev                         ║", "color:#00ff88");
      console.log("%c║   [DISCORD]: painhodev                          ║", "color:#00ff88");
      console.log("%c║   [CARGO]: Criador Profissional de Bugs          ║", "color:#00ff88");
      console.log(`%c║${jokeLine}║`, "color:#00ff88");
      console.log("%c║   [STATUS]: Funcionou na minha máquina! 🤷        ║", "color:#00ff88");
      console.log("%c╚══════════════════════════════════════════════════╝", "color:#00ff88");
      console.log("%c            \\     ^__^\n             \\   (oo)\\_______\n                 (__)\\       )\\/\\\\\n                     ||----Ō |\n                     ||     ||", "color:#00ff88");
    }
    
    mostrarResenha();
    const intervalId = setInterval(mostrarResenha, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Poppins:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
