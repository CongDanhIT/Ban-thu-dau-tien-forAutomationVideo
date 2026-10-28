// scenes/shots/02_freeze.js — Time freeze moment: suspended drops, character shocked
import { E, V, S, registerShot, mood, layer, backdrop, ease, prog, clamp, alpha, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';

registerShot('s002', {
  draw(g, t, info) {
    const M = mood('night');
    const cam = { z: 1.08 - 0.08 * ease.inOut(t / info.dur), x: Math.sin(t * 0.3) * 12 };

    // Bầu trời đêm sâu + Mặt trăng lạnh
    layer(g, cam, 0.2, (ctx) => {
      backdrop(ctx, M.sky);
      FX.moon(ctx, E.W * V(0.82, 0.86), E.H * V(0.24, 0.18), V(52, 64), M.sun || '#dfe8ff');
    });

    // Giọt nước đóng băng lơ lửng giữa không trung
    layer(g, cam, 0.5, (ctx) => {
      FX.drops(ctx, t, { count: 90, color: '#d0e4ff', drift: 1.5, rMin: 3, rMax: 16 });
    });

    // Mặt đất và Nhân vật người que phản ứng
    layer(g, cam, 1.0, (ctx) => {
      const gy = E.H * V(0.82, 0.78);
      ctx.fillStyle = '#080c16';
      ctx.fillRect(-E.W, gy, E.W * 3, E.H);
      
      // Viền sáng trắng lạnh băng giá bao quanh cơ thể để tách biệt hoàn toàn khỏi màn đêm
      const rim = { color: '#ffffff', dir: [0, -1], w: 5.5 };
      
      // Tư thế: lúc đóng băng bước đi dở dang ngơ ngác, sau đó đưa tay chạm giọt nước, rồi ôm đầu sốc
      const freezeWalk = walkPose(0.85, { lean: 4, arm: 22 });
      const heroPose = posesAt(t, [
        [0.0, freezeWalk],
        [1.6, POSES.reach],
        [3.8, POSES.handsOnHead]
      ], 0.35);

      drawFigure(ctx, {
        x: E.W * 0.5,
        y: gy,
        s: V(1.42, 1.55),
        facing: 1,
        outfit: { top: 'hoodie', color: '#ff6f61', head: 'none' },
        pose: breathe(heroPose, t * 0.2, 0.5, 2),
        expr: t < 3.2 ? 'surprised' : 'confused',
        face: { override: { eyes: 'ring', brows: 'raised', mouth: 'o' } },
        rim
      });
    });

    // Thẻ góc Slow Motion & Dòng chữ thông điệp tương phản cao
    UI.badge(g, { str: 'TIME FREEZE · 0.0001x', color: '#ffe066', size: V(36, 42) });
    if (t > 0.8 && t < 4.5) {
      UI.bigLine(g, t, { str: 'EVERYTHING LOCKS IN PLACE', dur: 3.5, y: E.H * V(0.18, 0.15), size: V(86, 78), color: '#ffffff' });
    }
  }
});
