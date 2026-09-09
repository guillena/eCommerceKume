'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/store/Navbar';
import { Footer } from '@/components/store/Footer';

export function ShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    // Admin pages handle their own layout — render children directly
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
