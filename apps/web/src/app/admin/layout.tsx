'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token && pathname !== '/admin/login') {
      router.replace('/admin/login');
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  // Login page renders without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!checked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-neutral-400">Verificando sesión...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
