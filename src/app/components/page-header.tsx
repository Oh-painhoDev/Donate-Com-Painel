import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function PageHeader() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-banner');

  return (
    <header
      id="inicio"
      className="relative h-[70vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white"
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
      <div className="absolute inset-0 bg-black/50" />
      <div className="container relative mx-auto px-4">
        <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-shadow-lg leading-tight">
          SOS Paraná: <br />Sua ajuda é a esperança deles.
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg md:text-2xl text-shadow">
          Milhares de famílias foram afetadas pelas enchentes. Sua doação leva alimento, abrigo e esperança.
        </p>
      </div>
    </header>
  );
}
