import Image from 'next/image';

export function SiteFooter({ content }: { content: any }) {
  if (!content) return null;

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            {content.logoImageUrl && (
              <Image
                src={content.logoImageUrl}
                alt="Logo"
                width={130}
                height={50}
                className="object-contain"
              />
            )}
             <p className="text-sm mt-4 text-primary-foreground/70 max-w-xs mx-auto md:mx-0">
              {content.footerRightsText}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg text-accent mb-2">{content.footerContactTitle}</h3>
            <a href={`mailto:${content.footerContactEmail}`} className="hover:underline text-primary-foreground/90">{content.footerContactEmail}</a>
            <p className="text-primary-foreground/70">{content.footerContactAddress}</p>
          </div>
           <div className="flex flex-col gap-2">
             <h3 className="font-bold text-lg text-accent mb-2">{content.footerLinksTitle}</h3>
            <a href="#inicio" className="hover:underline text-primary-foreground/90">Início</a>
            <a href="#doar" className="hover:underline text-primary-foreground/90">Doar</a>
            <a href="#faq" className="hover:underline text-primary-foreground/90">FAQ</a>
            <a href="https://doare.org/privacidade" className="hover:underline text-primary-foreground/90">Política de Privacidade</a>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-10 pt-8 text-center text-sm text-primary-foreground/60">
           <p>{content.footerMadeByText} <a href={content.footerMadeByLink} className="underline hover:text-accent-foreground">doare.org</a></p>
        </div>
      </div>
    </footer>
  );
}
