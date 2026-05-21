import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MEMORIES = [
 {
    emoji: '🌅',
    date: 'The beginning',
    title: 'Look at you 😭',
    short: 'From innocent baby to certified egoistic legend.',
    story: "Just look at this tiny little kid 😭 So innocent… so harmless….Honestly, if someone showed me this picture first, I would've thought: 'aww such a sweet child 🥺' — meanwhile NOW look at you 💀 Same face, upgraded with sarcasm, mood swings, and unnecessary confidence. But okay fine… still cute though. 😌💖",
    color: '#ff6b9d',
    polaroidBg: '#fff5f8',
    image: 'memory1.jpeg',
  },
  {
  emoji: '☕',
  date: 'You corrupted me 😭',
  title: 'Look what you turned me into',
  short: 'I was innocent before this friendship btw.',
  story: "Look at us standing there like two innocent little kids 💀 .You already had that suspicious face like you were about to say, ‘don’t tell anyone okay?’ 😭 Honestly, this picture explains everything — same energy, same nonsense, just taller now...some things really never changed. 🤝✨",
  color: '#c77dff',
  polaroidBg: '#fdf5ff',
  image: 'memory2.jpeg',
  },
  {
  emoji: '🌙',
  date: "The upgraded menace era 💀",
  title: "Look at this face 😭",
  short: "The innocence officially started disappearing here.",
  story: "Now THIS picture explains everything 💀 Look at that face — already giving full troublemaker energy  😭 Literally see the mischief loading behind that smile. Honestly, younger you probably annoyed everyone around you 24/7… but okay, I’ll admit one thing — at least now you finally learned how to behave with people (sometimes). Character development happened eventually, proud of you for that 👏✨",
  color: '#72efdd',
  polaroidBg: '#f0fffe',
  image: 'memory3.jpeg',
  },
  {
  emoji: '🎭',
  date: 'My favorite picture of us',
  title: 'The feelings you never noticed 😭',
  short: 'Still one of the best memories I have with you.',
  story: "This picture? Yeah… this one always hits differently. 😭 I was so stupidly happy around you back then, and honestly maybe a little too in love too 💀 But leave it, you never really looked at me that way and somehow I still stayed. Funny thing is — even after all that, I can’t look at this photo without smiling. And no matter what happened later, these memories? They were genuinely beautiful to me. 🤍✨",
  color: '#ffd60a',
  polaroidBg: '#fffdf0',
  image: 'memory4.jpeg',
  },
  {
  emoji: '🌸',
  date: 'That unforgettable trip ✨',
  title: "One of my favorite memories with you",
  short: 'I still wish we had more time together there.',
  story: "Everything about it just felt so good — the fun, the chaos, the random laughs, all of it. And yeah… sometimes I still regret that we didn’t really get enough time together there. But still, whenever I look at this picture, all I remember is how happy I was with you. No overthinking, no drama… just us enjoying the moment. 🤍✨",
  color: '#a78bfa',
  polaroidBg: '#f5f0ff',
  image: 'memory5.jpeg',
  }
];

