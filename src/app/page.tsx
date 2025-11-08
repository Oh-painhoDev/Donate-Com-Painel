import { PageHeader } from '@/app/components/page-header';
import { DonationSection } from '@/app/components/donation-section';
import { ImpactVisualizer } from '@/app/components/impact-visualizer';
import { CredibilityShowcase } from '@/app/components/credibility-showcase';
import { FaqSection } from '@/app/components/faq-section';
import { SiteFooter } from '@/app/components/site-footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function AboutSection() {
  const aboutImage = PlaceHolderImages.find(p => p.id === 'about-parana');
  return (
    <section className="bg-background text-foreground py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative w-full aspect-video max-w-lg mx-auto">
            {aboutImage && (
              <Image
                src={aboutImage.imageUrl}
                alt={aboutImage.description}
                data-ai-hint={aboutImage.imageHint}
                fill
                className="rounded-lg object-cover shadow-lg"
              />
            )}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">NOSSA MISSÃO</h2>
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-muted-foreground">AJUDANDO O PARANÁ</h3>
            <p className="text-lg mb-4">
              As recentes enchentes no Paraná deixaram milhares de famílias desabrigadas e em situação de vulnerabilidade. A sua doação é crucial para fornecer itens essenciais como alimentos, água potável, kits de higiene e abrigo.
            </p>
            <p className="text-lg">
              Junte-se a nós neste movimento de solidariedade. Cada contribuição, não importa o valor, faz uma enorme diferença na vida de quem perdeu tudo.
            </p>
            <Button asChild className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6">
              <Link href="#doar">Quero Ajudar</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}


export default function Home() {
  const logoImage = PlaceHolderImages.find(p => p.id === 'logo');
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <nav className="fixed top-0 left-0 right-0 bg-primary/80 backdrop-blur-sm p-4 z-50">
        <div className="container mx-auto flex justify-between items-center">
          {logoImage && (
              <Image
                src={logoImage.imageUrl}
                alt={logoImage.description}
                data-ai-hint={logoImage.imageHint}
                width={150}
                height={50}
                className="object-contain"
              />
            )}
            <Button asChild variant="ghost" className="text-primary-foreground hover:bg-white/20">
              <Link href="#doar">
                Doar Agora
              </Link>
            </Button>
        </div>
      </nav>
      <PageHeader />
      <main>
        <DonationSection />
        <ImpactVisualizer />
        <AboutSection />
        <CredibilityShowcase />
        <FaqSection />
      </main>
      <SiteFooter />
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Button
          asChild
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg rounded-full h-20 w-20 p-0 flex flex-col items-center justify-center leading-none"
        >
          <Link href="#doar">
            <Heart className="h-8 w-8 mb-1" />
            <span className="text-sm font-bold">DOAR</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
