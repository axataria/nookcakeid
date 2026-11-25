/**
 * Tactile Spring Physics & Kinematics Helpers
 * Inspired by Emil Kowalski's craftsmanship philosophy
 * Project CISKEK (nook & cake.)
 */

export const springPhysics = {
  // Snappy yet soft tap feedback for buttons and pills
  tactile: { type: "spring" as const, stiffness: 450, damping: 25 },
  // Bottom sheet drawer (Vaul) natural momentum
  sheet: { type: "spring" as const, stiffness: 300, damping: 30 },
  // Smooth counter animation for quantity steppers
  counter: { type: "spring" as const, stiffness: 500, damping: 35 },
  // 3D camera and slice parallax smooth following
  parallax: { stiffness: 180, damping: 24, mass: 1.0 },
  // Slow settled presentation float
  breathe: { stiffness: 40, damping: 15, mass: 2.0 },
};

/**
 * Standard clamp utility
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Hermite smoothstep curve
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Cubic ease-out for tactile settling
 */
export function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - clamp(x, 0, 1), 3);
}

/**
 * Quintic ease-out for ultra-silky settling
 */
export function easeOutQuint(x: number): number {
  return 1 - Math.pow(1 - clamp(x, 0, 1), 5);
}

/**
 * Frame-rate independent exponential smoothing (Three.js damp analog)
 * @param current Current value
 * @param target Target destination
 * @param lambda Smoothing factor (higher = faster)
 * @param dt Delta time in seconds
 */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}
