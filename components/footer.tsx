'use client';

import { Heart } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';

export function Footer() {
  return (
    <footer className="h-[100dvh] overflow-y-auto no-scrollbar w-full flex flex-col snap-start snap-always bg-gradient-to-b from-background to-secondary/10 border-t border-accent/20">
      <div className="w-full max-w-6xl mx-auto my-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-8 mb-16">
          {/* Left: Couple Names */}
          <div className="text-center md:text-left flex flex-col justify-center">
            <Reveal delay={0}>
              <h3 className="text-3xl font-serif text-foreground mb-4">
                Lilyfield & Ejoke
              </h3>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-sm uppercase tracking-widest text-muted-foreground font-light">
                May 16, 2026
              </p>
            </Reveal>
          </div>

          {/* Center: Message */}
          <div className="text-center">
            <Reveal delay={400}>
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-px w-4 bg-accent" />
                <Heart className="w-5 h-5 text-primary fill-primary" />
                <div className="h-px w-4 bg-accent" />
              </div>
            </Reveal>
            <Reveal delay={600}>
              <p className="text-muted-foreground font-light italic">
                "Love is not about finding the perfect person. It's about seeing an imperfect person perfectly."
              </p>
            </Reveal>
          </div>

          {/* Right: Details */}
          <div className="text-center md:text-right">
            <Reveal delay={800}>
              <p className="text-md uppercase tracking-widest text-muted-foreground font-medium mb-2">
                Venue
              </p>
            </Reveal>
            <Reveal delay={1000}>
              <p className="text-muted-foreground font-light leading-relaxed">
                Kingdom Hall of Jehovah's Witnesses <br />
                #26 Alhaji Mustapha Street, Off Una Street, Balogun Bus Stop, Iju Ishaga <br />
                Lagos State
              </p>
            </Reveal>
          </div>
        </div>

        {/* Divider */}
        <Reveal delay={1100}>
          <div className="h-px bg-accent/20 my-16" />
        </Reveal>

        {/* Bottom: Copyright */}
        <div className="text-center">
          <Reveal delay={1200}>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-light mb-4">
              Strictly by Invitation
            </p>
          </Reveal>
          <Reveal delay={1400}>
            <p className="text-xs text-muted-foreground font-light tracking-wide">
              © 2026 Lilyfield & Ejoke. All rights reserved.
            </p>
          </Reveal>
        </div>
      </div>
    </footer>
  );
}
