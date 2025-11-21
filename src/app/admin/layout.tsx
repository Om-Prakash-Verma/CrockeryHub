'use client';
import { usePathname, useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin-header';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function AdminContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isUserLoading) return;

    const isAdmin = !!user?.email;

    if (!isAdmin && pathname !== '/login') {
      router.replace('/login');
    } else if (isAdmin && pathname === '/login') {
      router.replace('/admin');
    }
  }, [user, isUserLoading, pathname, router]);

  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (isUserLoading || !user?.email) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-4 text-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AdminHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <AdminContent>{children}</AdminContent>
    </FirebaseClientProvider>
  );
}
