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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';


export function FaqSection({ content }: { content: any }) {
  if (!content) return null;
  return (
    <section id="faq" className="py-16 md:py-28 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-headline text-primary">
            {content.faqTitle}
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {content.faqs.map((faq: any, index: number) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b-0 rounded-lg shadow-md bg-secondary transition-all hover:bg-secondary/80">
              <AccordionTrigger className="text-left text-lg md:text-xl font-semibold p-6 text-secondary-foreground rounded-lg hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground p-6 pt-0 text-base bg-secondary rounded-b-lg">
                <p className="text-secondary-foreground/80">{faq.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
