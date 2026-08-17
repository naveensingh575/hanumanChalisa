import React, { useState, useEffect, useRef } from 'react';
import { Bell, Sparkles, Heart, Play, Pause, ArrowUp } from 'lucide-react';
import { openingDohas, chaupais, closingDoha } from './data/chalisaData';
import { playTempleBell } from './utils/audioEngine';
import confetti from 'canvas-confetti';

export default function App() {
  // Font Size State (Default 20px)
  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem('hc_minimal_fontsize') || '20', 10);
  });

  // Devotional Interactive States
  const [petalsActive, setPetalsActive] = useState(false);
  const [pranamCount, setPranamCount] = useState(0);

  // Auto Scroll State: Default human reading speed multiplier = 1.0 (45 px/sec)
  const [autoScroll, setAutoScroll] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0); // 0.75x, 1.0x, 1.5x
  const scrollAnimRef = useRef(null);
  const isUserInteractingRef = useRef(false);

  useEffect(() => {
    localStorage.setItem('hc_minimal_fontsize', fontSize.toString());
  }, [fontSize]);

  const decreaseFontSize = () => setFontSize(prev => Math.max(16, prev - 2));
  const resetFontSize = () => setFontSize(20);
  const increaseFontSize = () => setFontSize(prev => Math.min(32, prev + 2));

  // Pranam / Pushpanjali
  const handlePranam = () => {
    setPranamCount(prev => prev + 1);
    playTempleBell();
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#D97706', '#F59E0B', '#E11D48', '#FFD700']
    });
  };

  // Temple Bell Sound
  const handleBell = () => {
    playTempleBell();
  };

  // Auto Scroll Engine & Touch Handling for 100% Mobile Browser Compatibility (Chrome, Edge, Safari)
  const autoScrollStartedAtRef = useRef(0);
  const touchStartYRef = useRef(0);

  // Auto Scroll Loop (Human reading pace: base 45 px/sec)
  useEffect(() => {
    if (!autoScroll) {
      if (scrollAnimRef.current) cancelAnimationFrame(scrollAnimRef.current);
      return;
    }

    autoScrollStartedAtRef.current = Date.now();
    let lastTimestamp = performance.now();
    const basePace = 45; // 45 pixels per second represents comfortable reading speed

    const scrollLoop = (currentTimestamp) => {
      const deltaSeconds = Math.min((currentTimestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = currentTimestamp;

      // Scroll smoothly down using direct documentElement scroll for 100% mobile compatibility
      const pixelsToScroll = basePace * speedMultiplier * deltaSeconds;
      
      if (pixelsToScroll > 0) {
        window.scrollBy({ top: pixelsToScroll, left: 0, behavior: 'instant' });
      }

      // Check if reached the bottom of page
      const currentScroll = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const totalHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

      if (currentScroll + windowHeight >= totalHeight - 20) {
        setAutoScroll(false);
        return;
      }

      scrollAnimRef.current = requestAnimationFrame(scrollLoop);
    };

    scrollAnimRef.current = requestAnimationFrame(scrollLoop);

    return () => {
      if (scrollAnimRef.current) cancelAnimationFrame(scrollAnimRef.current);
    };
  }, [autoScroll, speedMultiplier]);

  // Touch & Wheel Event handling: only pause on intentional user scroll after initial button tap
  useEffect(() => {
    if (!autoScroll) return;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > 3) {
        setAutoScroll(false);
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      // Ignore touch during the first 450ms of clicking the button
      if (Date.now() - autoScrollStartedAtRef.current < 450) return;

      if (e.touches && e.touches[0]) {
        const touchCurrentY = e.touches[0].clientY;
        const diff = Math.abs(touchCurrentY - touchStartYRef.current);
        // Only pause if user performed an intentional finger drag > 25px
        if (diff > 25) {
          setAutoScroll(false);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [autoScroll]);

  const toggleAutoScroll = () => {
    setAutoScroll(prev => !prev);
  };

  const scrollToTop = () => {
    if (autoScroll) setAutoScroll(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="notranslate min-h-screen bg-[#FDFBF7] text-[#1E293B] flex flex-col items-center selection:bg-amber-100 selection:text-amber-900 relative" translate="no">
      
      {/* Floating Flower Petals (पुष्प वर्षा) */}
      {petalsActive && (
        <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden" aria-hidden="true">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="petal-particle text-amber-500 text-xl select-none"
              style={{
                left: `${(i * 7.2) + (i % 3) * 2}%`,
                animationDuration: `${6 + (i % 5) * 2}s`,
                animationDelay: `${(i % 5) * 0.9}s`,
              }}
            >
              {i % 2 === 0 ? '🌸' : '🌼'}
            </div>
          ))}
        </div>
      )}

      {/* Main Reading Container */}
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-28">
        
        {/* ================= 1. HEADER / HERO SECTION ================= */}
        <header className="flex flex-col items-center text-center mb-8 sm:mb-10">
          
          {/* Hero Card Enlarge - Length equal to Doha outer box with interactive divine animation */}
          <div className="relative group mb-6 w-full cursor-pointer">
            {/* Ambient Divine Pulsing Halo Glow */}
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-red-500 divine-halo-breath blur-xl group-hover:opacity-85 group-hover:blur-2xl group-hover:scale-105 transition-all duration-700 pointer-events-none"></div>
            
            {/* Full-width Box matching Doha width - 4:3 aspect ratio showing Mukut to lap and hiding below legs */}
            <div className="relative w-full aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-3 border-amber-300/90 group-hover:border-amber-400 shadow-xl shadow-amber-900/10 group-hover:shadow-amber-500/25 bg-amber-50 p-1.5 backdrop-blur-xs transition-all duration-700">
              
              {/* Smooth Zoom Photo */}
              <img
                src="/assets/hanuman_dhyan.jpg"
                alt="Lord Hanuman in Dhyan Posture - ध्यान मग्न श्री हनुमान जी"
                className="w-full h-full object-cover rounded-xl sm:rounded-2xl transform transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ objectPosition: 'center top' }}
                loading="eager"
              />

              {/* Shimmer Light Sweep on Hover */}
              <div className="shimmer-effect rounded-xl sm:rounded-2xl" aria-hidden="true"></div>
            </div>

            {/* Pranam / Pushpanjali Badge */}
            <button
              onClick={handlePranam}
              title="पुष्पांजलि व प्रणाम अर्पित करें"
              className="absolute -bottom-3 right-3 sm:right-4 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white text-xs font-semibold shadow-lg group-hover:shadow-amber-500/40 group-hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <Heart className="w-3.5 h-3.5 fill-current animate-bounce" />
              <span>प्रणाम {pranamCount > 0 && `(${pranamCount})`}</span>
            </button>
          </div>

          {/* Devotional Toolbar: Authentic Ghanti, Flower Shower, Auto Scroll */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-6">
            
            {/* Authentic Hindu Temple Bell (घंटी 🔔) */}
            <button
              onClick={handleBell}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-100/80 text-amber-950 border border-amber-300/80 text-xs font-semibold shadow-xs transition active:scale-95"
              title="मंदिर की पावन घंटी बजाएं ('टनन्न्न्...')"
            >
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              <span>घंटी 🔔</span>
            </button>

            {/* Phool / Pushpa Vrishti (🌸) */}
            <button
              onClick={() => setPetalsActive(!petalsActive)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition active:scale-95 ${
                petalsActive
                  ? 'bg-red-600 text-white border-red-600 shadow-sm'
                  : 'bg-white hover:bg-amber-100/80 text-amber-950 border-amber-300/80'
              }`}
              title="पुष्प वर्षा शुरू या बंद करें"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>{petalsActive ? 'पुष्प वर्षा (चालू) 🌸' : 'फूल वर्षा 🌸'}</span>
            </button>

            {/* Auto Scroll Toggle */}
            <button
              onClick={toggleAutoScroll}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition active:scale-95 ${
                autoScroll
                  ? 'bg-green-600 text-white border-green-600 shadow-sm animate-pulse'
                  : 'bg-white hover:bg-amber-100/80 text-amber-950 border-amber-300/80'
              }`}
              title="स्वतः स्क्रॉल (Auto-Scroll) चालू/बंद करें"
            >
              {autoScroll ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{autoScroll ? 'ऑटो स्क्रॉल (रोकें)' : 'ऑटो स्क्रॉल 📜'}</span>
            </button>

          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#B45309] drop-shadow-xs mb-2">
            ॥ श्री हनुमान चालीसा ॥
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-amber-800 font-medium">
            जय श्री राम | संकट मोचन कृपा निधान
          </p>

          <div className="w-24 h-[1.5px] bg-amber-300 mt-4 rounded-full"></div>
        </header>

        {/* ================= 2. OPENING DOHAS (प्रारम्भिक दोहा) ================= */}
        <section aria-label="प्रारम्भिक दोहा" className="mb-8">
          <div className="doha-card rounded-2xl p-6 sm:p-8 text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#B45309] bg-amber-100 px-3.5 py-1 rounded-full mb-5">
              ॥ दोहा ॥
            </span>

            <div
              className="font-bold leading-relaxed tracking-wide text-[#1E293B] space-y-5"
              style={{ fontSize: `${fontSize + 1}px` }}
            >
              {openingDohas.map((doha) => (
                <div key={doha.id} className="space-y-1">
                  <p>{doha.line1}</p>
                  <p>{doha.line2}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 3. 40 CHAUPAIS IN ONE GO (चौपाइयाँ १ से ४०) ================= */}
        <section aria-label="चौपाई" className="mb-8">
          <div className="reader-card rounded-2xl p-6 sm:p-8 shadow-md">
            
            {/* Header Badge */}
            <div className="text-center mb-6">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#B45309] bg-amber-100 px-4 py-1.5 rounded-full">
                ॥ चौपाई ॥
              </span>
            </div>

            {/* Continuous Seamless Flow of all 40 Chaupais */}
            <div
              className="font-medium leading-relaxed tracking-wide text-[#1E293B] space-y-5 text-center sm:text-left divide-y divide-amber-100/70"
              style={{ fontSize: `${fontSize}px` }}
            >
              {chaupais.map((chaupai, index) => (
                <div
                  key={chaupai.id}
                  className={`space-y-1 ${index > 0 ? 'pt-4' : ''}`}
                >
                  <p>{chaupai.line1}</p>
                  <p>{chaupai.line2}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ================= 4. CLOSING DOHA (समापन दोहा) ================= */}
        <section aria-label="समापन दोहा" className="mb-10">
          <div className="doha-card rounded-2xl p-6 sm:p-8 text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#B45309] bg-amber-100 px-3.5 py-1 rounded-full mb-4">
              ॥ दोहा ॥
            </span>

            <div
              className="font-bold leading-relaxed tracking-wide text-[#1E293B] space-y-1"
              style={{ fontSize: `${fontSize + 1}px` }}
            >
              <p>{closingDoha.line1}</p>
              <p>{closingDoha.line2}</p>
            </div>
          </div>
        </section>

        {/* ================= 5. FOOTER ================= */}
        <footer className="text-center pt-6 pb-8 space-y-4 border-t border-amber-200/60">
          <p className="text-base sm:text-lg font-bold text-[#B45309]">
            ॥ इति श्री हनुमान चालीसा समाप्त ॥
          </p>
          <p className="text-sm font-semibold text-amber-800">
            🚩 जय सिया राम 🚩
          </p>

          {/* Scroll to Top Button in Footer */}
          <div className="pt-2">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-100/90 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold shadow-xs active:scale-95 transition-all"
              title="आरंभ में वापस जाएं"
            >
              <ArrowUp className="w-4 h-4 text-amber-700" />
              <span>शीर्ष पर जाएं (Scroll to Top)</span>
            </button>
          </div>
        </footer>

      </main>

      {/* ================= 6. FLOATING DOCK: FONT SIZE, AUTO-SCROLL, & SCROLL TOP ================= */}
      <aside aria-label="Reading Controls" className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-5 sm:translate-x-0 z-40 max-w-[95vw]">
        <div className="flex items-center gap-1 sm:gap-1.5 bg-white/95 border border-amber-300/80 shadow-xl rounded-full px-2.5 py-1.5 backdrop-blur-md">
          
          {/* Auto Scroll Play/Pause Button */}
          <button
            onClick={toggleAutoScroll}
            className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition active:scale-95 ${
              autoScroll ? 'bg-green-600 text-white shadow-sm animate-pulse' : 'bg-amber-100/80 text-amber-900 hover:bg-amber-200'
            }`}
            title={autoScroll ? 'ऑटो स्क्रॉल रोकें' : 'ऑटो स्क्रॉल चालू करें'}
          >
            {autoScroll ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{autoScroll ? 'चल रहा है' : 'स्क्रॉल'}</span>
          </button>

          {/* Speed Selector (0.75x, 1x, 1.5x) */}
          <div className="flex items-center bg-amber-50 rounded-full p-0.5 border border-amber-200/70">
            {[
              { val: 0.75, label: '0.75x', title: 'धीमी गति (Slow Mobile Pace - 0.75x)' },
              { val: 1.0, label: '1x', title: 'सामान्य गति (Normal Reading - 1x)' },
              { val: 1.5, label: '1.5x', title: 'तेज़ गति (Fast - 1.5x)' }
            ].map(({ val, label, title }) => (
              <button
                key={val}
                onClick={() => {
                  setSpeedMultiplier(val);
                  if (!autoScroll) setAutoScroll(true);
                }}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition ${
                  speedMultiplier === val
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-amber-900 hover:bg-amber-200/60'
                }`}
                title={title}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="w-[1px] h-4 bg-amber-200 mx-0.5"></div>

          {/* Font Size Adjusters */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={decreaseFontSize}
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-amber-900 hover:bg-amber-100 transition active:scale-95"
              title="अक्षर छोटा करें (A-)"
            >
              A-
            </button>
            
            <button
              onClick={resetFontSize}
              className="px-1 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-amber-800 hover:bg-amber-50 transition"
              title="सामान्य आकार (Reset)"
            >
              {fontSize}px
            </button>

            <button
              onClick={increaseFontSize}
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-amber-900 hover:bg-amber-100 transition active:scale-95"
              title="अक्षर बड़ा करें (A+)"
            >
              A+
            </button>
          </div>

          <div className="w-[1px] h-4 bg-amber-200 mx-0.5"></div>

          {/* Scroll to Top Quick Icon */}
          <button
            onClick={scrollToTop}
            className="w-7 h-7 rounded-full flex items-center justify-center text-amber-900 hover:bg-amber-100 active:scale-95 transition"
            title="शीर्ष पर जाएं (Scroll to Top)"
          >
            <ArrowUp className="w-3.5 h-3.5 text-amber-800" />
          </button>

        </div>
      </aside>

    </div>
  );
}
