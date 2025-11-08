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
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';

export default function PixPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [pixData, setPixData] = useState<{ qrCode: string; qrCodeUrl: string; amount: number; transactionId: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('pixData');
    if (data) {
      try {
        setPixData(JSON.parse(data));
      } catch (e) {
        console.error('Failed to parse pixData from localStorage', e);
        toast({
            variant: 'destructive',
            title: 'Erro',
            description: 'Não foi possível carregar os dados do PIX.',
        });
        router.push('/contribuir');
      }
    } else {
      toast({
            variant: 'destructive',
            title: 'Dados não encontrados',
            description: 'Nenhuma informação de PIX para exibir. Redirecionando...',
      });
      router.push('/contribuir');
    }
  }, [router, toast]);

  const handleCopy = () => {
    if (pixData?.qrCode) {
      navigator.clipboard.writeText(pixData.qrCode);
      setIsCopied(true);
      toast({ title: 'Copiado!', description: 'O código PIX foi copiado para a área de transferência.' });
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!pixData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Carregando dados do PIX...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
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
    </div>
  );
}
