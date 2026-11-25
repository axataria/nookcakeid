"use client";

import React from "react";
import { QuickChatPanel } from "@/components/admin/QuickChatPanel";

export default function AdminQuickChatPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-[#00332A]">
          Quick Chat Operasional
        </h1>
        <p className="font-mono text-xs text-[#687E6C]">
          Catat order, tambah stok bahan + harga, atau cek laba dalam satu ketikan.
        </p>
      </div>
      <QuickChatPanel />
    </div>
  );
}
