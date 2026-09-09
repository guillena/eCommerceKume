'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Star,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/productos', label: 'Productos', icon: Package, exact: false },
  { href: '/admin/ordenes', label: 'Órdenes', icon: ShoppingBag, exact: false },
  { href: '/admin/resenas', label: 'Reseñas', icon: Star, exact: false },
];

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 p-3 space-y-0.5">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-black text-white'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarLogo() {
  return (
    <div className="px-4 py-5 border-b border-neutral-200">
      <Link href="/" className="flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="kume logo" className="h-8 w-auto object-contain" />
      </Link>
      <p className="text-xs text-neutral-400 mt-2">Panel de administración</p>
    </div>
  );
}

function LogoutButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="p-3 border-t border-neutral-200">
      <button
        onClick={onClick}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Cerrar sesión
      </button>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r border-neutral-200 bg-white">
        <SidebarLogo />
        <NavLinks pathname={pathname} />
        <LogoutButton onClick={handleLogout} />
      </aside>

      {/* Mobile top bar */}
      <div className="flex lg:hidden items-center justify-between border-b border-neutral-200 bg-white px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="kume logo" className="h-6 w-auto object-contain" />
          <span className="text-xs font-normal text-neutral-400">admin</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-50 h-full w-56 flex flex-col bg-white border-r border-neutral-200 lg:hidden">
            <SidebarLogo />
            <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            <LogoutButton onClick={handleLogout} />
          </aside>
        </>
      )}
    </>
  );
}
