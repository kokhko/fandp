import React, { useState, useEffect } from 'react';
import { ArrowRight, Flame, ShieldAlert, Users, Award, MapPin } from 'lucide-react';

interface HeroProps {
  onCtaClick: () => void;
  registeredCount: number;
}

export default function Hero({ onCtaClick, registeredCount }: HeroProps) {
  // Base fixed historic registrations is 32, total is 32 + contemporary registrations
  const targetCount = 32 + registeredCount;
  const [animatedCount, setAnimatedCount] = useState(1);
  const [animatedSpots, setAnimatedSpots] = useState(0);
  const [animatedTrash, setAnimatedTrash] = useState(0);
  const [animatedDays, setAnimatedDays] = useState(0);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Dynamic count-up animation that triggers on load, database updates, or loop trigger
  useEffect(() => {
    const startCount = 1;
    const endCount = targetCount;

    const startSpots = 0;
    const endSpots = 12;

    const startTrash = 0.0;
    const endTrash = 184.5;

    const startDays = 0;
    const endDays = 1200;

    const duration = 1500; // Animation duration in milliseconds (1.5 seconds)
    const startTime = performance.now();
    let animationFrameId: number;
    let timeoutId: NodeJS.Timeout;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic function for a premium, realistic weight slowing down near completion
      const easeOutQuad = (t: number) => t * (2 - t);
      const currentProgress = easeOutQuad(progress);
      
      const currentCount = Math.floor(startCount + (endCount - startCount) * currentProgress);
      const currentSpots = Math.floor(startSpots + (endSpots - startSpots) * currentProgress);
      const currentTrash = startTrash + (endTrash - startTrash) * currentProgress;
      const currentDays = Math.floor(startDays + (endDays - startDays) * currentProgress);

      setAnimatedCount(currentCount);
      setAnimatedSpots(currentSpots);
      setAnimatedTrash(currentTrash);
      setAnimatedDays(currentDays);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setAnimatedCount(endCount);
        setAnimatedSpots(endSpots);
        setAnimatedTrash(endTrash);
        setAnimatedDays(endDays);

        // Keep the finalized stats visible for 4.5 seconds, then reset and restart the animation
        timeoutId = setTimeout(() => {
          setAnimationTrigger(prev => prev + 1);
        }, 4500);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [targetCount, animationTrigger]);

  return (
    <div className="relative bg-stone-950 overflow-hidden min-h-[85vh] flex flex-col justify-between">
      {/* Background Image Overlay with the requested theme image and opacity mix */}
      <div className="absolute inset-0 z-0 text-white">
        <img
          src="https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&q=80&w=1920"
          alt="Majestic pine forest campsite sunrise"
          className="w-full h-full object-cover filter brightness-[0.75] opacity-90 scale-100 transition-transform duration-[10000ms] ease-out hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Red & Black Theme Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/95 via-black/45 to-black/20" />
      </div>

      {/* Spacing Header */}
      <div className="h-4 sm:h-12 z-10" />

      {/* Central Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex-1 flex flex-col items-center justify-center py-12">
        <div className="inline-flex items-center space-x-2 border border-white/50 text-white rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-sm animate-fade-in bg-white/10">
          <Flame className="h-4 w-4 text-sand animate-pulse" />
          <span>Experience the Nature with KHNP</span>
        </div>

        <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-none">
          <span className="block mb-1 text-white">접는 즐거움,</span>
          <span className="block text-sand drop-shadow-lg">떠나는 설렘.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-stone-100 text-sm sm:text-base lg:text-lg leading-relaxed font-normal drop-shadow-sm opacity-95">
          초보자를 위한 완벽한 입문 가이드와 한수원 임직원들만의 프라이빗한 백패킹 네트워크.<br className="hidden sm:block" />
          F&P와 함께 중복 투자 없는 똑똑한 야외 리프레시의 첫 발을 내딛으세요.
        </p>

        {/* CTA Button in earth-toned wood brown */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
          <button
            onClick={onCtaClick}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-wood hover:bg-wood-dark text-white font-extrabold px-10 py-5 rounded-xl text-base sm:text-lg shadow-2xl transform hover:scale-105 active:scale-98 transition-all cursor-pointer group"
          >
            <span>F&P와 함께 떠나기 (가입)</span>
            <ArrowRight className="h-5 w-5 text-sand group-hover:translate-x-1.5 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* Trust Badges Bar / Stats panel with clean geometric border */}
      <div className="relative z-10 w-full bg-forest-dark/95 backdrop-blur-md border-t border-wood/20 px-4 py-6 md:py-8 text-sand">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-1.5 text-sand">
              <Users className="h-4.5 w-4.5 text-sand" />
              <span className="text-xs sm:text-sm font-bold tracking-wider uppercase font-mono text-sand-light/80">누적 가입 회원</span>
            </div>
            <p className="text-xl sm:text-2xl font-black font-mono text-white">
              {animatedCount}명 <span className="text-xs text-green-300 font-sans font-medium">({registeredCount}명 신규)</span>
            </p>
          </div>

          <div className="space-y-1 border-l border-white/10">
            <div className="flex items-center justify-center space-x-1.5 text-sand">
              <MapPin className="h-4.5 w-4.5 text-sand" />
              <span className="text-xs sm:text-sm font-bold tracking-wider uppercase font-mono text-sand-light/80">정기 트립 스팟</span>
            </div>
            <p className="text-xl sm:text-2xl font-black font-mono text-white">오류캠핑장 외 {animatedSpots}곳</p>
          </div>

          <div className="space-y-1 border-l border-white/10">
            <div className="flex items-center justify-center space-x-1.5 text-sand">
              <Award className="h-4.5 w-4.5 text-sand" />
              <span className="text-xs sm:text-sm font-bold tracking-wider uppercase font-mono text-sand-light/80">쓰레기 수거 누적량</span>
            </div>
            <p className="text-xl sm:text-2xl font-black font-mono text-white">{animatedTrash.toFixed(1)} kg</p>
          </div>

          <div className="space-y-1 border-l border-white/10">
            <div className="flex items-center justify-center space-x-1.5 text-sand">
              <ShieldAlert className="h-4.5 w-4.5 text-sand" />
              <span className="text-xs sm:text-sm font-bold tracking-wider uppercase font-mono text-sand-light/80">F&P 안심 지표</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-green-300 font-mono">무재해 {animatedDays.toLocaleString()}일</p>
          </div>

        </div>
      </div>
    </div>
  );
}
