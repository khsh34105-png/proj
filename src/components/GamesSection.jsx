import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemoryGame from './MemoryGame';
import QuizGame from './QuizGame';
import YesNoGame from './YesNoGame';
import CarRaceGame from './CarRaceGame';

const COMPLIMENTS = [
  "The way you laugh is genuinely one of my favourite sounds ever 💜",
  "You have this energy that just makes everything feel lighter 🌸",
  "You remember the things that matter. That's rare. ✨",
  "You are so much more interesting than you think you are 💫",
  "Somehow being around you just feels like home 🌙",
  "Your mind works in ways that constantly surprise me 🦋",
  "You are exactly enough. More than, actually. 💖",
  "The world is genuinely better because you're in it 🌟",
];

const GAMES = [
  { id: 'memory',     label: 'Memory Match',              emoji: '🧠', desc: 'Test your memory (and your patience 😂)', color: '#c77dff' },
  { id: 'quiz',       label: 'How Well Do You Know Me?',  emoji: '💭', desc: 'Deep cuts. Are you ready?',               color: '#ff6b9d' },
  { id: 'yesno',      label: 'The Yes/No Game',           emoji: '🎯', desc: 'Warning: the No button is a coward',      color: '#72efdd' },
  { id: 'compliment', label: 'Compliment Generator',      emoji: '💌', desc: 'Infinite appreciation, on demand',        color: '#ffd60a' },
  { id: 'carrace',    label: 'Night Drive',               emoji: '🏎️', desc: 'Dodge traffic. Reach the finish line.',   color: '#ff6b9d' },
];

export default function GamesSection() {
  const [activeGame, setActiveGame] = useState(null);
  const [compliment, setCompliment] = useState(null);
  const [unlocked, setUnlocked] = useState([]);

  const handleWin = (gameId) => {
    if (!unlocked.includes(gameId)) setUnlocked(u => [...u, gameId]);
  };

  const getCompliment = () => {
    const r = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
    setCompliment(r);
  };

  return (
    <section className="section" style={{ padding: '6rem 2rem', background: 'radial-gradient(ellipse at 80% 50%, rgba(199,125,255,0.05) 0%, transparent 60%)' }}>
      <motion.div
        style={{ textAlign: 'center', marginBottom: 56 }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p style={{ fontFamily: 'Caveat', fontSize: '1.2rem', color: 'rgba(199,125,255,0.7)', marginBottom: 8 }}>chapter two 🎮</p>
        <h2 className="section-title gradient-text">Mini Games</h2>
        <p className="section-subtitle">little distractions made just for you</p>
      </motion.div>

      {!activeGame ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, maxWidth: 900, width: '100%' }}>
          {GAMES.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass card-3d"
              style={{
                padding: '28px 24px', borderRadius: 20, cursor: 'none',
                borderColor: `${game.color}25`, textAlign: 'center',
              }}
              whileHover={{ scale: 1.03, borderColor: game.color }}
              onClick={() => game.id === 'compliment' ? getCompliment() : setActiveGame(game.id)}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{game.emoji}</div>
              <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1rem', color: '#fff', marginBottom: 8 }}>{game.label}</h3>
              <p style={{ fontFamily: 'Caveat', fontSize: '1rem', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>{game.desc}</p>
              <span style={{
                display: 'inline-block', padding: '6px 16px', borderRadius: 20,
                background: `${game.color}20`, border: `1px solid ${game.color}40`,
                color: game.color, fontSize: '0.8rem', fontFamily: 'DM Sans',
              }}>
                {game.id === 'compliment' ? 'generate ✨' : 'play →'}
              </span>
              {unlocked.includes(game.id) && (
                <div className="achievement-badge" style={{ marginTop: 10, display: 'inline-flex' }}>
                  ✓ completed
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass"
          style={{
            maxWidth: activeGame === 'carrace' ? 420 : 600,
            width: '100%', borderRadius: 24, padding: '2.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem', color: '#fff' }}>
              {GAMES.find(g => g.id === activeGame)?.label}
            </h3>
            <button
              onClick={() => setActiveGame(null)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'none', fontSize: '0.9rem' }}
            >
              ← back
            </button>
          </div>

          {activeGame === 'memory'  && <MemoryGame  onWin={() => handleWin('memory')} />}
          {activeGame === 'quiz'    && <QuizGame    onComplete={() => handleWin('quiz')} />}
          {activeGame === 'yesno'   && <YesNoGame />}
          {activeGame === 'carrace' && <CarRaceGame onWin={() => handleWin('carrace')} />}
        </motion.div>
      )}

      {/* Compliment popup */}
      <AnimatePresence>
        {compliment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '2rem', cursor: 'none',
            }}
            onClick={() => setCompliment(null)}
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              style={{
                maxWidth: 420, padding: '3rem 2.5rem', textAlign: 'center',
                background: 'white', borderRadius: 4,
                boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
                color: '#1a1a2e',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: 20 }}>💌</div>
              <p style={{ fontFamily: 'Caveat', fontSize: '1.5rem', lineHeight: 1.6, color: '#2d2d4e' }}>
                {compliment}
              </p>
              <p style={{ fontFamily: 'Caveat', color: 'rgba(0,0,0,0.3)', marginTop: 24, fontSize: '0.9rem' }}>
                tap anywhere to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}