"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Download, Smartphone, WifiOff, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

interface AdminPwaContextValue {
  canInstall: boolean;
  isStandalone: boolean;
  isIosSafari: boolean;
  isOffline: boolean;
  triggerInstall: () => Promise<void>;
}

const AdminPwaContext = createContext<AdminPwaContextValue>({
  canInstall: false,
  isStandalone: false,
  isIosSafari: false,
  isOffline: false,
  triggerInstall: async () => {},
});

export function useAdminPwa() {
  return useContext(AdminPwaContext);
}

const INSTALL_BANNER_DISMISSED_KEY = "nook-admin-pwa-banner-dismissed";

export function AdminPwaProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIosSafari, setIsIosSafari] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;
    setIsStandalone(standalone);

    const ua = window.navigator.userAgent;
    const isIos = /iPad|iPhone|iPod/.test(ua);
    const isWebkit = /WebKit/.test(ua);
    const isCriOS = /CriOS|FxiOS|EdgiOS/.test(ua);
    setIsIosSafari(isIos && isWebkit && !isCriOS);

    setIsOffline(!window.navigator.onLine);

    try {
      const dismissed =
        window.localStorage.getItem(INSTALL_BANNER_DISMISSED_KEY) === "1";
      setBannerDismissed(dismissed);
    } catch {
      setBannerDismissed(false);
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch(() => {
          // Ignore SW registration failures in unsupported/restricted contexts
        });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const triggerInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const dismissBanner = () => {
    setBannerDismissed(true);
    try {
      window.localStorage.setItem(INSTALL_BANNER_DISMISSED_KEY, "1");
    } catch {
      // ignore storage errors
    }
  };

  const canInstall = Boolean(deferredPrompt) && !isStandalone;
  const showInstallBanner = canInstall && !bannerDismissed;

  return (
    <AdminPwaContext.Provider
      value={{
        canInstall,
        isStandalone,
        isIosSafari,
        isOffline,
        triggerInstall,
      }}
    >
      {isOffline && (
        <div
          role="status"
          className="sticky top-0 z-50 bg-[#BE123C] text-white px-4 py-2 text-xs font-mono flex items-center justify-center gap-2 pt-[calc(0.5rem+env(safe-area-inset-top))]"
        >
          <WifiOff className="w-3.5 h-3.5 shrink-0" />
          <span>Offline — data dapur tidak dapat disinkronkan</span>
        </div>
      )}

      {showInstallBanner && (
        <div className="md:hidden fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] inset-x-3 z-30 bg-[#00332A] text-white rounded-2xl p-3 shadow-xl border border-[#0E5B44] flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#0E5B44] flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-[#C4DE6E]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight truncate">
                Pasang nook admin
              </p>
              <p className="text-[10px] text-[#C4DE6E] truncate">
                Akses cepat dari layar utama HP
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={triggerInstall}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#C4DE6E] text-[#00332A] text-[11px] font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Pasang</span>
            </button>
            <button
              type="button"
              onClick={dismissBanner}
              aria-label="Tutup banner pasang aplikasi"
              className="p-1.5 text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {children}
    </AdminPwaContext.Provider>
  );
}
