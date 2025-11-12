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

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Copy, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';

// Schema para validação do formulário
const donationFormSchema = z.object({
  nome: z.string().min(3, { message: 'Nome completo é obrigatório.' }),
  email: z.string().email({ message: 'E-mail inválido.' }),
  cpf: z.string().length(11, { message: 'CPF deve conter 11 dígitos.' }),
  valor: z.number().min(8, { message: 'A doação mínima é de R$ 8,00.' }),
});

type DonationFormData = z.infer<typeof donationFormSchema>;

type PixData = {
  qrcode: string;
  qrcode_text: string;
  amount: number;
  id: string;
};

// Componente principal do formulário
export function DonationForm() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [baseValue, setBaseValue] = useState(75.00);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, trigger } = useForm<DonationFormData>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      valor: baseValue
    }
  });

  useEffect(() => {
    const initialValue = searchParams.get('valor');
    const parsedValue = initialValue ? parseFloat(initialValue) : baseValue;
    if (!isNaN(parsedValue)) {
      setBaseValue(parsedValue);
      setValue('valor', parsedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, setValue]);

  const handleGoToStep2 = async () => {
    const result = await trigger("valor");
    if (result) {
        setStep(2);
    }
  };
  const handleGoToStep1 = () => setStep(1);

  const selectSuggestion = (value: number) => {
    setBaseValue(value);
    setValue('valor', value);
    trigger('valor');
  };

  const handleMainInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(',', '.')) || 0;
    setBaseValue(value);
    setValue('valor', value);
  };
  
  const submitAndGeneratePix = async (data: DonationFormData) => {
      if (isSubmitting) return; 
      setIsSubmitting(true);
      toast({ title: 'Aguarde...', description: 'Gerando seu código PIX.' });

      try {
        const urlParams: {[key: string]: string} = {};
        searchParams.forEach((value, key) => {
            if (key !== 'valor') { // Don't include the value from the URL if it exists
              urlParams[key] = value;
            }
        });

        const pixPayload = {
            ...urlParams, // Pass all other UTM params
            valor: data.valor.toFixed(2),
            nome: data.nome,
            email: data.email,
            cpf: data.cpf,
            telefone: '11999999999',
            produto: `Doação SOS Paraná - R$${data.valor.toFixed(2)}`,
        };
        
        const response = await fetch('/api/create-vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pixPayload),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            // Lança um erro com os detalhes da API para ser pego no `catch`.
            // O `details` vem da nossa API route e contém a mensagem original.
            const error = new Error(result.details || result.error || 'Erro ao gerar PIX.');
            (error as any).details = result.details || result.error;
            throw error;
        }

        if (result.pix && result.pix.qrcode && result.pix.qrcode_text) {
             setPixData({
                ...result.pix,
                amount: data.valor,
                id: result.id,
            });
            setStep(3);
        } else {
            throw new Error('QR Code PIX não foi retornado pela API.');
        }

      } catch (error: any) {
          console.error('Erro ao gerar PIX:', error);
          toast({
              variant: 'destructive',
              title: 'Erro ao Gerar PIX',
              // Mostra a mensagem de erro detalhada se ela existir, senão mostra uma genérica.
              description: error.details || error.message || 'Não foi possível processar sua doação. Tente novamente.',
          });
      } finally {
        setIsSubmitting(false);
      }
  };

  const handleCopy = () => {
    if (pixData?.qrcode_text) {
      navigator.clipboard.writeText(pixData.qrcode_text);
      setIsCopied(true);
      toast({ title: 'Copiado!', description: 'O código PIX foi copiado para a área de transferência.' });
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-card">
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
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">R$</span>
                    <Input
                        id="mainAmountInput"
                        type="text"
                        className="w-full pl-12 pr-4 py-6 text-2xl font-bold"
                        value={baseValue.toFixed(2).replace('.', ',')}
                        onChange={handleMainInputChange}
                        onBlur={() => trigger('valor')}
                    />
                    </div>
                     {errors.valor && <p className="text-sm text-destructive mt-1">{errors.valor.message}</p>}
                </div>
                <p className="text-sm text-muted-foreground">Sugestão: valores mais doados</p>
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
                <form onSubmit={handleSubmit(submitAndGeneratePix)} className="space-y-4">
                <header className="mb-4">
                    <h4 className="text-lg font-bold">Só mais um passo!</h4>
                    <p className="text-sm text-muted-foreground">Seus dados são protegidos e essenciais para o registro da doação.</p>
                </header>

                <div className="space-y-3">
                    <div className="space-y-1">
                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input id="nome" {...register('nome')} placeholder="Seu nome completo"/>
                        {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" {...register('email')} placeholder="seu.email@exemplo.com"/>
                        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="cpf">CPF (somente números)</Label>
                        <Input id="cpf" type="number" {...register('cpf')} placeholder="11122233344" maxLength={11}/>
                        {errors.cpf && <p className="text-sm text-destructive">{errors.cpf.message}</p>}
                    </div>
                </div>
                
                <Button type="submit" size="lg" className="w-full h-14 text-lg" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isSubmitting ? 'PROCESSANDO...' : 'FINALIZAR E GERAR PIX'}
                </Button>
                </form>
            </div>

            {/* ETAPA 3: EXIBIÇÃO DO PIX */}
            <div style={{ display: step === 3 ? 'block' : 'none' }}>
              {isSubmitting && (
                  <div className="flex flex-col items-center gap-6 p-10">
                      <Loader2 className="h-16 w-16 animate-spin text-primary" />
                      <p className="text-muted-foreground">Conectando ao sistema de pagamento.</p>
                  </div>
              )}
              {pixData && (
                <div className="flex flex-col items-center gap-6">
                   <div className="p-4 bg-white rounded-lg border">
                      <Image 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(pixData.qrcode_text)}`}
                        alt="QR Code PIX" 
                        width={256} 
                        height={256} 
                        className="rounded-lg" 
                        unoptimized
                      />
                  </div>

                  <div className="text-left w-full bg-secondary p-4 rounded-lg">
                      <p className="font-semibold text-secondary-foreground">Valor: <span className="font-bold text-lg text-primary">R$ {pixData.amount.toFixed(2).replace('.', ',')}</span></p>
                      <p className="text-xs text-muted-foreground mt-1">ID: {pixData.id}</p>
                  </div>

                  <Button onClick={handleCopy} className="w-full" size="lg">
                      {isCopied ? <Check className="mr-2 h-5 w-5" /> : <Copy className="mr-2 h-5 w-5" />}
                      {isCopied ? 'Copiado!' : 'Copiar Código PIX'}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                      Abra o app do seu banco e escolha a opção PIX Copia e Cola.
                  </p>
                </div>
              )}
              {!pixData && !isSubmitting && (
                  <div className="flex flex-col items-center gap-6 p-10">
                    <p className="text-destructive">Não foi possível gerar o código PIX. Por favor, tente fazer sua doação novamente.</p>
                    <Button onClick={() => setStep(2)}>Tentar Novamente</Button>
                  </div>
              )}
            </div>
        </CardContent>
    </Card>
  );
}
