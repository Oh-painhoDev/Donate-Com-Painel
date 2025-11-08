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
'use client';
import { PageHeader } from '@/app/components/page-header';
import { DonationSection } from '@/app/components/donation-section';
import { ImpactVisualizer } from '@/app/components/impact-visualizer';
import { CredibilityShowcase } from '@/app/components/credibility-showcase';
import { FaqSection } from '@/app/components/faq-section';
import { SiteFooter } from '@/app/components/site-footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useDoc, useMemoFirebase, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { initialPageContent } from '@/lib/initial-data';
import { ThemeInjector } from '@/app/components/theme-injector';
import { NewsSection } from '@/app/components/news-section';

function AboutSection({ content }: { content: any }) {
  if (!content) return null;
  return (
    <section id="sobre" className="bg-secondary text-foreground py-16 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative w-full aspect-square max-w-lg mx-auto rounded-xl overflow-hidden shadow-2xl">
            {content.aboutImageUrl && (
              <Image
                src={content.aboutImageUrl}
                alt={content.aboutTitle}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary font-headline">{content.aboutTitle}</h2>
            <h3 className="text-xl md:text-2xl font-semibold mb-6 text-primary/80">{content.aboutSubTitle}</h3>
            <div className="space-y-4 text-lg text-foreground/90">
              <p>{content.aboutText}</p>
            </div>
            <Button asChild size="lg" className="mt-8 text-lg px-10 py-7 font-bold bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
              <Link href="#doar">Colabore</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}


export default function Home() {
  const firestore = useFirestore();
  const contentRef = useMemoFirebase(() => firestore ? doc(firestore, 'pageContent', 'landingPage') : null, [firestore]);
  const { data, isLoading } = useDoc(contentRef);

  const content = data ?? initialPageContent;
  
  if (isLoading) {
    return (
       <div className="flex items-center justify-center min-h-screen bg-background">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <ThemeInjector colors={content.colors} />
       <nav className="fixed top-0 left-0 right-0 bg-primary/90 backdrop-blur-lg border-b border-primary-foreground/10 py-1 px-2 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          {content.logoImageUrl && (
              <Image
                src={content.logoImageUrl}
                alt="Logo"
                width={100}
                height={40}
                className="object-contain"
              />
            )}
        </div>
      </nav>
      <PageHeader content={content} />
      <main>
        <DonationSection content={content} />
        <NewsSection content={content} />
        <ImpactVisualizer content={content} />
        <AboutSection content={content} />
        <CredibilityShowcase content={content} />
        <FaqSection content={content} />
      </main>
      <SiteFooter content={content} />
    </div>
  );
}
