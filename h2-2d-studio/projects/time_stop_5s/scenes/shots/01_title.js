// scenes/shots/01_title.js — Cinematic establishing title card
import { E, V, S, registerShot, mood, layer, backdrop, ease, prog, clamp, alpha, text, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';

registerShot('s001', {
  draw(g, t, info) {
    const M = mood('dusk');
    const cam = { z: 1.06 - 0.06 * ease.inOut(t / info.dur), y: -16 * t };

    // Lớp 1: Bầu trời xa, mặt trời và tia sáng god rays
    layer(g, cam, 0.2, (ctx) => {
      backdrop(ctx, M.sky);
      const sunX = E.W * 0.5, sunY = E.H * V(0.62, 0.55);
      FX.sun(ctx, sunX, sunY, V(86, 105), '#fff3dc', M.key, 4.5);
      FX.godRays(ctx, sunX, sunY, { count: 14, angle: -Math.PI / 2, spread: Math.PI * 1.5, len: 1800, a: 0.08, t });
    });

    // Lớp 2: Đường chân trời thành phố lớp xa (mauve purple)
    layer(g, cam, 0.5, (ctx) => {
      FX.skyline(ctx, { x: -200, y: E.H * V(0.72, 0.65), w: E.W + 400, maxH: V(280, 480), color: '#271c35', windowColor: alpha(M.practical, 0.8), seed: 21 });
    });

    // Lớp 3: Đường chân trời thành phố lớp gần (dark silhouette)
    layer(g, cam, 0.8, (ctx) => {
      ctx.fillStyle = '#140e1b';
      ctx.fillRect(-E.W, E.H * V(0.72, 0.65), E.W * 3, E.H);
      FX.skyline(ctx, { x: -200, y: E.H * V(0.78, 0.72), w: E.W + 400, minH: 50, maxH: V(150, 250), color: '#100a16', windowColor: alpha(M.practical, 0.9), lit: 0.28, seed: 7 });
    });

    // Lớp 4: Hạt bụi lơ lửng và Tiêu đề phát sáng lớn
    FX.dust(g, t, { count: 35, color: '#ffd9b0', a: 0.45 });
    UI.titleCard(g, t, {
      lines: ['WHAT IF TIME', 'STOOD STILL FOR 5 SECONDS?'],
      sub: 'A SCIENTIFIC THOUGHT EXPERIMENT',
      dur: info.dur,
      y: E.H * V(0.40, 0.38)
    });
  }
});
