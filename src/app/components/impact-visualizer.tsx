import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  ShoppingBasket,
  Package,
  Home,
  HeartHandshake,
} from 'lucide-react';

const impacts = [
  {
    amount: 'R$ 50',
    description: 'Cesta Básica para 1 família por 1 semana',
    icon: ShoppingBasket,
  },
  {
    amount: 'R$ 100',
    description: 'Kit de Higiene + Medicamentos para 5 pessoas',
    icon: Package,
  },
  {
    amount: 'R$ 200',
    description: 'Material para 10m² de abrigo emergencial',
    icon: Home,
  },
  {
    amount: 'R$ 500',
    description: 'Apoio completo para uma família desabrigada',
    icon: HeartHandshake,
  },
];

export function ImpactVisualizer() {
  return (
    <section id="impacto" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
            O Impacto da Sua Doação
          </h2>
          <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
            Veja como sua contribuição se transforma em ajuda real.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {impacts.map((impact) => (
            <Card
              key={impact.amount}
              className="text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                  <impact.icon className="h-10 w-10 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-accent">{impact.amount}</p>
                <p className="mt-2 text-muted-foreground">
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
