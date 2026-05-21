import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REASONS = [
  {
    icon: '🤍',
    title: "Still here after everything",
    text: "We’ve fought, stopped talking, annoyed each other beyond limits 😭 and somehow we’re still here. Honestly, I think that says a lot about us."
  },

  {
    icon: '🌧️',
    title: "You hide your emotions",
    text: "You act strong and unbothered all the time, but I know there’s a very emotional person underneath all that attitude 💀 You just don’t let everyone see it."
  },

  {
    icon: '😂',
    title: "You make me laugh",
    text: "Even during the worst days somehow you still manage to make me laugh. Half our conversations are nonsense, bullying, or random chaos… and somehow that became one of my favorite things."
  },

  {
    icon: '🌙',
    title: "You make people feel safe",
    text: "You have this weird ability to make people feel lighter when they’re around you. At least you do that for me. Things somehow feel less heavy with you."
  },

  {
    icon: '✨',
    title: "You care more than you admit",
    text: "You pretend not to care sometimes. But I know you do. And that means everything to me."
  },

  {
    icon: '🔥',
    title: "You have everything already",
    text: "You really don’t realize how good you actually are. You’re funny, caring, smart, annoying sometimes 💀 but genuinely someone worth keeping in people’s lives."
  },

  {
    icon: '💭',
    title: "The real you",
    text: "Not everyone gets to know the real version of you. But the people who do? They stay. Because there’s honestly something special about you beneath all the drama and sarcasm."
  },

  {
    icon: '💜',
    title: "You matter to me",
    text: "No matter how many fights happened or how much time passed, one thing never really changed — my love for you still matters to me a lot."
  },
];

const THINGS_YOU_REMIND = [
  "Rainy Sunday mornings with no plans ☁️",
  "Finding a song you didn't know you needed 🎵",
  "The first warm day after a long winter 🌸",
  "A long hug that nobody ends first 💜",
  "Staying up too late because the conversation is too good 🌙",
  "That feeling right before something amazing happens ✨",
  "A book you never want to finish 📖",
  "Home. Somehow. Just... home. 🏠",
];

export default function EmotionalSection() {
  const [revealedCards, setRevealedCards] = useState({});
  const [remindIdx, setRemindIdx] = useState(0);
  const [showNeverSaid, setShowNeverSaid] = useState(false);

  const toggleCard = (i) => {
    setRevealedCards(r => ({ ...r, [i]: !r[i] }));
  };

  return (
    <section className="section" style={{ padding: '6rem 2rem', flexDirection: 'column', gap: '5rem' }}>

      {/* Reasons */}
      <div style={{ maxWidth: 900, width: '100%' }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: 56 }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p style={{ fontFamily: 'Caveat', fontSize: '1.2rem', color: 'rgba(114,239,221,0.7)', marginBottom: 8 }}>chapter three 💜</p>
          <h2 className="section-title gradient-text-sky">Why You're Extraordinary</h2>
          <p className="section-subtitle">tap to reveal each reason</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {REASONS.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{ cursor: 'none', perspective: 600 }}
              onClick={() => toggleCard(i)}
            >
              <motion.div
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s',
                  transform: revealedCards[i] ? 'rotateY(180deg)' : 'rotateY(0)',
                  height: 180,
                  position: 'relative',
                }}
              >
                {/* Front */}
                <div style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                  borderRadius: 16, padding: '24px 20px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}>
                  <div style={{ fontSize: '2rem' }}>{r.icon}</div>
                  <h3 style={{ fontFamily: 'Playfair Display', fontSize: '0.95rem', color: '#fff', textAlign: 'center' }}>{r.title}</h3>
                  <p style={{ fontFamily: 'Caveat', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)' }}>tap to read ✨</p>
                </div>

                {/* Back */}
                <div style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  borderRadius: 16, padding: '20px',
                  background: 'linear-gradient(135deg, rgba(114,239,221,0.08), rgba(199,125,255,0.08))',
                  border: '1px solid rgba(114,239,221,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <p style={{ fontFamily: 'Caveat', fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, textAlign: 'center' }}>
                    {r.text}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* What reminds me of you */}
      <motion.div
        style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 style={{ fontFamily: 'Playfair Display', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: '#fff', marginBottom: 8 }}>
          Things that remind me of you
        </h2>
        <p style={{ fontFamily: 'Caveat', color: 'rgba(255,255,255,0.4)', marginBottom: 36, fontSize: '1.1rem' }}>
          ordinary things, that now mean something extraordinary
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={remindIdx}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="glass"
            style={{
              padding: '2.5rem', borderRadius: 20,
              fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
              fontFamily: 'Caveat', color: '#fff',
              lineHeight: 1.6, marginBottom: 24,
            }}
          >
            {THINGS_YOU_REMIND[remindIdx]}
          </motion.div>
        </AnimatePresence>

        <motion.button
          className="btn-neon"
          onClick={() => setRemindIdx(i => (i + 1) % THINGS_YOU_REMIND.length)}
          style={{ borderColor: '#c77dff', color: '#c77dff' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          another one →
        </motion.button>
      </motion.div>

      {/* Things I never said */}
      <motion.div
        style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 style={{ fontFamily: 'Playfair Display', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: '#fff', marginBottom: 8 }}>
          Things I never said out loud
        </h2>
        <p style={{ fontFamily: 'Caveat', color: 'rgba(255,255,255,0.4)', marginBottom: 36, fontSize: '1.1rem' }}>
          until now
        </p>

        {!showNeverSaid ? (
          <motion.button
            className="btn-neon"
            onClick={() => setShowNeverSaid(true)}
            style={{ borderColor: '#ff6b9d', color: '#ff6b9d' }}
            whileHover={{ scale: 1.05 }}
          >
            unlock ✉️
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {[
              "I genuinely think about you more than I let on. 💭",
              "Sometimes I save things just to show you later. 📱",
              "You have no idea how much better things are when you're around. 🌟",
              "I hope you actually believe how special you are. I mean it every time. 💜",
              "I'm really, really glad you exist. That's it. That's the thought. ✨",
            ].map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="glass"
                style={{ padding: '18px 24px', borderRadius: 14, textAlign: 'left' }}
              >
                <p style={{ fontFamily: 'Caveat', fontSize: '1.15rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                  {msg}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
