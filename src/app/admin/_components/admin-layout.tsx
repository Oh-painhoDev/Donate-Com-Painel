'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import {
  Settings,
  Image as ImageIcon,
  Palette,
  LayoutTemplate,
  Heart,
  Sparkles,
  MessageSquareQuote,
  HelpCircle,
  Footprints,
} from 'lucide-react';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const menuItems = [
  { href: '/admin/settings', icon: Settings, label: 'Configurações Gerais' },
  { href: '/admin/settings#colors', icon: Palette, label: 'Aparência e Cores' },
  { href: '/admin/settings#header', icon: LayoutTemplate, label: 'Cabeçalho' },
  { href: '/admin/settings#donation', icon: Heart, label: 'Doações' },
  { href: '/admin/settings#impact', icon: Sparkles, label: 'Visualizador de Impacto' },
  { href: '/admin/settings#about', icon: ImageIcon, label: 'Seção Sobre' },
  { href: '/admin/settings#credibility', icon: MessageSquareQuote, label: 'Depoimentos' },
  { href: '/admin/settings#faq', icon: HelpCircle, label: 'FAQ' },
  { href: '/admin/settings#footer', icon: Footprints, label: 'Rodapé' },
];

export function AdminPageLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/admin/login');
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
             <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
                <LayoutTemplate className="h-6 w-6" />
             </div>
             <h2 className="text-lg font-semibold text-primary">Painel</h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} className="w-full">
                  <SidebarMenuButton
                    tooltip={item.label}
                    className="group-data-[collapsible=icon]:justify-center"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.label}
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-lg font-semibold text-foreground">Gerenciar Conteúdo</h1>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sair
            </Button>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
