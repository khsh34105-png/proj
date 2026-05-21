import { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animFrame;
    let particles = [];
    let mouse = { x: -999, y: -999 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    const EMOJIS = ['✨', '💫', '🌸', '💖', '⭐', '🦋', '🌙', '💜', '🌺', '💝'];
    const COLORS = ['#ff6b9d', '#c77dff', '#72efdd', '#ffd60a', '#ff9ece', '#a78bfa'];

    class Particle {
      constructor() { this.reset(true); }
      reset(init = false) {
        this.x = Math.random() * canvas.width;
        this.y = init ? Math.random() * canvas.height : canvas.height + 20;
        this.size = Math.random() * 3 + 0.5;
        this.speedY = -(Math.random() * 0.8 + 0.2);
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.life = 1;
        this.decay = Math.random() * 0.003 + 0.001;
        this.type = Math.random() > 0.85 ? 'emoji' : 'circle';
        this.emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        this.emojiSize = Math.random() * 12 + 8;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.02 + 0.005;
      }
      update() {
        this.wobble += this.wobbleSpeed;
        this.x += this.speedX + Math.sin(this.wobble) * 0.3;
        this.y += this.speedY;
        this.life -= this.decay;

        // Gentle mouse repulsion
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.x += dx / dist * 0.5;
          this.y += dy / dist * 0.5;
        }

        if (this.life <= 0 || this.y < -30) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity * this.life;
        if (this.type === 'emoji') {
          ctx.font = `${this.emojiSize}px serif`;
          ctx.fillText(this.emoji, this.x, this.y);
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.shadowColor = this.color;
          ctx.shadowBlur = 8;
          ctx.fill();
        }
        ctx.restore();
      }
    }

    for (let i = 0; i < 120; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="particle-canvas" />;
}
