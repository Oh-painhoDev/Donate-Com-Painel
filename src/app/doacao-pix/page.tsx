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
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, Copy, Check, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface PixData {
  pix: {
    pix_qr_code: string;
    pix_url: string;
    qrcode?: string; // fallback
    qrcode_text?: string; // fallback
  };
}

function DoacaoPixForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Estados para os campos do formulário
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [valor, setValor] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const valorParam = searchParams.get('valor');
    if (valorParam) {
      setValor(valorParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPixData(null);

    const trackingParams: { [key: string]: string | null } = {};
    searchParams.forEach((value, key) => {
        if (key.startsWith('utm_') || key === 'src' || key === 'sck') {
            trackingParams[key] = value;
        }
    });

    const finalData = {
      valor: valor,
      nome: nome,
      cpf: cpf,
      email: email,
      telefone: telefone,
      produto: "Doação SOS Paraná", // Valor fixo para o produto
      ...trackingParams
    };

    try {
      const response = await fetch('/api/create-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });
      
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.details || 'Erro desconhecido ao gerar PIX.');
      }

      setPixData(result);

    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: "Erro ao Gerar PIX",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast({
        title: "Copiado!",
        description: "O código PIX foi copiado para a área de transferência.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  if (pixData) {
    const copiaECola = pixData.pix.pix_url || pixData.pix.qrcode_text;
    const qrCodeUrl = copiaECola 
      ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(copiaECola)}` 
      : null;


    return (
      <div className="text-center space-y-6">
        <Alert variant="default" className='bg-green-50 border-green-500 text-green-800'>
            <AlertTitle className='font-bold text-lg'>✅ PIX Gerado com Sucesso!</AlertTitle>
            <AlertDescription className='text-green-700'>
              <p>Obrigado, <strong>{nome}</strong>!</p>
              <p><strong>Valor:</strong> R$ {parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </AlertDescription>
        </Alert>

        {qrCodeUrl && (
          <div className="flex flex-col items-center">
            <h3 className="font-semibold mb-2 text-lg">1. Escaneie o QR Code abaixo</h3>
            <p className="text-sm text-muted-foreground mb-3">Abra o app do seu banco e aponte a câmera.</p>
            <div className="p-2 border bg-white rounded-lg shadow-md">
              <Image
                src={qrCodeUrl} 
                alt="QR Code PIX"
                width={250}
                height={250}
                unoptimized
              />
            </div>
          </div>
        )}

        {copiaECola && (
          <div className='w-full'>
            <h3 className="font-semibold mb-2 text-lg">2. Ou use o PIX Copia e Cola</h3>
            <p className="text-sm text-muted-foreground mb-3">Copie o código e cole na área PIX do seu banco.</p>
            <div className="relative p-4 pr-24 bg-gray-100 border rounded-lg break-all text-left text-sm text-gray-700">
              {copiaECola}
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(copiaECola)}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300"
              >
                {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className='ml-2'>{isCopied ? 'Copiado' : 'Copiar'}</span>
              </Button>
            </div>
          </div>
        )}

        <Button
          variant="secondary"
          onClick={() => {
            setPixData(null);
            setError(null);
          }}
          className="w-full mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Corrigir dados ou doar outro valor
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="valor-doacao" className="text-base font-semibold">
          Valor da Doação
        </Label>
        <Input
          id="valor-doacao"
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="R$ 0,00"
          step="0.01"
          min="8"
          required
          className="text-lg h-12"
        />
      </div>

       <div className="space-y-2">
        <Label htmlFor="nome">Nome Completo</Label>
        <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
      </div>

       <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF (apenas números)</Label>
          <Input id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))} required pattern="\d{11}" title="O CPF deve conter 11 dígitos." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input id="telefone" type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      <p className="text-xs text-muted-foreground text-center">
        Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
      </p>

      <Button type="submit" disabled={loading} className="w-full text-lg h-12">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : '💰'}
        {loading ? 'Gerando PIX...' : 'Finalizar e Gerar PIX'}
      </Button>

      <Button type="button" variant="link" className="w-full" onClick={() => router.push('/')}>
        Voltar para o site
      </Button>
    </form>
  );
}

export default function DoacaoPixPageContainer() {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">SOS Paraná</CardTitle>
          <CardDescription className="text-center">Só mais um passo! Seus dados são protegidos e essenciais para o registro da doação.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Loader2 className="mx-auto h-8 w-8 animate-spin" />}>
            <DoacaoPixForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
