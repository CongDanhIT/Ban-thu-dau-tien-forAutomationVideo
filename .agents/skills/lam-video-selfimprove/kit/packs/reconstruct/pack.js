// packs/reconstruct/pack.js — Bộ phong cách 3D White Clay & Tái hiện Hiện trường (Reconstruction Studio)
// Hỗ trợ mô hình 3D đất sét trắng Three.js, buồng lái, khoang hành khách, xe cộ, mannequin 23 tư thế, và các thẻ chứng cứ báo chí.

import { E } from '../../engine/core.js';
import * as K from './kit3d.js';
import * as V from './vehicles.js';
import * as W from './world.js';
import * as L from './looks.js';
import './templates.js';

export * from './kit3d.js';
export * from './vehicles.js';
export * from './world.js';
export * from './looks.js';
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
    await css('/node_modules/@fontsource/ibm-plex-mono/500.css').catch(() => {});
    await css('/node_modules/@fontsource/archivo/800.css').catch(() => {});
    await css('/node_modules/@fontsource/inter/600.css').catch(() => {});
  }
  // Mặc định của ngách 3D reconstruct: không dải đen, phong cách clay/doc
  if (!E.cfg.style) E.cfg.style = 'clay';
  if (E.cfg.bars === null || E.cfg.bars === undefined) E.cfg.bars = 'none';
  if (!E.cfg.captionStyle) E.cfg.captionStyle = 'doc';
}
