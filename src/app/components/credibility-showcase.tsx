import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const testimonials = [
  {
    name: 'Juliana Silva',
    location: 'Curitiba, PR',
    text: 'Fiquei desabrigada com meus dois filhos e não sabia o que fazer. A ajuda chegou rápido com comida e um lugar seguro para ficarmos. Sou muito grata a todos que doaram.'
  },
  {
    name: 'Marcos Oliveira',
    location: 'Voluntário',
    text: 'Ver a união das pessoas para ajudar é emocionante. Cada cesta básica que entregamos, cada cobertor, é um sopro de esperança. Fazer parte disso não tem preço.'
  },
  {
    name: 'Carla Martins',
    location: 'Londrina, PR',
    text: 'Nossa casa foi invadida pela água, perdemos quase tudo. O apoio que recebemos foi fundamental para recomeçar. Obrigada por não nos abandonarem neste momento tão difícil.'
  }
];

export function CredibilityShowcase() {

  return (
    <section id="depoimentos" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-headline text-primary">
            Vozes da Esperança
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
            Histórias reais de quem foi ajudado pela sua doação e de quem está na linha de frente.
          </p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              text={testimonial.text}
              location={testimonial.location}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ name, text, location }: { name: string; text: string; location: string }) {
  return (
    <Card className="bg-background overflow-hidden group shadow-lg rounded-2xl">
      <CardContent className="p-8">
        <div className="flex items-center mb-4">
          <Avatar className="h-14 w-14 mr-4">
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-xl text-primary">{name}</p>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
        </div>
        <p className="text-base text-foreground/80">{`"${text}"`}</p>
      </CardContent>
    </Card>
  );
}
