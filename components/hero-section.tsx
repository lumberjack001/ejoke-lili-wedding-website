'use client';

import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';

export function HeroSection() {

  return (
    <section className="relative w-full min-h-[100dvh] overflow-hidden snap-start snap-always flex flex-col lg:flex-row bg-background cursor-default">
      {/* Left side: Text Content */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-24 py-16 lg:py-0 z-10 min-h-[55dvh] lg:min-h-[100dvh] order-2 lg:order-1 bg-white relative shadow-[10px_0_30px_rgba(0,0,0,0.05)]">
        
        <div className="w-full max-w-xl mx-auto flex flex-col items-start text-left relative z-10">
          {/* Tagline */}
          <Reveal delay={100}>
            <p className="text-xs sm:text-sm font-light tracking-[0.25em] text-muted-foreground uppercase mb-6">
              Together with their families
            </p>
          </Reveal>

          {/* Main heading */}
          <div className="mb-6 w-full">
            <Reveal delay={300}>
              <h1
                className="font-serif text-foreground mb-4 leading-tight"
                style={{ fontSize: 'clamp(2.2rem, 7vw, 5.5rem)' }}
              >
                Lilyfield & Ejoke
              </h1>
            </Reveal>
            <Reveal delay={500}>
              <p
                className="text-muted-foreground font-light italic mt-2"
                style={{ fontSize: 'clamp(0.95rem, 2vw, 1.25rem)' }}
              >
                invite you to celebrate their wedding
              </p>
            </Reveal>
          </div>

          {/* Date & Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center w-full mt-6 gap-8 sm:gap-12">
            {/* Date */}
            <Reveal delay={700}>
              <div className="flex flex-col items-start text-left">
                <p
                  className="font-serif text-foreground mb-2"
                  style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)' }}
                >
                  May 16
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-muted-foreground/50" />
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-muted-foreground whitespace-nowrap">
                    2026
                  </p>
                </div>
              </div>
            </Reveal>

            {/* CTA Button */}
            <Reveal delay={900}>
              <a
                href="/wedding_invite_updated.png"
                download="Lilyfield_and_Ejoke_Wedding_Invite.png"
              >
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-xs sm:text-sm font-light rounded-full shadow-lg transition-transform hover:scale-105 uppercase tracking-[0.15em]"
                >
                  View Invitation
                </Button>
              </a>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Right side: Video */}
      <div className="w-full lg:w-[55%] xl:w-[60%] relative z-0 h-[45dvh] lg:min-h-[100dvh] order-1 lg:order-2 group overflow-hidden bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-[center_30%] transition-transform duration-[2000ms] ease-out scale-100 group-hover:scale-105"
          poster="https://res.cloudinary.com/dizxlackk/image/upload/v1776342684/hero_3_a94a3a.jpg"
        >
          <source src="https://res.cloudinary.com/dizxlackk/video/upload/v1776300697/IMG_7312_h4vkfm.mov" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Transparent overlay with subtle blur to reduce video sharpness */}
        <div className="absolute inset-0 bg-black/15 backdrop-blur-[3px] transition-all duration-1000 group-hover:backdrop-blur-[1px] pointer-events-none" />
      </div>
    </section>
  );
}
