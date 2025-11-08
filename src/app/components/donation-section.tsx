'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Copy, QrCode, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const pixKey = 'sosriobonito@email.com';
const suggestedAmounts = [50, 100, 200];

export function DonationSection() {
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);

  const qrCodeImage = PlaceHolderImages.find((img) => img.id === 'qr-code');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixKey);
    toast({
      title: 'Chave PIX copiada!',
      description: 'Agora é só colar no seu app do banco.',
    });
  };

  return (
    <section id="doar" className="py-12 md:py-20 bg-primary/10">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-6 md:p-8 bg-card flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-primary font-headline mb-2">
                [EMERGÊNCIA] Doe Agora
              </h2>
              <p className="text-muted-foreground mb-6">
                Sua doação via PIX é rápida, segura e chega em minutos para quem
                mais precisa.
              </p>

              <div className="space-y-4">
                <p className="text-sm font-semibold text-foreground">
                  VALOR SUGERIDO:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {suggestedAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? 'default' : 'outline'}
                      onClick={() => setSelectedAmount(amount)}
                      className="h-12 text-lg"
                    >
                      R${amount}
                    </Button>
                  ))}
                  <Button
                    variant={selectedAmount === null ? 'default' : 'outline'}
                    onClick={() => setSelectedAmount(null)}
                    className="h-12 text-lg"
                  >
                    Outro
                  </Button>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Smartphone size={20} /> Como Doar em 2 Minutos
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-sm">
                  <li>Abra o app do seu banco e entre na área Pix.</li>
                  <li>
                    Escolha "Pagar com QR Code" ou "Pix Copia e Cola".
                  </li>
                  <li>Escaneie o código ao lado ou cole a chave.</li>
                  <li>Confirme o valor e a doação. Pronto!</li>
                </ol>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-6 md:p-8 flex flex-col items-center justify-center border-l">
              <Tabs defaultValue="qrcode" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="qrcode">
                    <QrCode className="mr-2" /> QR Code
                  </TabsTrigger>
                  <TabsTrigger value="copia-e-cola">
                    <Copy className="mr-2" /> Copia e Cola
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="qrcode"
                  className="flex flex-col items-center"
                >
                  {qrCodeImage && (
                    <div className="p-2 bg-white rounded-lg shadow-md mt-4">
                      <Image
                        src={qrCodeImage.imageUrl}
                        alt={qrCodeImage.description}
                        data-ai-hint={qrCodeImage.imageHint}
                        width={200}
                        height={200}
                        className="rounded-md"
                      />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Aponte a câmera do seu celular para doar
                  </p>
                </TabsContent>
                <TabsContent
                  value="copia-e-cola"
                  className="flex flex-col items-center text-center mt-4"
                >
                  <CardTitle className="text-lg">Chave PIX (E-mail)</CardTitle>
                  <CardDescription className="mt-2 mb-4">
                    Clique no botão para copiar a chave.
                  </CardDescription>
                  <div className="w-full p-3 bg-white dark:bg-black rounded-lg border text-sm font-mono break-all mb-4">
                    {pixKey}
                  </div>
                  <Button
                    onClick={copyToClipboard}
                    className="w-full bg-accent hover:bg-accent/90"
                  >
                    <Copy className="mr-2 h-4 w-4" /> Copiar Chave PIX
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
