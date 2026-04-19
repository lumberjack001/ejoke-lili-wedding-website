'use client';

import { useState } from 'react';
import { Heart, CheckCircle, Gift } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';

type EnvelopeState = 'idle' | 'opening' | 'revealed' | 'thanked';

// ─── Site colour constants ────────────────────────────────────────────────────
const C = {
  body: '#f5ede0', // cream envelope body
  flap: '#e8d5b7', // slightly deeper – front of flap
  flapInside: '#f0e5cc', // lighter – inside of flap (back-face)
  innerSide: '#ddd0b5', // left / right interior triangle (deepest shade)
  innerBottom: '#e8d5b7', // bottom interior triangle
  border: '#c9a96e', // gold border / fold lines
  seal: '#bd8a3a', // wax seal gold
  paperBg: '#fffaf3', // paper card
  paperLine: '#d4b483', // paper decorative lines
  text: '#9a7a4a', // label text gold-dark
  textLight: '#b89060', // detail text gold-mid
} as const;

// Envelope SVG draw coordinates (viewBox 0 0 400 240)
const W = 400, H = 240;
const MX = W / 2;          // 200 – centre-x
const CY = 108;            // fold-centre y (slightly above mid for a realistic look)
const FLAPH = 115;         // flap div height (pixels-equivalent in percentage)

