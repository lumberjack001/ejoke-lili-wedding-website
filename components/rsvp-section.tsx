'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SeatReservation } from './seat-reservation';
import { Check, X } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import Image from 'next/image';

type RSVPStatus = 'pending' | 'yes' | 'no' | 'unsure';

export function RSVPSection() {
  const [status, setStatus] = useState<RSVPStatus>('pending');

  const renderContent = () => {
    switch (status) {
      case 'yes':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <Reveal delay={0}>
                <div className="inline-block rounded-full bg-primary/20 p-3 mb-4">
                  <Check className="w-8 h-8 text-primary" />
                </div>
              </Reveal>
              <Reveal delay={200}>
                <h3 className="text-3xl font-serif text-foreground mb-2">
                  We're thrilled you can make it!
                </h3>
              </Reveal>
              <Reveal delay={400}>
                <p className="text-muted-foreground font-light">
                  Please select your seat below
                </p>
              </Reveal>
            </div>
            <Reveal delay={600}>
              <SeatReservation />
            </Reveal>
          </div>
        );

      case 'no':
        return (
          <div className="text-center py-12 flex flex-col items-center">
            <Reveal delay={0}>
              <div className="inline-block rounded-full bg-red-100 p-3 mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
            </Reveal>
            <Reveal delay={200}>
              <h3 className="text-3xl font-serif text-foreground mb-4">
                Thank you for letting us know
              </h3>
            </Reveal>
            <Reveal delay={400}>
              <p className="text-muted-foreground font-light max-w-lg mx-auto">
                We'll miss you on our special day. Your presence would have meant the world to us.
              </p>
            </Reveal>
            <Reveal delay={600}>
              <Button
                onClick={() => setStatus('pending')}
                variant="outline"
                className="mt-8"
              >
                Back
              </Button>
            </Reveal>
          </div>
        );

      case 'unsure':
        return (
          <div className="text-center py-12 flex flex-col items-center">
            <Reveal delay={0}>
              <h3 className="text-3xl font-serif text-foreground mb-4">
                Still deciding?
              </h3>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-muted-foreground font-light max-w-lg mx-auto mb-8">
                We understand that plans can be uncertain. Please feel free to reach out to us with any questions or to confirm your attendance.
              </p>
            </Reveal>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Reveal delay={400}>
                <div className="text-left">
                  <p className="text-lg font-serif text-foreground">OGHRORO EDAFE</p>
                  <p className="text-muted-foreground font-light">+234 814 087 3824</p>
                </div>
              </Reveal>
              <Reveal delay={500}>
                <div className="h-12 w-px bg-border hidden sm:block" />
              </Reveal>
              <Reveal delay={600}>
                <div className="text-left">
                  <p className="text-lg font-serif text-foreground">ITOYA SHEM</p>
                  <p className="text-muted-foreground font-light">+234 814 504 9361</p>
                </div>
              </Reveal>
            </div>
            <Reveal delay={800}>
              <Button
                onClick={() => setStatus('pending')}
                variant="outline"
                className="mt-8"
              >
                Back
              </Button>
            </Reveal>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <Reveal delay={400}>
              <h3 className="text-2xl sm:text-3xl font-serif text-foreground mb-4">
                Will you be able to attend?
              </h3>
            </Reveal>
            <Reveal delay={600}>
              <p className="text-muted-foreground font-light mb-8">
                Please let us know by May 1st
              </p>
            </Reveal>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Reveal delay={800}>
                <Button
                  onClick={() => setStatus('yes')}
                  className="bg-primary flex-1 hover:bg-primary/90 w-full sm:w-auto text-primary-foreground px-8 py-6 text-base font-light"
                >
                  Yes, I'll be there
                </Button>
              </Reveal>
              <Reveal delay={1000}>
                <Button
                  onClick={() => setStatus('no')}
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-6 text-base font-light"
                >
                  Sorry, I can't attend
                </Button>
              </Reveal>
              <Reveal delay={1200}>
                <Button
                  onClick={() => setStatus('unsure')}
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-6 text-base font-light"
                >
                  Still deciding
                </Button>
              </Reveal>
            </div>
          </div>
        );
    }
  };

  return (
    <section
      id="rsvp-section"
      className="h-[100dvh] overflow-y-auto no-scrollbar w-full flex flex-col py-20 sm:py-32 bg-white px-4 sm:px-6 lg:px-8 snap-start snap-always overflow-x-hidden relative"
    >
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Left side: Photo */}
        <Reveal delay={0} className="w-full">
          <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:max-w-none rounded-2xl overflow-hidden shadow-2xl">
            <Image src="/images/rsvp_photo.png" alt="Lily and Ejoke" fill className="object-cover" />
          </div>
        </Reveal>

        {/* Right side: RSVP Content */}
        <div className="w-full space-y-12">
          {/* Section Header */}
          <div className="text-center lg:text-left mb-8">
            <Reveal delay={200}>
              <h2 className="text-4xl sm:text-5xl font-serif text-foreground mb-3 text-center">
                RSVP
              </h2>
            </Reveal>
            <Reveal delay={400}>
              <p className="text-muted-foreground font-light text-center">
                Join us in celebrating love
              </p>
            </Reveal>
          </div>

          {/* RSVP Content Form */}
          <div className="w-full max-w-xl mx-auto lg:mx-0">
            {renderContent()}
          </div>
        </div>
      </div>
    </section>
  );
}
