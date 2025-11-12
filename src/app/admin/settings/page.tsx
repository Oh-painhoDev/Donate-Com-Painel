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
'use client';
import { useDoc, useMemoFirebase, setDocumentNonBlocking, useFirestore } from '@/firebase/hooks';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash, Palette, LayoutTemplate, Heart, Sparkles, Image as ImageIcon, MessageSquareQuote, HelpCircle, Footprints, Newspaper, Bot } from 'lucide-react';
import { initialPageContent } from '@/lib/initial-data';
import { updateNews } from '@/ai/flows/update-news-flow';


const donationOptionSchema = z.object({
  amount: z.number().positive({ message: "O valor deve ser positivo."}),
  description: z.string().min(1, { message: "A descrição é obrigatória." }),
});

const newsItemSchema = z.object({
  title: z.string().min(1, { message: "O título é obrigatório." }),
  source: z.string().min(1, { message: "A fonte é obrigatória." }),
  url: z.string().url({ message: "URL inválida." }),
});

const impactSchema = z.object({
  amount: z.string().min(1, { message: "A quantidade é obrigatória." }),
  description: z.string().min(1, { message: "A descrição é obrigatória." }),
});

const testimonialSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório." }),
  text: z.string().min(1, { message: "O texto é obrigatório." }),
});

const faqSchema = z.object({
  q: z.string().min(1, { message: "A pergunta é obrigatória." }),
  a: z.string().min(1, { message: "A resposta é obrigatória." }),
});

const colorSchema = z.object({
  primary: z.string().regex(/^(\d{1,3})\s(\d{1,3}%)\s(\d{1,3}%)$/, { message: "Formato HSL inválido. Ex: 150 50% 25%" }),
  secondary: z.string().regex(/^(\d{1,3})\s(\d{1,3}%)\s(\d{1,3}%)$/, { message: "Formato HSL inválido. Ex: 150 45% 90%" }),
  accent: z.string().regex(/^(\d{1,3})\s(\d{1,3}%)\s(\d{1,3}%)$/, { message: "Formato HSL inválido. Ex: 14 100% 55%" }),
  background: z.string().regex(/^(\d{1,3})\s(\d{1,3}%)\s(\d{1,3}%)$/, { message: "Formato HSL inválido. Ex: 220 13% 98%" }),
});


const pageContentSchema = z.object({
  colors: colorSchema,
  pageTitle: z.string().min(1, { message: "O título da página é obrigatório." }),
  logoImageUrl: z.string().url({ message: "URL do logo inválida." }),
  headerText: z.string().min(1, { message: "O texto principal é obrigatório." }),
  headerSubText: z.string(),
  headerImageUrl: z.string().url({ message: "URL da imagem de fundo inválida." }),
  donationOptions: z.array(donationOptionSchema),
  customDonationText: z.string().min(1, { message: "O texto é obrigatório." }),
  newsTitle: z.string().min(1, { message: "O título da seção é obrigatório." }),
  newsItems: z.array(newsItemSchema),
  impactVisualizerTitle: z.string().min(1, { message: "O título é obrigatório." }),
  impactVisualizerSubText: z.string(),
  impacts: z.array(impactSchema),
  aboutTitle: z.string().min(1, { message: "O título é obrigatório." }),
  aboutSubTitle: z.string(),
  aboutText: z.string().min(1, { message: "O texto é obrigatório." }),
  aboutImageUrl: z.string().url({ message: "URL da imagem inválida." }),
  credibilityTitle: z.string().min(1, { message: "O título é obrigatório." }),
  testimonials: z.array(testimonialSchema),
  faqTitle: z.string().min(1, { message: "O título é obrigatório." }),
  faqs: z.array(faqSchema),
  footerLinksTitle: z.string(),
  footerContactTitle: z.string(),
  footerContactEmail: z.string().email({ message: "Email de contato inválido." }),
  footerContactAddress: z.string(),
  footerRightsText: z.string(),
  footerMadeByText: z.string(),
  footerMadeByLink: z.string().url({ message: "Link inválido." }),
});

