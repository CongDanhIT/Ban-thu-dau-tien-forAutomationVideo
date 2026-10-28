// packs/stick/pack.js — Bộ phong cách Hoạt hình Người Que 2.5D Điện ảnh (Cinematic Stick Figure Studio)
// Hỗ trợ khung xương 28 tư thế IK, giọt nước đóng băng thời gian, số liệu đồ thị, sơ đồ kỹ thuật blueprint và các kịch bản What-If.

import { E } from '../../engine/core.js';
import * as RIG from './rig.js';
import * as FX from './fx.js';
import * as UI from './ui.js';
import './templates.js';

export * from './rig.js';
export * from './fx.js';
export * from './ui.js';
export * from './templates.js';

function css(href) {
  return new Promise((r) => {
    if (typeof document === 'undefined') return r();
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = href;
    l.onload = r; l.onerror = r;
    document.head.appendChild(l);
  });
}

export async function init(E) {
  if (typeof document !== 'undefined') {
    await css('/node_modules/@fontsource/baloo-2/800.css').catch(() => {});
    await css('/node_modules/@fontsource/be-vietnam-pro/600.css').catch(() => {});
    await css('/node_modules/@fontsource/ibm-plex-mono/500.css').catch(() => {});
  }
  // Mặc định của ngách stick figure cinematic: style dusk (hoàng hôn), bars cinematic (letterbox 2:1)
  if (!E.cfg.style) E.cfg.style = 'dusk';
  if (E.cfg.bars === null || E.cfg.bars === undefined) E.cfg.bars = 'cinematic';
  if (!E.cfg.captionStyle) E.cfg.captionStyle = 'glow';
}
