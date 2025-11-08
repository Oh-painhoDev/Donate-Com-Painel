import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function SiteFooter() {
  const logoImage = PlaceHolderImages.find(p => p.id === 'logo');
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            {logoImage && (
              <Image
                src={logoImage.imageUrl}
                alt={logoImage.description}
                data-ai-hint={logoImage.imageHint}
                width={130}
                height={50}
                className="object-contain"
              />
            )}
             <p className="text-sm mt-4 text-gray-300 max-w-xs mx-auto md:mx-0">
              Todos os direitos reservados 2023
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg text-accent mb-2">Fale conosco</h3>
            <a href="mailto:aves@savebrasil.org.br" className="hover:underline">aves@savebrasil.org.br</a>
            <p>Rua Fernão Dias, 219 cj 2 | Pinheiros / SP - 05427-010</p>
          </div>
           <div className="flex flex-col gap-2">
             <h3 className="font-bold text-lg text-accent mb-2">Links Úteis</h3>
            <a href="#inicio" className="hover:underline">Início</a>
            <a href="#doar" className="hover:underline">Doar</a>
            <a href="#faq" className="hover:underline">FAQ</a>
            <a href="https://doare.org/privacidade" className="hover:underline">Política de Privacidade</a>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>Feito com ϟ por <a href="http://doare.org/" className="underline">doare.org</a></p>
        </div>
      </div>
    </footer>
  );
}
