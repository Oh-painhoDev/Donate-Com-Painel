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
    a: 'Para que você e sua empresa possam apoiar nossos projetos, envie um e-mail para comunicacao@savebrasil.org.br, informando seu interesse e descrevendo brevemente sobre os serviços prestados pelo seu negócio e sua ideia de projeto e ou parceria.'
  },
  {
    q: 'Sou Amigo SAVE e gostaria de atualizar meus dados, como posso fazer?',
    a: 'Você precisa entrar em contato com a nossa equipe através do e-mail amigos@savebrasil.org.br para que possamos atualizar seus dados (endereço, e-mail, telefone, etc) em nosso sistema.'
  },
  {
    q: 'Não posso doar agora, a SAVE Brasil possui programa de voluntariado?',
    a: 'Sim! A SAVE divulga durante todo o ano a abertura para os programas de voluntariado em nossos projetos, mas caso queira entrar em contato direto conosco é só encaminhar um e-mail para aves@savebrasil.org.br.'
  }
];

export function FaqSection() {
  return (
    <section id="faq" className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
            Perguntas Frequentes
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="mb-2">
              <AccordionTrigger className="text-left font-semibold text-lg p-4 bg-accent text-accent-foreground rounded-lg hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground p-4 bg-white rounded-b-lg">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
