import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  createBasqueScorchedTexture,
  createCustardCrossSectionTexture,
  createBakedCrustTexture,
  createKraftPaperTexture,
  createSurfaceDetailMaps,
} from "../shaders/cheesecakeShaders";
import { damp, easeOutCubic } from "@/lib/spring-physics";

/**
 * Creates a parametric Sector BufferGeometry for a Basque Cheesecake.
 * Generates:
 * 1. Sunken concave scorched top surface with organic wavy rim
 * 2. Outer curved baked crust wall
 * 3. Bottom base plate
 * 4. Radial cut planes exposing the custard interior
 */
function createCheesecakeSectorGeometry(
  startAngle: number,
  endAngle: number,
  radius = 2.1,
  height = 1.25,
  sunkenDepth = 0.38,
  angularSegments = 100,
  radialSegments = 36,
): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const radiusAt = (theta: number) =>
    radius * (1 + 0.009 * Math.sin(theta * 13) + 0.006 * Math.cos(theta * 23));
  const getTopY = (r: number, theta: number) => {
    const normR = r / radius;
    const depression = sunkenDepth * Math.pow(1 - normR, 1.6);
    const rimRipple = 0.055 * Math.sin(theta * 9.0) * Math.pow(normR, 2);
    return (
      height -
      depression +
      rimRipple +
      0.012 * Math.sin(r * 31 + theta * 17) * Math.sin(r * 23 - theta * 11)
    );
  };

  // 1. TOP SUNKEN CAP
  const topVertexOffset = positions.length / 3;
  for (let ri = 0; ri <= radialSegments; ri++) {
    const r = (ri / radialSegments) * radius;
    for (let ai = 0; ai <= angularSegments; ai++) {
      const frac = ai / angularSegments;
      const theta = startAngle + frac * (endAngle - startAngle);
      const x = ((r * radiusAt(theta)) / radius) * Math.sin(theta);
      const z = ((r * radiusAt(theta)) / radius) * Math.cos(theta);
      const y = getTopY(r, theta);

      positions.push(x, y, z);
      uvs.push(0.5 + x / (radius * 2.1), 0.5 + z / (radius * 2.1));

      const normR = r / radius;
      const slope = (sunkenDepth / radius) * 1.5 * (1 - normR);
      const nx = -slope * Math.sin(theta);
      const nz = -slope * Math.cos(theta);
      const ny = 1.0;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      normals.push(nx / len, ny / len, nz / len);
    }
  }

  for (let ri = 0; ri < radialSegments; ri++) {
    for (let ai = 0; ai < angularSegments; ai++) {
      const a = topVertexOffset + ri * (angularSegments + 1) + ai;
      const b = topVertexOffset + (ri + 1) * (angularSegments + 1) + ai;
      const c = topVertexOffset + (ri + 1) * (angularSegments + 1) + (ai + 1);
      const d = topVertexOffset + ri * (angularSegments + 1) + (ai + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  // 2. BOTTOM BASE CAP (Flat at y = 0)
  const bottomVertexOffset = positions.length / 3;
  for (let ri = 0; ri <= radialSegments; ri++) {
    const r = (ri / radialSegments) * radius;
    for (let ai = 0; ai <= angularSegments; ai++) {
      const frac = ai / angularSegments;
      const theta = startAngle + frac * (endAngle - startAngle);
      positions.push(
        ((r * radiusAt(theta)) / radius) * Math.sin(theta),
        0,
        ((r * radiusAt(theta)) / radius) * Math.cos(theta),
      );
      uvs.push(
        0.5 + (r * Math.sin(theta)) / (radius * 2),
        0.5 + (r * Math.cos(theta)) / (radius * 2),
      );
      normals.push(0, -1, 0);
    }
  }

  for (let ri = 0; ri < radialSegments; ri++) {
    for (let ai = 0; ai < angularSegments; ai++) {
      const a = bottomVertexOffset + ri * (angularSegments + 1) + ai;
      const b = bottomVertexOffset + (ri + 1) * (angularSegments + 1) + ai;
      const c =
        bottomVertexOffset + (ri + 1) * (angularSegments + 1) + (ai + 1);
      const d = bottomVertexOffset + ri * (angularSegments + 1) + (ai + 1);
      indices.push(a, d, b);
      indices.push(b, d, c);
    }
  }

  // 3. OUTER CURVED CRUST WALL
  const outerWallOffset = positions.length / 3;
  const heightSegments = 24;
  for (let hi = 0; hi <= heightSegments; hi++) {
    const v = hi / heightSegments;
    for (let ai = 0; ai <= angularSegments; ai++) {
      const frac = ai / angularSegments;
      const theta = startAngle + frac * (endAngle - startAngle);
      const topY = getTopY(radius, theta);
      const y = v * topY;
      const bulge = 0.04 * Math.sin(v * Math.PI);
      const r =
        radiusAt(theta) +
        bulge +
        0.018 *
          Math.sin(theta * 39 + v * 4 + Math.sin(theta * 11)) *
          Math.sin(v * Math.PI);

      positions.push(r * Math.sin(theta), y, r * Math.cos(theta));
      uvs.push(frac, v);
      normals.push(Math.sin(theta), 0, Math.cos(theta));
    }
  }

  for (let hi = 0; hi < heightSegments; hi++) {
    for (let ai = 0; ai < angularSegments; ai++) {
      const a = outerWallOffset + hi * (angularSegments + 1) + ai;
      const b = outerWallOffset + (hi + 1) * (angularSegments + 1) + ai;
      const c = outerWallOffset + (hi + 1) * (angularSegments + 1) + (ai + 1);
      const d = outerWallOffset + hi * (angularSegments + 1) + (ai + 1);
      indices.push(a, d, b);
      indices.push(b, d, c);
    }
  }

  // 4. RADIAL CUT PLANES (Custard Cross-Section)
  const addRadialCutPlane = (angle: number, isStartAngle: boolean) => {
    const cutOffset = positions.length / 3;
    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);
    const nx = isStartAngle ? -cosA : cosA;
    const nz = isStartAngle ? sinA : -sinA;

    for (let hi = 0; hi <= heightSegments; hi++) {
      const v = hi / heightSegments;
      for (let ri = 0; ri <= radialSegments; ri++) {
        const u = ri / radialSegments;
        const r = u * radius;
        const topY = getTopY(r, angle);
        const y = v * topY;

        positions.push(
          ((r * radiusAt(angle)) / radius) * sinA,
          y,
          ((r * radiusAt(angle)) / radius) * cosA,
        );
        uvs.push(u, v);
        normals.push(nx, 0, nz);
      }
    }

    for (let hi = 0; hi < heightSegments; hi++) {
      for (let ri = 0; ri < radialSegments; ri++) {
        const a = cutOffset + hi * (radialSegments + 1) + ri;
        const b = cutOffset + (hi + 1) * (radialSegments + 1) + ri;
        const c = cutOffset + (hi + 1) * (radialSegments + 1) + (ri + 1);
        const d = cutOffset + hi * (radialSegments + 1) + (ri + 1);

        if (isStartAngle) {
          indices.push(a, d, b);
          indices.push(b, d, c);
        } else {
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }
    }
  };

  addRadialCutPlane(startAngle, true);
  addRadialCutPlane(endAngle, false);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  const capCount = radialSegments * angularSegments * 6;
  const wallCount = heightSegments * angularSegments * 6;
  geometry.addGroup(0, capCount, 0);
  geometry.addGroup(capCount, capCount, 2);
  geometry.addGroup(capCount * 2, wallCount, 1);
  geometry.addGroup(
    capCount * 2 + wallCount,
    indices.length - capCount * 2 - wallCount,
    2,
  );
  geometry.computeVertexNormals();

  return geometry;
}

/**
 * Creates crinkled bakery parchment paper underneath the cake sector.
 */
function createParchmentPaperGeometry(
  startAngle: number,
  endAngle: number,
  radius = 2.4,
): THREE.BufferGeometry {
  const segments = 48;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  positions.push(0, -0.015, 0);
  uvs.push(0.5, 0.5);

  for (let i = 0; i <= segments; i++) {
    const frac = i / segments;
    const theta = startAngle + frac * (endAngle - startAngle);
    const crinkle =
      0.08 * Math.sin(theta * 14.0) + 0.04 * Math.cos(theta * 27.0);
    const r = radius + crinkle;
    const x = r * Math.sin(theta);
    const z = r * Math.cos(theta);
    const y = 0.02 * Math.sin(theta * 9.0) - 0.01;

    positions.push(x, y, z);
    uvs.push(0.5 + x / (radius * 2.2), 0.5 + z / (radius * 2.2));
  }

  for (let i = 1; i <= segments; i++) {
    indices.push(0, i, i + 1);
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

/**
 * Pure Three.js Engine for the Interactive Basque Cheesecake Hero
 */
export class ThreeCheesecakeEngine {
  private canvas: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animFrameId: number | null = null;
  private lastTime = 0;

  // Scene Objects
  private baseCakeGroup = new THREE.Group();
  private sliceGroup = new THREE.Group();
  private cakePivot = new THREE.Group();

  // State
  private scrollProgress = 0;
  private parallaxProgress = 0;
  private tiltAxis = new THREE.Vector3(
    Math.cos(Math.PI * 0.6),
    0,
    -Math.sin(Math.PI * 0.6),
  );
  private pointerX = 0;
  private pointerY = 0;
  private isReducedMotion = false;
  private sliceShadowMesh!: THREE.Mesh;

  // Interactive Drag & Mouse Animation
  private dragYaw = 0;
  private dragPitch = 0;
  private dragVelocityYaw = 0;
  private dragVelocityPitch = 0;

  // Kinematic Targets
  private sliceCurrentX = 0;
  private sliceCurrentY = 0;
  private sliceCurrentZ = 0;
  private sliceCurrentRotX = 0;

  private cameraCurrentX = 3.4;
  private cameraCurrentY = 3.0;
  private cameraCurrentZ = 4.6;
  private cameraLookAt = new THREE.Vector3(0, 0.4, 0);

  // Materials & Geometries for disposal
  private disposables: { dispose: () => void }[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.init();
  }

  private init() {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;

    // 1. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // 2. Scene & Camera Setup
    this.scene = new THREE.Scene();
    const studio = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const environment = pmrem.fromScene(studio, 0.05);
    this.scene.environment = environment.texture;
    this.scene.environmentIntensity = 0.3;
    this.disposables.push(environment);
    studio.dispose();
    pmrem.dispose();
    const isMobile = width < 768;
    this.camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    this.cameraCurrentX = isMobile ? 4.4 : 4.0;
    this.cameraCurrentY = isMobile ? 3.8 : 3.5;
    this.cameraCurrentZ = isMobile ? 6.2 : 5.8;
    this.camera.position.set(
      this.cameraCurrentX,
      this.cameraCurrentY,
      this.cameraCurrentZ,
    );
    this.camera.lookAt(this.cameraLookAt);

    // 3. Studio Lighting
    this.setupLighting();

    // 4. Contact Shadow
    this.setupContactShadow();

    // 5. Construct Cake & Berries
    this.buildCheesecake();

    // 6. Start Render Loop
    this.lastTime = performance.now();
    this.animate = this.animate.bind(this);
    this.animFrameId = requestAnimationFrame(this.animate);
  }

  private setupLighting() {
    // Warm Ambient
    const ambient = new THREE.AmbientLight(0xfaf7f2, 0.65);
    this.scene.add(ambient);

    // Primary Amber Key Light
    const keyLight = new THREE.DirectionalLight(0xfff1d6, 2.2);
    keyLight.position.set(4.5, 7.0, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0001;
    this.scene.add(keyLight);

    // Soft Fill Light
    const fillLight = new THREE.DirectionalLight(0xffedd5, 0.8);
    fillLight.position.set(-3.5, 2.5, 3.5);
    this.scene.add(fillLight);

    // Cool Silhouette Rim Light
    const rimLight = new THREE.DirectionalLight(0xe2e8f0, 1.5);
    rimLight.position.set(-4.5, 5.0, -4.5);
    this.scene.add(rimLight);

    // Berry Specular Point Light
    const berryGlisten = new THREE.PointLight(0xffffff, 1.2, 8);
    berryGlisten.position.set(0, 4.2, 0.5);
    this.scene.add(berryGlisten);
  }

  private setupContactShadow() {
    // Soft radial gradient canvas for contact shadow
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const ctx = shadowCanvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 120);
      gradient.addColorStop(0, "rgba(38, 28, 20, 0.38)");
      gradient.addColorStop(0.35, "rgba(38, 28, 20, 0.22)");
      gradient.addColorStop(0.7, "rgba(38, 28, 20, 0.08)");
      gradient.addColorStop(1, "rgba(38, 28, 20, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);
    }

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    this.disposables.push(shadowTexture);

    const shadowGeo = new THREE.PlaneGeometry(6.2, 6.2);
    this.disposables.push(shadowGeo);

    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });
    this.disposables.push(shadowMat);

    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.04;
    this.scene.add(shadowMesh);

    // Dedicated separated contact shadow for the detaching 1/5 slice
    const sliceShadowGeo = new THREE.PlaneGeometry(2.6, 2.6);
    this.disposables.push(sliceShadowGeo);
    const sliceShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.35,
    });
    this.disposables.push(sliceShadowMat);
    this.sliceShadowMesh = new THREE.Mesh(sliceShadowGeo, sliceShadowMat);
    this.sliceShadowMesh.rotation.x = -Math.PI / 2;
    this.sliceShadowMesh.position.y = -0.038;
    this.scene.add(this.sliceShadowMesh);
  }

  private buildCheesecake() {
    // In-memory Procedural Textures
    const scorchedTexture = createBasqueScorchedTexture();
    const custardTexture = createCustardCrossSectionTexture();
    const bakedCrustTexture = createBakedCrustTexture();
    const kraftTexture = createKraftPaperTexture();

    this.disposables.push(
      scorchedTexture,
      custardTexture,
      bakedCrustTexture,
      kraftTexture,
    );

    const topDetail = createSurfaceDetailMaps(scorchedTexture, 0.7);
    const wallDetail = createSurfaceDetailMaps(bakedCrustTexture, 0.5);
    const creamDetail = createSurfaceDetailMaps(custardTexture, 0.2);
    this.disposables.push(
      topDetail.bump,
      topDetail.roughness,
      wallDetail.bump,
      wallDetail.roughness,
      creamDetail.bump,
      creamDetail.roughness,
    );
    // Shared Materials
    const cakeMaterial = new THREE.MeshPhysicalMaterial({
      clearcoat: 0.14,
      clearcoatRoughness: 0.6,
      map: scorchedTexture,
      roughness: 1,
      roughnessMap: topDetail.roughness,
      metalness: 0,
      bumpMap: topDetail.bump,
      bumpScale: 0.065,
    });

    const wallMaterial = new THREE.MeshStandardMaterial({
      map: bakedCrustTexture,
      color: 0xffffff,
      roughness: 1,
      roughnessMap: wallDetail.roughness,
      bumpMap: wallDetail.bump,
      bumpScale: 0.07,
    });
    const interiorMaterial = new THREE.MeshPhysicalMaterial({
      map: custardTexture,
      color: 0xffffff,
      roughness: 0.48,
      bumpMap: creamDetail.bump,
      bumpScale: 0.025,
      clearcoat: 0.12,
      clearcoatRoughness: 0.45,
    });
    const cakeMaterials = [cakeMaterial, wallMaterial, interiorMaterial];
    this.disposables.push(wallMaterial, interiorMaterial);
    const parchmentMaterial = new THREE.MeshStandardMaterial({
      map: kraftTexture,
      roughness: 0.95,
      metalness: 0.0,
      color: 0xdec8ba,
      side: THREE.DoubleSide,
    });

    this.disposables.push(cakeMaterial, parchmentMaterial);

    // Sector angles: 1 Whole Cake = 5 Slices (72 deg / 1.2566 rad each)
    const sliceAngle = (2 * Math.PI) / 5; // 72 deg
    const startSliceAngle = Math.PI * 0.4;
    const endSliceAngle = startSliceAngle + sliceAngle;

    // --- 1. BASE CAKE BODY (4 Slices = 288 deg) ---
    const baseGeo = createCheesecakeSectorGeometry(
      endSliceAngle,
      startSliceAngle + 2 * Math.PI,
    );
    this.disposables.push(baseGeo);
    const baseMesh = new THREE.Mesh(baseGeo, cakeMaterials);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    this.baseCakeGroup.add(baseMesh);

    const baseParchmentGeo = createParchmentPaperGeometry(
      endSliceAngle,
      startSliceAngle + 2 * Math.PI,
    );
    this.disposables.push(baseParchmentGeo);
    const baseParchmentMesh = new THREE.Mesh(
      baseParchmentGeo,
      parchmentMaterial,
    );
    baseParchmentMesh.receiveShadow = true;
    this.baseCakeGroup.add(baseParchmentMesh);

    // Berries on Base Cake
    const baseBerries = this.createBerryCrown(false);
    this.baseCakeGroup.add(baseBerries);

    // --- 2. DETACHED SLICE (1 Slice = 72 deg) ---
    const sliceGeo = createCheesecakeSectorGeometry(
      startSliceAngle,
      endSliceAngle,
    );
    this.disposables.push(sliceGeo);
    const sliceMesh = new THREE.Mesh(sliceGeo, cakeMaterials);
    sliceMesh.castShadow = true;
    sliceMesh.receiveShadow = true;
    this.sliceGroup.add(sliceMesh);

    const sliceParchmentGeo = createParchmentPaperGeometry(
      startSliceAngle,
      endSliceAngle,
      2.3,
    );
    this.disposables.push(sliceParchmentGeo);
    const sliceParchmentMesh = new THREE.Mesh(
      sliceParchmentGeo,
      parchmentMaterial,
    );
    sliceParchmentMesh.receiveShadow = true;
    this.sliceGroup.add(sliceParchmentMesh);

    // Berries on Slice
    const sliceBerries = this.createBerryCrown(true);
    this.sliceGroup.add(sliceBerries);

    // Assemble groups into pivot
    this.cakePivot.add(this.baseCakeGroup);
    this.cakePivot.add(this.sliceGroup);
    this.scene.add(this.cakePivot);
  }

  private createBerryCrown(forSliceOnly: boolean): THREE.Group {
    const group = new THREE.Group();

    // Blackberry Drupelet Material
    const blackberryMat = new THREE.MeshPhysicalMaterial({
      color: 0x150512,
      roughness: 0.42,
      metalness: 0,
      clearcoat: 0.25,
      clearcoatRoughness: 0.4,
      reflectivity: 0.45,
      envMapIntensity: 0.25,
    });
    this.disposables.push(blackberryMat);

    // Raspberry Drupelet Material
    const raspberryMat = new THREE.MeshPhysicalMaterial({
      color: 0xbe123c,
      roughness: 0.35,
      transmission: 0,
      thickness: 0.5,
      ior: 1.45,
    });
    this.disposables.push(raspberryMat);

    // Blueberry Material
    const blueberryMat = new THREE.MeshStandardMaterial({
      color: 0x222e3e,
      roughness: 0.42,
    });
    this.disposables.push(blueberryMat);

    // Viscous Syrup Material
    const syrupMat = new THREE.MeshPhysicalMaterial({
      color: 0x881337,
      roughness: 0.06,
      transmission: 0.72,
      ior: 1.42,
      transparent: true,
      opacity: 0.88,
    });
    this.disposables.push(syrupMat);

    // Sage Mint Leaf Material
    const mintMat = new THREE.MeshStandardMaterial({
      color: 0x4d7c0f,
      roughness: 0.55,
      side: THREE.DoubleSide,
    });
    this.disposables.push(mintMat);

    // Helper: Build a single blackberry
    const addBlackberry = (
      pos: [number, number, number],
      rot: [number, number, number],
      scale: number,
    ) => {
      const berryGroup = new THREE.Group();
      berryGroup.position.set(...pos);
      berryGroup.rotation.set(...rot);
      berryGroup.scale.setScalar(scale);

      // Receptacle
      const recGeo = new THREE.CylinderGeometry(0.07, 0.12, 0.32, 8);
      const recMat = new THREE.MeshStandardMaterial({
        color: 0x0c040b,
        roughness: 0.7,
      });
      const recMesh = new THREE.Mesh(recGeo, recMat);
      recMesh.position.y = -0.02;
      berryGroup.add(recMesh);
      this.disposables.push(recGeo, recMat);

      // Instanced Drupelets
      const count = 52;
      const sphereGeo = new THREE.SphereGeometry(1, 10, 8);
      this.disposables.push(sphereGeo);
      const instMesh = new THREE.InstancedMesh(sphereGeo, blackberryMat, count);
      instMesh.castShadow = true;

      const dummy = new THREE.Object3D();
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      for (let i = 0; i < count; i++) {
        const t = i / (count - 1);
        const y = (1 - t) * 0.38 - 0.17;
        const r = Math.sin(t * Math.PI * 0.85) * 0.22 + 0.04;
        const theta = 2 * Math.PI * goldenRatio * i;
        dummy.position.set(Math.cos(theta) * r, y, Math.sin(theta) * r);
        dummy.scale.setScalar(0.065 * (0.8 + 0.3 * Math.sin(t * Math.PI)));
        dummy.updateMatrix();
        instMesh.setMatrixAt(i, dummy.matrix);
      }
      instMesh.instanceMatrix.needsUpdate = true;
      berryGroup.add(instMesh);
      group.add(berryGroup);
    };

    // Helper: Build a single raspberry
    const addRaspberry = (
      pos: [number, number, number],
      rot: [number, number, number],
      scale: number,
    ) => {
      const berryGroup = new THREE.Group();
      berryGroup.position.set(...pos);
      berryGroup.rotation.set(...rot);
      berryGroup.scale.setScalar(scale);

      const count = 48;
      const sphereGeo = new THREE.SphereGeometry(1, 10, 8);
      this.disposables.push(sphereGeo);
      const instMesh = new THREE.InstancedMesh(sphereGeo, raspberryMat, count);
      instMesh.castShadow = true;

      const dummy = new THREE.Object3D();
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      for (let i = 0; i < count; i++) {
        const t = i / (count - 1);
        const y = (1 - t) * 0.34 - 0.15;
        const r = Math.sin(t * Math.PI * 0.88) * 0.24 + 0.06;
        const theta = 2 * Math.PI * goldenRatio * i;
        dummy.position.set(Math.cos(theta) * r, y, Math.sin(theta) * r);
        dummy.scale.setScalar(0.06 * (0.85 + 0.25 * Math.sin(t * Math.PI)));
        dummy.updateMatrix();
        instMesh.setMatrixAt(i, dummy.matrix);
      }
      instMesh.instanceMatrix.needsUpdate = true;
      berryGroup.add(instMesh);
      group.add(berryGroup);
    };

    // Helper: Build a single blueberry
    const addBlueberry = (
      pos: [number, number, number],
      rot: [number, number, number],
      scale: number,
    ) => {
      const berryGroup = new THREE.Group();
      berryGroup.position.set(...pos);
      berryGroup.rotation.set(...rot);
      berryGroup.scale.setScalar(scale);

      const sphereGeo = new THREE.SphereGeometry(0.19, 24, 16);
      this.disposables.push(sphereGeo);
      const mesh = new THREE.Mesh(sphereGeo, blueberryMat);
      mesh.scale.set(1.0, 0.88, 1.0);
      mesh.castShadow = true;
      berryGroup.add(mesh);
      const calyxMaterial = new THREE.MeshStandardMaterial({
        color: 0x48515b,
        roughness: 0.85,
      });
      const calyxGeometry = new THREE.SphereGeometry(0.018, 6, 4);
      this.disposables.push(calyxMaterial, calyxGeometry);
      for (let petal = 0; petal < 5; petal++) {
        const theta = (petal * Math.PI * 2) / 5;
        const sepal = new THREE.Mesh(calyxGeometry, calyxMaterial);
        sepal.position.set(
          Math.cos(theta) * 0.035,
          0.164,
          Math.sin(theta) * 0.035,
        );
        sepal.scale.set(1, 0.25, 1.9);
        sepal.rotation.y = -theta;
        berryGroup.add(sepal);
      }
      group.add(berryGroup);
    };

    // Helper: Build a mint leaf
    const addMintLeaf = (
      pos: [number, number, number],
      rot: [number, number, number],
      scale: number,
    ) => {
      const leafGeo = new THREE.ConeGeometry(0.24, 0.6, 5);
      this.disposables.push(leafGeo);
      const leafMesh = new THREE.Mesh(leafGeo, mintMat);
      leafMesh.position.set(...pos);
      leafMesh.rotation.set(...rot);
      leafMesh.scale.set(scale, scale * 0.3, scale);
      group.add(leafMesh);
    };

    // Helper: Build syrup drip
    const addSyrupDrop = (pos: [number, number, number], scale: number) => {
      const dropGeo = new THREE.SphereGeometry(0.12, 8, 8);
      this.disposables.push(dropGeo);
      const dropMesh = new THREE.Mesh(dropGeo, syrupMat);
      dropMesh.position.set(...pos);
      dropMesh.scale.set(scale, scale * 1.5, scale);
      group.add(dropMesh);
    };

    if (forSliceOnly) {
      // Berry cluster sitting on the 1/5th detached slice
      addRaspberry([1.0, 1.3, -0.3], [0.15, -0.4, 0.2], 0.95);
      addBlueberry([1.22, 1.28, -0.52], [-0.1, 0.5, 0.1], 1.0);
      addBlackberry([0.9, 1.32, -0.12], [0.2, 0.3, -0.1], 0.88);
      addMintLeaf([1.12, 1.34, -0.22], [0.3, 0.9, -0.2], 0.85);
      addSyrupDrop([1.0, 1.2, -0.26], 0.75);
    } else {
      // Crown berries distributed on the 4/5th base cake
      addBlackberry([-0.35, 1.34, 0.45], [0.2, 0.4, -0.1], 1.15);
      addRaspberry([-0.72, 1.32, -0.15], [-0.15, 0.8, 0.25], 1.05);
      addBlueberry([-0.55, 1.29, 0.85], [0.1, -0.3, 0.2], 1.1);
      addRaspberry([0.15, 1.35, -0.65], [0.3, -0.6, -0.2], 1.1);
      addBlackberry([-0.25, 1.36, -0.55], [-0.2, 0.5, 0.1], 1.0);
      addBlueberry([0.55, 1.31, -0.45], [0.05, 0.7, -0.15], 1.05);
      addBlueberry([-0.85, 1.28, 0.35], [-0.2, 0.4, 0.1], 0.95);
      addMintLeaf([-0.45, 1.38, 0.25], [-0.4, 1.2, 0.3], 1.0);
      addMintLeaf([0.35, 1.35, -0.75], [0.5, -0.8, -0.4], 0.85);
      addSyrupDrop([-0.68, 1.22, 0.65], 0.9);
      addSyrupDrop([0.38, 1.24, -0.82], 0.8);
    }

    return group;
  }

  private lastInteraction = performance.now();
  private requestRender() {
    this.lastInteraction = performance.now();
    if (this.active && this.animFrameId === null) {
      this.lastTime = performance.now();
      this.animFrameId = requestAnimationFrame(this.animate);
    }
  }
  public setScrollProgress(progress: number) {
    this.scrollProgress = Math.max(0, Math.min(progress, 1));
    this.requestRender();
  }

  public setParallaxProgress(progress: number) {
    this.parallaxProgress = Math.max(0, Math.min(1, progress));
    this.requestRender();
  }
  public setPointer(x: number, y: number) {
    this.pointerX = x;
    this.pointerY = y;
    this.requestRender();
  }

  public addDrag(deltaX: number, deltaY: number) {
    this.dragYaw += deltaX * 0.007;
    this.dragPitch = Math.max(-0.35, Math.min(0.35, this.dragPitch + deltaY * 0.006));
    this.dragVelocityYaw = deltaX * 0.006;
    this.dragVelocityPitch = deltaY * 0.005;
    this.requestRender();
  }

  public setReducedMotion(reduced: boolean) {
    this.isReducedMotion = reduced;
    this.requestRender();
  }

  public resize() {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    this.requestRender();
  }

  private active = true;
  public setActive(active: boolean) {
    if (this.active === active) return;
    this.active = active;
    if (!active && this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (active) {
      this.lastTime = performance.now();
      this.animFrameId = requestAnimationFrame(this.animate);
    }
  }
  private animate(currentTime: number) {
    this.animFrameId = requestAnimationFrame(this.animate);

    const delta = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    const s = this.scrollProgress;
    const orbit = this.parallaxProgress;

    // -----------------------------------------------------------------------
    // 1. KINEMATIC SLICE DETACHMENT (72Â° Sector)
    // -----------------------------------------------------------------------
    if (this.isReducedMotion) {
      const angle = Math.PI * 0.6;
      this.sliceGroup.position.set(
        Math.sin(angle) * 1.7 * s,
        0,
        Math.cos(angle) * 1.7 * s,
      );
      this.sliceGroup.quaternion.setFromAxisAngle(
        this.tiltAxis,
        ((8 * Math.PI) / 180) * s,
      );
      this.sliceCurrentX = this.sliceGroup.position.x;
      this.sliceCurrentY = 0;
      this.sliceCurrentZ = this.sliceGroup.position.z;
      this.sliceCurrentRotX = ((8 * Math.PI) / 180) * s;
    } else {
      // Detachment progression: starts at s = 0.15, completes at s = 0.75
      const sliceTau = Math.max(0, Math.min((s - 0.15) / 0.6, 1.0));
      const easedTau = easeOutCubic(sliceTau);

      // Radial vector pointing along the bisector of the slice wedge
      const sliceBisectorAngle = Math.PI * 0.4 + (2 * Math.PI) / 10; // ~108 deg
      const radialDirX = Math.sin(sliceBisectorAngle);
      const radialDirZ = Math.cos(sliceBisectorAngle);

      // Radial translation distance: up to 1.7 units outward
      const targetDist = 1.7 * easedTau;
      const targetX = radialDirX * targetDist;
      const targetZ = radialDirZ * targetDist;

      // Arc elevation: gentle lift while separating
      const targetY = 0.22 * Math.sin(Math.PI * easedTau);

      // Presentation tilt: tilts 8 deg forward to showcase molten core
      const targetRotX = ((8 * Math.PI) / 180) * easedTau;

      this.sliceCurrentX = damp(this.sliceCurrentX, targetX, 5.0, delta);
      this.sliceCurrentY = damp(this.sliceCurrentY, targetY, 4.5, delta);
      this.sliceCurrentZ = damp(this.sliceCurrentZ, targetZ, 5.0, delta);
      this.sliceCurrentRotX = damp(
        this.sliceCurrentRotX,
        targetRotX,
        4.0,
        delta,
      );

      this.sliceGroup.position.set(
        this.sliceCurrentX,
        this.sliceCurrentY,
        this.sliceCurrentZ,
      );
      this.sliceGroup.quaternion.setFromAxisAngle(
        this.tiltAxis,
        this.sliceCurrentRotX,
      );

      if (this.sliceShadowMesh) {
        this.sliceShadowMesh.position.x = this.sliceGroup.position.x;
        this.sliceShadowMesh.position.z = this.sliceGroup.position.z;
        const lift = Math.max(0, this.sliceGroup.position.y);
        const shadowScale = Math.max(0.65, 1.0 - lift * 0.4);
        this.sliceShadowMesh.scale.set(shadowScale, shadowScale, shadowScale);
        (this.sliceShadowMesh.material as THREE.MeshBasicMaterial).opacity = Math.max(
          0.08,
          0.38 - lift * 0.5,
        );
      }
    }

    // -----------------------------------------------------------------------
    // 2. PARALLAX CAMERA RIG & ORBIT
    // -----------------------------------------------------------------------
    const isMobile = this.renderer.domElement.clientWidth < 768;
    const baseCamX = isMobile ? 4.4 : 4.0;
    const baseCamY = isMobile ? 3.8 : 3.5;
    const baseCamZ = isMobile ? 6.2 : 5.8;

    if (!this.isReducedMotion) {
      // Inertia decay for manual user drag
      this.dragVelocityYaw *= Math.pow(0.92, delta * 60);
      this.dragVelocityPitch *= Math.pow(0.92, delta * 60);
      this.dragYaw += this.dragVelocityYaw;
      this.dragPitch = Math.max(-0.4, Math.min(0.4, this.dragPitch + this.dragVelocityPitch));

      // Scroll-driven camera orbit + Pointer micro-parallax
      const targetCamX =
        baseCamX - 0.45 * orbit + 0.7 * s + this.pointerX * 0.35;
      const targetCamY = baseCamY - 0.25 * orbit - this.pointerY * 0.3;
      const targetCamZ = baseCamZ + 1.4 * s;

      this.cameraCurrentX = damp(this.cameraCurrentX, targetCamX, 5.0, delta);
      this.cameraCurrentY = damp(this.cameraCurrentY, targetCamY, 5.0, delta);
      this.cameraCurrentZ = damp(this.cameraCurrentZ, targetCamZ, 5.0, delta);

      this.camera.position.set(
        this.cameraCurrentX,
        this.cameraCurrentY,
        this.cameraCurrentZ,
      );

      // Dynamic focal point tracking the separating slice
      const targetLookZ = -0.2 * orbit - 0.25 * s;
      this.cameraLookAt.x = damp(this.cameraLookAt.x, 0.8 * s, 6.0, delta);
      this.cameraLookAt.z = damp(this.cameraLookAt.z, targetLookZ, 6.0, delta);
      this.camera.lookAt(this.cameraLookAt);

      // Interactive cake pivot rotation combining scroll, pointer, and manual drag
      const idleYaw = -0.12 * orbit;
      this.cakePivot.rotation.y = idleYaw + this.pointerX * 0.14 + this.dragYaw;
      this.cakePivot.rotation.x = this.pointerY * 0.08 + this.dragPitch;
    } else {
      this.cakePivot.rotation.y = 0;
      this.camera.position.set(
        baseCamX + 0.7 * s,
        baseCamY,
        baseCamZ + 1.4 * s,
      );
      this.cameraCurrentX = this.camera.position.x;
      this.cameraCurrentY = this.camera.position.y;
      this.cameraCurrentZ = this.camera.position.z;
      this.cameraLookAt.set(0.8 * s, 0.4, -0.25 * s);
      this.camera.lookAt(this.cameraLookAt);
    }

    // -----------------------------------------------------------------------
    // 3. RENDER
    // -----------------------------------------------------------------------
    // Lock exact terminal transforms after responsive convergence; do not render at rest.
    const settled = currentTime - this.lastInteraction > 2500;
    if (settled && !this.isReducedMotion) {
      const angle = Math.PI * 0.6;
      const phase = easeOutCubic(Math.max(0, Math.min(1, (s - 0.15) / 0.6)));
      this.sliceGroup.position.set(
        Math.sin(angle) * 1.7 * phase,
        0.22 * Math.sin(Math.PI * phase),
        Math.cos(angle) * 1.7 * phase,
      );
      this.sliceGroup.quaternion.setFromAxisAngle(
        this.tiltAxis,
        ((8 * Math.PI) / 180) * phase,
      );
    }
    this.renderer.render(this.scene, this.camera);
    if (this.isReducedMotion || settled) {
      if (this.animFrameId !== null) cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public dispose() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    this.disposables.forEach((item) => {
      try {
        item.dispose();
      } catch {
        // Safe disposal ignore
      }
    });
    this.disposables = [];

    this.renderer.dispose();
  }
}
