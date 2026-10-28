// scenes/shots/05_endscreen.js — Reality returns with shockwave, open question and subscribe
import { E, V, S, registerShot, mood, layer, backdrop, ease, prog, clamp, alpha, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';

registerShot('s005', {
  draw(g, t, info) {
    const M = mood('dusk');
    const cam = { z: 1.0 + 0.04 * ease.out(t / info.dur), x: 0 };

    // Bầu trời hoàng hôn bình yên trở lại
    layer(g, cam, 0.2, (ctx) => {
      backdrop(ctx, M.sky);
      FX.sun(ctx, E.W * 0.5, E.H * V(0.60, 0.52), V(75, 90), '#fff3dc', M.key, 4.0);
    });

    // Sóng xung kích bùng nổ khi thời gian tái khởi động (ở đầu cảnh)
    layer(g, cam, 0.5, (ctx) => {
      FX.rings(ctx, E.W * 0.5, E.H * 0.55, t, { count: 4, r0: 20, r1: 600, speed: 1.2, color: '#ffd59a', a: 0.6 });
      FX.dust(ctx, t, { count: 40, color: '#ffd9b0', a: 0.5 });
    });

    // Mặt đất và Nhân vật chính đứng thở phào
    layer(g, cam, 1.0, (ctx) => {
      const gy = E.H * V(0.82, 0.78);
      ctx.fillStyle = '#140e1b';
      ctx.fillRect(-E.W, gy, E.W * 3, E.H);

      // Viền hào quang vàng cam hoàng hôn nổi bật trước vầng mặt trời
      const rim = { color: '#ffb347', dir: [0, -1], w: 6.0 };
      const heroPose = posesAt(t, [
        [0.0, POSES.crouch],
        [1.0, POSES.think],
        [2.6, POSES.wave]
      ], 0.35);

      drawFigure(ctx, {
        x: E.W * 0.5,
        y: gy,
        s: V(1.4, 1.55),
        facing: 1,
        outfit: { top: 'hoodie', color: '#ff6f61' },
        pose: breathe(heroPose, t, 1, 1),
        expr: t < 1.0 ? 'worried' : 'happy',
        face: { override: { eyes: t < 1.0 ? 'ring' : 'happy', mouth: t < 1.0 ? 'o' : 'grin' } },
        rim
      });
    });

    // Bong bóng câu hỏi to rõ, đặt ở vị trí cao thoáng đãng (không đè đầu nhân vật)
    if (t > 1.2) {
      UI.bubble(g, E.W * 0.5, E.H * V(0.18, 0.14), {
        w: V(960, 720),
        h: V(115, 100),
        color: '#fffbf2',
        str: 'WHAT WOULD YOU DO IN 5 SECONDS?'
      });
    }

    // Nút Subscribe ở cuối
    if (t > 3.5) {
      const p = ease.outBack(prog(t, 3.5, 4.2));
      g.save();
      g.translate(E.W * 0.5, E.H * V(0.42, 0.36));
      g.scale(p, p);
      UI.badge(g, { str: 'SUBSCRIBE FOR MORE WHAT-IF', x: 0, y: 0, color: '#e5484d', size: V(32, 36) });
      g.restore();
    }
  }
});
