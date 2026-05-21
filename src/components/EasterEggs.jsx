import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Konami code easter egg
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

export default function EasterEggs() {
  const [konamiProgress, setKonamiProgress] = useState([]);
  const [showKonami, setShowKonami] = useState(false);
  const [notification, setNotification] = useState(null);
  const [secretsFound, setSecretsFound] = useState(0);

  const showNotif = (msg) => {
    setNotification(msg);
    setSecretsFound(s => s + 1);
    setTimeout(() => setNotification(null), 4000);
  };

  // Konami code
  useEffect(() => {
    const handler = (e) => {
      const updated = [...konamiProgress, e.key].slice(-KONAMI.length);
      setKonamiProgress(updated);
      if (updated.join(',') === KONAMI.join(',')) {
        setShowKonami(true);
        showNotif("🕹️ KONAMI CODE! You're a legend.");
        setTimeout(() => setShowKonami(false), 5000);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [konamiProgress]);

  // Double click counter
  useEffect(() => {
    let clicks = 0;
    const handler = () => {
      clicks++;
      if (clicks === 7) {
        showNotif("✨ 7 clicks! Lucky number. Lucky you.");
        clicks = 0;
      }
    };
    window.addEventListener('dblclick', handler);
    return () => window.removeEventListener('dblclick', handler);
  }, []);

  return (
    <>
      {/* KONAMI popup */}
      <AnimatePresence>
        {showKonami && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
            }}
            onClick={() => setShowKonami(false)}
          >
            <div style={{ textAlign: 'center' }}>
              <motion.div style={{ fontSize: '5rem', marginBottom: 16 }}
                animate={{ rotate: [0, 360] }} transition={{ duration: 1, repeat: 3 }}>
                🎮
              </motion.div>
              <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', color: '#ffd60a', marginBottom: 12 }}>
                CHEAT CODE UNLOCKED
              </h2>
              <p style={{ fontFamily: 'Caveat', fontSize: '1.4rem', color: 'rgba(255,255,255,0.7)' }}>
                Infinite love mode activated 💜<br/>
                (It was already infinite btw)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            style={{
              position: 'fixed', top: 24, right: 24,
              background: 'rgba(15,15,35,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,107,157,0.3)',
              borderRadius: 16, padding: '14px 20px',
              zIndex: 900, maxWidth: 300,
              boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            }}
          >
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,107,157,0.7)', fontFamily: 'Caveat', marginBottom: 4 }}>
              🔍 secret found! #{secretsFound}
            </p>
            <p style={{ fontSize: '0.88rem', color: '#fff', fontFamily: 'DM Sans' }}>{notification}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden corner secrets */}
      <div
        style={{
          position: 'fixed', bottom: 8, left: 8,
          width: 20, height: 20, cursor: 'none', zIndex: 50,
          opacity: 0, transition: 'opacity 0.3s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0'; }}
        onClick={() => showNotif("🌙 Found the corner star! You explore everything. I love that about you.")}
      >
        <div style={{ fontSize: '0.9rem' }}>⭐</div>
      </div>

      {/* Title click counter (exposed as global) */}
    </>
  );
}
