'use client';
import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { FirebaseClientProvider } from '@/firebase';

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
    if (!isUserLoading && user && pathname === '/admin/login') {
      router.replace('/admin');
    }
  }, [user, isUserLoading, router, pathname]);

  if (isUserLoading || (!user && pathname !== '/admin/login')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return children;
}
