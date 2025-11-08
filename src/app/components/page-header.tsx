import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function PageHeader() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-banner');

  return (
    <header
      id="inicio"
      className="relative h-[600px] md:h-[800px] w-full text-center"
    >
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/30" />
      <div className="container relative mx-auto px-4 h-full flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-shadow-lg">
          Preservar é preciso.
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-shadow">
          Faça parte do nosso movimento em defesa da conservação das aves e da biodiversidade brasileira.
        </p>
      </div>
    </header>
  );
}
