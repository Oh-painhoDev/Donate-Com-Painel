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
import type { Metadata } from 'next';
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
    console.log(`
  ═══════════════════════════════════════════════════
   [USUÁRIO]: Painho_Dev
   [DISCORD]: painhodev
   [CARGO]: Criador Profissional de Bugs
   [HABILIDADES]: Criar bugs novos, Consertar bugs antigos
   [STATUS]: Funcionou na minha máquina! 🤷
  ═══════════════════════════════════════════════════
            \\
             \\     ^__^
              \\   (oo)\\_______
                 (__)\\       )\\/\\\\
                     ||----Ō |
                     ||     ||
 `);
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