function MemoryImage({ src, color, alt }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError]   = useState(false);

  if (error) {
    // Fallback placeholder if image not found yet
    return (
      <div style={{
        width: '100%', aspectRatio: '4/3', borderRadius: 10,
        background: `${color}18`,
        border: `2px dashed ${color}50`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 6,
        marginBottom: 20,
      }}>
        <span style={{ fontSize: '2rem' }}>🖼️</span>
        <span style={{ fontFamily: 'Caveat', color: `${color}90`, fontSize: '0.85rem' }}>
          add image to public/
        </span>
        <span style={{ fontFamily: 'Space Mono', color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem' }}>
          {src}
        </span>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: 10, overflow: 'hidden', marginBottom: 20, position: 'relative', background: `${color}10` }}>
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            border: `3px solid ${color}40`,
            borderTopColor: color,
            animation: 'spin 0.8s linear infinite',
          }} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          opacity: loaded ? 1 : 0, transition: 'opacity 0.4s',
          display: 'block',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function TimelineSection() {
  const [activeMemory, setActiveMemory] = useState(null);

  return (
    <section className="section" style={{ padding: '6rem 2rem', background: 'linear-gradient(180deg, transparent, rgba(15,10,30,0.5) 50%, transparent)' }}>
      <motion.div
        style={{ textAlign: 'center', marginBottom: 64 }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <p style={{ fontFamily: 'Caveat', fontSize: '1.2rem', color: 'rgba(255,107,157,0.7)', marginBottom: 8 }}>
          chapter one 📖
        </p>
        <h2 className="section-title gradient-text">Memory Timeline</h2>
        <p className="section-subtitle">click a memory to open it ↓</p>
      </motion.div>

      <div style={{ maxWidth: 800, width: '100%', position: 'relative' }}>
        {/* Timeline line */}
        <div style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0,
          width: 2, background: 'linear-gradient(to bottom, #ff6b9d, #c77dff, #72efdd)',
          transform: 'translateX(-50%)', opacity: 0.4,
        }} />

        {MEMORIES.map((mem, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            style={{
              display: 'flex',
              justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start',
              paddingRight: i % 2 === 0 ? 'calc(50% + 30px)' : 0,
              paddingLeft:  i % 2 === 0 ? 0 : 'calc(50% + 30px)',
              marginBottom: 40,
            }}
          >
            {/* Dot on timeline */}
            <div style={{
              position: 'absolute', left: '50%', transform: 'translateX(-50%)',
              width: 14, height: 14, borderRadius: '50%',
              background: mem.color, boxShadow: `0 0 15px ${mem.color}`,
              border: '2px solid var(--deep)',
            }} />

            <motion.div
              className="glass card-3d"
              style={{ maxWidth: 280, padding: '20px', borderRadius: 16, cursor: 'none', borderColor: `${mem.color}30` }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setActiveMemory(activeMemory?.title === mem.title ? null : mem)}
            >
              {/* Thumbnail preview on card */}
              <div style={{
                width: '100%', aspectRatio: '16/9', borderRadius: 10,
                overflow: 'hidden', marginBottom: 12,
                background: `${mem.color}15`,
                border: `1px solid ${mem.color}25`,
                position: 'relative',
              }}>
                <img
                  src={mem.image}
                  alt={mem.title}
                  onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* fallback emoji shown if image missing */}
                <div style={{
                  display: 'none', position: 'absolute', inset: 0,
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.2rem',
                }}>
                  {mem.emoji}
                </div>
              </div>

              <p style={{ fontFamily: 'Caveat', color: mem.color, fontSize: '0.85rem', marginBottom: 4 }}>{mem.date}</p>
              <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.1rem', color: '#fff', marginBottom: 8 }}>{mem.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{mem.short}</p>
              <p style={{ fontSize: '0.75rem', color: mem.color, marginTop: 8, fontFamily: 'Caveat' }}>tap to read ✨</p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Memory popup */}
      <AnimatePresence>
        {activeMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '2rem', cursor: 'none',
            }}
            onClick={() => setActiveMemory(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              style={{
                maxWidth: 480, width: '100%', padding: '2rem',
                background: activeMemory.polaroidBg,
                borderRadius: 4,
                boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 2px 0 rgba(0,0,0,0.08)',
                color: '#1a1a2e', cursor: 'none',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Big image in popup */}
              <MemoryImage
                src={activeMemory.image}
                color={activeMemory.color}
                alt={activeMemory.title}
              />

              <p style={{ fontFamily: 'Caveat', color: activeMemory.color, fontSize: '0.9rem', marginBottom: 4 }}>
                {activeMemory.date}
              </p>
              <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.4rem', marginBottom: 14, color: '#1a1a2e' }}>
                {activeMemory.title}
              </h3>
              <p style={{ fontFamily: 'Caveat', fontSize: '1.15rem', lineHeight: 1.7, color: '#444' }}>
                {activeMemory.story}
              </p>
              <button
                style={{
                  marginTop: 20, padding: '8px 20px', borderRadius: 20,
                  border: `1px solid ${activeMemory.color}`, background: 'transparent',
                  color: activeMemory.color, cursor: 'none', fontFamily: 'DM Sans', fontSize: '0.85rem',
                }}
                onClick={() => setActiveMemory(null)}
              >
                close ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}