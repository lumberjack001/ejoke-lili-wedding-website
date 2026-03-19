'use client';

import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import Image from 'next/image';

export function HeroSection() {
  const scrollToInvitation = () => {
    const element = document.getElementById('rsvp-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[100dvh] w-full flex flex-col md:flex-row overflow-hidden snap-start snap-always">

      {/* Left Side: Content */}
      <div className="w-full md:w-1/2 flex items-center justify-center py-24 md:py-12 px-8 sm:px-12 lg:px-20 bg-gradient-to-br from-background via-background to-secondary/10">
        <div className="relative z-10 text-center w-full max-w-lg mx-auto">
          {/* Tagline */}
          <Reveal delay={0}>
            <p className="text-sm sm:text-base font-light tracking-widest text-muted-foreground uppercase mb-8">
              Together with their families
            </p>
          </Reveal>

          {/* Main heading */}
          <div className="mb-8">
            <Reveal delay={200}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-foreground mb-4">
                Lily & Ejoke
              </h1>
            </Reveal>
            <Reveal delay={400}>
              <p className="text-lg sm:text-xl text-muted-foreground font-light mb-6">
                invite you to celebrate their wedding
              </p>
            </Reveal>
          </div>

          {/* Date */}
          <Reveal delay={600}>
            <div className="mb-12">
              <p className="text-5xl sm:text-6xl font-serif text-primary mb-2">May 16</p>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-8 bg-accent" />
                <p className="text-sm uppercase tracking-widest text-muted-foreground">Two Thousand Twenty-Six</p>
                <div className="h-px w-8 bg-accent" />
              </div>
            </div>
          </Reveal>

          {/* CTA Button */}
          <Reveal delay={800}>
            <Button
              onClick={scrollToInvitation}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-base font-light tracking-wide shadow-lg hover:shadow-xl transition-all"
            >
              View Invitation
            </Button>
          </Reveal>
        </div>
      </div>

      {/* Right Side: Image */}
      <div className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-[100dvh]">
        <Reveal delay={0} className="w-full h-full absolute inset-0">
          <Image
            src="/images/hero_1.jpg"
            alt="Lily and Ejoke"
            fill
            priority
            className="object-cover object-center animate-image-zoom"
          />
        </Reveal>
      </div>

    </section>
  );
}
