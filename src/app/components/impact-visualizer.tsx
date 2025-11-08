/*
 * 
 *  ═══════════════════════════════════════════════════
 *   [USUÁRIO]: Painho_Dev
 *   [DISCORD]: painhodev
 *   [CARGO]: Criador Profissional de Bugs
 *   [HABILIDADES]: Criar bugs novos, Consertar bugs antigos
 *   [STATUS]: Funcionou na minha máquina! 🤷
 *  ═══════════════════════════════════════════════════
 *            \
 *             \     ^__^
 *              \   (oo)\_______
 *                 (__)\       )\/\\
 *                     ||----Ō |
 *                     ||     ||
 * 
 * 
 */
import { Card, CardContent } from '@/components/ui/card';
import { LandPlot, Bird, Users, Leaf } from 'lucide-react';

const iconMap: { [key: string]: React.ElementType } = {
  LandPlot,
  Bird,
  Users,
  Leaf,
  default: Leaf,
};

export function ImpactVisualizer({ content }: { content: any }) {
  if (!content) return null;

  return (
    <section id="impacto" className="py-16 md:py-28 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-headline text-primary">
            {content.impactVisualizerTitle}
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-base md:text-xl text-foreground/70">
            {content.impactVisualizerSubText}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.impacts.map((impact: any, index: number) => {
            const Icon = iconMap[impact.icon] || iconMap.default;
            return (
              <Card
                key={index}
                className="text-center bg-card border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-secondary rounded-full">
                     <Icon className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                  </div>
                  <p className="text-5xl md:text-6xl font-bold text-primary">{impact.amount}</p>
                  <p className="mt-2 text-base md:text-lg text-foreground/80 leading-relaxed">
                    {impact.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  );
}
