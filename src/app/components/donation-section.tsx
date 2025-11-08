'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const suggestedAmounts = [120, 240, 500];

export function DonationSection() {
  const [customAmount, setCustomAmount] = useState('');

  const DonationCircle = ({ amount, description, isCustom = false }: { amount?: number; description: string; isCustom?: boolean }) => (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-48 h-48 md:w-56 md:h-56">
        <div className="absolute inset-0 rounded-full bg-white shadow-lg"></div>
        <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-primary"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          {isCustom ? (
            <>
              <div className='flex items-baseline'>
                <span className="text-2xl text-primary font-bold">R$</span>
                <Input
                    id="custom-amount"
                    type="number"
                    placeholder="10,00"
                    className="text-3xl font-bold w-32 border-0 bg-transparent text-center shadow-none focus-visible:ring-0"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                  />
              </div>
              
            </>
          ) : (
            <span className="text-5xl font-bold text-accent">R${amount}</span>
          )}
           <p className="text-sm text-foreground/80 mt-2">{description}</p>
        </div>
      </div>
      <Button className="w-40 h-12 text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80">DOAR</Button>
    </div>
  );

  return (
    <section id="doar" className="py-16 md:py-24 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 justify-items-center">
          <DonationCircle amount={120} description="Seu engajamento fomenta a produção científica." />
          <DonationCircle amount={240} description="Você se torna um Amigo da SAVE!" />
          <DonationCircle amount={500} description="Sua colaboração fortalece nossos projetos." />
          <DonationCircle isCustom description="Independente da quantia, o importante é participar!" />
        </div>
      </div>
    </section>
  );
}
