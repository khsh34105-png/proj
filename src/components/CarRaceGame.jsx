import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LANE_COUNT = 5;
const LANE_WIDTH = 60;
const CAR_WIDTH = 36;
const CAR_HEIGHT = 56;
const ROAD_WIDTH = LANE_COUNT * LANE_WIDTH;
const GAME_HEIGHT = 480;
const OBSTACLE_INTERVAL_START = 1400;
const SPEEDS = [3, 5, 7, 10];
const SPEED_LABELS = ['🌸 Easy', '✨ Normal', '💫 Hard', '🔥 Insane'];

// Cute emoji cars for obstacles
const OBSTACLE_CARS = ['🚕', '🚙', '🚌', '🚎', '🏎️', '🚐'];

function getRandomLane() {
  return Math.floor(Math.random() * LANE_COUNT);
}

function laneToX(lane) {
  return lane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2;
}

export default function CarRaceGame({ onWin }) {
  const [gameState, setGameState] = useState('idle'); // idle | playing | dead | won
  const [lane, setLane] = useState(2);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [speedLevel, setSpeedLevel] = useState(1);
  const [roadOffset, setRoadOffset] = useState(0);
  const [sparkles, setSparkles] = useState([]);

  const gameLoop   = useRef(null);
  const obsTimer   = useRef(null);
  const laneRef    = useRef(lane);
  const scoreRef   = useRef(0);
  const aliveRef   = useRef(true);
  const obsRef     = useRef([]);
  const frameRef   = useRef(null);
  const roadRef    = useRef(0);

  laneRef.current = lane;

  const spawnSparkle = useCallback((x, y) => {
    const id = Date.now() + Math.random();
    setSparkles(s => [...s, { id, x, y }]);
    setTimeout(() => setSparkles(s => s.filter(sp => sp.id !== id)), 700);
  }, []);

  const startGame = () => {
    setGameState('playing');
    setLane(2);
    setObstacles([]);
    setScore(0);
    setSparkles([]);
    laneRef.current = 2;
    scoreRef.current = 0;
    aliveRef.current = true;
    obsRef.current = [];
    roadRef.current = 0;

    // Obstacle spawner
    let interval = OBSTACLE_INTERVAL_START;
    const spawn = () => {
      if (!aliveRef.current) return;
      const l = getRandomLane();
      const car = OBSTACLE_CARS[Math.floor(Math.random() * OBSTACLE_CARS.length)];
      obsRef.current = [...obsRef.current, { id: Date.now(), lane: l, y: -80, emoji: car }];
      setObstacles([...obsRef.current]);
      interval = Math.max(600, interval - 30);
      obsTimer.current = setTimeout(spawn, interval);
    };
    obsTimer.current = setTimeout(spawn, interval);

    // Game loop
    const speed = SPEEDS[speedLevel];
    const tick = () => {
      if (!aliveRef.current) return;

      // Move road
      roadRef.current = (roadRef.current + speed) % 60;
      setRoadOffset(roadRef.current);

      // Move obstacles
      obsRef.current = obsRef.current
        .map(o => ({ ...o, y: o.y + speed }))
        .filter(o => o.y < GAME_HEIGHT + 100);

      setObstacles([...obsRef.current]);
      scoreRef.current += 1;
      setScore(scoreRef.current);

      // Collision detection
      const playerY = GAME_HEIGHT - CAR_HEIGHT - 20;
      const playerX = laneToX(laneRef.current);
      for (const obs of obsRef.current) {
        const obsX = laneToX(obs.lane);
        if (
          obs.y + CAR_HEIGHT > playerY &&
          obs.y < playerY + CAR_HEIGHT &&
          Math.abs(obsX - playerX) < CAR_WIDTH - 8
        ) {
          aliveRef.current = false;
          clearTimeout(obsTimer.current);
          setGameState('dead');
          setBestScore(b => Math.max(b, scoreRef.current));
          return;
        }
      }

      // Win at score 3000
      if (scoreRef.current >= 3000) {
        aliveRef.current = false;
        clearTimeout(obsTimer.current);
        setGameState('won');
        setBestScore(b => Math.max(b, scoreRef.current));
        onWin?.();
        return;
      }

      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  };

  const stopGame = () => {
    aliveRef.current = false;
    clearTimeout(obsTimer.current);
    cancelAnimationFrame(frameRef.current);
  };

  useEffect(() => {
    return () => stopGame();
  }, []);

  // Keyboard controls
  useEffect(() => {
    if (gameState !== 'playing') return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setLane(l => {
          const nl = Math.max(0, l - 1);
          laneRef.current = nl;
          return nl;
        });
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        setLane(l => {
          const nl = Math.min(LANE_COUNT - 1, l + 1);
          laneRef.current = nl;
          return nl;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gameState]);

  const moveLeft  = () => { if (gameState !== 'playing') return; setLane(l => { const nl = Math.max(0, l - 1); laneRef.current = nl; return nl; }); };
  const moveRight = () => { if (gameState !== 'playing') return; setLane(l => { const nl = Math.min(LANE_COUNT - 1, l + 1); laneRef.current = nl; return nl; }); };

  const playerX = laneToX(lane);
  const playerY = GAME_HEIGHT - CAR_HEIGHT - 20;

  return (
    <div style={{ textAlign: 'center', userSelect: 'none' }}>
      <style>{`
        .race-road {
          position: relative;
          width: ${ROAD_WIDTH}px;
          height: ${GAME_HEIGHT}px;
          margin: 0 auto;
          background: #1a1a2e;
          overflow: hidden;
          border-radius: 12px;
          border: 2px solid rgba(255,255,255,0.08);
          box-shadow: 0 0 40px rgba(199,125,255,0.15);
        }
        .lane-line {
          position: absolute;
          width: 4px;
          top: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.25) 0px,
            rgba(255,255,255,0.25) 28px,
            transparent 28px,
            transparent 56px
          );
        }
        .road-edge {
          position: absolute;
          top: 0; bottom: 0;
          width: 8px;
          background: linear-gradient(to bottom, #ff6b9d, #c77dff, #72efdd, #ffd60a, #ff6b9d);
          background-size: 100% 200px;
          animation: edgeScroll 1s linear infinite;
        }
        @keyframes edgeScroll {
          from { background-position: 0 0; }
          to   { background-position: 0 200px; }
        }
        .player-car {
          position: absolute;
          font-size: 2rem;
          transition: left 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          filter: drop-shadow(0 0 12px #ff6b9d);
          z-index: 10;
        }
        .obstacle-car {
          position: absolute;
          font-size: 2rem;
          z-index: 8;
        }
        .sparkle {
          position: absolute;
          pointer-events: none;
          font-size: 1.2rem;
          animation: sparkleUp 0.7s ease-out forwards;
          z-index: 20;
        }
        @keyframes sparkleUp {
          from { transform: translateY(0) scale(1); opacity: 1; }
          to   { transform: translateY(-40px) scale(0); opacity: 0; }
        }
        .race-btn {
          font-family: 'Caveat', cursive;
          font-size: 1.1rem;
          padding: 10px 24px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          font-weight: 700;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .race-btn:hover { transform: scale(1.05); }
        .race-btn:active { transform: scale(0.97); }
        .ctrl-btn {
          width: 52px; height: 52px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.07);
          color: #fff;
          font-size: 1.3rem;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          backdrop-filter: blur(8px);
        }
        .ctrl-btn:active { background: rgba(255,107,157,0.3); transform: scale(0.92); }
        .score-pill {
          font-family: 'Space Mono', monospace;
          font-size: 0.78rem;
          padding: 4px 12px;
          border-radius: 20px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
        }
      `}</style>

      {/* Score bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, maxWidth: ROAD_WIDTH, margin: '0 auto 12px' }}>
        <span className="score-pill">score {score}</span>
        <span style={{ fontFamily: 'Caveat', fontSize: '1rem', color: 'rgba(255,255,255,0.4)' }}>
          best {bestScore}
        </span>
        <span className="score-pill">{SPEED_LABELS[speedLevel]}</span>
      </div>

      {/* Road */}
      <div className="race-road">

        {/* Left / right neon edges */}
        <div className="road-edge" style={{ left: 0 }} />
        <div className="road-edge" style={{ right: 0 }} />

        {/* Lane dividers */}
        {Array.from({ length: LANE_COUNT - 1 }).map((_, i) => (
          <div
            key={i}
            className="lane-line"
            style={{ left: (i + 1) * LANE_WIDTH - 2, backgroundPositionY: `${roadOffset}px` }}
          />
        ))}

        {/* Obstacles */}
        {obstacles.map(obs => (
          <div
            key={obs.id}
            className="obstacle-car"
            style={{ left: laneToX(obs.lane), top: obs.y, width: CAR_WIDTH, height: CAR_HEIGHT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: 'rotate(180deg)',
            }}
          >
            {obs.emoji}
          </div>
        ))}

        {/* Player car */}
        {(gameState === 'playing' || gameState === 'dead') && (
          <div
            className="player-car"
            style={{ left: playerX, top: playerY, width: CAR_WIDTH, height: CAR_HEIGHT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: gameState === 'dead' ? 0.3 : 1,
            }}
          >
            {gameState === 'dead' ? '💥' : '🏎️'}
          </div>
        )}

        {/* Sparkles */}
        {sparkles.map(sp => (
          <div key={sp.id} className="sparkle" style={{ left: sp.x, top: sp.y }}>✨</div>
        ))}

        {/* Overlays */}
        <AnimatePresence>
          {gameState === 'idle' && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 20,
                background: 'rgba(10,10,25,0.85)', backdropFilter: 'blur(4px)',
              }}
            >
              <p style={{ fontFamily: 'Playfair Display', fontSize: '1.6rem', color: '#ff6b9d', margin: 0 }}>
                Night Drive 🏎️
              </p>
              <p style={{ fontFamily: 'Caveat', fontSize: '1rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                dodge traffic · reach the finish line
              </p>

              {/* Speed selector */}
              <div style={{ display: 'flex', gap: 8 }}>
                {SPEED_LABELS.map((label, i) => (
                  <button
                    key={i}
                    className="race-btn"
                    onClick={() => setSpeedLevel(i)}
                    style={{
                      fontSize: '0.8rem', padding: '6px 12px',
                      background: speedLevel === i
                        ? 'linear-gradient(135deg, #ff6b9d, #c77dff)'
                        : 'rgba(255,255,255,0.07)',
                      color: '#fff',
                      border: speedLevel === i ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                className="race-btn"
                onClick={startGame}
                style={{ background: 'linear-gradient(135deg, #ff6b9d, #c77dff)', color: '#fff',
                  boxShadow: '0 0 20px rgba(255,107,157,0.4)', fontSize: '1.2rem', padding: '12px 32px' }}
              >
                Start Race ✨
              </button>
              <p style={{ fontFamily: 'Caveat', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                ← → arrow keys or tap buttons below
              </p>
            </motion.div>
          )}

          {gameState === 'dead' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 16,
                background: 'rgba(10,10,25,0.9)', backdropFilter: 'blur(6px)',
              }}
            >
              <p style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem', color: '#ff6b9d', margin: 0 }}>
                💥 Crash!
              </p>
              <p style={{ fontFamily: 'Caveat', fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                score: {score} {score > bestScore - 1 ? '· new best! 🌟' : ''}
              </p>
              <button
                className="race-btn"
                onClick={startGame}
                style={{ background: 'linear-gradient(135deg, #ff6b9d, #c77dff)', color: '#fff',
                  boxShadow: '0 0 20px rgba(255,107,157,0.4)' }}
              >
                Try Again 🔄
              </button>
            </motion.div>
          )}

          {gameState === 'won' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 16,
                background: 'rgba(10,10,25,0.9)', backdropFilter: 'blur(6px)',
              }}
            >
              <p style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem', color: '#ffd60a', margin: 0 }}>
                🏆 You Won!
              </p>
              <p style={{ fontFamily: 'Caveat', fontSize: '1rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                Just like you, unstoppable 💜
              </p>
              <button
                className="race-btn"
                onClick={startGame}
                style={{ background: 'linear-gradient(135deg, #ffd60a, #ff6b9d)', color: '#1a1a2e',
                  boxShadow: '0 0 20px rgba(255,214,10,0.4)', fontWeight: 800 }}
              >
                Race Again ✨
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile touch controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
        <button className="ctrl-btn" onClick={moveLeft}>◀</button>
        <button className="ctrl-btn" onClick={moveRight}>▶</button>
      </div>

      <p style={{ fontFamily: 'Caveat', fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>
        reach score 3000 to win 🏁
      </p>
    </div>
  );
}