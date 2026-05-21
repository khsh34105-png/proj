import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // loading | enter
  const [text, setText] = useState('loading magic...');

  const loadingTexts = [
    'gathering stardust... ✨',
    'bottling moonlight... 🌙',
    'wiring up the dreams... 💫',
    'adding a little love... 💖',
    'almost ready for you...',
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += Math.random() * 12 + 3;
      if (i >= 100) { i = 100; clearInterval(interval); setTimeout(() => setPhase('enter'), 600); }
      setProgress(Math.min(Math.round(i), 100));
      setText(loadingTexts[Math.floor((i / 100) * (loadingTexts.length - 1))]);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        key="loading"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 1.2 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'radial-gradient(ellipse at 50% 50%, #0f0f28 0%, #0a0a14 100%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 32,
        }}
      >
        {/* Stars background */}
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              borderRadius: '50%',
              background: '#fff',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.1, 1, 0.1] }}
            transition={{ duration: Math.random() * 3 + 1, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}

        {/* Big glowing orb */}
        <motion.div
          style={{
            width: 120, height: 120, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(199,125,255,0.3) 0%, transparent 70%)',
            position: 'absolute',
            filter: 'blur(20px)',
          }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {phase === 'loading' ? (
          <motion.div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
            {/* Logo */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{ fontSize: '3rem', marginBottom: 24, display: 'inline-block' }}
            >
              ✨
            </motion.div>

            <p style={{
              fontFamily: 'Caveat', fontSize: '1.8rem',
              color: 'rgba(255,255,255,0.7)', marginBottom: 32,
            }}>
              {text}
            </p>

            {/* Progress bar */}
            <div style={{
              width: 240, height: 3, background: 'rgba(255,255,255,0.1)',
              borderRadius: 2, overflow: 'hidden',
            }}>
              <motion.div
                style={{ height: '100%', background: 'linear-gradient(90deg, #ff6b9d, #c77dff)', borderRadius: 2 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <p style={{ marginTop: 10, fontFamily: 'Space Mono', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
              {progress}%
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}
          >
            <motion.p
              style={{ fontFamily: 'Playfair Display', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: '#fff', marginBottom: 12 }}
              animate={{ opacity: [0, 1] }}
              transition={{ duration: 1 }}
            >
              I made this little world
            </motion.p>
            <motion.p
              style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'transparent',
                background: 'linear-gradient(135deg, #ff6b9d, #c77dff)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                marginBottom: 48,
              }}
              animate={{ opacity: [0, 1] }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              just for you ✨
            </motion.p>

            <motion.button
              onClick={onComplete}
              style={{
                padding: '16px 48px', borderRadius: 50,
                background: 'linear-gradient(135deg, #ff6b9d, #c77dff)',
                border: 'none', color: '#fff', fontSize: '1rem',
                fontFamily: 'DM Sans', letterSpacing: '0.15em', textTransform: 'uppercase',
                cursor: 'none', fontWeight: 500,
                boxShadow: '0 0 40px rgba(255,107,157,0.4)',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(255,107,157,0.7)' }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              Enter ✨
            </motion.button>

            {/* Floating hearts */}
            {['💖', '💫', '🌸', '✨'].map((e, i) => (
              <motion.span
                key={i}
                style={{ position: 'absolute', fontSize: '1.5rem' }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 100],
                  y: [0, -80 - Math.random() * 60],
                  opacity: [0.8, 0],
                  scale: [1, 0.5],
                }}
                transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.5 }}
              >
                {e}
              </motion.span>
            ))}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
