import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
  {
    q: "What's my favorite thing to do?",
    options: [
      "Sleep all day",
      "Annoy you for no reason 😭",
      "Overthink every life decision",
      "Pretend I'm productive"
    ],
    correct: 1,
    feedback: "Correct 💀 Annoying you is genuinely one of my favorite hobbies at this point.",
  },

  {
  q: "What's my love language?",
  options: [
    "Words of affirmation",
    "Quality time",
    "Acts of service",
    "Randomly sending you memes at 2am"
  ],
  correct: 1,
  feedback: "Quality time >>> everything else 😭💖",
},

  {
    q: "What do I do when I'm nervous?",
    options: [
      "Talk too much",
      "Go very quiet",
      "Make terrible jokes",
      "Pretend I'm completely fine while internally screaming"
    ],
    correct: 3,
    feedback: "Internally screaming while smiling — a skill I've mastered 💀",
  },

  {
    q: "Whom do I love the most?",
    options: [
      "Food 😌",
      "Sleep 😭",
      "You obviously 💜",
      "Myself because self-love matters"
    ],
    correct: 2,
    feedback: "Congratulations, you passed the easiest question in existence 😭💖",
  },

  {
    q: "What do I think about you?",
    options: [
      "You're pretty cool",
      "You're surprisingly wonderful",
      "You make everything better",
      "Honestly? Way more than I ever say out loud 💜"
    ],
    correct: 3,
    feedback: "You were never going to get this one wrong, were you? 💖",
  },
];

const ENDINGS = [
  { range: [0,1], title: "Hmm... we need more time together 😅", msg: "That's okay — the best stories take time to understand. Stick around, I'll keep dropping hints 💜" },
  { range: [2,3], title: "Getting there! ✨", msg: "You know more than you think. And honestly, that means more than any score ever could 🌸" },
  { range: [4,5], title: "You know me SO well 💜", msg: "Honestly frightening. In the best way. You pay attention, you remember, you care. That's everything. Thank you for seeing me 💖" },
];

export default function QuizGame({ onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowFeedback(true);
    if (idx === QUESTIONS[currentQ].correct) setScore(s => s + 1);
    setTimeout(() => {
      setShowFeedback(false);
      setSelected(null);
      if (currentQ + 1 >= QUESTIONS.length) {
        setDone(true);
        onComplete?.();
      } else {
        setCurrentQ(q => q + 1);
      }
    }, 2000);
  };

  const ending = ENDINGS.find(e => score >= e.range[0] && score <= e.range[1]);

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center', padding: '2rem' }}
      >
        <motion.div style={{ fontSize: '4rem', marginBottom: 16 }}
          animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.6, repeat: 3 }}
        >
          {score >= 4 ? '🏆' : score >= 2 ? '⭐' : '💜'}
        </motion.div>
        <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', color: '#ffd60a', marginBottom: 12 }}>
          {score}/5 — {ending?.title}
        </h3>
        <p style={{ fontFamily: 'Caveat', fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: 400, margin: '0 auto' }}>
          {ending?.msg}
        </p>
        {/* Achievement badge */}
        <div className="achievement-badge" style={{ marginTop: 20, display: 'inline-flex' }}>
          🏅 Quiz completed!
        </div>
      </motion.div>
    );
  }

  const q = QUESTIONS[currentQ];

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {QUESTIONS.map((_, i) => (
          <div key={i} style={{
            height: 3, flex: 1, borderRadius: 2,
            background: i < currentQ ? '#c77dff' : i === currentQ ? '#ff6b9d' : 'rgba(255,255,255,0.1)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          <p style={{ fontFamily: 'Caveat', color: 'rgba(255,107,157,0.7)', marginBottom: 8 }}>
            question {currentQ + 1} of {QUESTIONS.length}
          </p>
          <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.3rem', color: '#fff', marginBottom: 24, lineHeight: 1.4 }}>
            {q.q}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.options.map((opt, i) => (
              <motion.button
                key={i}
                className={`quiz-option ${selected === i ? (i === q.correct ? 'correct' : 'wrong') : ''}`}
                onClick={() => handleAnswer(i)}
                whileHover={{ x: 6 }}
                whileTap={{ scale: 0.98 }}
                disabled={selected !== null}
              >
                <span style={{ marginRight: 12, opacity: 0.5 }}>{String.fromCharCode(65 + i)}.</span>
                {opt}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  marginTop: 16, padding: '14px', borderRadius: 12,
                  background: selected === q.correct ? 'rgba(114,239,221,0.1)' : 'rgba(255,107,157,0.1)',
                  border: `1px solid ${selected === q.correct ? 'rgba(114,239,221,0.3)' : 'rgba(255,107,157,0.3)'}`,
                }}
              >
                <p style={{ fontFamily: 'Caveat', fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)' }}>
                  {selected === q.correct ? '✓ ' : '✗ '}{q.feedback}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
