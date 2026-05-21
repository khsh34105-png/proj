import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CARD_EMOJIS = ['💖', '🌸', '✨', '🦋', '🌙', '💫', '🎵', '🌺'];

function shuffle(arr) {
  return [...arr, ...arr]
    .sort(() => Math.random() - 0.5)
    .map((v, i) => ({ id: i, value: v, flipped: false, matched: false }));
}

export default function MemoryGame({ onWin }) {
  const [cards, setCards] = useState(shuffle(CARD_EMOJIS));
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [message, setMessage] = useState('');
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (selected.length === 2) {
      setLocked(true);
      const [a, b] = selected;
      if (cards[a].value === cards[b].value) {
        setCards(c =>
          c.map((card, i) => i === a || i === b ? { ...card, matched: true } : card)
        );
        setMessage('Match! 🎉');
        setTimeout(() => { setMessage(''); setSelected([]); setLocked(false); }, 800);
      } else {
        setMessage('Try again... 😅');
        setTimeout(() => {
          setCards(c =>
            c.map((card, i) => i === a || i === b ? { ...card, flipped: false } : card)
          );
          setMessage('');
          setSelected([]);
          setLocked(false);
        }, 900);
      }
      setMoves(m => m + 1);
    }
  }, [selected]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched)) {
      setWon(true);
      setTimeout(() => onWin?.(), 1500);
    }
  }, [cards]);

  const flipCard = (idx) => {
    if (locked) return;
    if (selected.length >= 2) return;
    if (cards[idx].flipped || cards[idx].matched) return;
    setCards(c => c.map((card, i) => i === idx ? { ...card, flipped: true } : card));
    setSelected(s => [...s, idx]);
  };

  const reset = () => {
    setCards(shuffle(CARD_EMOJIS));
    setSelected([]);
    setMoves(0);
    setWon(false);
    setLocked(false);
    setMessage('');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <style>{`
        .mc-wrap {
          width: 80px;
          height: 80px;
          perspective: 600px;
          cursor: pointer;
        }
        .mc-inner {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.5s ease;
        }
        .mc-inner.is-flipped {
          transform: rotateY(180deg);
        }
        .mc-face {
          position: absolute;
          inset: 0;
          border-radius: 12px;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mc-back {
          background: linear-gradient(135deg, #c77dff, #ff6b9d);
          font-size: 1.2rem;
        }
        .mc-front {
          background: rgba(22,22,42,0.9);
          border: 1px solid rgba(255,255,255,0.15);
          font-size: 1.8rem;
          transform: rotateY(180deg);
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontFamily: 'Caveat', fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}>
          moves: {moves}
        </span>
        <AnimatePresence>
          {message && (
            <motion.span
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              style={{ fontFamily: 'Caveat', fontSize: '1.2rem', color: '#72efdd' }}
            >
              {message}
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={reset}
          style={{ fontFamily: 'Caveat', fontSize: '1rem', color: '#ff6b9d', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          restart ↺
        </button>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 80px)',
        gap: 10,
        justifyContent: 'center',
        margin: '0 auto',
      }}>
        {cards.map((card, i) => (
          <div
            key={card.id}
            className="mc-wrap"
            onClick={() => flipCard(i)}
            style={{ opacity: card.matched ? 0.35 : 1, transition: 'opacity 0.4s' }}
          >
            <div className={`mc-inner ${card.flipped || card.matched ? 'is-flipped' : ''}`}>
              <div className="mc-face mc-back">✨</div>
              <div className="mc-face mc-front">{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Win message */}
      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ marginTop: 24 }}
          >
            <p style={{ fontFamily: 'Playfair Display', fontSize: '1.3rem', color: '#ffd60a', marginBottom: 8 }}>
              You won in {moves} moves! 🌟
            </p>
            <p style={{ fontFamily: 'Caveat', fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }}>
              {moves < 20
                ? 'Incredible memory! Just like how you never forget the little things 💜'
                : "You got there! Some things take time — that's okay ✨"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}