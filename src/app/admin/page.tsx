'use client';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </div>
      <p>Welcome to the admin panel. Here you will be able to edit the page content.</p>
    </div>
  );
}
