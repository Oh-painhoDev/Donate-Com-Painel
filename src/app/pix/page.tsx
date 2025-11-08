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
import { useToast } from '@/hooks/use-toast';
import { createPixAction } from '@/app/actions';
import { Copy, Check, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';

function PixGeneration() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [pixData, setPixData] = useState<{ qrCode: string; qrCodeUrl: string; amount: number; transactionId: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const generatePix = async () => {
      const storedData = localStorage.getItem('donationData');
      if (!storedData) {
        toast({
          variant: 'destructive',
          title: 'Dados não encontrados',
          description: 'Não foi possível encontrar os dados da doação. Redirecionando...',
        });
        router.push('/contribuir');
        return;
      }

      try {
        const donationData = JSON.parse(storedData);
        const urlParams: {[key: string]: string} = {};
        searchParams.forEach((value, key) => {
            urlParams[key] = value;
        });

        const pixPayload = {
            ...urlParams, // Adiciona todos os parâmetros da URL (UTMs, etc)
            valor: donationData.valor,
            nome: donationData.nome,
            email: donationData.email,
            cpf: donationData.cpf,
            telefone: '11999999999', // Telefone fixo por enquanto
            produto: `Doação SOS Paraná - R$${donationData.valor}`,
            checkoutUrl: window.location.href, // Passa a URL completa para o serviço de rastreamento
        };

        const result = await createPixAction(pixPayload);

        if (!result.success) {
            throw new Error(result.error || 'Erro desconhecido ao gerar PIX.');
        }

        if (result.pixCopyPaste && result.qrCodeUrl) {
            setPixData({
                qrCode: result.pixCopyPaste, 
                qrCodeUrl: result.qrCodeUrl,
                amount: parseFloat(donationData.valor),
                transactionId: result.id || 'N/A',
            });
            localStorage.removeItem('donationData'); // Limpa os dados após o uso
        } else {
            throw new Error('QR Code PIX não foi retornado pela API.');
        }

      } catch (error: any) {
        console.error('Erro ao gerar PIX:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao Gerar PIX',
          description: error.message || 'Não foi possível se conectar ao serviço de pagamento. Tente novamente.',
        });
        // Opcional: redirecionar de volta se falhar
        // router.push('/contribuir');
      } finally {
        setIsLoading(false);
      }
    };

    generatePix();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executa apenas uma vez

  const handleCopy = () => {
    if (pixData?.qrCode) {
      navigator.clipboard.writeText(pixData.qrCode);
      setIsCopied(true);
      toast({ title: 'Copiado!', description: 'O código PIX foi copiado para a área de transferência.' });
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">Gerando seu PIX...</CardTitle>
                <CardDescription>Aguarde um momento.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6 p-10">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="text-muted-foreground">Conectando ao sistema de pagamento.</p>
            </CardContent>
        </Card>
    );
  }

  if (!pixData) {
    return (
       <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-destructive">Falha ao Gerar PIX</CardTitle>
                <CardDescription>Ocorreu um erro.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6 p-10">
                 <p className="text-destructive">Não foi possível gerar o código PIX. Por favor, tente fazer sua doação novamente.</p>
                 <Button onClick={() => router.push('/contribuir')}>Tentar Novamente</Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Finalize sua Doação</CardTitle>
          <CardDescription>Escaneie o QR Code ou copie o código abaixo.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
            <div className="p-4 bg-white rounded-lg border">
                {pixData.qrCodeUrl && (
                  <Image 
                    src={pixData.qrCodeUrl} 
                    alt="QR Code PIX" 
                    width={256} 
                    height={256} 
                    className="rounded-lg" 
                    unoptimized // Necessário para fontes externas de QR Code como qrserver.com
                  />
                )}
            </div>

            <div className="text-left w-full bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold">Valor: <span className="font-bold text-lg text-primary">R$ {pixData.amount.toFixed(2).replace('.', ',')}</span></p>
                <p className="text-xs text-gray-500 mt-1">ID: {pixData.transactionId}</p>
            </div>

            <Button onClick={handleCopy} className="w-full" size="lg">
                {isCopied ? <Check className="mr-2 h-5 w-5" /> : <Copy className="mr-2 h-5 w-5" />}
                {isCopied ? 'Copiado!' : 'Copiar Código PIX'}
            </Button>
             <p className="text-xs text-gray-500">
                Abra o app do seu banco e escolha a opção PIX Copia e Cola.
            </p>
        </CardContent>
    </Card>
  );
}


export default function PixPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Suspense fallback={<p>Carregando...</p>}>
                <PixGeneration />
            </Suspense>
        </div>
    );
}
