import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import ParticleCanvas from './components/ParticleCanvas';
import MusicPlayer from './components/MusicPlayer';
import NavigationDots from './components/NavigationDots';
import EasterEggs from './components/EasterEggs';

import HeroSection from './components/HeroSection';
import TimelineSection from './components/TimelineSection';
import GamesSection from './components/GamesSection';
import EmotionalSection from './components/EmotionalSection';
import FakeChatSection from './components/FakeChatSection';
import GrandFinale from './components/GrandFinale';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Track active section via IntersectionObserver
  useEffect(() => {
    if (!loaded) return;
    const sections = ['hero', 'timeline', 'games', 'emotional', 'chat', 'finale'];
    const observers = [];
    
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    
    return () => observers.forEach(o => o.disconnect());
  }, [loaded]);

  const handleEnter = () => {
    setLoaded(true);
    setIsPlaying(true);
  };

  return (
    <>
      <CustomCursor />
      
      <AnimatePresence>
        {!loaded && <LoadingScreen onComplete={handleEnter} />}
      </AnimatePresence>

      {loaded && (
        <>
          <ParticleCanvas />
          <EasterEggs />
          <NavigationDots activeSection={activeSection} />
          <MusicPlayer isPlaying={isPlaying} setIsPlaying={setIsPlaying} />

          <main>
            <div id="hero"><HeroSection onNext={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })} /></div>
            <div id="timeline"><TimelineSection /></div>
            <div id="games"><GamesSection /></div>
            <div id="emotional"><EmotionalSection /></div>
            <div id="chat"><FakeChatSection /></div>
            <div id="finale"><GrandFinale /></div>
          </main>
        </>
      )}
    </>
  );
}
