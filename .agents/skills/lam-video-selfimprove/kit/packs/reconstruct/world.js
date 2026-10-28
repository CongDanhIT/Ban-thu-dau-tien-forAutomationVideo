// packs/reconstruct/world.js — WebGL renderer, 3D scenes, camera helpers.
// 1 world unit = 1 metre. Deterministic in t (seeded camera & movements).
import * as THREE from 'three';
import { E, key, ease, clamp, lerp, drift } from '../../engine/core.js';
import { resolveLook } from './looks.js';

export { THREE };

export const QUALITY = {
  draft:    { shadow: 1024 },
  standard: { shadow: 2048 },
  high:     { shadow: 4096 },
};

const C = (c) => new THREE.Color(c);
let R = null;
const sets = new Map();
let current = null;

export function initRenderer(canvas) {
  const Q = QUALITY[E.quality] || QUALITY.standard;
  R = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    stencil: false,
    depth: true,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance'
  });
  R.setPixelRatio(1);
  R.setSize(E.outW || E.W || 1920, E.outH || E.H || 1080, false);
  R.shadowMap.enabled = true;
  R.shadowMap.type = THREE.PCFSoftShadowMap;
  R.toneMapping = THREE.ACESFilmicToneMapping;
  R.toneMappingExposure = 1.0;
  R.outputColorSpace = THREE.SRGBColorSpace;
  return R;
}

export function getRenderer() {
  if (!R && typeof document !== 'undefined') {
    const c = document.createElement('canvas');
    c.width = E.W || 1920;
    c.height = E.H || 1080;
    initRenderer(c);
  }
  return R;
}

export const renderer = () => getRenderer();

// Sky dome
function skyDome(look) {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      zen: { value: C('#000') },
      mid: { value: C('#000') },
      hor: { value: C('#000') },
      sunDir: { value: new THREE.Vector3(0, 1, 0) },
      glow: { value: 0.1 }
    },
    vertexShader: `
      varying vec3 vDir;
      void main(){
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 zen, mid, hor, sunDir;
      uniform float glow;
      varying vec3 vDir;
      void main(){
        vec3 d = normalize(vDir);
        float h = clamp(d.y, 0.0, 1.0);
        vec3 c = mix(hor, mid, smoothstep(0.0, 0.14, h));
        c = mix(c, zen, smoothstep(0.10, 0.65, h));
        if (d.y < 0.0) c = hor;
        float s = max(dot(d, sunDir), 0.0);
        c += vec3(1.0, 0.92, 0.8) * (pow(s, 10.0) * glow + pow(s, 400.0) * glow * 6.0);
        gl_FragColor = vec4(c, 1.0);
      }
    `,
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(2800, 32, 16), mat);
  m.frustumCulled = false;
  m.renderOrder = -10;
  return m;
}

export function applyLook(S, spec) {
  const L = resolveLook(spec, S.lookName || E.cfg.look || 'clay');
  S.look = L;
  const sc = S.scene;
  if (!S.sky) { S.sky = skyDome(L); sc.add(S.sky); }
  S.sky.visible = true;
  const u = S.sky.material.uniforms;
  if (L.sky.type === 'gradient') {
    u.zen.value.set(L.sky.zenith);
    u.mid.value.set(L.sky.mid);
    u.hor.value.set(L.sky.horizon);
    u.glow.value = L.sky.sunGlow ?? 0.1;
  } else {
    const c = L.sky.color || L.bg;
    u.zen.value.set(c); u.mid.value.set(c); u.hor.value.set(c);
    u.glow.value = 0;
  }
  u.sunDir.value.set(...L.sun.dir).normalize();
  sc.background = C(L.bg);
  sc.fog = L.fog && S.fog !== false ? new THREE.FogExp2(C(L.fog.color), (S.fogScale ?? 1) * L.fog.density) : null;
  S.hemi.color.set(L.hemi.sky);
  S.hemi.groundColor.set(L.hemi.ground);
  S.hemi.intensity = L.hemi.intensity;
  S.sun.color.set(L.sun.color);
  S.sun.intensity = L.sun.intensity;
  S.sunDir.set(...L.sun.dir).normalize();
  placeSun(S);
  return L;
}

function placeSun(S) {
  S.sun.position.copy(S.sunDir).multiplyScalar(S.shadow.dist).add(S.shadow.center);
  S.sun.target.position.copy(S.shadow.center);
  S.sun.target.updateMatrixWorld();
}

