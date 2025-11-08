import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';
import Link from 'next/link';

export function NewsSection({ content }: { content: any }) {
  if (!content || !content.newsItems || content.newsItems.length === 0) return null;

  return (
    <section id="noticias" className="py-16 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-headline text-primary">
            {content.newsTitle}
          </h2>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {content.newsItems.map((newsItem: any, index: number) => (
            <NewsCard
              key={index}
              title={newsItem.title}
              source={newsItem.source}
              url={newsItem.url}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsCard({ title, source, url }: { title: string; source: string; url: string; }) {
  return (
    <Card className="bg-secondary p-8 flex flex-col justify-between shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
      <div>
        <div className="flex items-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full mr-4">
            <Newspaper className="h-6 w-6 text-primary" />
          </div>
          <p className="font-bold text-lg text-primary">{source}</p>
        </div>
        <h3 className="text-xl font-semibold text-secondary-foreground mb-4">
          {title}
        </h3>
      </div>
      <Button asChild className="mt-4 w-full md:w-auto self-start" variant="outline">
        <Link href={url} target="_blank" rel="noopener noreferrer">
          Ver Matéria Completa
        </Link>
      </Button>
    </Card>
  );
}
