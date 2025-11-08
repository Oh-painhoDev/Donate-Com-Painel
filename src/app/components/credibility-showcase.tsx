import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, ShieldCheck } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const partners = [
  'Defesa Civil Estadual',
  'Ministério Público',
  'Prefeitura Municipal',
  'Governo do Paraná',
  'Corpo de Bombeiros',
];

export function CredibilityShowcase() {
  const testimonial1 = PlaceHolderImages.find((img) => img.id === 'testimonial-1');
  const testimonial2 = PlaceHolderImages.find((img) => img.id === 'testimonial-2');

  return (
    <section id="confianca" className="py-12 md:py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
            Doe com Confiança
          </h2>
          <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
            Esta campanha é auditada e apoiada por instituições sérias.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-green-500" /> Fiscalizado por:
                </h3>
                <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                  {partners.slice(0, 3).map((p) => (
                    <span key={p}>{p}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Parceiros:</h3>
                <div className="flex flex-wrap gap-2">
                  {partners.map((p) => (
                    <Badge key={p} variant="secondary">
                      {p}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-xl font-bold text-center text-foreground">
              Depoimentos
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {testimonial1 && (
                <TestimonialCard
                  image={testimonial1}
                  title="Uma moradora relata o desespero"
                />
              )}
              {testimonial2 && (
                <TestimonialCard
                  image={testimonial2}
                  title="Voluntário descreve o cenário"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ image, title }: { image: any; title: string }) {
  return (
    <Card className="overflow-hidden group shadow-lg">
      <div className="relative">
        <Image
          src={image.imageUrl}
          alt={image.description}
          data-ai-hint={image.imageHint}
          width={500}
          height={300}
          className="aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <PlayCircle className="h-16 w-16 text-white/80 group-hover:text-white transition-colors" />
        </div>
      </div>
      <CardContent className="p-4">
        <p className="font-semibold text-foreground">{title}</p>
      </CardContent>
    </Card>
  );
}
