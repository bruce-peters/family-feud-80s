type Kind = 'ding' | 'buzzer' | 'reveal';

let ctx: AudioContext | null = null;
function getCtx(): AudioContext {
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  return ctx;
}

function tone(freq: number, durMs: number, type: OscillatorType = 'sine', gain = 0.2, when = 0, sweepTo?: number) {
  const ac = getCtx();
  const t0 = ac.currentTime + when;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (sweepTo !== undefined) {
    osc.frequency.linearRampToValueAtTime(sweepTo, t0 + durMs / 1000);
  }
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.008);
  g.gain.setValueAtTime(gain, t0 + durMs / 1000 - 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + durMs / 1000);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + durMs / 1000 + 0.05);
}

function buzzer() {
  const ac = getCtx();
  const t0 = ac.currentTime;
  const dur = 1.0;

  // Master gain + lowpass for that muffled "EHHHH" character
  const master = ac.createGain();
  master.gain.setValueAtTime(0, t0);
  master.gain.linearRampToValueAtTime(0.35, t0 + 0.01);
  master.gain.setValueAtTime(0.35, t0 + dur - 0.1);
  master.gain.linearRampToValueAtTime(0, t0 + dur);

  const lp = ac.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 900;
  lp.Q.value = 4;

  master.connect(lp).connect(ac.destination);

  // Three detuned saw/square voices descending slightly — that classic dissonant buzz
  const voices: Array<[number, number, OscillatorType]> = [
    [165, 110, 'sawtooth'],
    [110, 78, 'square'],
    [82, 60, 'sawtooth'],
  ];
  voices.forEach(([f0, f1, type]) => {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t0);
    o.frequency.linearRampToValueAtTime(f1, t0 + dur);
    g.gain.value = 0.5;
    o.connect(g).connect(master);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  });

  // Subtle vibrato on a 4th voice for grit
  const grit = ac.createOscillator();
  const gritGain = ac.createGain();
  const lfo = ac.createOscillator();
  const lfoGain = ac.createGain();
  grit.type = 'square';
  grit.frequency.setValueAtTime(140, t0);
  lfo.frequency.value = 22;
  lfoGain.gain.value = 18;
  lfo.connect(lfoGain).connect(grit.frequency);
  gritGain.gain.value = 0.25;
  grit.connect(gritGain).connect(master);
  grit.start(t0);
  lfo.start(t0);
  grit.stop(t0 + dur + 0.05);
  lfo.stop(t0 + dur + 0.05);
}

export function play(kind: Kind) {
  try {
    if (kind === 'ding') {
      tone(880, 120, 'sine', 0.25);
      tone(1320, 200, 'sine', 0.2, 0.08);
    } else if (kind === 'buzzer') {
      buzzer();
    } else if (kind === 'reveal') {
      tone(440, 80, 'triangle', 0.15);
      tone(660, 80, 'triangle', 0.15, 0.05);
    }
  } catch { /* audio blocked until user gesture */ }
}
