import { PageHeader } from '@/app/components/page-header';
import { DonationSection } from '@/app/components/donation-section';
import { TransparencyDashboard } from '@/app/components/transparency-dashboard';
import { NewsFeed } from '@/app/components/news-feed';
import { ImpactVisualizer } from '@/app/components/impact-visualizer';
import { CredibilityShowcase } from '@/app/components/credibility-showcase';
import { FaqSection } from '@/app/components/faq-section';
import { SiteFooter } from '@/app/components/site-footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function AtuacaoSection() {
  const atuacaoImage = PlaceHolderImages.find(p => p.id === 'atuacao-save-brasil');
  return (
    <section className="bg-primary text-primary-foreground py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative w-full aspect-square max-w-md mx-auto">
            {atuacaoImage && (
              <Image
                src={atuacaoImage.imageUrl}
                alt={atuacaoImage.description}
                data-ai-hint={atuacaoImage.imageHint}
                fill
                className="rounded-full object-cover shadow-lg"
              />
            )}
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-accent">A SAVE BRASIL</h2>
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-blue-200">ATUAÇÃO</h3>
            <p className="text-lg">
              A SAVE Brasil desenvolve ações para a conservação em áreas prioritárias, capacitação de comunidades locais, além de monitoramento da fauna, flora e atividades educacionais.
            </p>
            <p className="mt-4 text-lg">
              Nosso foco é conservar as aves do Brasil. Somos uma rede de pessoas engajadas que entenderam a necessidade de agir para salvar a Natureza - e a nós mesmos.
            </p>
            <Button asChild className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="#doar">Colabore</Link>
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
      <nav className="fixed top-0 left-0 right-0 bg-transparent p-4 z-20">
        <div className="container mx-auto flex justify-between items-center">
        {logoImage && (
              <Image
                src={logoImage.imageUrl}
                alt={logoImage.description}
                data-ai-hint={logoImage.imageHint}
                width={130}
                height={40}
                className="object-contain"
              />
            )}
        </div>
      </nav>
      <PageHeader />
      <main>
        <DonationSection />
        <ImpactVisualizer />
        <AtuacaoSection />
        <CredibilityShowcase />
        <FaqSection />
      </main>
      <SiteFooter />
      {/* Floating button for mobile that links to the donation section */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Button
          asChild
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg rounded-full h-16 w-16 p-0 flex flex-col items-center justify-center leading-none"
        >
          <Link href="#doar">
            <Heart className="h-6 w-6 mb-1" />
            <span className="text-xs font-bold">DOAR</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
