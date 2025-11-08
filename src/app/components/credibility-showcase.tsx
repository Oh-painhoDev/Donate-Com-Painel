import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const testimonials = [
  {
    name: 'Silvia Linhares',
    text: 'Ser amiga da SAVE significa ter encontrado um caminho para ajudar a nossa natureza a sobreviver. Acredito nas pessoas que estão na direção. Elas estão dando o seu melhor e eu me orgulho de contribuir. A SAVE me representa e sinto feliz de fazer parte de qualquer forma. Parabéns a todos que fazem a SAVE.'
  },
  {
    name: 'Nailson Junior',
    text: 'Ser amigo da SAVE é saber que você está contribuindo de forma direta para a conversação de uma natureza muito destruída pelo ser humano. Você ajuda na conservação de espécies extremamente ameaçadas e que correm um risco alto de deixarem de existir. Você consegue fazer algo para que seus filhos e netos possam ver o que você viu.'
  },
  {
    name: 'Gersony Jovchelevich',
    text: 'Se a observação de aves foi uma janela que se abriu na minha vida, para uma vista linda, fazer parte do Grupo de amigos da SAVE foi multiplicar essas janelas e conviver com gente que ama olhar através delas, se encanta e compartilha a sua visão. É oportunidade de aprendizado com os melhores, é crescimento, é troca.'
  }
];

export function CredibilityShowcase() {

  return (
    <section id="depoimentos" className="py-16 md:py-28 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-headline text-primary">
            Depoimentos de Amigos da SAVE
          </h2>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
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
