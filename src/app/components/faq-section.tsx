import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'Como se tornar um Amigo SAVE?',
    a: 'Para se tornar um Amigo SAVE, você deve clicar em “doar” para efetuar sua contribuição. Através da sua participação, poderemos desenvolver nossos projetos e continuar ajudando na preservação de diversas espécies de aves, seus habitats e biomas brasileiros.',
  },
  {
    q: 'A partir de quantos reais mensais viro um Amigo SAVE?',
    a: 'A partir de R$240,00 ao ano e o mesmo que R$20,00 ao mês.',
  },
  {
    q: 'Qual o valor mínimo de doação?',
    a: 'A partir de R$80,00 você já estará auxiliando em nossa missão de preservação ambiental.',
  },
  {
    q: 'Sou ex-doador ou ex-Amigo SAVE, posso voltar a doar?',
    a: 'Sim! Nós, da SAVE Brasil ficamos contentes com seu retorno, mas para isso, é importante que você refaça o seu cadastro de doação, escolhendo se será um doador pontual ou um Amigo Save, para usufruir de todos os benefícios.',
  },
   {
    q: 'Como saber se minha doação está ativa?',
    a: 'Entre em contato conosco através do e-mail amigos@savebrasil.org.br, que verificaremos em nosso sistema o status da sua doação.',
  },
  {
    q: 'Sou empresa e quero contribuir, posso ser um parceiro?',
    a: 'Para que você e sua empresa possam apoiar nossos projetos, envie um e-mail para comunicacao@savebrasil.org.br, informando seu interesse e descrevendo brevemente sobre os serviços prestados pelo seu negócio e sua ideia de projeto e ou parceria.',
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-headline text-primary">
            Perguntas Frequentes
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b-0">
              <AccordionTrigger className="text-left text-lg md:text-xl font-semibold p-6 bg-accent/80 text-primary rounded-lg hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground p-6 text-base bg-accent/20 rounded-b-lg">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
