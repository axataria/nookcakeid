"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { ThreeCheesecakeEngine } from "./three/ThreeCheesecakeEngine";
interface Props {
  view: "scroll" | "whole" | "slice";
}
export function HeroCanvas({ view }: Props) {
  const viewRef = useRef(view);
  const updateRef = useRef<() => void>(() => {});
  const ref = useRef<HTMLCanvasElement>(null);
  const engine = useRef<ThreeCheesecakeEngine | null>(null);
  const [failed, setFailed] = useState(false);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!engine.current) return;
    if (isDragging.current) {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      engine.current.addDrag(dx, dy);
    }
    const canvas = ref.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      engine.current.setPointer(Math.max(-1, Math.min(1, nx)), Math.max(-1, Math.min(1, ny)));
    }
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    isDragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    let instance: ThreeCheesecakeEngine;
    try {
      instance = new ThreeCheesecakeEngine(ref.current);
      engine.current = instance;
    } catch {
      setFailed(true);
      return;
    }
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const hero =
        ref.current?.closest(".hero-parallax") ||
        ref.current?.closest("section");
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const range = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / range));
      instance.setScrollProgress(
        viewRef.current === "slice"
          ? 1
          : viewRef.current === "whole" || query.matches
            ? 0
            : progress,
      );
      instance.setParallaxProgress(query.matches ? 0 : progress);
    };
    let scrollFrame = 0;
    const onScroll = () => {
      if (!scrollFrame)
        scrollFrame = requestAnimationFrame(() => {
          scrollFrame = 0;
          update();
        });
    };
    updateRef.current = update;
    const preference = () => {
      instance.setReducedMotion(query.matches);
      update();
    };
    preference();
    query.addEventListener("change", preference);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Global ambient pointer parallax when hovering across the hero section
    const onHeroPointerMove = (e: PointerEvent) => {
      if (query.matches || isDragging.current) return;
      const hero =
        ref.current?.closest(".hero-parallax") ||
        ref.current?.closest("section");
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      instance.setPointer(
        Math.max(-1, Math.min(1, normX * 0.8)),
        Math.max(-1, Math.min(1, normY * 0.8)),
      );
    };
    window.addEventListener("pointermove", onHeroPointerMove, { passive: true });

    const resize = new ResizeObserver(() => {
      instance.resize();
      update();
    });
    resize.observe(ref.current);
    const visible = new IntersectionObserver((entries) =>
      instance.setActive(entries[0].isIntersecting && !document.hidden),
    );
    visible.observe(ref.current);
    const visibility = () =>
      instance.setActive(
        !document.hidden &&
          !!ref.current &&
          ref.current.getBoundingClientRect().bottom > 0 &&
          ref.current.getBoundingClientRect().top < innerHeight,
      );
    document.addEventListener("visibilitychange", visibility);
    const contextLost = (e: Event) => {
      e.preventDefault();
      instance.setActive(false);
      setFailed(true);
    };
    const canvas = ref.current;
    canvas.addEventListener("webglcontextlost", contextLost);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onHeroPointerMove);
      cancelAnimationFrame(scrollFrame);
      resize.disconnect();
      visible.disconnect();
      query.removeEventListener("change", preference);
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("webglcontextlost", contextLost);
      instance.dispose();
      engine.current = null;
    };
  }, []);
  useEffect(() => {
    viewRef.current = view;
    updateRef.current();
  }, [view]);
  return (
    <div className="relative w-full h-full select-none cursor-grab active:cursor-grabbing">
      {failed ? (
        <div className="fallback-label">
          <p>The Burnt Corner</p>
          <p>Mahkota karamel, custard lembut</p>
          <small>Pratinjau 3D tidak tersedia di perangkat ini</small>
        </div>
      ) : (
        <canvas
          ref={ref}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="w-full h-full block touch-pan-y"
          role="img"
          aria-label="Ilustrasi tiga dimensi Basque cheesecake interaktif. Geser untuk memutar atau melihat irisan."
        />
      )}
    </div>
  );
}
