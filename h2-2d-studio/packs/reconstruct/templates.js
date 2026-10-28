// packs/reconstruct/templates.js — Mẫu cảnh phân cảnh 3D & Đồ họa Báo chí Tái hiện Hiện trường.
import { E, registerTemplate, clamp, lerp, ease } from '../../engine/core.js';
import * as K from './kit3d.js';
import * as V from './vehicles.js';
import { createSet, renderScene, dolly, orbit, handheld } from './world.js';

// Helper đăng ký template chuẩn cho player.js (cung cấp thuộc tính draw)
function tpl(name, drawFn) {
  registerTemplate(name, {
    draw: (ctx, lt, info) => {
      const a = info.args || {};
      const o = {
        ...a,
        dur: info.dur,
        id: info.id,
        texts: a.texts || info.shot?.texts,
        footnote: info.shot?.footnote || a.footnote
      };
      drawFn(ctx, lt, a, o);
    }
  });
}

// Vẽ footnote thanh lịch ở góc dưới màn hình
function drawFootnote(ctx, note) {
  if (!note) return;
  ctx.save();
  ctx.font = '500 22px "IBM Plex Mono", Consolas, monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  const w = ctx.measureText(note).width + 30;
  ctx.fillRect(40, E.H - 65, w, 38);
  ctx.fillStyle = '#b8c0cc';
  ctx.fillText(note, 55, E.H - 38);
  ctx.restore();
}

// Vẽ badge góc trên
function drawBadge(ctx, text, pos = 'tr') {
  if (!text) return;
  ctx.save();
  ctx.font = '700 20px "IBM Plex Mono", Consolas, monospace';
  const tw = ctx.measureText(text).width + 36;
  const th = 40;
  const x = pos === 'tr' ? E.W - tw - 50 : 50;
  const y = 50;
  ctx.fillStyle = 'rgba(10, 15, 24, 0.85)';
  ctx.strokeStyle = 'rgba(74, 140, 255, 0.8)';
  ctx.lineWidth = 1.5;
  ctx.fillRect(x, y, tw, th);
  ctx.strokeRect(x, y, tw, th);
  ctx.fillStyle = '#4a8cff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + tw / 2, y + th / 2);
  ctx.restore();
}

// 1. Template: Buồng lái phi công 3D (cockpit)
let _cockpitSet = null;
tpl('cockpit', (ctx, lt, a, o) => {
  if (!_cockpitSet) {
    _cockpitSet = createSet('cockpit_main', (W) => {
      const ck = V.cockpit({ doorOpen: 0 });
      W.add(ck.group);
      const cap = K.mannequin({ style: 'clay', pose: 'pilot' });
      cap.position.copy(ck.capSeat);
      cap.rotation.y = Math.PI / 2;
      W.add(cap);
      return { ck, cap };
    }, o.look || 'clay');
  }
  const dur = o.dur || 5.0;
  dolly(_cockpitSet.camera, lt, [
    [0, { pos: [0.3, 1.35, 1.2], look: [0.3, 1.05, -0.4], fov: 50 }],
    [dur, { pos: [0.35, 1.32, 0.85], look: [0.32, 1.05, -0.4], fov: 46 }]
  ]);
  handheld(_cockpitSet.camera, lt, 0.015);
  const dom = renderScene(_cockpitSet);
  if (dom && ctx) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(dom, 0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
  }

  // Overlay text / Badge / Footnote
  if (o.texts) {
    for (const t of o.texts) {
      if (t.kind === 'badge') drawBadge(ctx, t.t, t.pos || 'tr');
      if (t.kind === 'quote' && lt >= (t.at || 0)) {
        ctx.save();
        ctx.fillStyle = 'rgba(10, 14, 22, 0.8)';
        ctx.fillRect(80, E.H - 180, E.W - 160, 90);
        ctx.strokeStyle = 'rgba(255, 60, 60, 0.8)';
        ctx.lineWidth = 3;
        ctx.strokeRect(80, E.H - 180, E.W - 160, 90);
        ctx.fillStyle = '#ff6b6b';
        ctx.font = '700 24px "IBM Plex Mono", monospace';
        ctx.fillText(t.who || 'RADIO COMMS', 110, E.H - 145);
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 28px Inter, sans-serif';
        ctx.fillText(t.t, 110, E.H - 108);
        ctx.restore();
      }
    }
  }
  drawFootnote(ctx, o.footnote);
});

