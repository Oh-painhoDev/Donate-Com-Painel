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
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export function CredibilityShowcase({ content }: { content: any }) {
  if (!content) return null;

  return (
    <section id="depoimentos" className="py-16 md:py-28 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-headline text-primary">
            {content.credibilityTitle}
          </h2>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {content.testimonials.map((testimonial: any, index: number) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              text={testimonial.text}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ name, text }: { name: string; text: string;}) {
  return (
    <Card className="bg-background overflow-hidden group shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <Avatar className="h-16 w-16 mr-5 border-2 border-primary/20">
            <AvatarFallback className='text-xl bg-primary/90 text-primary-foreground'>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-xl text-primary">{name}</p>
          </div>
        </div>
        <p className="text-base text-foreground/80 leading-relaxed">{`“${text}”`}</p>
      </CardContent>
    </Card>
  );
}
