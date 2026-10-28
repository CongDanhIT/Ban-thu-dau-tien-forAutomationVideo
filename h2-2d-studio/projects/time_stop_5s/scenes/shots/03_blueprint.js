// scenes/shots/03_blueprint.js — Scientific blueprint explanation
import { E, V, S, registerShot, ease, prog, clamp, lerp, seg, circle, rr, alpha, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import * as UI from '/engine/ui2d.js';

registerShot('s003', {
  draw(g, t, info) {
    UI.blueprint(g, { grid: 55, a: 0.08 });
    const bpCol = UI.bpStroke();

    // Tiêu đề sơ đồ tương phản cao, phát sáng neon sắc nét
    text(g, 'PHYSICAL CONSEQUENCES AT T = 0', E.W / 2, E.H * V(0.15, 0.11), {
      size: V(50, 52),
      color: '#ffffff',
      font: FONTS.ui,
      weight: 900,
      glow: 22,
      glowColor: 'rgba(0, 230, 255, 0.8)'
    });

    // 3 hộp nguyên lý cơ chế dàn đều cân đối, xuất hiện đồng bộ trong 0.6s đầu
    const steps = [
      { num: '01', title: 'PHOTONS STOP', sub: 'Light waves freeze in space' },
      { num: '02', title: 'AIR MOLECULES LOCK', sub: 'Gas turns into solid walls' },
      { num: '03', title: 'TOTAL SILENCE', sub: 'Sound cannot propagate' }
    ];

    const count = steps.length;
    const boxW = V(360, 680), boxH = V(140, 110);
    const startY = E.H * V(0.42, 0.28);
    const gap = V(420, 150);

    for (let i = 0; i < count; i++) {
      // Cả 3 hộp hiện sớm để tránh tình trạng màn hình bên phải bị trống
      const p = ease.out(prog(t, 0.12 + i * 0.15, 0.52 + i * 0.15));
      if (p <= 0) continue;

      const cx = E.vertical ? E.W / 2 : E.W / 2 + (i - 1) * gap;
      const cy = E.vertical ? startY + i * gap : startY;

      g.save();
      g.globalAlpha *= p;
      rr(g, cx - boxW / 2, cy - boxH / 2, boxW, boxH, 18);
      g.fillStyle = 'rgba(10, 24, 52, 0.95)';
      g.fill();
      g.strokeStyle = '#00e5ff';
      g.lineWidth = 2.5;
      g.stroke();

      text(g, steps[i].num, cx, cy - 26, { size: V(22, 24), color: '#38bdf8', font: FONTS.ui, weight: 800 });
      text(g, steps[i].title, cx, cy + 8, { size: V(28, 30), color: '#ffffff', font: FONTS.ui, weight: 900 });
      text(g, steps[i].sub, cx, cy + 38, { size: V(18, 20), color: '#bae6fd', font: FONTS.ui, weight: 600 });
      g.restore();
    }

    // Nhân vật nhà khoa học Doc: Có tóc bạc xù kiểu Einstein và viền sáng cyan bao quanh toàn thân (không bị mất đầu)
    if (!E.vertical) {
      drawFigure(g, {
        x: V(220, 150),
        y: E.H - V(120, 200),
        s: V(1.2, 1.35),
        facing: 1,
        outfit: { 
          top: 'labcoat', 
          head: 'curly', 
          headColor: '#f1f5f9', 
          face: 'glasses' 
        },
        pose: breathe(POSES.explain, t, 1, 4),
        expr: 'thinking',
        prop: { type: 'pointer' },
        rim: { color: '#00e5ff', dir: [0, -1], w: 5.0 }
      });
    }

    // Thước đo vận tốc photon
    UI.dimension(g, t, {
      x1: E.W * 0.25,
      y1: E.H * V(0.78, 0.82),
      x2: E.W * 0.75,
      y2: E.H * V(0.78, 0.82),
      str: 'C = 0 km/s (FROZEN)',
      color: S().ui.gold,
      start: 2.2
    });
  }
});
