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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import Link from 'next/link';

export function DonationSection({ content }: { content: any }) {
  const [customAmount, setCustomAmount] = useState('');

  const DonationCircle = ({ amount, description, isCustom = false }: { amount?: number; description: string; isCustom?: boolean }) => {
    const finalAmount = isCustom ? parseFloat(customAmount) : amount;
    
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative w-48 h-48 md:w-56 md:h-56 transform hover:scale-105 transition-transform duration-300">
          <div className="absolute inset-0 rounded-full bg-white shadow-2xl"></div>
          <div className="absolute inset-2 rounded-full border-2 border-dashed border-accent"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
            {isCustom ? (
              <>
                <div className='flex items-baseline text-primary'>
                  <span className="text-2xl font-bold">R$</span>
                  <Input
                      id="custom-amount"
                      type="number"
                      placeholder="0,00"
                      className="text-3xl md:text-4xl font-bold w-32 border-0 bg-transparent text-center shadow-none focus-visible:ring-0 p-0"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                    />
                </div>
              </>
            ) : (
              <span className="text-5xl md:text-6xl font-bold text-accent">R${amount}</span>
            )}
             <p className="text-sm text-foreground/80 mt-2 font-medium">{description}</p>
          </div>
        </div>
        <Button size="lg" className="w-40 h-12 text-lg font-bold bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg" asChild>
          <Link href={`/contribuir?valor=${finalAmount || ''}`}>DOAR</Link>
        </Button>
      </div>
    );
  }

  if (!content) return null;

  return (
    <section id="doar" className="py-16 md:py-24 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 justify-items-center">
          {content.donationOptions.map((option: any, index: number) => (
            <DonationCircle key={index} amount={option.amount} description={option.description} />
          ))}
          <DonationCircle isCustom description={content.customDonationText} />
        </div>
      </div>
    </section>
  );
}
