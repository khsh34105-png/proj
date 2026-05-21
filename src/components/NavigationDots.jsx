import { motion } from 'framer-motion';

const CHAPTERS = [
  { id: 'hero', label: 'Start ✨', color: '#ff6b9d' },
  { id: 'timeline', label: 'Memories 📖', color: '#c77dff' },
  { id: 'games', label: 'Games 🎮', color: '#72efdd' },
  { id: 'emotional', label: 'Feelings 💜', color: '#ffd60a' },
  { id: 'chat', label: 'Chats 💬', color: '#a78bfa' },
  { id: 'finale', label: 'Finale 🎁', color: '#ff6b9d' },
];

export default function NavigationDots({ activeSection }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{
      position: 'fixed', left: 20, top: '50%', transform: 'translateY(-50%)',
      display: 'flex', flexDirection: 'column', gap: 14, zIndex: 100,
    }}>
      {CHAPTERS.map((ch) => (
        <motion.div
          key={ch.id}
          style={{
            position: 'relative', display: 'flex', alignItems: 'center',
            gap: 10, cursor: 'none',
          }}
          onClick={() => scrollTo(ch.id)}
          whileHover="hovered"
        >
          <motion.div
            style={{
              width: activeSection === ch.id ? 12 : 8,
              height: activeSection === ch.id ? 12 : 8,
              borderRadius: '50%',
              background: activeSection === ch.id ? ch.color : 'rgba(255,255,255,0.2)',
              boxShadow: activeSection === ch.id ? `0 0 12px ${ch.color}` : 'none',
              transition: 'all 0.3s',
              flexShrink: 0,
            }}
          />
          <motion.span
            variants={{ hovered: { opacity: 1, x: 0 } }}
            initial={{ opacity: 0, x: -8 }}
            style={{
              fontFamily: 'Caveat', fontSize: '0.85rem',
              color: ch.color, whiteSpace: 'nowrap',
              background: 'rgba(10,10,20,0.8)', padding: '2px 8px',
              borderRadius: 8,
            }}
          >
            {ch.label}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}
