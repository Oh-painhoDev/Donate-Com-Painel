'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const suggestedAmounts = [120, 240, 500];

export function DonationSection() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(240);

  return (
    <section id="doar" className="py-12 md:py-20 bg-[#E5A237]">
      <div className="container mx-auto px-4">
        <div className="bg-primary rounded-lg p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {suggestedAmounts.map((amount) => (
                <div key={amount} className="text-center bg-white rounded-full p-6 shadow-lg flex flex-col justify-between">
                  <div>
                    <p className="text-4xl font-bold text-accent">R${amount}</p>
                    <p className="mt-2 text-muted-foreground text-sm">
                      {amount === 120 && 'Seu engajamento fomenta a produção científica voltada à preservação das aves'}
                      {amount === 240 && 'A partir de R$240 por ano você se torna um Amigo da SAVE!'}
                      {amount === 500 && 'Sua colaboração fortalece nossos projetos em prol das espécies ameaçadas de extinção'}
                    </p>
                  </div>
                  <Button
                    variant={'default'}
                    className="mt-4 w-24 mx-auto rounded-full bg-gray-800 text-white hover:bg-gray-700"
                  >
                    DOAR
                  </Button>
                </div>
              ))}
               <div className="text-center bg-white rounded-full p-6 shadow-lg flex flex-col justify-between">
                  <div>
                    <p className="text-3xl font-bold text-accent">Doar <br/>outro valor</p>
                    <p className="mt-2 text-muted-foreground text-sm">
                      Independente da quantia, o importante é participar! Ajude com o quanto puder
                    </p>
                  </div>
                  <Button
                    variant={'default'}
                    className="mt-4 w-24 mx-auto rounded-full bg-gray-800 text-white hover:bg-gray-700"
                  >
                    DOAR
                  </Button>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
