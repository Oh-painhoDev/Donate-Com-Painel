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
    <section id="impacto" className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-headline text-accent">
            Impacto na Prática
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-blue-200">
            Com quase 20 anos de atuação no Brasil, estes são alguns dos números que traduzem o nosso trabalho:
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {impacts.map((impact) => (
            <Card
              key={impact.amount}
              className="text-center bg-primary/50 border-accent/30 rounded-2xl p-6 shadow-lg"
            >
              <CardContent className="flex flex-col items-center gap-4">
                <impact.icon className="w-16 h-16 text-accent" />
                <p className="text-5xl font-bold text-white">{impact.amount}</p>
                <p className="mt-2 text-lg text-blue-200">
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