export function GiftsSection() {
  const [state, setState] = useState<EnvelopeState>('idle');

  const handleOpen = () => {
    if (state !== 'idle') return;
    setState('opening');
    setTimeout(() => setState('revealed'), 900);
  };

  const isOpen = state === 'opening' || state === 'revealed';
  const isRevealed = state === 'revealed';

  return (
    <section
      className="h-[100vh] max-h-[100vh] no-scrollbar w-full flex flex-col snap-start snap-always relative overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, var(--background), color-mix(in oklch, var(--secondary) 10%, transparent))' }}
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-0">

        {/* ── Section header ──────────────────────────────────────────────── */}
        <div className="text-center flex-shrink-0 space-y-3">
          <Reveal delay={0}>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-accent/60" />
              <Gift className="w-5 h-5 text-primary" />
              <div className="h-px w-8 bg-accent/60" />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground">
              A Gift of Love
            </h2>
          </Reveal>

          <Reveal delay={250}>
            <p className="text-muted-foreground font-light max-w-lg mx-auto leading-relaxed text-sm sm:text-base">
              Your presence at our celebration is the greatest gift of all. However, if you
              wish to bless us further, we would be deeply grateful for a monetary gift as
              we begin this new chapter together.
            </p>
          </Reveal>

          {/* Hint – only when idle */}
          <div style={{ minHeight: 28 }}>
            {state === 'idle' && (
              <Reveal delay={250}>
                <p className="text-xs sm:text-sm text-muted-foreground font-light animate-pulse">
                  Click the envelope to reveal account details ✉️
                </p>
              </Reveal>
            )}
          </div>
        </div>

        {/* ── Envelope / Thank-you area ────────────────────────────────────── */}
        <div className="flex-1 flex items-end justify-center overflow-visible">

          {state !== 'thanked' ? (

            <Reveal delay={400} className="w-full flex justify-center overflow-visible">
              {/*
                Outer wrapper: percentage-based width, anchored to the bottom.
                overflow: visible so the paper can protrude above.
              */}
              <div
                className="relative w-[95%] sm:w-[82%] lg:w-[70%]"
                style={{ maxWidth: 680, transform: 'translateY(30%)' }}
              >
                {/* ── PAPER ─────────────────────────────────────────────────── */}
                {/*
                  Hidden inside the envelope when closed (opacity 0 + bottom anchor
                  keeps it within the envelope rect).
                  On open: slides upward, bottom edge stays at ~top of envelope opening.
                */}
                <div
                  aria-hidden={!isOpen}
                  style={{
                    position: 'absolute',
                    left: '15%',
                    right: '15%',
                    // When open: "bottom: 90%" places the paper bottom at 90% up from
                    // the parent bottom (i.e. approx at the envelope top-edge).
                    bottom: isOpen ? '90%' : '32%',
                    transition: 'bottom 0.75s cubic-bezier(0.34, 1.05, 0.64, 1), opacity 0.3s ease',
                    opacity: isOpen ? 1 : 0,
                    zIndex: 12,
                    pointerEvents: isRevealed ? 'auto' : 'none',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: C.paperBg,
                      border: `1.5px solid ${C.paperLine}`,
                      // Flat bottom so paper looks like it terminates inside the envelope
                      borderRadius: '8px 8px 0 0',
                      padding: 'clamp(14px, 3vw, 22px)',
                      paddingBottom: 'clamp(26px, 5vw, 38px)',
                      boxShadow: '0 -4px 28px rgba(189,138,58,0.10)',
                      textAlign: 'center',
                    }}
                  >
                    {/* Decorative ruled lines on the paper */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14, padding: '0 6px' }}>
                      <div style={{ height: 1.5, background: C.paperLine, opacity: 0.5, borderRadius: 2 }} />
                      <div style={{ height: 1.5, background: C.paperLine, opacity: 0.28, borderRadius: 2 }} />
                    </div>

                    <p style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.text, fontWeight: 600, marginBottom: 10 }}>
                      Account Details
                    </p>

                    <p style={{ fontSize: 12, color: C.textLight, margin: '0 0 3px' }}>Bank · Opay</p>
                    <p style={{ fontSize: 'clamp(17px, 3.8vw, 24px)', fontFamily: 'serif', color: '#2c2c2c', letterSpacing: '0.1em', margin: '4px 0' }}>
                      9075254818
                    </p>
                    <p style={{ fontSize: 12, color: C.textLight, margin: '0 0 14px' }}>Account Name · EJOVWOKOGHENE UNUEFE</p>

                    <div style={{ height: 1, background: `${C.paperLine}38`, margin: '0 0 12px' }} />

                    <p style={{ fontSize: 11, color: C.textLight, fontStyle: 'italic', marginBottom: 14, lineHeight: 1.6 }}>
                      Thank you for your love and generosity 🤍
                    </p>

                    <button
                      id="gift-sent-btn"
                      onClick={(e) => { e.stopPropagation(); setState('thanked'); }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        backgroundColor: 'rgba(189,138,58,0.08)',
                        border: '1px solid rgba(189,138,58,0.35)',
                        borderRadius: 10,
                        padding: '10px 14px',
                        fontSize: 12,
                        fontWeight: 500,
                        letterSpacing: '0.04em',
                        color: C.seal,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(189,138,58,0.16)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(189,138,58,0.08)')}
                    >
                      <CheckCircle style={{ width: 15, height: 15, flexShrink: 0 }} />
                      Gift has been sent ✓
                    </button>
                  </div>
                </div>

                {/* ── ENVELOPE ──────────────────────────────────────────────── */}
                {/*
                  perspective on THIS div so CSS 3-D children work correctly.
                  The envelope scene is not interactive in itself (onClick is on the
                  inner div to avoid capturing clicks on the paper button).
                */}
                <div
                  style={{ position: 'relative', perspective: '900px', perspectiveOrigin: '50% 0%' }}
                >

                  {/* ── 1. BODY SVG ─────────────────────────────────────────── */}
                  {/*
                    Draws the static parts of the envelope AND the interior
                    fold triangles (visible only when open).
                  */}
                  <div
                    className={state === 'idle' ? 'cursor-pointer' : 'cursor-default'}
                    onClick={handleOpen}
                    role={state === 'idle' ? 'button' : undefined}
                    aria-label="Open envelope to reveal account details"
                    style={{ position: 'relative', zIndex: 3 }}
                  >
                    <svg
                      viewBox={`0 0 ${W} ${H}`}
                      style={{
                        width: '100%',
                        display: 'block',
                        filter: 'drop-shadow(0 16px 48px rgba(189,138,58,0.22)) drop-shadow(0 2px 6px rgba(189,138,58,0.1))',
                      }}
                      aria-hidden="true"
                    >
                      {/* Envelope base */}
                      <rect x="0" y="0" width={W} height={H} rx="0" ry="0" fill={C.body} />

                      {/* Interior triangles — only when open */}
                      {isOpen && (
                        <>
                          {/* Left inner panel */}
                          <polygon points={`0,0 ${MX},${CY} 0,${H}`} fill={C.innerSide} />
                          {/* Right inner panel */}
                          <polygon points={`${W},0 ${MX},${CY} ${W},${H}`} fill={C.innerSide} />
                          {/* Bottom inner panel */}
                          <polygon points={`0,${H} ${MX},${CY} ${W},${H}`} fill={C.innerBottom} />

                          {/* Fold crease lines */}
                          <line x1="0" y1="0" x2={MX} y2={CY} stroke={C.border} strokeWidth="1" opacity="0.3" />
                          <line x1={W} y1="0" x2={MX} y2={CY} stroke={C.border} strokeWidth="1" opacity="0.3" />
                          <line x1="0" y1={H} x2={MX} y2={CY} stroke={C.border} strokeWidth="1" opacity="0.3" />
                          <line x1={W} y1={H} x2={MX} y2={CY} stroke={C.border} strokeWidth="1" opacity="0.3" />
                        </>
                      )}

                      {/* Closed-state bottom fold lines */}
                      {!isOpen && (
                        <>
                          <line x1="0" y1={H} x2={MX} y2={CY} stroke={C.border} strokeWidth="1.2" opacity="0.45" />
                          <line x1={W} y1={H} x2={MX} y2={CY} stroke={C.border} strokeWidth="1.2" opacity="0.45" />
                        </>
                      )}

                      {/* Outer border — drawn last so it's always crisp */}
                      <rect x="1" y="1" width={W - 2} height={H - 2} rx="0" ry="0" fill="none" stroke={C.border} strokeWidth="2" />
                    </svg>

                    {/* ── Wax seal ─────────────────────────────────────────── */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        // Vertically: seal sits at the tip of the flap (≈ CY / H * 100 %)
                        top: `${(CY / H) * 100}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 8,
                        opacity: isOpen ? 0 : 1,
                        transition: 'opacity 0.2s ease',
                        pointerEvents: 'none',
                      }}
                    >
                      <div
                        style={{
                          width: 'clamp(44px, 9vw, 62px)',
                          height: 'clamp(44px, 9vw, 62px)',
                          borderRadius: '50%',
                          backgroundColor: C.seal,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 18px rgba(189,138,58,0.45)',
                        }}
                      >
                        <span
                          style={{
                            color: '#fff5e6',
                            fontSize: 'clamp(11px, 2.2vw, 15px)',
                            fontFamily: 'serif',
                            fontWeight: 600,
                            userSelect: 'none',
                          }}
                        >
                          L♥E
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ── 2. FLAP (3-D fold) ──────────────────────────────────── */}
                  {/*
                    Positioned over the top portion of the envelope (height ≈ FLAPH/H %).
                    transformOrigin: 'top center' – the straight top edge is the hinge.

                    Closed  → rotateX(0deg)    : triangle points DOWN (normal closed flap)
                    Open    → rotateX(-180deg) : flap folds BACK, appears above the envelope
                                                as an upward-pointing triangle (matches reference)

                    Two faces via backface-visibility:
                      Front face  – visible when closed  – down-pointing triangle (C.flap)
                      Back face   – visible when open    – inside of flap (C.flapInside)
                  */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: `${(FLAPH / H) * 100}%`,
                      transformOrigin: 'top center',
                      transform: isOpen ? 'rotateX(-180deg)' : 'rotateX(0deg)',
                      transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
                      transformStyle: 'preserve-3d',
                      zIndex: 6,
                      // no pointer events – click is handled by the body div
                      pointerEvents: state === 'idle' ? 'auto' : 'none',
                      cursor: state === 'idle' ? 'pointer' : 'default',
                    }}
                    onClick={handleOpen}
                  >
                    {/* FRONT face – shown when CLOSED */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        overflow: 'hidden',
                        borderRadius: 0,
                      }}
                    >
                      <svg
                        viewBox={`0 0 ${W} ${FLAPH}`}
                        style={{ width: '100%', height: '100%' }}
                        preserveAspectRatio="none"
                      >
                        {/* Down-pointing triangle */}
                        <path d={`M0 0 L${MX} ${FLAPH} L${W} 0 Z`} fill={C.flap} />
                        {/* Fold edge line */}
                        <path d={`M0 0 L${MX} ${FLAPH} L${W} 0`} fill="none" stroke={C.border} strokeWidth="2.5" />
                      </svg>
                    </div>

                    {/* BACK face – shown when OPEN (inside of flap, now pointing UP) */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        /* rotateX(180deg) on itself so it's the back face */
                        transform: 'rotateX(180deg)',
                        overflow: 'hidden',
                        borderRadius: 0,
                      }}
                    >
                      <svg
                        viewBox={`0 0 ${W} ${FLAPH}`}
                        style={{ width: '100%', height: '100%' }}
                        preserveAspectRatio="none"
                      >
                        {/*
                          When back-face is showing the element is flipped (180deg),
                          so we draw the triangle pointed UP here (which renders as
                          the upward folded flap behind the paper in the open state).
                        */}
                        <path d={`M0 ${FLAPH} L${MX} 0 L${W} ${FLAPH} Z`} fill={C.flapInside} />
                        <path d={`M0 ${FLAPH} L${MX} 0 L${W} ${FLAPH}`} fill="none" stroke={C.border} strokeWidth="2" />
                      </svg>
                    </div>
                  </div>

                </div>
                {/* end envelope scene */}

              </div>
            </Reveal>

          ) : (

            /* ── Thank-you state ──────────────────────────────────────────── */
            <Reveal delay={250}>
              <div className="w-full flex items-center justify-center pb-16">
                <div className="text-center space-y-5 animate-fade-in px-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Heart className="w-9 h-9 text-primary fill-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-serif text-foreground">
                      Thank You, From the Bottom of Our Hearts
                    </h3>
                    <p className="text-muted-foreground font-light max-w-sm mx-auto leading-relaxed text-sm sm:text-base">
                      Your generosity means the world to us. We are so grateful to have you
                      as part of our journey. See you on the big day! 💛
                    </p>
                  </div>
                  <button
                    id="gift-reset-btn"
                    onClick={() => setState('idle')}
                    className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
                  >
                    ← Go back
                  </button>
                </div>
              </div>
            </Reveal>
          )}

        </div>
      </div>
    </section>
  );
}