type PageContentForm = z.infer<typeof pageContentSchema>;

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isUpdatingNews, setIsUpdatingNews] = useState(false);

  const contentRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'pageContent', 'landingPage');
  }, [firestore]);

  const { data: pageContent, isLoading } = useDoc<PageContentForm>(contentRef);
  
  const defaultValues = pageContent ?? initialPageContent;

  const { control, register, handleSubmit, reset, getValues, formState: { isDirty, errors } } = useForm<PageContentForm>({
    resolver: zodResolver(pageContentSchema),
    defaultValues: defaultValues,
  });

  const { fields: donationOptionFields, append: appendDonationOption, remove: removeDonationOption } = useFieldArray({ control, name: "donationOptions" });
  const { fields: newsItemFields, append: appendNewsItem, remove: removeNewsItem, replace: replaceNewsItems } = useFieldArray({ control, name: "newsItems" });
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
    toast({ title: 'Sucesso!', description: 'Conteúdo da página salvo com sucesso.' });
  };
  
  const handleUpdateNews = async () => {
    setIsUpdatingNews(true);
    toast({ title: 'Aguarde...', description: 'Atualizando notícias com Inteligência Artificial.' });
    try {
      const topic = "desastre do tornado em Rio Bonito do Iguaçu, Paraná";
      const result = await updateNews({ topic });
      if (result && result.newsItems) {
        replaceNewsItems(result.newsItems);
        const currentData = getValues();
        currentData.newsItems = result.newsItems;
        if (contentRef) {
          setDocumentNonBlocking(contentRef, currentData, { merge: true });
        }
        toast({ title: 'Sucesso!', description: 'Notícias foram atualizadas e salvas.' });
      } else {
        throw new Error('A resposta da IA não continha notícias.');
      }
    } catch (error) {
      console.error("Failed to update news with AI:", error);
      toast({ variant: 'destructive', title: 'Erro de IA', description: 'Não foi possível atualizar as notícias no momento.' });
    } finally {
      setIsUpdatingNews(false);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        <Card id="colors" className="scroll-mt-24 shadow-sm">
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

        <Card id="header" className="scroll-mt-24 shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-3"><LayoutTemplate className="text-primary"/> Seção do Cabeçalho</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Título da Página (Aba do Navegador)</Label><Input {...register('pageTitle')} /><p className="text-destructive text-sm mt-1">{errors.pageTitle?.message}</p></div>
              <div><Label>URL da Imagem do Logo</Label><Input type="url" {...register('logoImageUrl')} /><p className="text-destructive text-sm mt-1">{errors.logoImageUrl?.message}</p></div>
            </div>
            <div><Label>Texto Principal</Label><Input {...register('headerText')} /><p className="text-destructive text-sm mt-1">{errors.headerText?.message}</p></div>
            <div><Label>Subtexto</Label><Textarea {...register('headerSubText')} /></div>
            <div><Label>URL da Imagem de Fundo</Label><Input type="url" {...register('headerImageUrl')} /><p className="text-destructive text-sm mt-1">{errors.headerImageUrl?.message}</p></div>
          </CardContent>
        </Card>

        <Card id="donation" className="scroll-mt-24 shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-3"><Heart className="text-primary"/> Opções de Doação</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {donationOptionFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg bg-card">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                    <div><Label>Valor (número)</Label><Input type="number" {...register(`donationOptions.${index}.amount`, { valueAsNumber: true })} /><p className="text-destructive text-sm mt-1">{errors.donationOptions?.[index]?.amount?.message}</p></div>
                    <div><Label>Descrição</Label><Input {...register(`donationOptions.${index}.description`)} /><p className="text-destructive text-sm mt-1">{errors.donationOptions?.[index]?.description?.message}</p></div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeDonationOption(index)}><Trash className="h-4 w-4"/></Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={() => appendDonationOption({ amount: 0, description: '' })}>Adicionar Opção</Button>
            <div><Label>Texto para Doação Customizada</Label><Input {...register('customDonationText')} /><p className="text-destructive text-sm mt-1">{errors.customDonationText?.message}</p></div>
          </CardContent>
        </Card>

        <Card id="news" className="scroll-mt-24 shadow-sm">
          <CardHeader>
             <div className="flex flex-wrap items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-3"><Newspaper className="text-primary"/> Seção de Notícias</CardTitle>
                <Button type="button" variant="outline" onClick={handleUpdateNews} disabled={isUpdatingNews}>
                    <Bot className="mr-2 h-4 w-4" />
                    {isUpdatingNews ? 'Atualizando...' : 'Atualizar Notícias com IA'}
                </Button>
             </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Título da Seção</Label><Input {...register('newsTitle')} /><p className="text-destructive text-sm mt-1">{errors.newsTitle?.message}</p></div>
            <Label>Itens de Notícia</Label>
            <div className="space-y-4">
              {newsItemFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg bg-card">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                    <div><Label>Título da Notícia</Label><Input {...register(`newsItems.${index}.title`)} /><p className="text-destructive text-sm mt-1">{errors.newsItems?.[index]?.title?.message}</p></div>
                    <div><Label>Fonte (ex: G1)</Label><Input {...register(`newsItems.${index}.source`)} /><p className="text-destructive text-sm mt-1">{errors.newsItems?.[index]?.source?.message}</p></div>
                    <div><Label>URL do Link</Label><Input type="url" {...register(`newsItems.${index}.url`)} /><p className="text-destructive text-sm mt-1">{errors.newsItems?.[index]?.url?.message}</p></div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeNewsItem(index)}><Trash className="h-4 w-4"/></Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={() => appendNewsItem({ title: '', source: '', url: 'https://' })}>Adicionar Notícia Manualmente</Button>
          </CardContent>
        </Card>

        <Card id="impact" className="scroll-mt-24 shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-3"><Sparkles className="text-primary"/> Visualizador de Impacto</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Título</Label><Input {...register('impactVisualizerTitle')} /><p className="text-destructive text-sm mt-1">{errors.impactVisualizerTitle?.message}</p></div>
            <div><Label>Subtexto</Label><Textarea {...register('impactVisualizerSubText')} /></div>
             <Label>Itens de Impacto</Label>
             <div className="space-y-4">
               {impactFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg bg-card">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                    <div><Label>Número/Quantidade</Label><Input {...register(`impacts.${index}.amount`)} /><p className="text-destructive text-sm mt-1">{errors.impacts?.[index]?.amount?.message}</p></div>
                    <div><Label>Descrição</Label><Input {...register(`impacts.${index}.description`)} /><p className="text-destructive text-sm mt-1">{errors.impacts?.[index]?.description?.message}</p></div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeImpact(index)}><Trash className="h-4 w-4"/></Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={() => appendImpact({ amount: '', description: '' })}>Adicionar Impacto</Button>
          </CardContent>
        </Card>

        <Card id="about" className="scroll-mt-24 shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-3"><ImageIcon className="text-primary"/> Seção "Sobre"</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Título</Label><Input {...register('aboutTitle')} /><p className="text-destructive text-sm mt-1">{errors.aboutTitle?.message}</p></div>
            <div><Label>Subtítulo</Label><Input {...register('aboutSubTitle')} /></div>
            <div><Label>Texto</Label><Textarea {...register('aboutText')} /><p className="text-destructive text-sm mt-1">{errors.aboutText?.message}</p></div>
            <div><Label>URL da Imagem</Label><Input type="url" {...register('aboutImageUrl')} /><p className="text-destructive text-sm mt-1">{errors.aboutImageUrl?.message}</p></div>
          </CardContent>
        </Card>

         <Card id="credibility" className="scroll-mt-24 shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-3"><MessageSquareQuote className="text-primary"/> Seção de Depoimentos</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Título</Label><Input {...register('credibilityTitle')} /><p className="text-destructive text-sm mt-1">{errors.credibilityTitle?.message}</p></div>
            <Label>Depoimentos</Label>
            <div className="space-y-4">
               {testimonialFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg bg-card">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                    <div><Label>Nome</Label><Input {...register(`testimonials.${index}.name`)} /><p className="text-destructive text-sm mt-1">{errors.testimonials?.[index]?.name?.message}</p></div>
                    <div><Label>Texto do Depoimento</Label><Textarea {...register(`testimonials.${index}.text`)} /><p className="text-destructive text-sm mt-1">{errors.testimonials?.[index]?.text?.message}</p></div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeTestimonial(index)}><Trash className="h-4 w-4"/></Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={() => appendTestimonial({ name: '', text: '' })}>Adicionar Depoimento</Button>
          </CardContent>
        </Card>

        <Card id="faq" className="scroll-mt-24 shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-3"><HelpCircle className="text-primary"/> Perguntas Frequentes (FAQ)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Título</Label><Input {...register('faqTitle')} /><p className="text-destructive text-sm mt-1">{errors.faqTitle?.message}</p></div>
            <Label>Perguntas e Respostas</Label>
             <div className="space-y-4">
               {faqFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg bg-card">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                    <div><Label>Pergunta</Label><Input {...register(`faqs.${index}.q`)} /><p className="text-destructive text-sm mt-1">{errors.faqs?.[index]?.q?.message}</p></div>
                    <div><Label>Resposta</Label><Textarea {...register(`faqs.${index}.a`)} /><p className="text-destructive text-sm mt-1">{errors.faqs?.[index]?.a?.message}</p></div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeFaq(index)}><Trash className="h-4 w-4"/></Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={() => appendFaq({ q: '', a: '' })}>Adicionar Pergunta</Button>
          </CardContent>
        </Card>

        <Card id="footer" className="scroll-mt-24 shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-3"><Footprints className="text-primary"/> Rodapé</CardTitle></CardHeader>
          <CardContent className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Título Links</Label><Input {...register('footerLinksTitle')} /></div>
            <div><Label>Título Contato</Label><Input {...register('footerContactTitle')} /></div>
            <div><Label>Email de Contato</Label><Input type="email" {...register('footerContactEmail')} /><p className="text-destructive text-sm mt-1">{errors.footerContactEmail?.message}</p></div>
            <div><Label>Endereço / Contato Secundário</Label><Input {...register('footerContactAddress')} /></div>
            <div><Label>Texto de Direitos Autorais</Label><Input {...register('footerRightsText')} /></div>
            <div><Label>Texto "Feito por"</Label><Input {...register('footerMadeByText')} /></div>
            <div><Label>Link "Feito por"</Label><Input type="url" {...register('footerMadeByLink')} /><p className="text-destructive text-sm mt-1">{errors.footerMadeByLink?.message}</p></div>
          </CardContent>
        </Card>

        <div className="flex justify-end sticky bottom-0 -mx-8 -mb-8 p-4 bg-background/95 backdrop-blur-sm border-t z-50">
          <Button type="submit" size="lg" disabled={!isDirty && !isUpdatingNews}>
            {isUpdatingNews ? 'Salvando...' : (isDirty ? 'Salvar Todas as Alterações' : 'Tudo Salvo!')}
          </Button>
        </div>
      </form>
  );
}
