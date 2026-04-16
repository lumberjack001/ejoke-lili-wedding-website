'use client';

import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';

export function HeroSection() {
  const scrollToInvitation = () => {
    const element = document.getElementById('rsvp-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="group relative h-[100dvh] w-full overflow-hidden snap-start snap-always flex flex-col justify-end items-center pb-12 sm:pb-16 cursor-default">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-black">
        {/* The video expands/zooms in on hover */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-[center_30%] transition-transform duration-[1500ms] ease-out scale-100 group-hover:scale-110"
          poster="/images/hero_3.jpg"
        >
          {/* Online video link */}
          <source src="https://res.cloudinary.com/dizxlackk/video/upload/v1776300697/IMG_7312_h4vkfm.mov" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Dark overlay that deepens slightly on hover to keep text super readable */}
        <div className="absolute inset-0 bg-black/20 z-10 transition-colors duration-1000 group-hover:bg-black/40" />
      </div>

      {/* Content Container - placed at bottom center, slides up gracefully into place on hover with glassmorphism backdrop */}
      <div className="relative z-20 w-[90%] max-w-4xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-8 sm:p-12 mb-4 flex flex-col items-center text-center transform transition-all duration-[1200ms] ease-out translate-y-8 group-hover:translate-y-0">

        {/* Tagline */}
        <Reveal delay={100}>
          <p className="text-xs sm:text-sm font-light tracking-[0.25em] text-white/90 uppercase mb-4 sm:mb-6">
            Together with their families
          </p>
        </Reveal>

        {/* Main heading */}
        <div className="mb-6 w-full">
          <Reveal delay={300}>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif text-white mb-2 leading-tight drop-shadow-xl">
              Lily & Ejoke
            </h1>
          </Reveal>
          <Reveal delay={500}>
            <p className="text-lg sm:text-2xl text-white/90 font-light italic mt-2 sm:mt-4 drop-shadow-md">
              invite you to celebrate their wedding
            </p>
          </Reveal>
        </div>

        {/* Date & Button Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-2xl mt-4 sm:mt-8 gap-8 sm:gap-4">
          {/* Date */}
          <Reveal delay={700}>
            <div className="flex flex-col items-center sm:items-start text-left">
              <p className="text-3xl sm:text-4xl font-serif text-white mb-2 drop-shadow-lg">May 16</p>
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-8 bg-white/50" />
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-white/80 whitespace-nowrap">
                  2026
                </p>
              </div>
            </div>
          </Reveal>

          {/* CTA Button */}
          <Reveal delay={900}>
            <Button
              onClick={scrollToInvitation}
              className="group/btn relative overflow-hidden bg-white/15 hover:bg-white text-white hover:text-black border border-white/30 hover:border-white rounded-full px-8 py-6 text-xs sm:text-sm font-light tracking-[0.15em] uppercase transition-all duration-500 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] shrink-0"
            >
              <span className="relative z-10 transition-transform duration-300 block group-hover/btn:scale-105">
                View Invitation
              </span>
            </Button>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
