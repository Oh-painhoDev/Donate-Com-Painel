import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Newspaper, Radio } from 'lucide-react';

const newsItems = [
  {
    live: true,
    time: 'AGORA',
    text: 'Defesa Civil atualiza balanço de desabrigados.',
  },
  {
    live: false,
    time: '14h30',
    text: 'Chegada de 3 toneladas de mantimentos e água potável.',
  },
  {
    live: false,
    time: '12h15',
    text: 'Ministros confirmam liberação de verba federal emergencial.',
  },
  {
    live: false,
    time: '10h45',
    text: 'Equipes de resgate identificam mais 2 vítimas.',
  },
];

export function NewsFeed() {
  return (
    <section id="noticias" className="py-12 md:py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
            Situação Agora
          </h2>
          <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
            Últimas notícias oficiais sobre a situação em Rio Bonito do Iguaçu.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper /> Últimas Notícias
            </CardTitle>
            <CardDescription>Atualizações a cada 30 minutos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {newsItems.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="text-right flex-shrink-0 w-20">
                    {item.live ? (
                      <span className="flex items-center justify-end text-destructive font-bold text-sm">
                        <Radio className="h-4 w-4 mr-1 animate-pulse" />
                        AO VIVO
                      </span>
                    ) : (
                      <span className="text-muted-foreground font-medium text-sm">
                        {item.time}
                      </span>
                    )}
                  </div>
                  <div className="relative flex-1">
                    <div className="absolute left-[-1.15rem] top-1 h-full border-l-2 border-border/70"></div>
                    <div className="absolute left-[-1.5rem] top-1.5 h-3 w-3 rounded-full bg-primary"></div>
                    <p className="text-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