// 2. Template: Máy bay ngoại cảnh 3D (airliner)
let _airlinerSet = null;
tpl('airliner', (ctx, lt, a, o) => {
  if (!_airlinerSet) {
    _airlinerSet = createSet('airliner_main', (W) => {
      const pl = V.airliner({ length: 39.5, radius: 1.9 });
      W.add(pl);
      return { pl };
    }, o.look || 'day');
  }
  const dur = o.dur || 6.0;
  orbit(_airlinerSet.camera, lt, {
    target: [20, 0, 0],
    radius: [34, 26],
    height: [7, 3.5],
    from: -40,
    to: 15,
    dur
  });
  handheld(_airlinerSet.camera, lt, 0.008);
  const dom = renderScene(_airlinerSet);
  if (dom && ctx) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(dom, 0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
  }
  drawFootnote(ctx, o.footnote);
});

// 3. Template: Khoang hành khách 3D (cabin)
let _cabinSet = null;
tpl('cabin', (ctx, lt, a, o) => {
  if (!_cabinSet) {
    _cabinSet = createSet('cabin_main', (W) => {
      const cb = V.cabin({ rows: 12, passengers: 0.85, cutaway: 'top' });
      W.add(cb.group);
      return { cb };
    }, o.look || 'clay');
  }
  const dur = o.dur || 5.0;
  orbit(_cabinSet.camera, lt, {
    target: [0, 0.8, 0],
    radius: [4.5, 3.8],
    height: [2.2, 1.9],
    from: -20,
    to: 15,
    dur
  });
  const dom = renderScene(_cabinSet);
  if (dom && ctx) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(dom, 0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
  }
  drawFootnote(ctx, o.footnote);
});

// 4. Template: Thẻ Số liệu Nhảy (evidence_stat)
tpl('evidence_stat', (ctx, lt, a, o) => {
  ctx.save();
  // Nền tối radar
  ctx.fillStyle = o.bg || '#07090e';
  ctx.fillRect(0, 0, E.W, E.H);

  const dur = o.dur || 5.0;
  const at = o.at || 0.2;
  const countDur = o.countDur || 2.0;
  const p = clamp((lt - at) / countDur);
  const curVal = Math.round(lerp(o.countFrom ?? 30000, o.value || 18000, ease.outExpo(p)));

  // Kicker
  ctx.fillStyle = '#6e7a8e';
  ctx.font = '600 24px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText((o.kicker || 'DATA RECORDER TELEMETRY').toUpperCase(), E.W / 2, E.H * 0.3);

  // Big Stat Value
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 160px "IBM Plex Mono", Consolas, monospace';
  const valStr = curVal.toLocaleString() + (o.suffix || ' FT');
  ctx.fillText(valStr, E.W / 2, E.H * 0.48);

  // Label
  ctx.fillStyle = '#4a8cff';
  ctx.font = '700 36px Archivo, Inter, sans-serif';
  ctx.fillText((o.label || 'RAPID DESCENT ALTITUDE').toUpperCase(), E.W / 2, E.H * 0.66);

  // Đường kẻ phân cách
  ctx.strokeStyle = 'rgba(74, 140, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(E.W * 0.25, E.H * 0.74);
  ctx.lineTo(E.W * 0.75, E.H * 0.74);
  ctx.stroke();

  drawFootnote(ctx, o.footnote);
  ctx.restore();
});

