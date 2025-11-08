'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
  Newspaper,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const menuItems = [
  { href: '/admin/settings', icon: Settings, label: 'Configurações Gerais' },
  { href: '/admin/settings#colors', icon: Palette, label: 'Aparência e Cores' },
  { href: '/admin/settings#header', icon: LayoutTemplate, label: 'Cabeçalho' },
  { href: '/admin/settings#donation', icon: Heart, label: 'Doações' },
  { href: '/admin/settings#news', icon: Newspaper, label: 'Notícias' },
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
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-6 w-6" />
             </div>
             <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-primary group-data-[collapsible=icon]:hidden">
                  SOS Paraná
                </h2>
                <p className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">Painel Admin</p>
             </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} className="w-full">
                  <SidebarMenuButton
                    tooltip={{children: item.label, side: 'right'}}
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
         <SidebarFooter>
            <SidebarMenu>
                 <SidebarMenuItem>
                    <button onClick={handleSignOut} className='w-full'>
                         <SidebarMenuButton
                            tooltip={{children: 'Sair', side: 'right'}}
                            className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:text-red-500 hover:bg-destructive/10 hover:text-destructive"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Sair</span>
                        </SidebarMenuButton>
                    </button>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b bg-background/50 backdrop-blur-sm px-6 sticky top-0 z-40">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-xl font-semibold text-foreground">Gerenciar Conteúdo do Site</h1>
            </div>
            <div className='hidden md:block'>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
            </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-gray-50/50">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
