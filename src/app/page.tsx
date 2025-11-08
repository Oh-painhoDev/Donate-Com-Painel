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

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <PageHeader />
      <main>
        <DonationSection />
        <TransparencyDashboard />
        <NewsFeed />
        <ImpactVisualizer />
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
