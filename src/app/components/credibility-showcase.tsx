import {
  Card,
  CardContent,
} from '@/components/ui/card';

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
    text: 'Se a observação de aves foi uma janela que se abriu na minha vida, para uma vista linda, fazer parte do Grupo de amigos da SAVE foi multiplicar essas janelas e conviver com gente que ama olhar através delas, se encanta e compartilha a sua visão. É oportunidade de aprendizado com os melhores, é crescimento, é troca. E sobretudo é um alento nesse momento atual tão difícil. Ver gente tão comprometida e trabalhando com afinco para a proteção das aves e da natureza me alegra o coração e estimula na mesma direção.'
  }
];

export function CredibilityShowcase() {

  return (
    <section id="depoimentos" className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
            Depoimentos
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

function TestimonialCard({ name, text }: { name: string; text: string }) {
  return (
    <Card className="overflow-hidden group shadow-lg bg-accent text-accent-foreground rounded-3xl">
      <CardContent className="p-6">
        <p className="font-bold text-xl mb-4">{name}</p>
        <p className="text-sm">{text}</p>
      </CardContent>
    </Card>
  );
}
