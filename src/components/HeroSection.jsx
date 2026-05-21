import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

export default function HeroSection({ onNext }) {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowScroll(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="section" style={{
      background: 'radial-gradient(ellipse at 30% 50%, rgba(199,125,255,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(255,107,157,0.05) 0%, transparent 60%)',
      minHeight: '100vh',
    }}>
      {/* Big dreamy circle */}
      <motion.div
        style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(199,125,255,0.08) 0%, transparent 70%)',
          left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
        transition={{ scale: { duration: 6, repeat: Infinity }, rotate: { duration: 30, repeat: Infinity, ease: 'linear' } }}
      />

      {/* Orbiting elements */}
      {['💖', '✨', '🌙', '💫', '🌸'].map((emoji, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute', fontSize: '1.8rem',
            left: '50%', top: '50%',
          }}
          animate={{
            rotate: 360,
          }}
          transition={{ duration: 8 + i * 3, repeat: Infinity, ease: 'linear' }}
          custom={i}
        >
          <motion.span
            style={{ display: 'block' }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2 + i, repeat: Infinity }}
          >
            <div style={{
              transform: `translateX(${180 + i * 30}px) translateY(-50%)`,
              display: 'inline-block',
            }}>{emoji}</div>
          </motion.span>
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div
        style={{ textAlign: 'center', position: 'relative', zIndex: 2, maxWidth: 700 }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.p
          style={{ fontFamily: 'Caveat', fontSize: '1.3rem', color: 'rgba(255,107,157,0.8)', marginBottom: 16 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          hey you ✨
        </motion.p>

        <motion.h1
          style={{
            fontFamily: 'Playfair Display', fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            color: '#fff', lineHeight: 1.15, marginBottom: 24,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Welcome to{' '}
          <span style={{
            background: 'linear-gradient(135deg, #ff6b9d, #c77dff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            your world
          </span>
        </motion.h1>

        <motion.div
          style={{
            fontFamily: 'DM Sans', fontSize: 'clamp(1rem, 2vw, 1.3rem)',
            color: 'rgba(255,255,255,0.6)', marginBottom: 48, minHeight: 36,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <TypeAnimation
            sequence={[
              'A place made with too many feelings... 🌸',
              2000,
              'Full of things I wanted to say... 💭',
              2000,
              'And a few surprises along the way... ✨',
              2000,
              'Explore slowly. There\'s so much hidden here 🔍',
              2500,
            ]}
            wrapper="span"
            cursor={true}
            repeat={Infinity}
            speed={60}
          />
        </motion.div>

        <motion.div
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
        >
          <motion.button
            className="btn-neon"
            onClick={onNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ borderColor: '#ff6b9d', color: '#ff6b9d' }}
          >
            Start exploring →
          </motion.button>
        </motion.div>

        {showScroll && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: 60, color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', fontFamily: 'Caveat', fontSize: '1rem' }}
          >
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              scroll down to discover ↓
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Corner secret star */}
      <motion.div
        style={{
          position: 'absolute', top: 24, right: 24,
          fontSize: '1.2rem', opacity: 0.05, cursor: 'none',
          transition: 'opacity 0.3s',
        }}
        whileHover={{ opacity: 1, scale: 1.5, rotate: 180 }}
        title="You found a secret ⭐"
        onClick={() => alert("⭐ Secret star found! +1 magic point! You're curious — I like that 💜")}
      >
        ⭐
      </motion.div>
    </section>
  );
}
