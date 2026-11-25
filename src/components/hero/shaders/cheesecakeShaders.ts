import * as THREE from "three";
// Seeded value noise keeps baked detail identical across resize and replay.
function hash(x: number, y: number): number {
  let n = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}
function noise(x: number, y: number): number {
  const ix = Math.floor(x),
    iy = Math.floor(y);
  let u = x - ix,
    v = y - iy;
  u = u * u * (3 - 2 * u);
  v = v * v * (3 - 2 * v);
  return THREE.MathUtils.lerp(
    THREE.MathUtils.lerp(hash(ix, iy), hash(ix + 1, iy), u),
    THREE.MathUtils.lerp(hash(ix, iy + 1), hash(ix + 1, iy + 1), u),
    v,
  );
}
function fbm(x: number, y: number): number {
  let sum = 0,
    amp = 0.54;
  for (let i = 0; i < 5; i++) {
    sum += noise(x, y) * amp;
    x = x * 2.07 + 13.4;
    y = y * 2.07 + 7.8;
    amp *= 0.48;
  }
  return sum;
}
function makeTexture(
  width: number,
  height: number,
  pixel: (u: number, v: number, x: number, y: number) => number[],
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const data = ctx.createImageData(width, height);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const rgb = pixel(x / width, 1 - y / height, x, y),
        i = (y * width + x) * 4;
      data.data[i] = rgb[0];
      data.data[i + 1] = rgb[1];
      data.data[i + 2] = rgb[2];
      data.data[i + 3] = 255;
    }
  ctx.putImageData(data, 0, 0);
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
function blend(a: number[], b: number[], t: number) {
  return a.map((v, i) => v + (b[i] - v) * Math.max(0, Math.min(1, t)));
}

let cachedScorched: THREE.CanvasTexture | null = null;
let cachedCustard: THREE.CanvasTexture | null = null;
let cachedCrust: THREE.CanvasTexture | null = null;
let cachedKraft: THREE.CanvasTexture | null = null;

export function createBasqueScorchedTexture(size = 512) {
  if (cachedScorched) return cachedScorched;
  cachedScorched = makeTexture(size, size, (u, v, x, y) => {
    const dx = (u - 0.5) * 2,
      dy = (v - 0.5) * 2,
      r = Math.hypot(dx, dy);
    const broad = fbm(dx * 4.2 + 5, dy * 4.2 + 8),
      fine = fbm(dx * 35, dy * 35);
    const burn = THREE.MathUtils.smoothstep(
      broad * 0.85 + fine * 0.15,
      0.28,
      0.67,
    );
    let col = blend([182, 112, 49], [44, 22, 14], burn);
    const blister = Math.pow(noise(dx * 90 + 1, dy * 90 + 1), 9);
    col = blend(col, [226, 165, 89], blister * 0.6);
    const edge = THREE.MathUtils.smoothstep(r, 0.82, 1);
    col = blend(col, [111, 58, 28], edge * 0.4);
    const grain = (hash(x, y) - 0.5) * 12;
    return col.map((c) => c + grain);
  });
  return cachedScorched;
}
export function createCustardCrossSectionTexture(width = 512, height = 256) {
  if (cachedCustard) return cachedCustard;
  cachedCustard = makeTexture(width, height, (u, v, x, y) => {
    const edge = THREE.MathUtils.smoothstep(u, 0.78, 1);
    const center =
      1 - Math.min(1, Math.hypot((u - 0.18) * 0.8, (v - 0.5) * 1.5));
    let col = blend([229, 210, 172], [255, 244, 215], center);
    col = blend(col, [201, 167, 111], edge * 0.5);
    const grain = (fbm(u * 30, v * 20) - 0.5) * 12;
    const cx = Math.floor(u * 65),
      cy = Math.floor(v * 40),
      px = u * 65 - cx,
      py = v * 40 - cy;
    const pore = hash(cx, cy) > 0.85 && Math.hypot(px - 0.5, py - 0.5) < 0.14;
    if (pore) col = blend(col, [168, 139, 98], 0.3);
    if (v > 0.94)
      col = blend(col, [65, 34, 20], THREE.MathUtils.smoothstep(v, 0.94, 1));
    if (v < 0.09)
      col = blend(
        col,
        [58, 32, 23],
        1 - THREE.MathUtils.smoothstep(v, 0.04, 0.09),
      );
    return col.map((c) => c + grain + (hash(x, y) - 0.5) * 3);
  });
  return cachedCustard;
}
export function createBakedCrustTexture(width = 512, height = 256) {
  if (cachedCrust) return cachedCrust;
  cachedCrust = makeTexture(width, height, (u, v, x, y) => {
    const folds = Math.pow(
      0.5 + 0.5 * Math.sin(u * Math.PI * 88 + noise(u * 30, v * 7) * 3),
      6,
    );
    const toast = fbm(u * 18, v * 6);
    let col = blend(
      [235, 209, 164],
      [120, 65, 33],
      THREE.MathUtils.smoothstep(toast, 0.33, 0.73) * 0.9 + folds * 0.1,
    );
    col = blend(
      col,
      [58, 30, 20],
      THREE.MathUtils.smoothstep(v, 0.82, 1) * 0.9,
    );
    col = blend(
      col,
      [65, 35, 24],
      (1 - THREE.MathUtils.smoothstep(v, 0, 0.1)) * 0.75,
    );
    const fine = (noise(u * 260, v * 100) - 0.5) * 17 + (hash(x, y) - 0.5) * 6;
    return col.map((c) => c + fine);
  });
  return cachedCrust;
}
export function createKraftPaperTexture(size = 256) {
  if (cachedKraft) return cachedKraft;
  cachedKraft = makeTexture(size, size, (u, v, x, y) => {
    const grain = (hash(x, y) - 0.5) * 13 + noise(u * 80, v * 3) * 5;
    return [226 + grain, 213 + grain, 191 + grain];
  });
  return cachedKraft;
}
// Color maps use sRGB. Bump/roughness are independent scalar maps in linear space.
export function createSurfaceDetailMaps(
  source: THREE.CanvasTexture,
  strength = 0.5,
) {
  const canvas = source.image as HTMLCanvasElement,
    ctx = canvas.getContext("2d")!,
    data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const bump = makeTexture(canvas.width, canvas.height, (_u, _v, x, y) => {
    const i = (y * canvas.width + x) * 4;
    const lum =
      data.data[i] * 0.25 + data.data[i + 1] * 0.6 + data.data[i + 2] * 0.15;
    const n = lum * strength + (hash(x, y) - 0.5) * 30 + 90;
    return [n, n, n];
  });
  const roughness = makeTexture(canvas.width, canvas.height, (_u, _v, x, y) => {
    const i = (y * canvas.width + x) * 4;
    const n = 150 + (255 - data.data[i]) * 0.22;
    return [n, n, n];
  });
  bump.colorSpace = THREE.NoColorSpace;
  roughness.colorSpace = THREE.NoColorSpace;
  return { bump, roughness };
}
