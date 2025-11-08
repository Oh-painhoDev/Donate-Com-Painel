'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const suggestedAmounts = [50, 100, 250];

export function DonationSection() {
  const [customAmount, setCustomAmount] = useState('');

  return (
    <section id="doar" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Faça sua Doação</h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Sua contribuição ajudará a fornecer suprimentos essenciais para as famílias impactadas pelas enchentes no Paraná.
          </p>
        </div>
        <div className="bg-background rounded-2xl p-8 md:p-12 shadow-xl max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {suggestedAmounts.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                className="h-24 text-2xl font-bold transition-all hover:bg-accent hover:text-accent-foreground hover:scale-105"
              >
                R$ {amount}
              </Button>
            ))}
            <div className="md:col-span-1 p-6 bg-secondary rounded-lg">
              <Label htmlFor="custom-amount" className="text-lg font-semibold text-primary">Outro Valor</Label>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xl text-muted-foreground">R$</span>
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="10,00"
                  className="text-lg font-bold"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Button size="lg" className="w-full md:w-auto h-14 text-xl font-bold bg-accent text-accent-foreground hover:bg-accent/90">
              DOAR AGORA
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
