import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CHAT_SCENES = [
  {
    title: "Pagal energy 💀",
    messages: [
      { from: 'me', text: "Kuch nhi baithi hu laptop khol ke", time: "9:49 PM" },
      { from: 'you', text: "Oo", time: "9:49 PM" },
      { from: 'me', text: "Abe tujhse poocha hai mene", time: "9:49 PM" },
      { from: 'you', text: "Free ho tho vc kr lo", time: "9:49 PM" },
      { from: 'you', text: "Exat", time: "9:49 PM" },
      { from: 'you', text: "2 min baad", time: "9:49 PM" },
      { from: 'you', text: "Ab 1 min baad", time: "9:50 PM" },
      { from: 'me', text: "Pagal hai 😭", time: "9:50 PM" },
      { from: 'me', text: "Tu free hai toh karle", time: "9:50 PM" },
      { from: 'you', text: "Acha", time: "9:51 PM" },
    ]
  },

  {
    title: "Missing you hours ❤️",
    messages: [
      { from: 'you', text: "Missing mee ?", time: "10:15 AM" },
      { from: 'you', text: "Meri baato ko ?", time: "10:15 AM" },
      { from: 'you', text: "Hasi mazak ki", time: "10:16 AM" },
      { from: 'you', text: "Ko", time: "10:16 AM" },
      { from: 'me', text: "Bohot zyada", time: "10:17 AM" },
      { from: 'me', text: "Sab kuch", time: "10:18 AM" },
      { from: 'you', text: "💋❤️", time: "10:20 AM" },
      { from: 'you', text: "Miss tho mai bhi kr raha hu", time: "10:20 AM" },
      { from: 'me', text: "❤️❤️❤️", time: "10:22 AM" },
    ]
  }
];

export default function FakeChatSection() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const chatRef = useRef(null);

  const scene = CHAT_SCENES[sceneIdx];

  useEffect(() => {
    setVisibleMessages([]);
    setMsgIdx(0);
    setIsTyping(false);
  }, [sceneIdx]);

  useEffect(() => {
    if (msgIdx >= scene.messages.length) return;
    const msg = scene.messages[msgIdx];
    const showTypingFor = msg.from === 'you' ? 800 + msg.text.length * 20 : 0;

    const t1 = setTimeout(() => {
      if (msg.from === 'you') setIsTyping(true);
    }, 500);

    const t2 = setTimeout(() => {
      setIsTyping(false);
      setVisibleMessages(v => [...v, msg]);
      setMsgIdx(i => i + 1);
    }, showTypingFor + 600);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [msgIdx, sceneIdx]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [visibleMessages, isTyping]);

  return (
    <section className="section" style={{ padding: '6rem 2rem' }}>
      <motion.div
        style={{ textAlign: 'center', marginBottom: 56 }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p style={{ fontFamily: 'Caveat', fontSize: '1.2rem', color: 'rgba(255,107,157,0.7)', marginBottom: 8 }}>chapter four 💬</p>
        <h2 className="section-title gradient-text">Conversations I replay</h2>
        <p className="section-subtitle">the ones that stuck with me</p>
      </motion.div>

      <div style={{ maxWidth: 480, width: '100%' }}>
        {/* Scene selector */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {CHAT_SCENES.map((s, i) => (
            <button
              key={i}
              onClick={() => setSceneIdx(i)}
              style={{
                padding: '6px 14px', borderRadius: 20, cursor: 'none',
                background: i === sceneIdx ? 'rgba(255,107,157,0.2)' : 'transparent',
                border: `1px solid ${i === sceneIdx ? '#ff6b9d' : 'rgba(255,255,255,0.1)'}`,
                color: i === sceneIdx ? '#ff6b9d' : 'rgba(255,255,255,0.5)',
                fontSize: '0.8rem', fontFamily: 'DM Sans',
                transition: 'all 0.2s',
              }}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Phone mockup */}
        <div style={{
          background: '#111', borderRadius: 32, overflow: 'hidden',
          border: '2px solid rgba(255,255,255,0.08)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        }}>
          {/* Status bar */}
          <div style={{
            background: 'rgba(255,255,255,0.04)', padding: '12px 20px',
            display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #ff6b9d, #c77dff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>😊</div>
            <div>
              <p style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>Dev 🧑‍🦱</p>
              <p style={{ fontSize: '0.7rem', color: '#72efdd' }}>● online</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={chatRef} style={{ padding: '16px', minHeight: 360, maxHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <AnimatePresence>
              {visibleMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: msg.from === 'me' ? 'flex-end' : 'flex-start' }}
                >
                  <div className={msg.from === 'me' ? 'chat-bubble-sent' : 'chat-bubble-recv'}>
                    <p style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>{msg.text}</p>
                  </div>
                  <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', marginTop: 2, paddingLeft: msg.from !== 'me' ? 4 : 0, paddingRight: msg.from === 'me' ? 4 : 0 }}>
                    {msg.time}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignSelf: 'flex-start' }}>
                <div className="chat-bubble-recv" style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
