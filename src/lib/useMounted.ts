'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to check if the component has mounted on the client.
 * Essential for components reading from localStorage (Zustand persist)
 * to prevent SSR hydration mismatches.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
