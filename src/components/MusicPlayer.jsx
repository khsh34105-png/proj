import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PLAYLIST = [
  { title: "Feels Like You",  artist: "dreamy vibes ✨",   color: "#ff6b9d", mode: "dreamy"    },
  { title: "Golden Hour",     artist: "twilight love 🌙",  color: "#c77dff", mode: "golden"    },
  { title: "Stargazing",      artist: "soft nights 🌟",    color: "#72efdd", mode: "stargazing"},
  { title: "Everywhere",      artist: "warm memories 💫",  color: "#ffd60a", mode: "warm"      },
  { title: "Ocean Eyes",      artist: "you in a song 🌊",  color: "#a78bfa", mode: "ocean"     },
];

// --- Web Audio engine ---
// Each "mode" procedurally generates a distinct ambient soundscape.
// Nothing is downloaded — all sound is synthesised in the browser.

function createAudioEngine(ctx) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.connect(ctx.destination);

  const nodes = [];

  function makePad(freq, detune = 0, gainVal = 0.06) {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    const filt = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.detune.setValueAtTime(detune, ctx.currentTime);

    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(800, ctx.currentTime);
    filt.Q.setValueAtTime(1, ctx.currentTime);

    gain.gain.setValueAtTime(gainVal, ctx.currentTime);

    osc.connect(filt);
    filt.connect(gain);
    gain.connect(master);
    osc.start();
    nodes.push(osc, gain, filt);
    return { osc, gain, filt };
  }

  // track all chime timers so stop() can cancel them
  const chimeTimers = [];

  function makeChime(freq, interval, gainVal = 0.04) {
    let timerId;
    function ring() {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      env.gain.setValueAtTime(0, ctx.currentTime);
      env.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + 0.01);
      env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);
      osc.connect(env);
      env.connect(master);
      osc.start();
      osc.stop(ctx.currentTime + 2);
      timerId = setTimeout(ring, interval + Math.random() * interval * 0.5);
      chimeTimers.push(timerId);
    }
    ring();
  }

  function makeNoise(gainVal = 0.015, cutoff = 400) {
    const bufSize = ctx.sampleRate * 2;
    const buf  = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const src  = ctx.createBufferSource();
    const filt = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    src.buffer = buf;
    src.loop = true;
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(cutoff, ctx.currentTime);
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);

    src.connect(filt);
    filt.connect(gain);
    gain.connect(master);
    src.start();
    nodes.push(src, filt, gain);
  }

  // LFO that slowly modulates a param
  function makeLFO(param, rate, depth, center) {
    const lfo  = ctx.createOscillator();
    const lfoG = ctx.createGain();
    lfo.frequency.setValueAtTime(rate, ctx.currentTime);
    lfoG.gain.setValueAtTime(depth, ctx.currentTime);
    param.setValueAtTime(center, ctx.currentTime);
    lfo.connect(lfoG);
    lfoG.connect(param);
    lfo.start();
    nodes.push(lfo, lfoG);
  }

  // Build soundscape per mode
  function buildMode(mode) {
    switch (mode) {

      case 'dreamy': {
        // Soft pad chord  C maj7: C3 E3 G3 B3
        const freqs = [130.81, 164.81, 196.00, 246.94];
        freqs.forEach((f, i) => {
          const { osc, filt } = makePad(f, i * 4, 0.055);
          makeLFO(osc.frequency, 0.07 + i * 0.013, 1.5, f);
          makeLFO(filt.frequency, 0.04 + i * 0.009, 180, 700);
        });
        makeChime(523.25, 3200); // C5
        makeChime(659.25, 4800); // E5
        makeNoise(0.01, 300);
        break;
      }

      case 'golden': {
        // Warm pad  A min: A2 C3 E3 + high A4
        const freqs = [110, 130.81, 164.81, 440];
        freqs.forEach((f, i) => {
          const { osc, filt } = makePad(f, i * 6, 0.05);
          osc.type = 'triangle';
          makeLFO(osc.frequency, 0.05 + i * 0.011, 2, f);
          makeLFO(filt.frequency, 0.035, 200, 600);
        });
        makeChime(880, 5000, 0.035);
        makeChime(1108.73, 7000, 0.025); // C#6
        makeNoise(0.008, 200);
        break;
      }

      case 'stargazing': {
        // High crystal pad  E maj: E3 G#3 B3 E4
        const freqs = [164.81, 207.65, 246.94, 329.63];
        freqs.forEach((f, i) => {
          const { osc, filt } = makePad(f, i * 3, 0.045);
          osc.type = 'sine';
          makeLFO(osc.frequency, 0.09 + i * 0.017, 1, f);
          makeLFO(filt.frequency, 0.06, 300, 1000);
        });
        makeChime(1318.51, 2800, 0.05); // E6
        makeChime(987.77,  3600, 0.04); // B5
        makeChime(1567.98, 6000, 0.03); // G6
        makeNoise(0.007, 500);
        break;
      }

      case 'warm': {
        // Sunny pad  D maj: D3 F#3 A3 D4
        const freqs = [146.83, 185.00, 220.00, 293.66];
        freqs.forEach((f, i) => {
          const { osc, filt } = makePad(f, i * 5, 0.055);
          osc.type = 'triangle';
          makeLFO(osc.frequency, 0.06 + i * 0.015, 2.5, f);
          makeLFO(filt.frequency, 0.03, 250, 750);
        });
        makeChime(587.33, 3500, 0.045); // D5
        makeChime(740.00, 5500, 0.035); // F#5
        makeNoise(0.012, 350);
        break;
      }

      case 'ocean': {
        // Deep wavy pad  F maj: F2 A2 C3 F3
        const freqs = [87.31, 110.00, 130.81, 174.61];
        freqs.forEach((f, i) => {
          const { osc, filt } = makePad(f, i * 7, 0.06);
          osc.type = 'sine';
          makeLFO(osc.frequency, 0.04 + i * 0.008, 3, f);
          makeLFO(filt.frequency, 0.025, 300, 500);
        });
        makeChime(349.23, 4000, 0.04); // F4
        makeChime(523.25, 6500, 0.03); // C5
        makeNoise(0.018, 250);         // ocean wash
        break;
      }

      default: break;
    }
  }

  return {
    buildMode,
    fadeIn(duration = 1.5) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(1, ctx.currentTime + duration);
    },
    fadeOut(duration = 1.2) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
    },
    setVolume(v) {
      master.gain.setValueAtTime(v, ctx.currentTime);
    },
    stop() {
      // cancel all pending chime timeouts first
      chimeTimers.forEach(id => clearTimeout(id));
      chimeTimers.length = 0;
      // disconnect and stop all audio nodes
      nodes.forEach(n => { try { n.disconnect(); n.stop?.(); } catch (_) {} });
      nodes.length = 0;
    },
  };
}

