import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'Como confirmar se minha doação foi recebida?',
    a: 'Ao doar via PIX, a confirmação é quase instantânea. Você pode opcionalmente preencher um formulário após a doação para receber um recibo por e-mail como comprovante.',
  },
  {
    q: 'Recebo algum recibo da minha doação?',
    a: 'Sim! Após a doação, haverá um link opcional para um formulário onde você pode inserir seu e-mail e CPF/CNPJ para receber um recibo oficial.',
  },
  {
    q: 'Posso doar de qualquer banco ou carteira digital?',
    a: 'Sim. Qualquer instituição financeira que opera com o sistema PIX pode ser usada para fazer a doação, seja banco tradicional ou digital.',
  },
  {
    q: 'Minha doação é dedutível do Imposto de Renda?',
    a: 'Sim. Esta campanha está enquadrada na Lei de Incentivo à Doação, permitindo que pessoas físicas e jurídicas possam abater parte do valor doado.',
  },
  {
    q: 'Como posso ter certeza do destino do meu dinheiro?',
    a: 'Publicaremos relatórios de prestação de contas quinzenalmente nesta página, com total transparência sobre os valores arrecadados e onde foram aplicados.',
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
            Perguntas Frequentes
          </h2>
          <p className="mt-2 text-muted-foreground">
            Tire suas dúvidas sobre a doação via PIX.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-semibold">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
