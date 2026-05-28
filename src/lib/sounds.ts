type Kind = 'ding' | 'buzzer' | 'reveal';

const cache: Record<string, HTMLAudioElement> = {};

function getAudio(src: string): HTMLAudioElement {
  if (!cache[src]) {
    cache[src] = new Audio(src);
    cache[src].load();
  }
  return cache[src];
}

let current: HTMLAudioElement | null = null;

export function playSound(src: string) {
  try {
    if (current) { current.pause(); current.currentTime = 0; }
    const audio = getAudio(src);
    audio.currentTime = 0;
    audio.play().catch(() => {});
    current = audio;
  } catch { /* blocked until user gesture */ }
}

export function stopSound() {
  try {
    if (current) { current.pause(); current.currentTime = 0; current = null; }
  } catch { /* */ }
}

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

export function play(kind: Kind) {
  try {
    if (kind === 'ding') {
      playSound('/sounds/correct.mp3');
    } else if (kind === 'buzzer') {
      playSound('/sounds/buzzer.mp3');
    } else if (kind === 'reveal') {
      tone(440, 80, 'triangle', 0.15);
      tone(660, 80, 'triangle', 0.15, 0.05);
    }
  } catch { /* audio blocked until user gesture */ }
}
