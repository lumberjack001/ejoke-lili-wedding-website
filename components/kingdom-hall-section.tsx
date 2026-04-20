'use client';

import { MapPin, Clock, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';

export function KingdomHallSection() {
  const gmapsLink = "https://www.google.com/maps/dir/?api=1&destination=6°39'54.1\"N 3°19'36.3\"E";

  return (
    <section className="h-[100dvh] overflow-y-auto no-scrollbar w-full flex flex-col py-20 sm:py-32 bg-secondary/5 px-4 sm:px-6 lg:px-8 snap-start snap-always relative">
      <div className="w-full max-w-4xl mx-auto my-auto space-y-12">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <Reveal delay={0}>
            <h2 className="text-4xl sm:text-5xl font-serif text-foreground mb-3">
              The Ceremony
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-muted-foreground font-light">
              We look forward to sharing this sacred moment with you
            </p>
          </Reveal>
        </div>

        {/* Content Card */}
        <Reveal delay={400} className="w-full">
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-accent/20 shadow-xl overflow-hidden relative group">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-colors duration-700 pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-10">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-foreground mb-2">Location</h3>
                    <p className="text-muted-foreground font-bold leading-relaxed">
                      Kingdom Hall of Jehovah's Witnesses<br />
                      #26 Alhaji Mustapha Street, Off Una Street, Balogun Bus Stop, Iju Ishaga<br />
                      Lagos State
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-foreground mb-2">Time</h3>
                    <p className="text-muted-foreground font-bold leading-relaxed">
                      Saturday, May 16, 2026<br />
                      10:00 AM Prompt
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center space-y-6 bg-white/50 backdrop-blur-sm rounded-2xl p-8 sm:p-10 border border-accent/10 shadow-sm relative overflow-hidden">
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center shadow-sm">
                  <Navigation className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center">
                  <h4 className="font-serif text-xl text-foreground mb-2">Need Directions?</h4>
                  <p className="text-sm text-muted-foreground font-light mb-8 max-w-xs mx-auto">Open in Google Maps for the best route to the Kingdom Hall.</p>
                  <Button
                    onClick={() => window.open(gmapsLink, '_blank')}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-base font-light"
                  >
                    View on Google Maps
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
