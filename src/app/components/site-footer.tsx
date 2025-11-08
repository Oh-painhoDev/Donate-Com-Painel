import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function SiteFooter() {
  const logoImage = PlaceHolderImages.find(p => p.id === 'logo');
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 text-center md:text-left">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center md:items-start">
            {logoImage && (
              <Image
                src={logoImage.imageUrl}
                alt={logoImage.description}
                data-ai-hint={logoImage.imageHint}
                width={125}
                height={40}
                className="object-contain"
              />
            )}
             <p className="text-xs mt-4 text-gray-300">
              Todos os direitos reservados 2023 | {' '}
              <a href="#" className="underline">Política de Privacidade</a> e {' '}
              <a href="#" className="underline">Termos de Uso﻿</a>
            </p>
          </div>
          <div>
            <h3 className="font-bold text-accent mb-2">Fale conosco:</h3>
            <a href="mailto:aves@savebrasil.org.br" className="hover:underline">aves@savebrasil.org.br</a>
          </div>
          <div>
            <h3 className="font-bold text-accent mb-2">Endereço:</h3>
            <p>Rua Fernão Dias, 219 cj 2 | Pinheiros / SP - 05427-010</p>
          </div>
        </div>
      </div>
      <div className="bg-[#A6EBF7] py-2 text-center text-primary font-semibold">
        <p>Feito por ϟ <a href="http://doare.org/" className="underline">doare.org</a></p>
      </div>
    </footer>
  );
}
