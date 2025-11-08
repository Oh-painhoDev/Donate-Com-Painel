'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This page now simply acts as a redirector to the main settings page.
export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/settings');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecionando...</p>
    </div>
  );
}
