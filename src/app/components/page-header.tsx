import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function PageHeader() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-banner');

  return (
    <header
      id="inicio"
      className="relative h-[80vh] w-full flex items-center justify-center text-center text-white"
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
      <div className="container relative z-10 mx-auto px-4 mt-32">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-shadow-lg leading-tight">
          Preservar é preciso.
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg md:text-2xl text-shadow">
          Faça parte do nosso movimento em defesa da conservação das aves e da biodiversidade brasileira.
        </p>
      </div>
    </header>
  );
}
