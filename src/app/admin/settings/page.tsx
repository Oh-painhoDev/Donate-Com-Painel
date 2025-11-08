'use client';
import { useAuth, useDoc, useMemoFirebase, setDocumentNonBlocking, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc } from 'firebase/firestore';
import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash, Palette, LayoutTemplate, Heart, Sparkles, Image as ImageIcon, MessageSquareQuote, HelpCircle, Footprints, Newspaper } from 'lucide-react';
import { initialPageContent } from '@/lib/initial-data';


const donationOptionSchema = z.object({
  amount: z.number(),
  description: z.string(),
});

const newsItemSchema = z.object({
  title: z.string(),
  source: z.string(),
  url: z.string().url(),
});

const impactSchema = z.object({
  amount: z.string(),
  description: z.string(),
});

const testimonialSchema = z.object({
  name: z.string(),
  text: z.string(),
});

const faqSchema = z.object({
  q: z.string(),
  a: z.string(),
});

const colorSchema = z.object({
  primary: z.string().regex(/^(\d{1,3})\s(\d{1,3}%)\s(\d{1,3}%)$/, { message: "Formato HSL inválido. Ex: 150 50% 25%" }),
  secondary: z.string().regex(/^(\d{1,3})\s(\d{1,3}%)\s(\d{1,3}%)$/, { message: "Formato HSL inválido. Ex: 150 45% 90%" }),
  accent: z.string().regex(/^(\d{1,3})\s(\d{1,3}%)\s(\d{1,3}%)$/, { message: "Formato HSL inválido. Ex: 14 100% 55%" }),
  background: z.string().regex(/^(\d{1,3})\s(\d{1,3}%)\s(\d{1,3}%)$/, { message: "Formato HSL inválido. Ex: 220 13% 98%" }),
});


const pageContentSchema = z.object({
  colors: colorSchema,
  pageTitle: z.string(),
  logoImageUrl: z.string().url(),
  headerText: z.string(),
  headerSubText: z.string(),
  headerImageUrl: z.string().url(),
  donationOptions: z.array(donationOptionSchema),
  customDonationText: z.string(),
  newsTitle: z.string(),
  newsItems: z.array(newsItemSchema),
  impactVisualizerTitle: z.string(),
  impactVisualizerSubText: z.string(),
  impacts: z.array(impactSchema),
  aboutTitle: z.string(),
  aboutSubTitle: z.string(),
  aboutText: z.string(),
  aboutImageUrl: z.string().url(),
  credibilityTitle: z.string(),
  testimonials: z.array(testimonialSchema),
  faqTitle: z.string(),
  faqs: z.array(faqSchema),
  footerLinksTitle: z.string(),
  footerContactTitle: z.string(),
  footerContactEmail: z.string().email(),
  footerContactAddress: z.string(),
  footerRightsText: z.string(),
  footerMadeByText: z.string(),
  footerMadeByLink: z.string().url(),
});

