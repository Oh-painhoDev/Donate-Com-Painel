/*
 * 
 *  ═══════════════════════════════════════════════════
 *   [USUÁRIO]: Painho_Dev
 *   [DISCORD]: painhodev
 *   [CARGO]: Criador Profissional de Bugs
 *   [HABILIDADES]: Criar bugs novos, Consertar bugs antigos
 *   [STATUS]: Funcionou na minha máquina! 🤷
 *  ═══════════════════════════════════════════════════
 *            \
 *             \     ^__^
 *              \   (oo)\_______
 *                 (__)\       )\/\\
 *                     ||----Ō |
 *                     ||     ||
 * 
 * 
 */
'use client';
import { useUser } from '@/firebase/hooks';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { AdminPageLayout } from './_components/admin-layout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading && !user && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
    // No redirect from /admin/login to /admin here, as the login page is now standalone.
    // Redirect to the main settings page if user is logged in and tries to access login.
    if (!isUserLoading && user && pathname === '/admin/login') {
      router.replace('/admin/settings');
    }
  }, [user, isUserLoading, router, pathname]);

  // While loading, or if trying to access a protected route without being logged in, show a loader.
  if (isUserLoading || (!user && pathname !== '/admin/login')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Carregando...</p>
      </div>
    );
  }

  // If on the login page, render it without the main admin layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // For all other admin pages, wrap them in the AdminPageLayout with sidebar
  return <AdminPageLayout>{children}</AdminPageLayout>;
}
