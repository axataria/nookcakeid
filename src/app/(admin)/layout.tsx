'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChefHat,
  Package,
  FileText,
  TrendingUp,
  Store,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Kitchen & Oven',
      href: '/admin/kitchen',
      icon: ChefHat,
      badge: 'Bake Prep',
    },
    {
      label: 'Inventory & MRP',
      href: '/admin/inventory',
      icon: Package,
    },
    {
      label: 'Open PO & Supplier',
      href: '/admin/procurement',
      icon: FileText,
    },
    {
      label: 'Profit & Unit Econ',
      href: '/admin/analytics',
      icon: TrendingUp,
      badge: '51.8% GM',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col md:flex-row">
      {/* Sidebar for Desktop & Tablet */}
      <aside className="w-full md:w-64 bg-white border-r border-[#E8E1D5] flex-shrink-0 flex flex-col justify-between p-6">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-xl tracking-tight text-[#1C1917]">
                nook &amp; cake<span className="text-[#D97706]">.</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] text-[10px] font-bold">
                ERP
              </span>
            </div>
            <p className="text-xs text-[#78716C]">
              Solo Baker Kitchen &amp; Operations
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#1C1917] text-white shadow-md shadow-[#1C1917]/10'
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
                          ? 'bg-[#D97706] text-white'
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

        {/* Solo Baker Guard Status */}
        <div className="pt-6 border-t border-[#E8E1D5] space-y-3">
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#1C1917]">Solo Baker Quota:</span>
              <span className="text-[#15803D] font-bold">12 / 16 Bento</span>
            </div>
            <div className="w-full bg-[#E8E1D5] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#D97706] h-full rounded-full w-[75%]" />
            </div>
            <span className="text-[10px] text-[#78716C] block">
              Batas optimal 16 bento/hari terjaga.
            </span>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[#E8E1D5] bg-white text-xs font-semibold text-[#1C1917] hover:border-[#D97706] transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Lihat Toko Pelanggan</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-grow p-4 sm:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
