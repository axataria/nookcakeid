'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquarePlus,
  ChefHat,
  Package,
  FileText,
  TrendingUp,
  Store,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const navItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      badge: 'KPI',
    },
    {
      label: 'Quick Chat',
      href: '/chat',
      icon: MessageSquarePlus,
      badge: 'Cepat',
    },
    {
      label: 'Kitchen & Oven',
      href: '/kitchen',
      icon: ChefHat,
      badge: 'Bake Prep',
    },
    {
      label: 'Inventory & MRP',
      href: '/inventory',
      icon: Package,
    },
    {
      label: 'Open PO & Supplier',
      href: '/procurement',
      icon: FileText,
    },
    {
      label: 'Profit & ROE',
      href: '/analytics',
      icon: TrendingUp,
      badge: 'ROE',
    },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  const storefrontUrl =
    typeof window !== 'undefined' && window.location.hostname.startsWith('admin.')
      ? `${window.location.protocol}//${window.location.host.replace(/^admin\./, '')}`
      : '/';

  const checkActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === '/admin';
    return pathname === href || pathname === `/admin${href}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col md:flex-row">
      {/* Mobile Top Header (< 768px) */}
      <header className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8E1D5] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="nook cake"
            width={1014}
            height={595}
            className="h-7 w-auto object-contain"
          />
          <span className="px-2 py-0.5 rounded-full bg-[#0E5B44]/10 text-[#0E5B44] text-[10px] font-mono font-bold">
            ADMIN
          </span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          aria-label="Keluar Owner"
          className="inline-flex items-center gap-1 text-xs font-mono text-[#78716C] hover:text-[#BE123C]"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </header>

      {/* Desktop / Tablet Sidebar (>= 768px) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-[#E8E1D5] flex-shrink-0 flex-col justify-between p-6 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="nook cake"
                width={1014}
                height={595}
                className="h-9 w-auto object-contain"
              />
              <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] text-[10px] font-bold">
                ERP
              </span>
            </div>
            <p className="text-xs text-[#78716C]">
              Solo Baker Kitchen &amp; Operations
            </p>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = checkActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#00332A] text-white shadow-md shadow-[#00332A]/15'
                      : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-[#C4DE6E] text-[#00332A]'
                          : 'bg-[#FEF3C7] text-[#B45309]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-[#E8E1D5] space-y-2.5">
          <a
            href={storefrontUrl}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[#E8E1D5] bg-white text-xs font-semibold text-[#1C1917] hover:border-[#0E5B44] transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-[#0E5B44]" />
            <span>Lihat Toko Pelanggan</span>
          </a>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FAF8F5] text-xs font-semibold text-[#78716C] hover:text-[#BE123C] hover:border-[#BE123C]/40 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? 'Keluar...' : 'Keluar Owner'}</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-grow p-4 sm:p-8 pb-24 md:pb-8 overflow-y-auto">
        {children}
      </main>

      {/* Mobile "Lainnya" Sheet */}
      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5 pb-8 space-y-3 border-t border-[#E8E1D5]">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E1D5]">
              <span className="font-display font-bold text-sm text-[#00332A]">
                Menu Operasional Lainnya
              </span>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="p-1 text-[#78716C]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Link
              href="/procurement"
              onClick={() => setMoreOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF8F5] text-sm font-semibold text-[#00332A]"
            >
              <FileText className="w-4 h-4 text-[#0E5B44]" />
              <span>Open PO &amp; Supplier</span>
            </Link>
            <Link
              href="/analytics"
              onClick={() => setMoreOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF8F5] text-sm font-semibold text-[#00332A]"
            >
              <TrendingUp className="w-4 h-4 text-[#0E5B44]" />
              <span>Profit, OPEX &amp; ROE</span>
            </Link>
            <a
              href={storefrontUrl}
              className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF8F5] text-sm font-semibold text-[#00332A]"
            >
              <Store className="w-4 h-4 text-[#0E5B44]" />
              <span>Lihat Toko Pelanggan</span>
            </a>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Navbar (< 768px) */}
      <nav
        aria-label="Navigasi cepat mobile"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E1D5] px-2 py-1.5 flex items-center justify-around shadow-[0_-8px_24px_rgba(0,0,0,0.06)]"
      >
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold ${
            checkActive('/') ? 'text-[#0E5B44]' : 'text-[#78716C]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/kitchen"
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold ${
            checkActive('/kitchen') ? 'text-[#0E5B44]' : 'text-[#78716C]'
          }`}
        >
          <ChefHat className="w-5 h-5" />
          <span>Orders</span>
        </Link>

        {/* Center Quick Chat Primary Action */}
        <Link
          href="/chat"
          className="-mt-5 flex flex-col items-center gap-0.5"
        >
          <span
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white transition-transform active:scale-95 ${
              checkActive('/chat')
                ? 'bg-[#00332A] text-[#C4DE6E]'
                : 'bg-[#0E5B44] text-white'
            }`}
          >
            <MessageSquarePlus className="w-5 h-5" />
          </span>
          <span className="text-[10px] font-mono font-bold text-[#0E5B44]">
            Quick Chat
          </span>
        </Link>

        <Link
          href="/inventory"
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold ${
            checkActive('/inventory') ? 'text-[#0E5B44]' : 'text-[#78716C]'
          }`}
        >
          <Package className="w-5 h-5" />
          <span>Stok</span>
        </Link>

        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold ${
            moreOpen || checkActive('/analytics') || checkActive('/procurement')
              ? 'text-[#0E5B44]'
              : 'text-[#78716C]'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span>Lainnya</span>
        </button>
      </nav>
    </div>
  );
}
