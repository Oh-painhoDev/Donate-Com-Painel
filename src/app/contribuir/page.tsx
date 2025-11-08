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

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

// Schema para validação do formulário
const donationFormSchema = z.object({
  nome: z.string().min(3, { message: 'Nome completo é obrigatório.' }),
  email: z.string().email({ message: 'E-mail inválido.' }),
  cpf: z.string().length(11, { message: 'CPF deve conter 11 dígitos.' }),
});

type DonationFormData = z.infer<typeof donationFormSchema>;

// Componente principal do formulário
function DonationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [baseValue, setBaseValue] = useState(75.00);

  const { register, handleSubmit, formState: { errors } } = useForm<DonationFormData>({
    resolver: zodResolver(donationFormSchema),
  });

  // Seta o valor inicial do input
  useEffect(() => {
    const initialValue = searchParams.get('valor');
    if (initialValue && !isNaN(parseFloat(initialValue))) {
      setBaseValue(parseFloat(initialValue));
    }
  }, [searchParams]);

  const handleGoToStep2 = () => setStep(2);
  const handleGoToStep1 = () => setStep(1);

  const selectSuggestion = (value: number) => {
    setBaseValue(value);
  };

  const handleMainInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(',', '.')) || 0;
    setBaseValue(value);
  };
  
  // Função final que salva os dados e redireciona
  const submitFinalForm = (data: DonationFormData) => {
      toast({ title: 'Redirecionando...', description: 'Aguarde enquanto preparamos a sua doação.' });

      try {
          const donationData = {
              ...data, // nome, email, cpf
              valor: baseValue.toFixed(2),
          };

          // Salva os dados no localStorage para serem lidos pela página /pix
          localStorage.setItem('donationData', JSON.stringify(donationData));

          // Redireciona para a página /pix, mantendo os parâmetros UTM da URL original
          const currentParams = new URLSearchParams(window.location.search);
          router.push(`/pix?${currentParams.toString()}`);

      } catch (error: any) {
          console.error('Erro ao salvar dados da doação:', error);
          toast({
              variant: 'destructive',
              title: 'Erro Inesperado',
              description: 'Não foi possível processar sua doação. Tente novamente.',
          });
      }
  };


  return (
    <Card className="w-full max-w-lg mx-auto">
        <CardHeader className="text-center">
            <CardTitle className="text-xl sm:text-2xl">SOS PARANÁ</CardTitle>
            <CardDescription>Ajude as vítimas do tornado</CardDescription>
        </CardHeader>
        <CardContent>
            {/* ETAPA 1: SELEÇÃO DE VALOR */}
            <div style={{ display: step === 1 ? 'block' : 'none' }}>
                <div className="space-y-4">
                <div>
                    <Label htmlFor="mainAmountInput" className="sr-only">Valor da Doação</Label>
                    <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-500">R$</span>
                    <Input
                        id="mainAmountInput"
                        type="text"
                        className="w-full pl-12 pr-4 py-6 text-2xl font-bold border-2 border-gray-300 focus:border-primary"
                        value={baseValue.toFixed(2).replace('.', ',')}
                        onChange={handleMainInputChange}
                    />
                    </div>
                </div>
                <p className="text-sm text-gray-500">Sugestão: valores mais doados</p>
                <div className="grid grid-cols-3 gap-2">
                    {[25, 50, 75, 100, 300, 500].map((value) => (
                    <Button
                        key={value}
                        variant={baseValue === value ? 'default' : 'outline'}
                        className="rounded-full h-12"
                        onClick={() => selectSuggestion(value)}
                    >
                        R$ {value.toFixed(2).replace('.', ',')}
                    </Button>
                    ))}
                </div>
                <Button variant="default" size="lg" className="w-full h-14 text-lg" onClick={handleGoToStep2}>
                    CONTINUAR
                </Button>
                </div>
            </div>

            {/* ETAPA 2: DADOS DO DOADOR */}
            <div style={{ display: step === 2 ? 'block' : 'none' }}>
                <Button variant="link" onClick={handleGoToStep1} className="p-0 mb-4 text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para alterar o valor
                </Button>
                <form onSubmit={handleSubmit(submitFinalForm)} className="space-y-4">
                <header className="mb-4">
                    <h4 className="text-lg font-bold">Só mais um passo!</h4>
                    <p className="text-sm text-gray-500">Seus dados são protegidos e essenciais para o registro da doação.</p>
                </header>

                <div className="space-y-3">
                    <div className="space-y-1">
                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input id="nome" {...register('nome')} placeholder="Seu nome completo"/>
                        {errors.nome && <p className="text-sm text-red-500">{errors.nome.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" {...register('email')} placeholder="seu.email@exemplo.com"/>
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="cpf">CPF (somente números)</Label>
                        <Input id="cpf" {...register('cpf')} placeholder="11122233344"/>
                        {errors.cpf && <p className="text-sm text-red-500">{errors.cpf.message}</p>}
                    </div>
                </div>
                
                <Button type="submit" size="lg" className="w-full h-14 text-lg">
                    FINALIZAR E GERAR PIX
                </Button>
                </form>
            </div>
        </CardContent>
    </Card>
  );
}

export default function ContribuirPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Suspense fallback={<div>Carregando...</div>}>
                <DonationForm />
            </Suspense>
        </div>
    );
}
