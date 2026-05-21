import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

const FINAL_MESSAGES = [
  "You made it to the end of this little world. 🌍",
  "Which means you spent time here. With me. In a way.",
  "And that means more than I'll probably ever say directly. 💜",
  "This whole thing exists because of one reason:",
  "You deserve to feel seen. Celebrated. Treasured.",
  "Not just on birthdays or special occasions.",
  "But on a random Tuesday when someone just wanted to say:",
  "I'm really, really glad you're you.",
  "Thank you for being in my life. ✨",
  "Now go do something that makes you happy today.",
  "You've earned it.",
];

export default function GrandFinale() {
  const [started, setStarted] = useState(false);
  const [messageIdx, setMessageIdx] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showReplay, setShowReplay] = useState(false);

  const start = () => {
    setStarted(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 8000);
  };

  useEffect(() => {
    if (!started) return;
    if (messageIdx >= FINAL_MESSAGES.length - 1) {
      setTimeout(() => setShowReplay(true), 2000);
      return;
    }
    const t = setTimeout(() => setMessageIdx(i => i + 1), 2800);
    return () => clearTimeout(t);
  }, [messageIdx, started]);

  return (
    <section className="section" style={{
      padding: '6rem 2rem',
      background: 'radial-gradient(ellipse at 50% 50%, rgba(255,107,157,0.06) 0%, transparent 60%)',
      minHeight: '100vh',
    }}>
      {showConfetti && (
        <Confetti
          numberOfPieces={200}
          colors={['#ff6b9d', '#c77dff', '#72efdd', '#ffd60a', '#ff9ece', '#fff']}
          recycle={false}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 500 }}
        />
      )}

      {/* Stars explosion on start */}
      {started && Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'fixed',
            left: '50%', top: '50%',
            fontSize: Math.random() > 0.5 ? '1.5rem' : '1rem',
            zIndex: 400, pointerEvents: 'none',
          }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{
            x: (Math.random() - 0.5) * window.innerWidth,
            y: (Math.random() - 0.5) * window.innerHeight,
            opacity: 0,
            rotate: Math.random() * 720,
          }}
          transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5 }}
        >
          {['✨', '💫', '⭐', '💜', '🌸', '💖'][Math.floor(Math.random() * 6)]}
        </motion.div>
      ))}

      <motion.div
        style={{ textAlign: 'center', maxWidth: 600, position: 'relative', zIndex: 2 }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {!started ? (
          <>
            <motion.div
              style={{ fontSize: '4rem', marginBottom: 24 }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🎁
            </motion.div>
            <h2 style={{
              fontFamily: 'Playfair Display', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: '#fff', marginBottom: 16, lineHeight: 1.2,
            }}>
              The{' '}
              <span style={{
                background: 'linear-gradient(135deg, #ff6b9d, #c77dff)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Grand Finale</span>
            </h2>
            <p style={{ fontFamily: 'Caveat', fontSize: '1.3rem', color: 'rgba(255,255,255,0.5)', marginBottom: 48 }}>
              the most important part of this whole world
            </p>
            <motion.button
              className="btn-neon"
              onClick={start}
              style={{
                borderColor: '#ffd60a', color: '#ffd60a',
                fontSize: '1rem', padding: '16px 48px',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,214,10,0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              open ✨
            </motion.button>
          </>
        ) : (
          <div>
            {/* Stars in background */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'fixed',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: '1rem',
                  pointerEvents: 'none', zIndex: 1,
                }}
                animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.3, 1] }}
                transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
              >
                {'✨💫⭐'.split('')[Math.floor(Math.random() * 3)]}
              </motion.div>
            ))}

            <AnimatePresence mode="wait">
              <motion.div
                key={messageIdx}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <p style={{
                  fontFamily: messageIdx % 3 === 0 ? 'Playfair Display' : 'Caveat',
                  fontSize: messageIdx % 3 === 0 ? 'clamp(1.5rem, 4vw, 2.2rem)' : 'clamp(1.3rem, 3vw, 1.8rem)',
                  color: ['#fff', '#ff6b9d', '#c77dff', '#72efdd', '#ffd60a'][messageIdx % 5],
                  lineHeight: 1.5, textAlign: 'center',
                  textShadow: `0 0 40px ${['#ff6b9d40', '#c77dff40', '#72efdd40'][messageIdx % 3]}`,
                }}>
                  {FINAL_MESSAGES[messageIdx]}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 40 }}>
              {FINAL_MESSAGES.map((_, i) => (
                <div key={i} style={{
                  width: i <= messageIdx ? 16 : 6,
                  height: 6, borderRadius: 3,
                  background: i <= messageIdx ? '#ff6b9d' : 'rgba(255,255,255,0.15)',
                  transition: 'all 0.3s',
                }} />
              ))}
            </div>

            {showReplay && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: 48 }}
              >
                <p style={{ fontFamily: 'Caveat', fontSize: '1.1rem', color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
                  💜 made with love, just for you
                </p>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <motion.button
                    className="btn-neon"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    style={{ borderColor: '#c77dff', color: '#c77dff' }}
                    whileHover={{ scale: 1.05 }}
                  >
                    replay from start ↑
                  </motion.button>
                  <motion.button
                    className="btn-neon"
                    onClick={() => { setMessageIdx(0); setShowConfetti(true); setShowReplay(false); setTimeout(() => setShowConfetti(false), 8000); }}
                    style={{ borderColor: '#ff6b9d', color: '#ff6b9d' }}
                    whileHover={{ scale: 1.05 }}
                  >
                    read again ✨
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </section>
  );
}
