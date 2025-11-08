import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'Como posso ter certeza de que minha doação chegará às vítimas?',
    a: 'Trabalhamos em parceria com defesas civis e organizações locais de confiança no Paraná para garantir que todas as doações sejam distribuídas de forma transparente e eficiente para as famílias mais necessitadas.',
  },
  {
    q: 'Quais itens são mais necessários neste momento?',
    a: 'As maiores necessidades são alimentos não perecíveis, água potável, produtos de higiene pessoal, roupas, cobertores e materiais de limpeza. Sua doação em dinheiro nos permite comprar esses itens em grande quantidade e de acordo com a demanda.',
  },
  {
    q: 'Posso doar itens físicos em vez de dinheiro?',
    a: 'No momento, estamos focados na arrecadação financeira para otimizar a logística e comprar os itens mais urgentes diretamente nas regiões afetadas. Para doações de itens, por favor, procure os pontos de coleta oficiais da Defesa Civil em sua cidade.',
  },
  {
    q: 'Como posso me voluntariar para ajudar?',
    a: 'Agradecemos imensamente seu interesse! O trabalho voluntário está sendo coordenado pelas autoridades locais. Por favor, entre em contato com a Defesa Civil do seu município para se cadastrar e saber como ajudar presencialmente.',
  },
  {
    q: 'Minha empresa gostaria de fazer uma grande doação. Como proceder?',
    a: 'Para doações corporativas ou parcerias, por favor, entre em contato através do e-mail sosparana@email.com para que nossa equipe possa dar o suporte necessário e alinhar os detalhes da colaboração.',
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
              <AccordionTrigger className="text-left text-lg md:text-xl font-semibold p-6 bg-secondary text-primary rounded-lg hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground p-6 text-base bg-secondary/50 rounded-b-lg">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
