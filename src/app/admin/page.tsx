'use client';
import { useAuth, useDoc, useMemoFirebase, setDocumentNonBlocking, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc } from 'firebase/firestore';
import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash } from 'lucide-react';

const donationOptionSchema = z.object({
  amount: z.number(),
  description: z.string(),
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

const pageContentSchema = z.object({
  pageTitle: z.string(),
  headerText: z.string(),
  headerSubText: z.string(),
  headerImageUrl: z.string().url(),
  donationOptions: z.array(donationOptionSchema),
  customDonationText: z.string(),
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
});

type PageContentForm = z.infer<typeof pageContentSchema>;

export default function AdminPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();

  const contentRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'pageContent', 'landingPage');
  }, [firestore]);

  const { data: pageContent, isLoading } = useDoc<PageContentForm>(contentRef);

  const { control, register, handleSubmit, reset, formState: { isDirty } } = useForm<PageContentForm>({
    resolver: zodResolver(pageContentSchema),
    defaultValues: pageContent ?? undefined,
  });

  const { fields: donationOptionFields, append: appendDonationOption, remove: removeDonationOption } = useFieldArray({ control, name: "donationOptions" });
  const { fields: impactFields, append: appendImpact, remove: removeImpact } = useFieldArray({ control, name: "impacts" });
  const { fields: testimonialFields, append: appendTestimonial, remove: removeTestimonial } = useFieldArray({ control, name: "testimonials" });
  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({ control, name: "faqs" });

  useEffect(() => {
    if (pageContent) {
      reset(pageContent);
    }
  }, [pageContent, reset]);

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/admin/login');
  };

  const onSubmit = (data: PageContentForm) => {
    if (!contentRef) return;
    setDocumentNonBlocking(contentRef, data, { merge: true });
    toast({ title: 'Sucesso!', description: 'Conteúdo da página salvo.' });
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Carregando conteúdo...</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Painel de Administração</h1>
        <Button onClick={handleSignOut} variant="outline">Sair</Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* Header Section */}
        <Card>
          <CardHeader><CardTitle>Cabeçalho</CardTitle></CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div><Label>Título da Página (Aba do Navegador)</Label><Input {...register('pageTitle')} /></div>
            <div><Label>Texto Principal</Label><Input {...register('headerText')} /></div>
            <div><Label>Subtexto</Label><Textarea {...register('headerSubText')} /></div>
            <div><Label>URL da Imagem de Fundo</Label><Input type="url" {...register('headerImageUrl')} /></div>
          </CardContent>
        </Card>

        {/* Donation Section */}
        <Card>
          <CardHeader><CardTitle>Opções de Doação</CardTitle></CardHeader>
          <CardContent className="space-y-4 pt-4">
            {donationOptionFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg">
                <div className="grid-cols-2 gap-4 grid flex-grow">
                  <div><Label>Valor (número)</Label><Input type="number" {...register(`donationOptions.${index}.amount`, { valueAsNumber: true })} /></div>
                  <div><Label>Descrição</Label><Input {...register(`donationOptions.${index}.description`)} /></div>
                </div>
                <Button type="button" variant="destructive" size="icon" onClick={() => removeDonationOption(index)}><Trash/></Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => appendDonationOption({ amount: 0, description: '' })}>Adicionar Opção</Button>
            <div><Label>Texto para Doação Customizada</Label><Input {...register('customDonationText')} /></div>
          </CardContent>
        </Card>

        {/* Impact Section */}
        <Card>
          <CardHeader><CardTitle>Visualizador de Impacto</CardTitle></CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div><Label>Título</Label><Input {...register('impactVisualizerTitle')} /></div>
            <div><Label>Subtexto</Label><Textarea {...register('impactVisualizerSubText')} /></div>
             {impactFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg">
                <div className="grid-cols-2 gap-4 grid flex-grow">
                  <div><Label>Número/Quantidade</Label><Input {...register(`impacts.${index}.amount`)} /></div>
                  <div><Label>Descrição</Label><Input {...register(`impacts.${index}.description`)} /></div>
                </div>
                <Button type="button" variant="destructive" size="icon" onClick={() => removeImpact(index)}><Trash/></Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => appendImpact({ amount: '', description: '' })}>Adicionar Impacto</Button>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader><CardTitle>Seção "Sobre"</CardTitle></CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div><Label>Título</Label><Input {...register('aboutTitle')} /></div>
            <div><Label>Subtítulo</Label><Input {...register('aboutSubTitle')} /></div>
            <div><Label>Texto</Label><Textarea {...register('aboutText')} /></div>
            <div><Label>URL da Imagem</Label><Input type="url" {...register('aboutImageUrl')} /></div>
          </CardContent>
        </Card>

         {/* Credibility Section */}
        <Card>
          <CardHeader><CardTitle>Seção de Depoimentos</CardTitle></CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div><Label>Título</Label><Input {...register('credibilityTitle')} /></div>
             {testimonialFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg">
                <div className="grid-cols-2 gap-4 grid flex-grow">
                  <div><Label>Nome</Label><Input {...register(`testimonials.${index}.name`)} /></div>
                  <div><Label>Texto do Depoimento</Label><Textarea {...register(`testimonials.${index}.text`)} /></div>
                </div>
                <Button type="button" variant="destructive" size="icon" onClick={() => removeTestimonial(index)}><Trash/></Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => appendTestimonial({ name: '', text: '' })}>Adicionar Depoimento</Button>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader><CardTitle>Seção de Perguntas Frequentes (FAQ)</CardTitle></CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div><Label>Título</Label><Input {...register('faqTitle')} /></div>
             {faqFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg">
                 <div className="grid-cols-2 gap-4 grid flex-grow">
                  <div><Label>Pergunta</Label><Input {...register(`faqs.${index}.q`)} /></div>
                  <div><Label>Resposta</Label><Textarea {...register(`faqs.${index}.a`)} /></div>
                </div>
                <Button type="button" variant="destructive" size="icon" onClick={() => removeFaq(index)}><Trash/></Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => appendFaq({ q: '', a: '' })}>Adicionar Pergunta</Button>
          </CardContent>
        </Card>

        {/* Footer Section */}
        <Card>
          <CardHeader><CardTitle>Rodapé</CardTitle></CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div><Label>Título Links</Label><Input {...register('footerLinksTitle')} /></div>
            <div><Label>Título Contato</Label><Input {...register('footerContactTitle')} /></div>
            <div><Label>Email de Contato</Label><Input type="email" {...register('footerContactEmail')} /></div>
            <div><Label>Endereço</Label><Input {...register('footerContactAddress')} /></div>
          </CardContent>
        </Card>

        <div className="flex justify-end sticky bottom-4">
          <Button type="submit" size="lg" disabled={!isDirty}>Salvar Alterações</Button>
        </div>
      </form>
    </div>
  );
}
