// packs/stick/templates.js — Thư viện phân cảnh mẫu cho Stick Figure Cinematic 2.5D
import { E, V, S, mood, layer, blurLayer, backdrop, ease, prog, clamp, lerp, seg, circle, ring, rr, poly, glow, alpha, text, FONTS } from '../../engine/core.js';
import * as RIG from '../../engine/rig2d.js';
import * as FX from '../../engine/fx2d.js';
import * as UI from '../../engine/ui2d.js';

export const TEMPLATES = {
  // 1. stick_title: Tiêu đề Cinematic lớn phát sáng trên nền thành phố hoàng hôn/đêm + god rays
  stick_title(g, t, opt = {}) {
    const {
      lines = ['WHAT IF TIME', 'STOOD COMPLETELY STILL?'],
      sub = null,
      dur = 4,
      moodName = 'dusk',
      sunPos = [E.W / 2, E.H * V(0.6, 0.52)]
    } = opt;
    const M = mood(moodName);
    const cam = { z: 1.05 - 0.05 * ease.inOut(t / dur), y: -15 * t };

    layer(g, cam, 0.2, (ctx) => {
      backdrop(ctx, M.sky);
      FX.sun(ctx, sunPos[0], sunPos[1], V(80, 100), '#fff3dc', M.key, 4.5);
      FX.godRays(ctx, sunPos[0], sunPos[1], { count: 12, angle: -Math.PI / 2, spread: Math.PI * 1.5, len: 1800, a: 0.07, t });
    });

    layer(g, cam, 0.5, (ctx) => {
      FX.skyline(ctx, { x: -200, y: E.H * V(0.72, 0.65), w: E.W + 400, maxH: V(280, 460), color: '#241a30', windowColor: alpha(M.practical, 0.8), seed: 17 });
    });

    layer(g, cam, 0.8, (ctx) => {
      ctx.fillStyle = '#140e1b';
      ctx.fillRect(-E.W, E.H * V(0.72, 0.65), E.W * 3, E.H);
      FX.skyline(ctx, { x: -200, y: E.H * V(0.78, 0.72), w: E.W + 400, minH: 50, maxH: V(150, 240), color: '#0f0a15', windowColor: alpha(M.practical, 0.9), lit: 0.25, seed: 9 });
    });

    FX.dust(g, t, { count: 35, color: '#ffd9b0', a: 0.45 });
    UI.titleCard(g, t, { lines, sub, dur, y: E.H * V(0.38, 0.36) });
  },

  // 2. stick_figure: Diễn hoạt 1 hoặc 2 nhân vật người que với pose, biểu cảm, đạo cụ
  stick_figure(g, t, opt = {}) {
    const {
      char1 = {
        x: E.W * 0.5,
        y: E.H * V(0.82, 0.78),
        s: V(1.35, 1.5),
        facing: 1,
        pose: 'stand',
        expr: 'smile',
        outfit: { top: 'hoodie', color: '#d64a33' }
      },
      char2 = null,
      moodName = 'dusk',
      backdropColor = null,
      hasDust = true
    } = opt;

    const M = mood(moodName);
    const cam = { z: 1.0 + 0.04 * ease.inOut(t / 4), x: 0 };

    layer(g, cam, 0.2, (ctx) => {
      if (backdropColor) {
        ctx.fillStyle = backdropColor;
        ctx.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
      } else {
        backdrop(ctx, M.sky);
      }
    });

    // Vẽ sàn/mặt đất
    layer(g, cam, 0.9, (ctx) => {
      ctx.fillStyle = M.floor || '#1a1422';
      ctx.fillRect(-E.W, char1.y, E.W * 3, E.H);
      seg(ctx, [[-E.W, char1.y], [E.W * 2, char1.y]], 3, alpha(M.rim || '#ffffff', 0.15));
    });

    // Vẽ nhân vật
    layer(g, cam, 1.0, (ctx) => {
      const rim = { color: M.rim || '#ffffff', dir: [0, -1] };
      const p1 = typeof char1.pose === 'string' ? RIG.pose(char1.pose) : char1.pose;
      RIG.drawFigure(ctx, {
        x: char1.x,
        y: char1.y,
        s: char1.s,
        facing: char1.facing || 1,
        outfit: char1.outfit,
        pose: RIG.breathe(p1, t, 1, 1),
        expr: char1.expr || 'neutral',
        prop: char1.prop,
        rim
      });

      if (char2) {
        const p2 = typeof char2.pose === 'string' ? RIG.pose(char2.pose) : char2.pose;
        RIG.drawFigure(ctx, {
          x: char2.x,
          y: char2.y || char1.y,
          s: char2.s || char1.s,
          facing: char2.facing || -1,
          outfit: char2.outfit,
          pose: RIG.breathe(p2, t, 1, 2),
          expr: char2.expr || 'neutral',
          prop: char2.prop,
          rim
        });
      }
    });

    if (hasDust) FX.dust(g, t, { count: 30, color: M.key || '#ffffff', a: 0.35 });
  },

  // 3. stick_freeze: Khoảnh khắc ngưng đọng thời gian với giọt nước/bong bóng lơ lửng
  stick_freeze(g, t, opt = {}) {
    const {
      title = 'TIME STOP',
      badge = '0.0001x',
      charPose = 'ready',
      moodName = 'night',
      dropCount = 85
    } = opt;
    const M = mood(moodName);
    const cam = { z: 1.08 - 0.08 * (t / 5), x: Math.sin(t * 0.2) * 15 };

    layer(g, cam, 0.2, (ctx) => {
      backdrop(ctx, M.sky);
      FX.moon(ctx, E.W * V(0.8, 0.85), E.H * V(0.25, 0.2), V(50, 60), M.sun || '#dfe8ff');
    });

    // Giọt nước / bụi đóng băng
    layer(g, cam, 0.6, (ctx) => {
      FX.drops(ctx, t, { count: dropCount, color: '#d8e8ff', drift: 2 });
    });

    // Nhân vật phản ứng trong khoảnh khắc đóng băng
    layer(g, cam, 1.0, (ctx) => {
      const gy = E.H * V(0.82, 0.78);
      ctx.fillStyle = '#0a0d18';
      ctx.fillRect(-E.W, gy, E.W * 3, E.H);
      const rim = { color: '#a0c8ff', dir: [0, -1] };
      const p = RIG.pose(charPose);
      RIG.drawFigure(ctx, {
        x: E.W * 0.5,
        y: gy,
        s: V(1.4, 1.55),
        facing: 1,
        outfit: { top: 'hoodie', color: '#ff6f61' },
        pose: RIG.breathe(p, t * 0.2, 0.5, 3), // thở cực chậm
        expr: 'shocked',
        rim
      });
    });

    if (badge) UI.badge(g, { str: badge, color: '#68d391', size: V(38, 44) });
    if (title) UI.bigLine(g, t, { str: title, y: E.H * V(0.2, 0.18), color: '#ffffff' });
  },

  // 4. stick_blueprint: Sơ đồ kỹ thuật phân tích cơ chế khoa học
  stick_blueprint(g, t, opt = {}) {
    const {
      title = 'HOW IT WORKS',
      steps = ['EYES SEE', 'BRAIN DECIDES', 'MUSCLE MOVES'],
      dur = 4
    } = opt;
    UI.blueprint(g);
    const bpCol = UI.bpStroke();

    // Tiêu đề sơ đồ
    text(g, title, E.W / 2, E.H * V(0.18, 0.14), {
      size: V(52, 54),
      color: bpCol,
      font: FONTS.title,
      weight: 900,
      glowColor: alpha(bpCol, 0.6)
    });

    // 3 hộp quy trình
    const count = steps.length;
    const stepW = V(380, 700), stepH = V(140, 120);
    const startY = E.H * V(0.42, 0.3);
    const gap = V(440, 160);

    for (let i = 0; i < count; i++) {
      const p = ease.out(prog(t, i * 0.5, i * 0.5 + 0.6));
      if (p <= 0) continue;

      const cx = E.vertical ? E.W / 2 : E.W / 2 + (i - 1) * gap;
      const cy = E.vertical ? startY + i * gap : startY;

      g.save();
      g.globalAlpha *= p;
      rr(g, cx - stepW / 2, cy - stepH / 2, stepW, stepH, 16);
      g.fillStyle = 'rgba(14,29,62,0.85)';
      g.fill();
      g.strokeStyle = bpCol;
      g.lineWidth = 2.5;
      g.stroke();

      text(g, `0${i + 1}`, cx, cy - 24, { size: V(22, 24), color: alpha(bpCol, 0.6), font: FONTS.mono, weight: 800 });
      text(g, steps[i], cx, cy + 16, { size: V(28, 30), color: '#ffffff', font: FONTS.title, weight: 900 });

      // Mũi tên kết nối
      if (i < count - 1 && p > 0.8) {
        if (!E.vertical) {
          const arrowX = cx + stepW / 2 + 10;
          seg(g, [[arrowX, cy], [arrowX + gap - stepW - 20, cy]], 2.5, bpCol);
        } else {
          const arrowY = cy + stepH / 2 + 10;
          seg(g, [[cx, arrowY], [cx, arrowY + gap - stepH - 20]], 2.5, bpCol);
        }
      }
      g.restore();
    }
  },

  // 5. stick_data_card: Thẻ số liệu tăng trưởng và đồ thị đường cong
  stick_data_card(g, t, opt = {}) {
    UI.blueprint(g, { a: 0.04 });
    UI.dataCard(g, t, {
      title: opt.title || 'REACTION VELOCITY',
      subtitle: opt.subtitle || 'RESPONSE TIME MULTIPLIER',
      from: opt.from ?? 1.0,
      to: opt.to ?? 10.0,
      unit: opt.unit || 'x',
      dur: opt.dur || 2.5,
      shape: opt.shape || 1.8
    });
  },

  // 6. stick_comparison: Bảng thanh so sánh 2 chỉ số
  stick_comparison(g, t, opt = {}) {
    const {
      rows = [
        { label: 'NORMAL REACTION', v: 0.25, color: '#8fb8e8' },
        { label: 'TRAINED REACTION', v: 0.12, color: '#ffc83d' }
      ],
      title = 'COMPARISON'
    } = opt;

    UI.blueprint(g);
    if (title) {
      text(g, title, E.W / 2, E.H * V(0.2, 0.16), {
        size: V(50, 52),
        color: UI.bpStroke(),
        font: FONTS.title,
        weight: 900
      });
    }

    UI.compareBars(g, t, {
      rows,
      x: V(E.W * 0.2, E.W * 0.1),
      y: E.H * V(0.45, 0.4),
      w: V(E.W * 0.55, E.W * 0.7),
      start: 0.3
    });
  }
};
