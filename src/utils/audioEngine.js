// Devotional Web Audio API sound generator for Authentic Hindu Mandir Bell (मंदिर की पावन घंटी - 'टनन्न्न्...')

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Authentic Hindu Temple Brass Bell ('टनन्न्न्...' - Mandir Ghanti)
export function playTempleBell() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Master bus with gentle compressor/limiter for smooth acoustics
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.85, now);
    masterGain.connect(ctx.destination);

    // Fundamental Bell strike note (approx E6 / 1318.5 Hz - classic resonant temple bell pitch)
    const baseFreq = 1318.5;

    // Acoustic Mandir Brass Bell harmonic modes (Prime, Tierce, Quint, Nominal, Super-nominal, High Ring)
    const bellModes = [
      { ratio: 0.5, gain: 0.25, decay: 4.5, type: 'sine' },       // Sub-hum tone
      { ratio: 1.0, gain: 0.65, decay: 5.0, type: 'sine' },       // Fundamental Prime ('Tan...')
      { ratio: 1.002, gain: 0.45, decay: 4.8, type: 'sine' },     // Slight acoustic beating shimmer
      { ratio: 1.2, gain: 0.35, decay: 3.8, type: 'sine' },       // Minor third (Tierce)
      { ratio: 1.5, gain: 0.25, decay: 3.2, type: 'sine' },       // Fifth (Quint)
      { ratio: 2.0, gain: 0.30, decay: 2.5, type: 'sine' },       // Octave (Nominal)
      { ratio: 2.76, gain: 0.18, decay: 1.8, type: 'triangle' },   // High ring mode
      { ratio: 4.07, gain: 0.12, decay: 1.2, type: 'sine' },       // Upper metallic sheen
      { ratio: 5.4, gain: 0.08, decay: 0.8, type: 'sine' }         // Clapper strike transient
    ];

    // Clapper strike noise pulse for the initial "T" impact
    const strikeOsc = ctx.createOscillator();
    const strikeGain = ctx.createGain();
    const strikeFilter = ctx.createBiquadFilter();

    strikeFilter.type = 'bandpass';
    strikeFilter.frequency.value = 2400;
    strikeFilter.Q.value = 3;

    strikeOsc.type = 'triangle';
    strikeOsc.frequency.setValueAtTime(baseFreq * 2.2, now);
    strikeOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + 0.04);

    strikeGain.gain.setValueAtTime(0.5, now);
    strikeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    strikeOsc.connect(strikeFilter);
    strikeFilter.connect(strikeGain);
    strikeGain.connect(masterGain);

    strikeOsc.start(now);
    strikeOsc.stop(now + 0.08);

    // Harmonic bell partials
    bellModes.forEach(({ ratio, gain, decay, type }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(baseFreq * ratio, now);

      g.gain.setValueAtTime(0.001, now);
      // Fast attack strike
      g.gain.linearRampToValueAtTime(gain, now + 0.008);
      // Long resonant exponential decay ("nnnnnn...")
      g.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(g);
      g.connect(masterGain);

      osc.start(now);
      osc.stop(now + decay + 0.1);
    });

  } catch (e) {
    console.error("Temple bell error:", e);
  }
}
