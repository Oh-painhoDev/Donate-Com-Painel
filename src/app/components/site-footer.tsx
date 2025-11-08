import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="bg-primary/10">
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-accent font-headline">
          Cada segundo conta.
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-foreground/80">
          Sua doação chega em minutos diretamente para quem precisa. Não há
          tempo a perder. A solidariedade é nossa maior força.
        </p>
        <div className="mt-8">
          <Button
            asChild
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg animate-bounce"
          >
            <Link href="#doar">
              <Heart className="mr-2 h-5 w-5" /> Doar Agora via PIX
            </Link>
          </Button>
        </div>
      </div>
      <div className="border-t border-border/50 py-4">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} SOS Rio Bonito. Uma iniciativa da
            comunidade para a comunidade.
          </p>
          <p>Rio Bonito Relief</p>
        </div>
      </div>
    </footer>
  );
}
