import { PageHeader } from '@/app/components/page-header';
import { DonationSection } from '@/app/components/donation-section';
import { ImpactVisualizer } from '@/app/components/impact-visualizer';
import { CredibilityShowcase } from '@/app/components/credibility-showcase';
import { FaqSection } from '@/app/components/faq-section';
import { SiteFooter } from '@/app/components/site-footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function AboutSection() {
  const aboutImage = PlaceHolderImages.find(p => p.id === 'about-parana');
  return (
    <section id="sobre" className="bg-secondary text-foreground py-16 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative w-full aspect-square max-w-lg mx-auto rounded-xl overflow-hidden shadow-2xl">
            {aboutImage && (
              <Image
                src={aboutImage.imageUrl}
                alt={aboutImage.description}
                data-ai-hint={aboutImage.imageHint}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary font-headline">A SAVE BRASIL</h2>
            <h3 className="text-xl md:text-2xl font-semibold mb-6 text-primary/80">ATUAÇÃO</h3>
            <div className="space-y-4 text-lg text-foreground/90">
              <p>
                A SAVE Brasil desenvolve ações para a conservação em áreas prioritárias, capacitação de comunidades locais, além de monitoramento da fauna, flora e atividades educacionais.
              </p>
              <p>
                Nosso foco é conservar as aves do Brasil. Somos uma rede de pessoas engajadas que entenderam a necessidade de agir para salvar a Natureza - e a nós mesmos.
              </p>
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
  const logoImage = PlaceHolderImages.find(p => p.id === 'logo');
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <nav className="fixed top-0 left-0 right-0 bg-primary/90 backdrop-blur-lg border-b border-primary-foreground/10 py-1 px-2 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          {logoImage && (
              <Image
                src={logoImage.imageUrl}
                alt={logoImage.description}
                data-ai-hint={logoImage.imageHint}
                width={100}
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
        <AboutSection />
        <CredibilityShowcase />
        <FaqSection />
      </main>
      <SiteFooter />
    </div>
  );
}
