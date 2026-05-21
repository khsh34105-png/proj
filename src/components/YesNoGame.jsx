import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const QUESTIONS = [
  "Do you think about me sometimes? 🥺",
  "Am I your favourite? (be honest)",
  "Okay but... do you really like me? 👀",
  "Best person you know? (right answer only)",
  "Are you smiling right now? 😊",
];

export default function YesNoGame() {
  const [qIndex, setQIndex] = useState(0);
  const [yesCount, setYesCount] = useState(0);
  const [done, setDone] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const runAwayNo = () => {
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) return;
    const rx = (Math.random() - 0.5) * 300;
    const ry = (Math.random() - 0.5) * 200;
    setNoPos(prev => ({
      x: Math.max(-150, Math.min(150, prev.x + rx)),
      y: Math.max(-80, Math.min(80, prev.y + ry)),
    }));
  };

  const handleYes = () => {
    setYesCount(y => y + 1);
    setNoPos({ x: 0, y: 0 });
    if (qIndex + 1 >= QUESTIONS.length) {
      setDone(true);
    } else {
      setQIndex(q => q + 1);
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center', padding: '2rem' }}
      >
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
        <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.4rem', color: '#ff6b9d', marginBottom: 12 }}>
          {yesCount} yeses! That's a perfect score.
        </h3>
        <p style={{ fontFamily: 'Caveat', fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)' }}>
          See? Saying yes to me is always the right choice 😌💜
        </p>
        <div className="achievement-badge" style={{ marginTop: 16, display: 'inline-flex' }}>
          💖 No button defeated!
        </div>
      </motion.div>
    );
  }

  return (
    <div ref={containerRef} style={{ textAlign: 'center', padding: '2rem', position: 'relative', minHeight: 260 }}>
      <motion.h3
        key={qIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: 'Playfair Display', fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', color: '#fff', marginBottom: 48, maxWidth: 400, margin: '0 auto 48px' }}
      >
        {QUESTIONS[qIndex]}
      </motion.h3>

      <div style={{ display: 'flex', gap: 40, justifyContent: 'center', alignItems: 'center', position: 'relative', height: 60 }}>
        {/* YES button — big and inviting */}
        <motion.button
          onClick={handleYes}
          style={{
            padding: '14px 40px', borderRadius: 50,
            background: 'linear-gradient(135deg, #ff6b9d, #c77dff)',
            border: 'none', color: '#fff', fontSize: '1rem',
            fontFamily: 'DM Sans', fontWeight: 600,
            cursor: 'none', letterSpacing: '0.1em',
            boxShadow: '0 0 30px rgba(255,107,157,0.4)',
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          Yes! 💖
        </motion.button>

        {/* NO button — runs away on hover */}
        <motion.button
          onHoverStart={runAwayNo}
          onTouchStart={runAwayNo}
          animate={{ x: noPos.x, y: noPos.y }}
          transition={{ type: 'spring', stiffness: 300 }}
          style={{
            padding: '10px 24px', borderRadius: 50,
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem',
            fontFamily: 'DM Sans', cursor: 'none',
            position: 'relative', zIndex: 10,
          }}
        >
          No...
        </motion.button>
      </div>

      <p style={{ marginTop: 32, fontFamily: 'Caveat', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>
        (the no button doesn't want to be clicked btw 👀)
      </p>
    </div>
  );
}
