'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Reveal } from '@/components/ui/reveal';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function WeddingCountdown() {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      // May 16, 2026
      const weddingDate = new Date('2026-05-16T00:00:00').getTime();
      const now = new Date().getTime();
      const difference = weddingDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeRemaining({ days, hours, minutes, seconds });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, []);

  const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative mb-3">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 flex items-center justify-center">
          <span className="text-4xl sm:text-5xl font-serif text-primary font-light">
            {String(value).padStart(2, '0')}
          </span>
        </div>
      </div>
      <span className="text-xs sm:text-sm font-light uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );

  return (
    <section className="h-[100dvh] overflow-y-auto no-scrollbar w-full flex flex-col bg-gradient-to-b from-background to-secondary/5 px-4 sm:px-6 lg:px-8 snap-start snap-always">
      <div className="w-full max-w-5xl mx-auto my-auto py-12 space-y-16 flex flex-col items-center justify-center">
        {/* Section Header */}
        <div className="text-center w-full mb-4">
          <Reveal delay={0}>
            <h2 className="text-4xl sm:text-5xl font-serif text-foreground mb-3">
              The Countdown
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-muted-foreground font-light">
              Days until we say I do
            </p>
          </Reveal>
        </div>

        {/* Countdown Grid */}
        <Card className="backdrop-blur-sm bg-white/50 border-accent/20 p-8 sm:p-12">
          <div className="flex flex-wrap justify-center items-end gap-4 sm:gap-6 lg:gap-8">
            <Reveal delay={300}><CountdownUnit value={timeRemaining.days} label="Days" /></Reveal>
            <Reveal delay={400}><div className="text-3xl sm:text-4xl font-light text-accent mb-6">:</div></Reveal>
            <Reveal delay={500}><CountdownUnit value={timeRemaining.hours} label="Hours" /></Reveal>
            <Reveal delay={600}><div className="text-3xl sm:text-4xl font-light text-accent mb-6">:</div></Reveal>
            <Reveal delay={700}><CountdownUnit value={timeRemaining.minutes} label="Minutes" /></Reveal>
            <Reveal delay={800}><div className="text-3xl sm:text-4xl font-light text-accent mb-6">:</div></Reveal>
            <Reveal delay={900}><CountdownUnit value={timeRemaining.seconds} label="Seconds" /></Reveal>
          </div>
        </Card>
      </div>
    </section>
  );
}