// ------------------------------------------------ sets
export function createSet(id, buildFn, lookSpec = 'clay') {
  const Q = QUALITY[E.quality] || QUALITY.standard;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, (E.W || 1920) / (E.H || 1080), 0.05, 6000);
  const hemi = new THREE.HemisphereLight(0xffffff, 0x888888, 1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffffff, 2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(Q.shadow, Q.shadow);
  sun.shadow.bias = -0.0003;
  sun.shadow.normalBias = 0.04;
  scene.add(sun, sun.target);

  const S = {
    id, scene, camera, hemi, sun,
    sunDir: new THREE.Vector3(0, 1, 0),
    shadow: { center: new THREE.Vector3(), radius: 30, dist: 200 },
    lookName: lookSpec || 'clay'
  };

  const W = {
    THREE, scene, camera, set: S, E,
    add: (...o) => { o.forEach((x) => scene.add(x)); return o[0]; },
    shadowArea(center, radius = 30) {
      S.shadow.center.set(...center);
      S.shadow.radius = radius;
      S.shadow.dist = Math.max(60, radius * 3);
      Object.assign(sun.shadow.camera, {
        left: -radius, right: radius, top: radius, bottom: -radius,
        near: 1, far: S.shadow.dist * 2.2
      });
      sun.shadow.camera.updateProjectionMatrix();
      placeSun(S);
    },
    fogScale(k) { S.fogScale = k; },
    noFog() { S.fog = false; },
    look: (spec) => applyLook(S, spec)
  };

  W.shadowArea([0, 0, 0], 30);
  applyLook(S, lookSpec);
  if (typeof buildFn === 'function') {
    S.api = buildFn(W) || {};
  }
  return S;
}

export function renderScene(S) {
  const r = getRenderer();
  if (!r) return null;
  if (S.sky) S.sky.position.copy(S.camera.position);
  S.camera.updateMatrixWorld();
  r.render(S.scene, S.camera);
  return r.domElement;
}

// ------------------------------------------------ camera helpers
const V3 = (a) => (a?.isVector3 ? a.clone() : new THREE.Vector3(...a));

export function dolly(cam, t, keys, fn = ease.inOut) {
  const v = key(t, keys.map((k) => [
    k[0],
    { pos: [...V3(k[1].pos).toArray()], look: [...V3(k[1].look).toArray()], fov: k[1].fov ?? cam.fov, roll: k[1].roll ?? 0 },
    k[2]
  ]), fn);
  cam.position.set(...v.pos);
  cam.up.set(0, 1, 0);
  cam.lookAt(...v.look);
  if (v.roll) cam.rotateZ(v.roll);
  if (Math.abs(cam.fov - v.fov) > 1e-4) { cam.fov = v.fov; cam.updateProjectionMatrix(); }
}

export function orbit(cam, t, o = {}) {
  const { target = [0, 1, 0], radius = 8, height = 3, from = -30, to = 20, dur = 6, fov, e = ease.inOut } = o;
  const k = e(clamp(t / dur)), a = THREE.MathUtils.degToRad(lerp(from, to, k));
  const r = Array.isArray(radius) ? lerp(radius[0], radius[1], k) : radius;
  const h = Array.isArray(height) ? lerp(height[0], height[1], k) : height;
  const T = V3(target);
  cam.position.set(T.x + Math.sin(a) * r, T.y + h, T.z + Math.cos(a) * r);
  cam.lookAt(T);
  if (fov && cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); }
}

export function follow(cam, t, target, o = {}) {
  const { posA = [0, 2, 8], posB = posA, lookA = [0, 0, 0], lookB = lookA, dur = 6, e = ease.inOut, fov } = o;
  const k = e(clamp(t / dur)), p = target(t);
  cam.position.copy(p).add(V3(posA).lerp(V3(posB), k));
  cam.lookAt(p.clone().add(V3(lookA).lerp(V3(lookB), k)));
  if (fov && cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); }
}

export function handheld(cam, t, amp = 0.02, seed = 1) {
  const [x, y, z] = drift(t, amp, 0.4, seed);
  cam.position.x += x; cam.position.y += y; cam.position.z += z;
  const [a, b] = drift(t + 7, amp * 0.25, 0.3, seed + 5);
  cam.rotation.x += a; cam.rotation.y += b;
}

export function toStage(cam, p) {
  if (!cam || !p) return { x: 0, y: 0, visible: false, depth: 0 };
  const v = V3(p).project(cam);
  const behind = v.z > 1;
  return {
    x: (v.x + 1) / 2 * (E.W || 1920),
    y: (1 - v.y) / 2 * (E.H || 1080),
    visible: !behind && Math.abs(v.x) < 1.2 && Math.abs(v.y) < 1.2,
    depth: v.z
  };
}
