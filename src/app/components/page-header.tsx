import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function PageHeader({ content }: { content: any }) {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-banner');

  if (!content) return null;

  return (
    <header
      id="inicio"
      className="relative h-[85vh] w-full flex items-center justify-center text-center text-white"
    >
      {heroImage && (
        <Image
          src={content.headerImageUrl || heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="container relative z-10 mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-shadow-lg leading-tight font-headline">
          {content.headerText}
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg md:text-2xl text-shadow font-light">
          {content.headerSubText}
        </p>
      </div>
    </header>
  );
}
