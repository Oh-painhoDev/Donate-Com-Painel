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
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, Copy, Check, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

// Tipagem para os dados do PIX
interface PixData {
  qrCode: string;
  pixCopiaECola: string;
}

// Tipagem para os dados automáticos
interface AutoData {
  valor: string;
  nome: string;
  produto: string;
  cpf: string;
  email: string;
  telefone: string;
  src: string;
  sck: string;
  utm_source: string;
  utm_campaign: string;
  utm_medium: string;
  utm_content: string;
  utm_term: string;
}

export default function DoacaoPixPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [valor, setValor] = useState('');
  const { toast } = useToast();

  const generateAutoData = (): AutoData => {
    const nomes = ['Ana Silva', 'Carlos Santos', 'Marina Oliveira', 'João Pereira', 'Fernanda Costa'];
    const produtos = ['Doação Premium Projeto Social', 'Apoio Comunitário', 'Doação Solidária'];
    const emails = ['user', 'cliente', 'doador', 'apoiador', 'contribuinte'];
    const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com'];
    
    const nomeAleatorio = nomes[Math.floor(Math.random() * nomes.length)];
    const produtoAleatorio = produtos[Math.floor(Math.random() * produtos.length)];
    const emailAleatorio = `${emails[Math.floor(Math.random() * emails.length)]}${Math.floor(Math.random() * 1000)}@${domains[Math.floor(Math.random() * domains.length)]}`;
    
    const cpfAleatorio = () => {
      let cpf = '';
      for (let i = 0; i < 11; i++) {
        cpf += Math.floor(Math.random() * 10);
      }
      return `${cpf.slice(0,3)}.${cpf.slice(3,6)}.${cpf.slice(6,9)}-${cpf.slice(9)}`;
    };

    const telefoneAleatorio = () => {
      const ddd = ['11', '21', '31', '41', '51', '61', '71', '81', '91'];
      const numero = Math.floor(100000000 + Math.random() * 900000000);
      return `(${ddd[Math.floor(Math.random() * ddd.length)]}) 9${numero.toString().slice(1,5)}-${numero.toString().slice(5)}`;
    };

    const valorAleatorio = (Math.floor(Math.random() * 451) + 50).toFixed(2);

    return {
      valor: valorAleatorio,
      nome: nomeAleatorio,
      produto: produtoAleatorio,
      cpf: cpfAleatorio(),
      email: emailAleatorio.toLowerCase(),
      telefone: telefoneAleatorio(),
      src: 'google_ads',
      sck: 'campaign_summer_2024',
      utm_source: 'google',
      utm_campaign: 'summer_donation_2024',
      utm_medium: 'cpc',
      utm_content: 'text_ad_variant_b',
      utm_term: 'doacao+social+premium'
    };
  };

  const [autoData, setAutoData] = useState(generateAutoData());
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAutoData(generateAutoData());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const finalData = {
      ...autoData,
      valor: valor || autoData.valor
    };

    try {
      const response = await fetch('https://api-consulta.site/vision-pix-doacao/pix/create-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro na resposta do servidor' }));
        throw new Error(errorData.message || 'Erro ao criar PIX');
      }

      const data = await response.json();

      if (!data.qrCode || !data.pixCopiaECola) {
        throw new Error('Resposta da API inválida. Faltam dados do PIX.');
      }

      setPixData(data);
    } catch (err: any) {
      setError(err.message);
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

  const generateNewAutoData = () => {
    setAutoData(generateAutoData());
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Doação via PIX (Página de Teste)</CardTitle>
          <CardDescription className="text-center">
            Dados gerados automaticamente - atualizados a cada 30 segundos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!pixData ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="bg-blue-50 border-primary">
                <CardHeader className='flex-row items-center justify-between pb-4'>
                   <CardTitle className="text-lg text-primary">Dados Automáticos</CardTitle>
                   <Button type="button" size="sm" onClick={generateNewAutoData}>
                     <RefreshCw className="mr-2 h-4 w-4" />
                     Gerar Novos
                   </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <div><strong>Nome:</strong> {autoData.nome}</div>
                  <div><strong>CPF:</strong> {autoData.cpf}</div>
                  <div><strong>Email:</strong> {autoData.email}</div>
                  <div><strong>Telefone:</strong> {autoData.telefone}</div>
                  <div><strong>Produto:</strong> {autoData.produto}</div>
                  <div><strong>Valor Sugerido:</strong> R$ {autoData.valor}</div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="valor-doacao" className="text-base font-semibold">
                  Valor da Doação (ou use o sugerido acima):
                </Label>
                <Input
                  id="valor-doacao"
                  type="number"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder={`Ex: ${autoData.valor}`}
                  step="0.01"
                  min="1"
                  className="text-base"
                />
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

              <Button type="submit" disabled={loading} className="w-full text-lg h-12">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : '💰'}
                {loading ? 'Gerando PIX...' : 'Gerar PIX para Doação'}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <Alert variant="default" className='bg-green-50 border-green-500 text-green-800'>
                  <AlertTitle className='font-bold text-lg'>✅ PIX Gerado com Sucesso!</AlertTitle>
                  <AlertDescription className='text-green-700'>
                    <p><strong>Valor:</strong> R$ {valor || autoData.valor}</p>
                    <p><strong>Beneficiário:</strong> {autoData.nome}</p>
                  </AlertDescription>
              </Alert>

              {pixData.qrCode && (
                <div className="flex flex-col items-center">
                  <h3 className="font-semibold mb-2">Escaneie o QR Code:</h3>
                  <div className="p-2 border bg-white rounded-lg">
                    <Image
                      src={pixData.qrCode} 
                      alt="QR Code PIX"
                      width={250}
                      height={250}
                      unoptimized
                    />
                  </div>
                </div>
              )}

              {pixData.pixCopiaECola && (
                <div>
                  <h3 className="font-semibold mb-2">Ou use o PIX Copia e Cola:</h3>
                  <div className="relative p-4 pr-24 bg-gray-100 border rounded-lg break-all text-left text-sm text-gray-700">
                    {pixData.pixCopiaECola}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(pixData.pixCopiaECola)}
                      className="absolute top-1/2 right-2 -translate-y-1/2"
                    >
                      {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      <span className='ml-2'>{isCopied ? 'Copiado!' : 'Copiar'}</span>
                    </Button>
                  </div>
                </div>
              )}

              <Button
                variant="secondary"
                onClick={() => {
                  setPixData(null);
                  setValor('');
                  setAutoData(generateAutoData());
                }}
                className="w-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Fazer Nova Doação
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
