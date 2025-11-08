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
import { createPix } from '@/services/pix';
import { ArrowLeft } from 'lucide-react';
import { trackSale } from '@/services/utmify';


// --- Component para o formulário ---
function DonationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [baseValue, setBaseValue] = useState(75.00);
  const [isLoading, setIsLoading] = useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');

  // Seta o valor inicial do input baseado no parâmetro da URL
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
  
  const handleSubmitFinalForm = async (event: React.FormEvent) => {
      event.preventDefault();
      setIsLoading(true);
      toast({ title: 'Processando...', description: 'Aguarde enquanto geramos o PIX.' });

      try {
          const urlParams = new URLSearchParams(window.location.search);
          const pixData: any = {
              valor: baseValue.toFixed(2),
              nome,
              email,
              cpf: cpf.replace(/\D/g, ''),
              produto: 'Doação SOS Paraná', // ou outro nome de produto relevante
          };

          // Adiciona todos os parâmetros da URL ao payload
          urlParams.forEach((value, key) => {
              pixData[key] = value;
          });

          // Rastreia a "venda" antes de gerar o PIX
          trackSale({
            amountInCents: baseValue * 100,
            productName: `Doação de R$${baseValue.toFixed(2)}`,
          });


          const result = await createPix(pixData);

          if (!result.success) {
              throw new Error(result.error || 'Erro desconhecido na API');
          }

          // A nova API normalizada retorna pixCopyPaste e qrCodeUrl
          if (result.pixCopyPaste && result.qrCodeUrl) {
              localStorage.setItem('pixData', JSON.stringify({
                  qrCode: result.pixCopyPaste, // O código para o QR Code
                  qrCodeUrl: result.qrCodeUrl, // A URL da imagem do QR Code
                  amount: baseValue,
                  transactionId: result.id || 'N/A',
              }));
              router.push('/pix');
          } else {
              throw new Error('QR Code PIX não foi retornado pela API.');
          }

      } catch (error: any) {
          console.error('Erro ao criar PIX:', error);
          toast({
              variant: 'destructive',
              title: 'Erro ao gerar PIX',
              description: error.message || 'Não foi possível se conectar ao serviço de pagamento. Tente novamente.',
          });
      } finally {
          setIsLoading(false);
      }
  };


  return (
    <div className="w-full max-w-lg mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      <header className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">SOS PARANÁ</h2>
        <h4 className="text-sm text-gray-500">Ajude as vítimas do tornado</h4>
      </header>

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
                className="w-full pl-12 pr-4 py-6 text-2xl font-bold border-2 border-gray-200 focus:border-primary"
                value={baseValue.toFixed(2).replace('.', ',')}
                onChange={handleMainInputChange}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600">Sugestão: valores mais doados</p>
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
        <form onSubmit={handleSubmitFinalForm} className="space-y-4">
          <header className="mb-4">
              <h4 className="text-lg font-bold">Só mais um passo!</h4>
              <p className="text-sm text-gray-600">Seus dados são protegidos e essenciais para o registro da doação.</p>
          </header>
          <div className="space-y-2">
            <Label htmlFor="donorName">Nome Completo</Label>
            <Input id="donorName" placeholder="Seu nome completo" required value={nome} onChange={e => setNome(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="donorEmail">E-mail</Label>
            <Input id="donorEmail" type="email" placeholder="seu.email@exemplo.com" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="donorDoc">CPF</Label>
            <Input id="donorDoc" placeholder="000.000.000-00" required value={cpf} onChange={e => setCpf(e.target.value)} />
          </div>
          <Button type="submit" size="lg" className="w-full h-14 text-lg" disabled={isLoading}>
            {isLoading ? 'FINALIZANDO...' : 'FINALIZAR DOAÇÃO'}
          </Button>
        </form>
      </div>
    </div>
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