// 5. Template: Thẻ Bằng chứng Bài báo Điều tra (evidence_article)
tpl('evidence_article', (ctx, lt, a, o) => {
  ctx.save();
  // Nền xám trung tính phòng họp
  ctx.fillStyle = o.bg || '#11141a';
  ctx.fillRect(0, 0, E.W, E.H);

  // Tờ báo trắng trung tâm
  const cardW = 1400;
  const cardH = 760;
  const cardX = (E.W - cardW) / 2;
  const cardY = (E.H - cardH) / 2 - 20;

  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 40;
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.shadowBlur = 0;

  // Thanh thương hiệu màu xanh ở đầu bài báo
  ctx.fillStyle = o.color || '#1e5fcc';
  ctx.fillRect(cardX, cardY, cardW, 40);

  // Headline
  ctx.fillStyle = '#111317';
  ctx.font = '800 48px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(o.headline || 'ACCIDENT INVESTIGATION REPORT', cardX + 60, cardY + 75);

  // Byline & Date
  ctx.fillStyle = '#656b77';
  ctx.font = '600 20px "IBM Plex Mono", monospace';
  ctx.fillText(`${o.byline || 'NTSB Board'} — ${o.date || 'OCTOBER 2026'}`, cardX + 60, cardY + 145);

  // Đường kẻ ngang mỏng
  ctx.strokeStyle = '#e2e5eb';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cardX + 60, cardY + 185);
  ctx.lineTo(cardX + cardW - 60, cardY + 185);
  ctx.stroke();

  // Paragraph Body
  const bodyText = (o.paragraphs && o.paragraphs[0]) || 'Severe high-altitude ice crystals blocked primary sensors.';
  ctx.fillStyle = '#22262e';
  ctx.font = '400 36px "Source Serif 4", Georgia, serif';
  
  // Vệt Highlight quét dần theo thời gian (Highlighter sweep)
  const hlAt = o.hlAt || 0.8;
  const p = clamp((lt - hlAt) / 1.5);
  if (p > 0) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 235, 59, 0.45)';
    ctx.fillRect(cardX + 55, cardY + 230, (cardW - 120) * p, 110);
    ctx.restore();
  }

  // Vẽ chữ đoạn văn
  const wrapText = (text, x, y, maxW, lineH) => {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const test = line + words[n] + ' ';
      if (ctx.measureText(test).width > maxW && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineH;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, x, y);
  };
  wrapText(bodyText, cardX + 60, cardY + 245, cardW - 120, 52);

  drawFootnote(ctx, o.footnote);
  ctx.restore();
});

// 6. Template: Thẻ Trích dẫn Nhân chứng / Hộp đen (evidence_quote)
tpl('evidence_quote', (ctx, lt, a, o) => {
  ctx.save();
  ctx.fillStyle = o.bg || '#090c12';
  ctx.fillRect(0, 0, E.W, E.H);

  const cardW = 1280;
  const cardH = 500;
  const cardX = (E.W - cardW) / 2;
  const cardY = (E.H - cardH) / 2;

  // Khung glassmorphism
  ctx.fillStyle = 'rgba(16, 23, 36, 0.85)';
  ctx.strokeStyle = 'rgba(74, 140, 255, 0.25)';
  ctx.lineWidth = 2;
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // Dấu ngoặc kép lớn
  ctx.fillStyle = '#4a8cff';
  ctx.font = '900 120px Archivo, sans-serif';
  ctx.fillText('“', cardX + 60, cardY + 110);

  // Quote text
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 42px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(o.text || 'Warning lights illuminated without prior indication.', cardX + 130, cardY + 80);

  // Tên & vai trò
  ctx.fillStyle = '#4a8cff';
  ctx.font = '700 28px "IBM Plex Mono", monospace';
  ctx.fillText((o.who || 'CAPTAIN STATEMENT').toUpperCase(), cardX + 130, cardY + 280);

  ctx.fillStyle = '#8b96a8';
  ctx.font = '500 22px Inter, sans-serif';
  ctx.fillText(`${o.role || 'First Officer'} — ${o.source || 'Official Transcript'}`, cardX + 130, cardY + 325);

  drawFootnote(ctx, o.footnote);
  ctx.restore();
});
