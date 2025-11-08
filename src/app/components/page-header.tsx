import { Card, CardContent } from '@/components/ui/card';
import { HeartCrack, Users, Building, Siren } from 'lucide-react';

const stats = [
  { icon: HeartCrack, value: '6', label: 'Vidas Perdidas' },
  { icon: Siren, value: '750', label: 'Feridos' },
  { icon: Building, value: '90%', label: 'Cidade Destruída' },
  { icon: Users, value: '1.000+', label: 'Desabrigados' },
];

export function PageHeader() {
  return (
    <header
      id="inicio"
      className="relative bg-primary/5 pt-20 pb-12 sm:pb-16 text-center"
    >
      <div className="absolute top-0 left-0 right-0 bg-destructive text-destructive-foreground p-2 text-sm md:text-base font-bold animate-pulse z-10">
        <p>EMERGÊNCIA - TORNADO EF3</p>
      </div>
      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-primary font-headline">
          SOS Rio Bonito
        </h1>
        <p className="mt-3 text-xl md:text-2xl font-semibold text-accent">
          AJUDE AGORA
        </p>
        <p className="mt-2 max-w-2xl mx-auto text-foreground/80">
          Sua doação pode salvar vidas e ajudar a reconstruir a esperança em
          Rio Bonito do Iguaçu.
        </p>

        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="bg-card/90 backdrop-blur-sm border-primary/20 transition-transform hover:scale-105 hover:shadow-lg"
            >
              <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
                <stat.icon
                  className="w-10 h-10 text-destructive mb-3"
                  strokeWidth={1.5}
                />
                <p className="text-3xl md:text-4xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </header>
  );
}
