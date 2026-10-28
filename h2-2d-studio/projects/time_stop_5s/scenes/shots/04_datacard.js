// scenes/shots/04_datacard.js — Scientific data card with exponential curve
import { E, V, S, registerShot, ease, prog, clamp, alpha } from '/engine/core.js';
import * as UI from '/engine/ui2d.js';

registerShot('s004', {
  draw(g, t, info) {
    UI.blueprint(g, { a: 0.04 });

    // Thẻ dữ liệu nhảy số và đồ thị đường cong tăng vọt
    UI.dataCard(g, t, {
      title: 'AIR RESISTANCE MULTIPLIER',
      subtitle: 'DISPLACEMENT COEFFICIENT',
      from: 1.0,
      to: 99.9,
      unit: 'x',
      decimals: 1,
      start: 0.4,
      dur: 2.8,
      shape: 2.2,
      inDur: 0.4,
      total: info.dur,
      labels: [
        [0.0, '1.0x (Normal)'],
        [0.5, '25.0x (Rigid)'],
        [1.0, '99.9x (Solid Wall)']
      ]
    });

    // Thẻ đo đạc số liệu phụ
    UI.readout(g, {
      label: 'ENVIRONMENTAL TEMPERATURE:',
      value: 'ABSOLUTE ZERO (-273.15 C)',
      x: V(120, 80),
      y: E.H - V(80, 140),
      color: '#8fd0ff',
      size: V(32, 34),
      a: ease.out(prog(t, 1.5, 2.2))
    });
  }
});
