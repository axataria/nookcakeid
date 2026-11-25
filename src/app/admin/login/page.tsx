"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Gagal masuk. Periksa email dan password.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1E8] text-[#00332A] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle cutting mat background accent */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: "url(/stickers/cutting-mat-grid.svg)",
          backgroundSize: "320px",
        }}
      />

      <div className="relative z-10 w-full max-w-md bg-white rounded-[28px] border-2 border-[#D9D3C5] shadow-[0_20px_50px_-15px_rgba(0,51,42,0.14)] p-6 sm:p-8">
        <div className="flex flex-col items-center text-center mb-7">
          <Image
            src="/logo.png"
            alt="nook cake"
            width={1014}
            height={595}
            priority
            className="h-12 w-auto object-contain mb-3"
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E5B44]/10 border border-[#0E5B44]/20 text-[11px] font-mono font-bold text-[#0E5B44] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ADMIN PORTAL · OWNER ONLY</span>
          </div>
          <h1 className="font-display font-extrabold text-xl text-[#00332A]">
            Masuk Dapur Operasional
          </h1>
          <p className="font-mono text-xs text-[#687E6C] mt-1">
            admin.nookcake.shop
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="owner-email"
              className="block font-display font-bold text-xs text-[#00332A] mb-1.5"
            >
              Email Owner
            </label>
            <input
              id="owner-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@nookcake.shop"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#D9D3C5] text-sm font-mono text-[#00332A] placeholder:text-[#687E6C]/60 focus:outline-none focus:border-[#0E5B44] transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="owner-password"
              className="block font-display font-bold text-xs text-[#00332A] mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="owner-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#D9D3C5] text-sm font-mono text-[#00332A] placeholder:text-[#687E6C]/60 focus:outline-none focus:border-[#0E5B44] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#687E6C] hover:text-[#00332A]"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-[#BE123C]/8 border border-[#BE123C]/25 text-xs font-mono text-[#BE123C]"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#0E5B44] hover:bg-[#0B4A37] text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#0E5B44]/20 transition-all disabled:opacity-60"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? "Memverifikasi..." : "Masuk ke Admin"}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
