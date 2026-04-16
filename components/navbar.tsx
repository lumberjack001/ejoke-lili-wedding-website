'use client';

import { useState, useEffect } from 'react';

export function Navbar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = document.getElementById('main-container');
    if (!container) return;

    const handleScroll = () => {
      // The hero section takes up 100vh. Show navbar when scrolling past 50% of the viewport height overlaying into the countdown page.
      if (container.scrollTop > window.innerHeight * 0.5) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger check on initial load

    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const container = document.getElementById('main-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div 
      className={`fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 transition-all duration-700 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
      }`}
    >
      <button 
        onClick={scrollToTop}
        className={`backdrop-blur-2xl backdrop-saturate-200 bg-white/40 dark:bg-black/40 border border-white/50 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.15)] rounded-full px-8 py-3 transition-all duration-300 hover:bg-white/50 dark:hover:bg-black/50 hover:scale-105 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] ${
          isVisible ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'
        }`}
      >
        <h2 className="text-lg sm:text-xl font-serif text-foreground/90 tracking-wide m-0">
          You <span className="text-primary italic mx-1">are</span> Invited<span className="text-primary italic mx-1">!!</span>
        </h2>
      </button>
    </div>
  );
}
