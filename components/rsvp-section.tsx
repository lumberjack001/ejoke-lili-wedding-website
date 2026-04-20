'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { SeatReservation } from './seat-reservation';
import { Check, X, AlertCircle, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import Image from 'next/image';
import supabase from '@/app/config/supabaseClient';

type RSVPStatus = 'pending' | 'yes' | 'no' | 'unsure' | 'trouble';

interface CarouselImage {
  id: number;
  src: string;
  alt: string;
}

export function RSVPSection() {
  const [status, setStatus] = useState<RSVPStatus>('pending');
  const [showSeats, setShowSeats] = useState(false);
  const [showVirtual, setShowVirtual] = useState(false);

  // ── Carousel state ────────────────────────────────────────────────
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('image_upload')
        .select('id,title,image')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setCarouselImages(
          data.map((item: any) => ({
            id: item.id,
            src: item.image,
            alt: item.title || 'Wedding moment',
          }))
        );
      }
    };

    fetchImages();
  }, []);

  // Auto-advance every 4 s
  useEffect(() => {
    if (carouselImages.length < 2) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [carouselImages]);

  const goTo = (idx: number) => {
    setActiveIndex((idx + carouselImages.length) % carouselImages.length);
    // Reset timer on manual nav
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % carouselImages.length);
    }, 4000);
  };

  const renderContent = () => {
    switch (status) {
      case 'yes':
        if (showSeats) {
          return (
            <div className="w-full animate-fade-in">
              <SeatReservation
                onBack={() => setShowSeats(false)}
                onTrouble={() => {
                  setShowSeats(false);
                  setStatus('trouble');
                }}
              />
            </div>
          );
        }

        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-10">
              <Reveal delay={0}>
                <div className="inline-block rounded-full bg-primary/20 p-3 mb-6 mt-4">
                  <Check className="w-8 h-8 text-primary" />
                </div>
              </Reveal>
              <Reveal delay={200}>
                <h3 className="text-3xl sm:text-4xl font-serif text-foreground mb-4">
                  We're thrilled you can make it!
                </h3>
              </Reveal>
              <Reveal delay={400}>
                <p className="text-muted-foreground font-light max-w-sm mx-auto mb-10">
                  To complete your RSVP, please securely select your preferred table and seat.
                </p>
              </Reveal>
              <Reveal delay={600}>
                <Button
                  onClick={() => setShowSeats(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 text-lg font-light rounded-full shadow-lg transition-transform hover:scale-105"
                >
                  Select Table
                </Button>
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
              <p className="text-muted-foreground font-light max-w-lg mx-auto mb-8">
                We'll miss you on our special day. Your presence would have meant the world to us.
              </p>
            </Reveal>

            {!showVirtual ? (
              <Reveal delay={500}>
                <div className="bg-secondary/5 p-6 sm:p-8 rounded-2xl w-full max-w-md border border-accent/20 shadow-sm mt-4">
                  <h4 className="font-serif text-xl sm:text-2xl mb-6 text-foreground">Would you like to join virtually?</h4>
                  <Button
                    onClick={() => setShowVirtual(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-base font-light rounded-full shadow-md transition-transform hover:scale-105"
                  >
                    Yes
                  </Button>
                </div>
              </Reveal>
            ) : (
              <Reveal delay={0} className="w-full">
                <div className="bg-secondary/5 p-6 sm:p-8 rounded-2xl w-full max-w-md border border-accent/20 animate-fade-in shadow-sm mt-4 mx-auto">
                  <p className="text-foreground text-base font-light mb-8">
                    The stream is scheduled to begin at <span className="font-medium font-serif">11am on May 16th, 2026.</span>
                  </p>
                  <Button
                    onClick={() => window.open('https://youtube.com/live/TpxFaFDxBWQ?feature=share', '_blank')}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-light rounded-full shadow-md w-full sm:w-auto transition-transform hover:scale-105"
                  >
                    Click now to join the stream
                  </Button>
                </div>
              </Reveal>
            )}

            <Reveal delay={800}>
              <Button
                onClick={() => { setStatus('pending'); setShowVirtual(false); }}
                variant="outline"
                className="mt-10"
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

      case 'trouble':
        return (
          <div className="text-center py-12 flex flex-col items-center animate-fade-in">
            <Reveal delay={0}>
              <div className="inline-block rounded-full bg-orange-100 p-3 mb-4">
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </Reveal>
            <Reveal delay={200}>
              <h3 className="text-3xl font-serif text-foreground mb-4">
                Having trouble?
              </h3>
            </Reveal>
            <Reveal delay={400}>
              <p className="text-muted-foreground font-light max-w-lg mx-auto mb-6">
                Need help with your reservation? You can place a direct call or start a WhatsApp chat for immediate assistance.
              </p>
            </Reveal>
            <Reveal delay={500}>
              <div className="text-center mb-6">
                <p className="text-lg font-serif text-foreground tracking-wide">ITOYA SHEM</p>
              </div>
            </Reveal>
            <Reveal delay={600}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto">
                <Button
                  onClick={() => window.open('tel:+2348145049361', '_self')}
                  className="bg-primary/10 hover:bg-primary/20 text-primary border-none shadow-none px-8 py-6 w-full sm:w-1/2 text-base font-medium rounded-full"
                >
                  Call
                </Button>
                <Button
                  onClick={() => window.open('https://wa.me/2348145049361', '_blank')}
                  className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200/50 shadow-none px-8 py-6 w-full sm:w-1/2 text-base font-medium rounded-full"
                >
                  WhatsApp
                </Button>
              </div>
            </Reveal>
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
        {/* Left side: Photo Carousel */}
        <Reveal delay={0} className="w-full">
          <div className="relative aspect-[5/5] w-full max-w-md mx-auto lg:max-w-none rounded-2xl overflow-hidden shadow-2xl group">

            {/* Images — crossfade */}
            {carouselImages.length > 0 ? (
              carouselImages.map((img, i) => (
                <Image
                  key={img.id}
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-opacity duration-700"
                  style={{ opacity: i === activeIndex ? 1 : 0 }}
                  priority={i === 0}
                />
              ))
            ) : (
              // Fallback to original image while loading
              <Image
                src="https://res.cloudinary.com/dizxlackk/image/upload/v1776342683/hero_2_j12yuj.jpg"
                alt="Lilyfield and Ejoke"
                fill
                className="object-cover"
              />
            )}

            {/* Prev / Next arrows — only show when there are multiple images */}
            {carouselImages.length > 1 && (
              <>
                <button
                  onClick={() => goTo(activeIndex - 1)}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/25 hover:bg-black/45 backdrop-blur-sm transition-colors p-2 opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => goTo(activeIndex + 1)}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/25 hover:bg-black/45 backdrop-blur-sm transition-colors p-2 opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                  {carouselImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      aria-label={`Go to photo ${i + 1}`}
                      className={`rounded-full transition-all duration-300 ${i === activeIndex
                        ? 'bg-white w-4 h-2'
                        : 'bg-white/50 w-2 h-2'
                        }`}
                    />
                  ))}
                </div>
              </>
            )}
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

      <Button onClick={() => { setStatus('trouble'); setShowSeats(false); setShowVirtual(false); document.getElementById('rsvp-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="fixed bottom-6 right-6 z-50 h-14 w-14 hover:w-[140px] rounded-full p-0 shadow-2xl bg-orange-100 hover:bg-orange-100  text-orange-600 transition-all duration-300 flex items-center justify-center overflow-hidden group">
        <HelpCircle className="w-6 h-6 shrink-0" />
        <span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:ml-2 group-hover:opacity-100 font-medium whitespace-nowrap transition-all duration-300 overflow-hidden">
          Need Help?
        </span>
      </Button>
    </section>
  );
}
