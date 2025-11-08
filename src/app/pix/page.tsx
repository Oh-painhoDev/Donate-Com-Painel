'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Uma versão simples de um gerador de QR Code em SVG para não depender de libs externas no client-side
const QRCodeSVG = ({ text }: { text: string }) => {
  // Esta é uma implementação placeholder. Uma lib real como 'qrcode.react' seria melhor.
  // Para este exemplo, usaremos uma API externa para gerar a imagem.
  if (!text) return null;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(text)}`;
  return <img src={qrUrl} alt="QR Code PIX" width={256} height={256} className="rounded-lg" />;
};


export default function PixPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [pixData, setPixData] = useState<{ qrCode: string; amount: number; transactionId: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('pixData');
    if (data) {
      try {
        setPixData(JSON.parse(data));
        // localStorage.removeItem('pixData'); // Opcional: remover após o uso
      } catch (e) {
        console.error('Failed to parse pixData from localStorage', e);
        toast({
            variant: 'destructive',
            title: 'Erro',
            description: 'Não foi possível carregar os dados do PIX.',
        });
        router.push('/');
      }
    } else {
      toast({
            variant: 'destructive',
            title: 'Dados não encontrados',
            description: 'Nenhuma informação de PIX para exibir.',
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
                <QRCodeSVG text={pixData.qrCode} />
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