// --- Component ---

export default function MusicPlayer({ isPlaying, setIsPlaying }) {
  const [currentTrack, setCurrentTrack]   = useState(0);
  const [expanded, setExpanded]           = useState(false);
  const [progress, setProgress]           = useState(0);

  const ctxRef    = useRef(null);
  const engineRef = useRef(null);
  const intervalRef = useRef(null);

  const track = PLAYLIST[currentTrack];

  // Boot / swap audio engine
  const startEngine = useCallback((mode) => {
    // Kill any existing engine immediately before creating a new one
    if (engineRef.current) {
      engineRef.current.stop();
      engineRef.current = null;
    }

    // Create (or reuse) AudioContext
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }

    const engine = createAudioEngine(ctxRef.current);
    engine.buildMode(mode);
    engine.fadeIn(1.5);
    engineRef.current = engine;
  }, []);

  const stopEngine = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.fadeOut(0.8);
      const dying = engineRef.current;
      engineRef.current = null; // null immediately so no new engine races it
      setTimeout(() => dying.stop(), 900);
    }
  }, []);

  // React to play/pause
  useEffect(() => {
    if (isPlaying) {
      startEngine(track.mode);
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setCurrentTrack(t => (t + 1) % PLAYLIST.length);
            return 0;
          }
          return p + 0.5;
        });
      }, 150);
    } else {
      stopEngine();
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  // Swap track while playing
  useEffect(() => {
    if (isPlaying) startEngine(track.mode);
  }, [currentTrack]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopEngine();
      clearInterval(intervalRef.current);
    };
  }, []);

  const selectTrack = (i) => {
    setCurrentTrack(i);
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <motion.div
      className="music-player"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2, type: 'spring' }}
      onClick={() => setExpanded(!expanded)}
      style={{ cursor: 'none' }}
    >
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'absolute',
              bottom: '100%',
              right: 0,
              marginBottom: 12,
              background: 'rgba(15,15,35,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16,
              padding: '16px',
              minWidth: 220,
            }}
          >
            <p style={{ fontFamily: 'Caveat', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: 8 }}>
              Songs that feel like you 🎵
            </p>
            {PLAYLIST.map((t, i) => (
              <div
                key={i}
                onClick={(e) => { e.stopPropagation(); selectTrack(i); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px',
                  borderRadius: 8, cursor: 'none',
                  background: i === currentTrack ? 'rgba(255,255,255,0.08)' : 'transparent',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: t.color, flexShrink: 0,
                  boxShadow: `0 0 8px ${t.color}`,
                }} />
                <div>
                  <p style={{ fontSize: '0.85rem', color: '#e8e8f0' }}>{t.title}</p>
                  <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{t.artist}</p>
                </div>
                {i === currentTrack && isPlaying && (
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                    {[1, 2, 3].map(b => (
                      <div key={b} className={`eq-bar eq-${b}`} style={{ width: 3, background: t.color, borderRadius: 2 }} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Waveform bars */}
      <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 20 }}>
        {[4, 7, 5, 9, 6, 8, 4, 6, 7].map((h, i) => (
          <motion.div
            key={i}
            style={{
              width: 3, borderRadius: 2,
              background: isPlaying ? track.color : 'rgba(255,255,255,0.3)',
              boxShadow: isPlaying ? `0 0 6px ${track.color}` : 'none',
            }}
            animate={{ height: isPlaying ? [h * 1.5, h * 3, h * 1.5] : h }}
            transition={{ repeat: Infinity, duration: 0.6 + i * 0.08, delay: i * 0.05 }}
          />
        ))}
      </div>

      <div style={{ minWidth: 100 }}>
        <p style={{ fontSize: '0.8rem', color: '#e8e8f0', fontWeight: 500 }}>{track.title}</p>
        <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>{track.artist}</p>
        <div style={{ height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1, marginTop: 4 }}>
          <div style={{ height: '100%', width: `${progress}%`, background: track.color, borderRadius: 1, transition: 'width 0.15s' }} />
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
        style={{
          width: 32, height: 32, borderRadius: '50%',
          background: `linear-gradient(135deg, ${track.color}, var(--violet))`,
          border: 'none', cursor: 'none', color: '#fff', fontSize: '0.8rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 15px ${track.color}50`,
        }}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

      <style>{`
        @keyframes eq1 { from { height: 4px; } to { height: 14px; } }
        @keyframes eq2 { from { height: 8px; } to { height: 18px; } }
        @keyframes eq3 { from { height: 6px; } to { height: 12px; } }
        .eq-bar { height: 6px; }
        .eq-1 { animation: eq1 0.8s ease infinite alternate; }
        .eq-2 { animation: eq2 0.6s ease infinite alternate; }
        .eq-3 { animation: eq3 0.9s ease infinite alternate; }
      `}</style>
    </motion.div>
  );
}