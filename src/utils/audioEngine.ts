/**
 * Generative Web Audio Ambient Soundscapes & Speech Engine
 * Provides authentic, zero-dependency, non-network ambient audio (Rain, Lofi Piano, Wind)
 * and read-along speech synthesis.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;

  // Master Gain
  private masterGain: GainNode | null = null;

  // Rain Nodes
  private rainGain: GainNode | null = null;
  private rainNode: AudioNode | null = null;

  // Wind Nodes
  private windGain: GainNode | null = null;
  private windNode: AudioNode | null = null;

  // Piano State
  private pianoGain: GainNode | null = null;
  private pianoInterval: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Rain branch
      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.rainGain.connect(this.masterGain);

      // Wind branch
      this.windGain = this.ctx.createGain();
      this.windGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.windGain.connect(this.masterGain);

      // Piano branch
      this.pianoGain = this.ctx.createGain();
      this.pianoGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.pianoGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- Rain Generator (Filtered Noise + Droplet pops) ---
  private startRain() {
    if (!this.ctx || !this.rainGain) return;

    // Buffer noise
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Lowpass filter for cozy muffled rain
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.rainGain);
    whiteNoise.start();
    this.rainNode = whiteNoise;
  }

  // --- Wind Generator (Resonant modulated noise) ---
  private startWind() {
    if (!this.ctx || !this.windGain) return;

    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(380, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(4.0, this.ctx.currentTime);

    // Subtle LFO for wind gust swelling
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(150, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(bandpass.frequency);
    lfo.start();

    noise.connect(bandpass);
    bandpass.connect(this.windGain);
    noise.start();
    this.windNode = noise;
  }

  // --- Melancholic Piano Chords Generator ---
  private playPianoNote(freq: number, startTime: number, duration: number) {
    if (!this.ctx || !this.pianoGain) return;

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    // Lowpass filter for warm, rounded, acoustic felt piano texture
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, startTime);
    filter.frequency.exponentialRampToValueAtTime(350, startTime + duration);

    // Envelope
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.08); // gentle attack
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration); // long graceful release

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.pianoGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }

  private startPianoCycle() {
    if (!this.ctx) return;

    // Poetic progressions: D minor / F major / C major / Bb / A minor notes (in Hz)
    const chords = [
      [146.83, 220.00, 261.63, 349.23], // Dm7 (D3, A3, C4, F4)
      [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
      [130.81, 196.00, 261.63, 329.63], // C/E (C3, G3, C4, E4)
      [116.54, 174.61, 220.00, 293.66], // Bbadd9 (Bb2, F3, A3, D4)
      [110.00, 164.81, 220.00, 261.63], // Am (A2, E3, A3, C4)
    ];

    let chordIndex = 0;

    const scheduleChord = () => {
      if (!this.ctx || !this.isRunning) return;
      const now = this.ctx.currentTime;
      const currentChord = chords[chordIndex % chords.length];
      chordIndex++;

      // Arpeggiate chord notes with slight humanized delay
      currentChord.forEach((freq, idx) => {
        const noteDelay = idx * 0.35 + Math.random() * 0.08;
        const duration = 4.5 + Math.random() * 0.8;
        this.playPianoNote(freq, now + noteDelay, duration);
      });
    };

    scheduleChord();
    this.pianoInterval = window.setInterval(scheduleChord, 4800);
  }

  // --- Public Controls ---
  public start(config?: { rain?: number; piano?: number; wind?: number; master?: number }) {
    this.initContext();
    if (this.isRunning) return;
    this.isRunning = true;

    this.startRain();
    this.startWind();
    this.startPianoCycle();

    if (config) {
      this.updateVolumes(config);
    }
  }

  public stop() {
    this.isRunning = false;
    if (this.pianoInterval) {
      clearInterval(this.pianoInterval);
      this.pianoInterval = null;
    }

    if (this.rainNode) {
      try {
        (this.rainNode as AudioBufferSourceNode).stop();
      } catch {
        // ignore already stopped
      }
      this.rainNode = null;
    }

    if (this.windNode) {
      try {
        (this.windNode as AudioBufferSourceNode).stop();
      } catch {
        // ignore
      }
      this.windNode = null;
    }
  }

  public updateVolumes({
    rain,
    piano,
    wind,
    master,
  }: {
    rain?: number;
    piano?: number;
    wind?: number;
    master?: number;
  }) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (master !== undefined && this.masterGain) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, master)), now);
    }
    if (rain !== undefined && this.rainGain) {
      this.rainGain.gain.setValueAtTime(Math.max(0, Math.min(1, rain)), now);
    }
    if (piano !== undefined && this.pianoGain) {
      this.pianoGain.gain.setValueAtTime(Math.max(0, Math.min(1, piano)), now);
    }
    if (wind !== undefined && this.windGain) {
      this.windGain.gain.setValueAtTime(Math.max(0, Math.min(1, wind)), now);
    }
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }
}

export const ambientSound = new SoundEngine();

/**
 * Read-Along Speech Controller
 */
export class SpeechController {
  private static synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;
  private static onEndCallback: (() => void) | null = null;

  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public static speakText(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      onEnd?: () => void;
      onError?: () => void;
    }
  ) {
    if (!this.synth) return;
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 0.88;
    utterance.pitch = options.pitch || 0.95;

    // Pick best available voice (prefer ne-NP, hi-IN, or gentle natural voices)
    const voices = this.synth.getVoices();
    const preferredVoice =
      voices.find((v) => v.lang.startsWith('ne')) ||
      voices.find((v) => v.lang.startsWith('hi')) ||
      voices.find((v) => v.lang.startsWith('en-IN')) ||
      voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      if (options.onError) options.onError();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public static pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public static resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public static stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public static isSpeaking(): boolean {
    return !!(this.synth && this.synth.speaking);
  }
}