type PageContentForm = z.infer<typeof pageContentSchema>;

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const contentRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'pageContent', 'landingPage');
  }, [firestore]);

  const { data: pageContent, isLoading } = useDoc<PageContentForm>(contentRef);
  
  const defaultValues = pageContent ?? initialPageContent;

  const { control, register, handleSubmit, reset, formState: { isDirty, errors } } = useForm<PageContentForm>({
    resolver: zodResolver(pageContentSchema),
    defaultValues: defaultValues,
  });

  const { fields: donationOptionFields, append: appendDonationOption, remove: removeDonationOption } = useFieldArray({ control, name: "donationOptions" });
  const { fields: newsItemFields, append: appendNewsItem, remove: removeNewsItem } = useFieldArray({ control, name: "newsItems" });
  const { fields: impactFields, append: appendImpact, remove: removeImpact } = useFieldArray({ control, name: "impacts" });
  const { fields: testimonialFields, append: appendTestimonial, remove: removeTestimonial } = useFieldArray({ control, name: "testimonials" });
  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({ control, name: "faqs" });

  useEffect(() => {
    if (pageContent) {
      reset(pageContent);
    } else if(!isLoading) {
      reset(initialPageContent);
    }
  }, [pageContent, reset, isLoading]);

  const onSubmit = (data: PageContentForm) => {
    if (!contentRef) return;
    setDocumentNonBlocking(contentRef, data, { merge: true });
    toast({ title: 'Sucesso!', description: 'Conteúdo da página salvo.' });
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        <Card id="colors" className="scroll-mt-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><Palette className="text-primary"/> Aparência e Cores</CardTitle>
            <CardDescription>Edite as cores principais do site. Use o formato HSL (ex: "150 50% 25%").</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><Label>Primária</Label><Input {...register('colors.primary')} /><p className="text-destructive text-sm mt-1">{errors.colors?.primary?.message}</p></div>
              <div><Label>Secundária</Label><Input {...register('colors.secondary')} /><p className="text-destructive text-sm mt-1">{errors.colors?.secondary?.message}</p></div>
              <div><Label>Destaque (Accent)</Label><Input {...register('colors.accent')} /><p className="text-destructive text-sm mt-1">{errors.colors?.accent?.message}</p></div>
              <div><Label>Fundo (Background)</Label><Input {...register('colors.background')} /><p className="text-destructive text-sm mt-1">{errors.colors?.background?.message}</p></div>
            </div>
          </CardContent>
        </Card>

        <Card id="header" className="scroll-mt-20">
          <CardHeader><CardTitle className="flex items-center gap-3"><LayoutTemplate className="text-primary"/> Seção do Cabeçalho</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Título da Página (Aba do Navegador)</Label><Input {...register('pageTitle')} /></div>
              <div><Label>URL da Imagem do Logo</Label><Input type="url" {...register('logoImageUrl')} /></div>
            </div>
            <div><Label>Texto Principal</Label><Input {...register('headerText')} /></div>
            <div><Label>Subtexto</Label><Textarea {...register('headerSubText')} /></div>
            <div><Label>URL da Imagem de Fundo</Label><Input type="url" {...register('headerImageUrl')} /></div>
          </CardContent>
        </Card>

        <Card id="donation" className="scroll-mt-20">
          <CardHeader><CardTitle className="flex items-center gap-3"><Heart className="text-primary"/> Opções de Doação</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {donationOptionFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg bg-background">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                    <div><Label>Valor (número)</Label><Input type="number" {...register(`donationOptions.${index}.amount`, { valueAsNumber: true })} /></div>
                    <div><Label>Descrição</Label><Input {...register(`donationOptions.${index}.description`)} /></div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeDonationOption(index)}><Trash className="h-4 w-4"/></Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={() => appendDonationOption({ amount: 0, description: '' })}>Adicionar Opção</Button>
            <div><Label>Texto para Doação Customizada</Label><Input {...register('customDonationText')} /></div>
          </CardContent>
        </Card>

        <Card id="news" className="scroll-mt-20">
          <CardHeader><CardTitle className="flex items-center gap-3"><Newspaper className="text-primary"/> Seção de Notícias</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Título da Seção</Label><Input {...register('newsTitle')} /></div>
            <Label>Itens de Notícia</Label>
            <div className="space-y-4">
              {newsItemFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg bg-background">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                    <div><Label>Título da Notícia</Label><Input {...register(`newsItems.${index}.title`)} /></div>
                    <div><Label>Fonte (ex: G1)</Label><Input {...register(`newsItems.${index}.source`)} /></div>
                    <div><Label>URL do Link</Label><Input type="url" {...register(`newsItems.${index}.url`)} /></div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeNewsItem(index)}><Trash className="h-4 w-4"/></Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={() => appendNewsItem({ title: '', source: '', url: '' })}>Adicionar Notícia</Button>
          </CardContent>
        </Card>

        <Card id="impact" className="scroll-mt-20">
          <CardHeader><CardTitle className="flex items-center gap-3"><Sparkles className="text-primary"/> Visualizador de Impacto</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Título</Label><Input {...register('impactVisualizerTitle')} /></div>
            <div><Label>Subtexto</Label><Textarea {...register('impactVisualizerSubText')} /></div>
             <Label>Itens de Impacto</Label>
             <div className="space-y-4">
               {impactFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg bg-background">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                    <div><Label>Número/Quantidade</Label><Input {...register(`impacts.${index}.amount`)} /></div>
                    <div><Label>Descrição</Label><Input {...register(`impacts.${index}.description`)} /></div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeImpact(index)}><Trash className="h-4 w-4"/></Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={() => appendImpact({ amount: '', description: '' })}>Adicionar Impacto</Button>
          </CardContent>
        </Card>

        <Card id="about" className="scroll-mt-20">
          <CardHeader><CardTitle className="flex items-center gap-3"><ImageIcon className="text-primary"/> Seção "Sobre"</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Título</Label><Input {...register('aboutTitle')} /></div>
            <div><Label>Subtítulo</Label><Input {...register('aboutSubTitle')} /></div>
            <div><Label>Texto</Label><Textarea {...register('aboutText')} /></div>
            <div><Label>URL da Imagem</Label><Input type="url" {...register('aboutImageUrl')} /></div>
          </CardContent>
        </Card>

         <Card id="credibility" className="scroll-mt-20">
          <CardHeader><CardTitle className="flex items-center gap-3"><MessageSquareQuote className="text-primary"/> Seção de Depoimentos</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Título</Label><Input {...register('credibilityTitle')} /></div>
            <Label>Depoimentos</Label>
            <div className="space-y-4">
               {testimonialFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg bg-background">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                    <div><Label>Nome</Label><Input {...register(`testimonials.${index}.name`)} /></div>
                    <div><Label>Texto do Depoimento</Label><Textarea {...register(`testimonials.${index}.text`)} /></div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeTestimonial(index)}><Trash className="h-4 w-4"/></Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={() => appendTestimonial({ name: '', text: '' })}>Adicionar Depoimento</Button>
          </CardContent>
        </Card>

        <Card id="faq" className="scroll-mt-20">
          <CardHeader><CardTitle className="flex items-center gap-3"><HelpCircle className="text-primary"/> Perguntas Frequentes (FAQ)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Título</Label><Input {...register('faqTitle')} /></div>
            <Label>Perguntas e Respostas</Label>
             <div className="space-y-4">
               {faqFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg bg-background">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                    <div><Label>Pergunta</Label><Input {...register(`faqs.${index}.q`)} /></div>
                    <div><Label>Resposta</Label><Textarea {...register(`faqs.${index}.a`)} /></div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeFaq(index)}><Trash className="h-4 w-4"/></Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={() => appendFaq({ q: '', a: '' })}>Adicionar Pergunta</Button>
          </CardContent>
        </Card>

        <Card id="footer" className="scroll-mt-20">
          <CardHeader><CardTitle className="flex items-center gap-3"><Footprints className="text-primary"/> Rodapé</CardTitle></CardHeader>
          <CardContent className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Título Links</Label><Input {...register('footerLinksTitle')} /></div>
            <div><Label>Título Contato</Label><Input {...register('footerContactTitle')} /></div>
            <div><Label>Email de Contato</Label><Input type="email" {...register('footerContactEmail')} /></div>
            <div><Label>Endereço / Contato Secundário</Label><Input {...register('footerContactAddress')} /></div>
            <div><Label>Texto de Direitos Autorais</Label><Input {...register('footerRightsText')} /></div>
            <div><Label>Texto "Feito por"</Label><Input {...register('footerMadeByText')} /></div>
            <div><Label>Link "Feito por"</Label><Input type="url" {...register('footerMadeByLink')} /></div>
          </CardContent>
        </Card>

        <div className="flex justify-end sticky bottom-0 -mx-8 -mb-8 p-4 bg-background/80 backdrop-blur-sm border-t">
          <Button type="submit" size="lg" disabled={!isDirty}>
            {isDirty ? 'Salvar Alterações' : 'Salvo'}
          </Button>
        </div>
      </form>
  );
}
