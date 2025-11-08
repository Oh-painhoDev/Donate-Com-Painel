import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Feather,
  Globe,
  Bird,
} from 'lucide-react';

const impacts = [
  {
    amount: '208.823',
    description: 'Quantidade de hectares protegidos pelas ações da SAVE Brasil.',
    icon: Globe,
  },
  {
    amount: '9.273',
    description: 'Visitantes que vieram conhecer nossas reservas, nos últimos anos',
    icon: Feather,
  },
  {
    amount: '64',
    description: 'Espécies de aves ameaçadas que foram beneficiadas pela SAVE Brasil',
    icon: Bird,
  },
];

export function ImpactVisualizer() {
  return (
    <section id="impacto" className="py-12 md:py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-accent">
            Impacto na prática
          </h2>
          <p className="mt-2 max-w-2xl mx-auto text-blue-200">
            Com quase 20 anos de atuação no Brasil, estes são alguns dos números que traduzem o nosso trabalho:
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {impacts.map((impact) => (
            <Card
              key={impact.amount}
              className="text-center bg-transparent border-0 shadow-none"
            >
              <CardContent>
                <p className="text-6xl font-bold text-white">{impact.amount}</p>
                <hr className="my-4 border-accent" />
                <p className="mt-2 text-lg">
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
