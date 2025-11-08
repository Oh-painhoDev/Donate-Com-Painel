import { Card, CardContent } from '@/components/ui/card';
import { LandPlot, Bird, Users } from 'lucide-react';

const impacts = [
  {
    amount: '208.823',
    description: 'Hectares protegidos pelas ações da SAVE Brasil.',
    icon: LandPlot,
  },
  {
    amount: '9.273',
    description: 'Visitantes que vieram conhecer nossas reservas, nos últimos anos.',
    icon: Users,
  },
  {
    amount: '64',
    description: 'Espécies de aves ameaçadas que foram beneficiadas pela SAVE Brasil.',
    icon: Bird,
  },
];

export function ImpactVisualizer() {
  return (
    <section id="impacto" className="py-16 md:py-28 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-headline text-primary">
            Impacto na Prática
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-base md:text-xl text-foreground/70">
            Com quase 20 anos de atuação no Brasil, estes são alguns dos números que traduzem o nosso trabalho:
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {impacts.map((impact) => (
            <Card
              key={impact.amount}
              className="text-center bg-card border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <CardContent className="flex flex-col items-center gap-4">
                <div className="p-4 bg-secondary rounded-full">
                  <impact.icon className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                </div>
                <p className="text-5xl md:text-6xl font-bold text-primary">{impact.amount}</p>
                <p className="mt-2 text-base md:text-lg text-foreground/80 leading-relaxed">
                  {impact.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
