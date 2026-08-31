import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

// ---------------------------------------------------------------------------
// Image assets
// ---------------------------------------------------------------------------

const PORTAL_BG =
  'https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779707217/image_1_vdzwae.png'
const CURTAIN_LEFT =
  'https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779706559/curtain_left_znkmva.png'
const CURTAIN_RIGHT =
  'https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779706564/curtain_right_paeyym.png'
const WORLD_BG =
  'https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779706392/image_2_gkcdlx.png'
const BOTTOM_CLOUDS =
  'https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779706555/bottom_clouds_xskut6.png'

const CARD_IMAGES = [
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260525_160507_2ccbb4eb-1469-484f-af25-59168ad9a233.png&w=1280&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260525_160644_072a7f68-a101-4ded-a332-7d37707dbdd1.png&w=1280&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260525_160706_1c153d04-0dfb-4ac9-a4ef-e74f301c329c.png&w=1280&q=85',
]

// ---------------------------------------------------------------------------
// Scene 2 card data
// ---------------------------------------------------------------------------

interface ArcCard {
  title: string
  desc: string
  color: string
}

const ARC_CARDS: ArcCard[] = [
  { title: 'Hidden Realms', desc: 'Luminous sanctuaries unseen by wandering eyes', color: '#f3cdd6' },
  { title: 'Wild Solitudes', desc: 'Dissolve into untamed horizons and deep calm', color: '#dcedc2' },
  { title: 'Silent Havens', desc: 'Remote escapes far beyond ordinary reach', color: '#c3e3f4' },
  { title: 'Bespoke Quests', desc: 'Journeys shaped around your vision and soul', color: '#f0e4c0' },
  { title: 'Vivid Drifts', desc: 'Surreal passages through breathtaking terrain', color: '#dcd2f2' },
  { title: 'Mystic Crests', desc: 'Timeless ridgelines wrapped in cloud and myth', color: '#f3cdd6' },
  { title: 'Deep Currents', desc: 'Glowing depths alive with uncharted wonder', color: '#c3e3f4' },
  { title: 'Gilded Dusk', desc: 'Amber horizons that stretch past all reason', color: '#f0e4c0' },
  { title: 'Glassy Tides', desc: 'Calm waters holding skies of pure stillness', color: '#dcedc2' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val))

// Mouse-parallax magnitudes (px of drift per layer)
const MAG = { world: 6, clouds: 9, portal: 7, curtainL: 14, curtainR: 14 }
const MOUSE_SMOOTH_SPEED = 0.07

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return isMobile
}

// ---------------------------------------------------------------------------
// Small shared pieces
// ---------------------------------------------------------------------------

function StarLogo() {
  return (
    <svg width={28} height={28} viewBox="0 0 28 28" fill="none" aria-label="Reverie">
      <path
        d="M14 2l2.09 6.42H23l-5.45 3.96 2.09 6.42L14 14.84l-5.64 4.06 2.09-6.42L4.96 8.42h6.95L14 2z"
        fill="white"
        opacity={0.9}
      />
      <circle cx={14} cy={24} r={1.5} fill="white" opacity={0.6} />
      <circle cx={6} cy={6} r={1} fill="white" opacity={0.4} />
      <circle cx={22} cy={6} r={1} fill="white" opacity={0.4} />
    </svg>
  )
}

function ScrollChevron() {
  return (
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: '50%',
        border: '1.5px solid rgba(255,255,255,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'bobUp 1.8s ease-in-out infinite',
      }}
    >
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
        <path
          d="M3 5.5l4 4 4-4"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

function PlayCircle({ size }: { size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.38} height={size * 0.38} viewBox="0 0 10 10">
        <path d="M3 1.6v6.8l5.4-3.4L3 1.6z" fill="#1a0f14" />
      </svg>
    </div>
  )
}

// Photo card used across the Scene 1 layouts: image background, bottom
// gradient, masked backdrop-blur strip and a small content row.
function PhotoCard({
  img,
  size,
  radius,
  shadow,
  contentInset,
  children,
}: {
  img: string
  size: number
  radius: number
  shadow: string
  contentInset: number
  children: ReactNode
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: shadow,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '60%',
          background:
            'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.32) 40%, rgba(0,0,0,0.12) 72%, transparent 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '44%',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          maskImage: 'linear-gradient(to top, black 35%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 35%, transparent 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: contentInset,
          right: contentInset,
          bottom: contentInset,
          display: 'flex',
          alignItems: 'center',
          gap: 9,
        }}
      >
        {children}
      </div>
    </div>
  )
}

function PatronCount({ numberSize, labelSize }: { numberSize: number; labelSize: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <span
        style={{
          fontFamily: "'Viaoda Libre', serif",
          fontSize: numberSize,
          color: '#fff',
          lineHeight: 1,
        }}
      >
        32
      </span>
      <span style={{ fontSize: labelSize, color: 'rgba(255,255,255,0.85)', lineHeight: 1.3 }}>
        World Patrons
      </span>
    </div>
  )
}

function SliderDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            width: i === 0 ? 28 : 14,
            height: 4,
            borderRadius: 2,
            background: i === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
          }}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Arc card slider (Scene 2)
// ---------------------------------------------------------------------------

function ArcCardSlider({
  cards,
  rotationOffset,
  isMobile,
}: {
  cards: ArcCard[]
  rotationOffset: number
  isMobile: boolean
}) {
  const cardSpacingDeg = isMobile ? 12 : 9
  const centerIndex = Math.floor(cards.length / 2)
  const arcRadius = isMobile ? 700 : 1100
  const cardW = isMobile ? 160 : 220
  const cardH = isMobile ? 175 : 230
  const sliderH = isMobile ? 260 : 360
  const halfW = cardW / 2
  const bottomLift = isMobile ? 140 : 200

  return (
    <div style={{ position: 'relative', width: '100%', height: sliderH }}>
      {cards.map((card, i) => {
        const baseDeg = (i - centerIndex) * cardSpacingDeg
        const deg = baseDeg - rotationOffset + centerIndex * cardSpacingDeg
        const rad = (deg * Math.PI) / 180
        const x = Math.sin(rad) * arcRadius
        const y = arcRadius - Math.cos(rad) * arcRadius
        return (
          <div
            key={card.title}
            style={{
              position: 'absolute',
              bottom: -y + bottomLift,
              left: `calc(50% + ${x - halfW}px)`,
              width: cardW,
              height: cardH,
              transform: `rotate(${deg}deg)`,
              transformOrigin: `${halfW}px ${arcRadius}px`,
              background: card.color,
              borderRadius: isMobile ? 18 : 26,
              boxShadow: '0 8px 40px rgba(80,40,60,0.18)',
              padding: isMobile ? 16 : 22,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: isMobile ? 12 : 14,
                right: isMobile ? 12 : 14,
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: '1.5px solid rgba(80,50,60,0.3)',
                color: 'rgba(80,50,60,0.6)',
                fontFamily: "'Imprima', sans-serif",
                fontSize: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>
            <div
              style={{
                fontFamily: "'Viaoda Libre', serif",
                fontSize: isMobile ? 22 : 30,
                color: '#3a2530',
                lineHeight: 1.05,
              }}
            >
              {card.title}
            </div>
            <div
              style={{
                fontFamily: "'Imprima', sans-serif",
                fontSize: isMobile ? 12 : 15,
                color: 'rgba(58,37,48,0.65)',
                lineHeight: 1.4,
                marginTop: 6,
              }}
            >
              {card.desc}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

const navLinkStyle: CSSProperties = {
  fontFamily: "'Imprima', sans-serif",
  fontSize: 12,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#fff',
  opacity: 0.9,
  textDecoration: 'none',
}

const headingFont: CSSProperties = { fontFamily: "'Viaoda Libre', serif", fontWeight: 400 }

const SUBTEXT =
  'Crafting boundless digital worlds where the edge between AI, vision, and living myth dissolves.'

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const cloudsRef = useRef<HTMLDivElement>(null)
  const portalRef = useRef<HTMLDivElement>(null)
  const curtainLRef = useRef<HTMLDivElement>(null)
  const curtainRRef = useRef<HTMLDivElement>(null)

  const progressRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const smoothMouseRef = useRef({ x: 0, y: 0 })
  const curtainsOpenRef = useRef(false)

  const [progress, setProgress] = useState(0)
  const [uiVisible, setUiVisible] = useState(false)
  const [entranceDone, setEntranceDone] = useState(false)
  const isMobile = useIsMobile()

  // Scroll progress across the 480vh container, clamped 0-1.
  useEffect(() => {
    const onScroll = () => {
      const container = containerRef.current
      if (!container) return
      const max = container.scrollHeight - window.innerHeight
      const p = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0
      progressRef.current = p
      setProgress(p)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Raw mouse position, normalized to -1..1 from the viewport center.
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Entrance sequence: curtains part, then the UI fades in, then the curtain
  // transition is dropped so parallax becomes instant.
  useEffect(() => {
    const t1 = window.setTimeout(() => {
      curtainsOpenRef.current = true
    }, 100)
    const t2 = window.setTimeout(() => setUiVisible(true), 600)
    const t3 = window.setTimeout(() => setEntranceDone(true), 2200)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [])

  // rAF loop: smooth the mouse and drive every parallax layer imperatively.
  // React never writes `transform`/`opacity` on these layers, so the two
  // update paths cannot clobber each other.
  useEffect(() => {
    let raf = 0
    const tick = () => {
      const s = smoothMouseRef.current
      const m = mouseRef.current
      s.x = lerp(s.x, m.x, MOUSE_SMOOTH_SPEED)
      s.y = lerp(s.y, m.y, MOUSE_SMOOTH_SPEED)

      const p = progressRef.current
      const ep = easeInOut(p)

      if (worldRef.current) {
        worldRef.current.style.transform = `translate3d(${-s.x * MAG.world}px, ${
          -s.y * MAG.world
        }px, 0) scale(${lerp(1, 1.18, ep)})`
      }
      if (cloudsRef.current) {
        cloudsRef.current.style.transform = `translate3d(${-s.x * MAG.clouds}px, ${
          -s.y * MAG.clouds * 0.4
        }px, 0) scale(${lerp(1, 1.4, ep)})`
        cloudsRef.current.style.opacity = String(lerp(0.7, 1, clamp(p / 0.05, 0, 1)))
      }
      if (portalRef.current) {
        portalRef.current.style.transform = `translate3d(${-s.x * MAG.portal}px, ${
          -s.y * MAG.portal
        }px, 0) scale(${lerp(1, 7.5, ep)})`
        portalRef.current.style.opacity = String(1 - clamp((p - 0.65) / 0.2, 0, 1))
      }

      const open = curtainsOpenRef.current
      const scrollShift = lerp(0, 150, ep)
      if (curtainLRef.current) {
        const base = open ? -62 : 0
        curtainLRef.current.style.transform = `translateX(calc(${base - scrollShift}% + ${
          -s.x * MAG.curtainL
        }px)) translateY(${-s.y * MAG.curtainL * 0.3}px) scale(${lerp(1, 1.3, ep)})`
      }
      if (curtainRRef.current) {
        const base = open ? 62 : 0
        curtainRRef.current.style.transform = `translateX(calc(${base + scrollShift}% + ${
          -s.x * MAG.curtainR
        }px)) translateY(${-s.y * MAG.curtainR * 0.3}px) scale(${lerp(1, 1.3, ep)})`
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const scene1Opacity = clamp(1 - progress / 0.22, 0, 1)
  const scene2Opacity = clamp((progress - 0.68) / 0.16, 0, 1)
  const arcSweepDeg = (ARC_CARDS.length - 1) * 10
  const rotationOffset = lerp(0, arcSweepDeg, clamp((progress - 0.7) / 0.3, 0, 1))

  const curtainTransition = entranceDone
    ? 'none'
    : 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)'

  // Fade-in helper for the entrance stagger. `base` keeps a positioning
  // transform (e.g. the -50% centering) intact through the animation.
  const fadeIn = (delay: number, base = ''): CSSProperties => ({
    opacity: uiVisible ? 1 : 0,
    transform: uiVisible ? `${base} translateY(0)`.trim() : `${base} translateY(24px)`.trim(),
    transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
  })

  return (
    <div ref={containerRef} style={{ height: '480vh', position: 'relative' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: '#0a0608',
        }}
      >
        {/* Layer 1: world background */}
        <div
          ref={worldRef}
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: '50% 50%',
            pointerEvents: 'none',
          }}
        >
          <img
            src={WORLD_BG}
            alt=""
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Layer 2: bottom clouds */}
        <div
          ref={cloudsRef}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            transformOrigin: '50% 100%',
            opacity: 0.7,
            pointerEvents: 'none',
          }}
        >
          <img
            src={BOTTOM_CLOUDS}
            alt=""
            draggable={false}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Layer 2.5: arc card slider */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: isMobile ? 60 : 80,
            zIndex: 9,
            opacity: scene2Opacity,
            pointerEvents: 'none',
          }}
        >
          <ArcCardSlider cards={ARC_CARDS} rotationOffset={rotationOffset} isMobile={isMobile} />
        </div>

        {/* Layer 3: portal frame */}
        <div
          ref={portalRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 15,
            transformOrigin: '52% 38%',
            pointerEvents: 'none',
          }}
        >
          <img
            src={PORTAL_BG}
            alt=""
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Layer 3.5: bottom fade */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            zIndex: 16,
            background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Layer 4L: curtain left */}
        <div
          ref={curtainLRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 16,
            transformOrigin: 'left center',
            transition: curtainTransition,
            pointerEvents: 'none',
          }}
        >
          <img
            src={CURTAIN_LEFT}
            alt=""
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'right center',
            }}
          />
        </div>

        {/* Layer 4R: curtain right */}
        <div
          ref={curtainRRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 16,
            transformOrigin: 'right center',
            transition: curtainTransition,
            pointerEvents: 'none',
          }}
        >
          <img
            src={CURTAIN_RIGHT}
            alt=""
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'left center',
            }}
          />
        </div>

        {/* Top fade gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '42vh',
            zIndex: 45,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Scene 1 UI */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            opacity: scene1Opacity,
            pointerEvents: scene1Opacity <= 0.02 ? 'none' : undefined,
          }}
        >
          {/* Mobile layout */}
          <div
            className="flex md:hidden"
            style={{
              height: '100%',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 24,
              padding: '80px 24px 100px',
              ...fadeIn(0.3),
            }}
          >
            <h1 style={{ ...headingFont, color: '#3b1a0a' }}>
              <span
                className="tracking-widest"
                style={{ display: 'block', fontSize: 'clamp(26px, 7vw, 42px)' }}
              >
                FALL <span style={{ color: '#6b2e0e', fontSize: '0.8em' }}>›</span>{' '}
                <span style={{ fontStyle: 'italic' }}>INTO</span>
              </span>
              <span
                className="tracking-tight leading-none"
                style={{ display: 'block', fontSize: 'clamp(52px, 16vw, 80px)' }}
              >
                REVERIE
              </span>
            </h1>
            <p className="leading-relaxed" style={{ fontSize: 15, color: '#5c2d0e', maxWidth: 280 }}>
              {SUBTEXT}
            </p>
            <PhotoCard
              img={CARD_IMAGES[0]}
              size={140}
              radius={22}
              shadow="0 8px 32px rgba(0,0,0,0.5)"
              contentInset={10}
            >
              <PlayCircle size={26} />
              <span style={{ fontSize: 13, color: '#fff' }}>View Reel</span>
            </PhotoCard>
          </div>

          {/* Tablet layout */}
          <div
            className="hidden md:flex xl:hidden"
            style={{
              height: '100%',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 28,
              padding: '80px 32px 96px',
              ...fadeIn(0.3),
            }}
          >
            <h1 style={{ ...headingFont, color: '#3b1a0a' }}>
              <span
                className="tracking-widest"
                style={{ display: 'block', fontSize: 'clamp(28px, 5vw, 44px)' }}
              >
                FALL <span style={{ color: '#6b2e0e', fontSize: '0.8em' }}>›</span>{' '}
                <span style={{ fontStyle: 'italic' }}>INTO</span>
              </span>
              <span
                className="tracking-tight leading-none"
                style={{ display: 'block', fontSize: 'clamp(60px, 12vw, 86px)' }}
              >
                REVERIE
              </span>
            </h1>
            <p className="leading-relaxed" style={{ fontSize: 16, color: '#5c2d0e', maxWidth: 400 }}>
              {SUBTEXT}
            </p>
            <div className="flex gap-3.5">
              <PhotoCard
                img={CARD_IMAGES[0]}
                size={140}
                radius={22}
                shadow="0 8px 32px rgba(0,0,0,0.5)"
                contentInset={10}
              >
                <PlayCircle size={26} />
                <span style={{ fontSize: 13, color: '#fff' }}>View Reel</span>
              </PhotoCard>
              <PhotoCard
                img={CARD_IMAGES[1]}
                size={140}
                radius={22}
                shadow="0 8px 32px rgba(0,0,0,0.5)"
                contentInset={10}
              >
                <PatronCount numberSize={28} labelSize={12} />
              </PhotoCard>
              <PhotoCard
                img={CARD_IMAGES[2]}
                size={140}
                radius={22}
                shadow="0 8px 32px rgba(0,0,0,0.5)"
                contentInset={10}
              >
                <PlayCircle size={26} />
                <span style={{ fontSize: 13, color: '#fff' }}>View Reel</span>
              </PhotoCard>
            </div>
          </div>

          {/* Desktop heading block */}
          <div
            className="hidden xl:block"
            style={{
              position: 'absolute',
              top: '46%',
              left: 60,
              maxWidth: 440,
              ...fadeIn(0.3, 'translateY(-50%)'),
            }}
          >
            <h1
              style={{
                ...headingFont,
                color: '#fff',
                textShadow: '0 2px 24px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.9)',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontSize: 'clamp(32px, 4.5vw, 54px)',
                  lineHeight: 1.1,
                  letterSpacing: '0.04em',
                }}
              >
                FALL <span style={{ color: 'rgba(255,220,180,0.7)', fontSize: '0.8em' }}>›</span>{' '}
                <span style={{ fontStyle: 'italic' }}>INTO</span>
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: 'clamp(50px, 7.5vw, 88px)',
                  lineHeight: 0.9,
                  letterSpacing: '-0.02em',
                }}
              >
                REVERIE
              </span>
            </h1>
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.7,
                color: 'rgba(255,245,235,0.88)',
                maxWidth: 300,
                marginTop: 26,
                textShadow: '0 1px 12px rgba(0,0,0,0.8)',
              }}
            >
              {SUBTEXT}
            </p>
          </div>

          {/* Desktop cards block */}
          <div
            className="hidden xl:flex"
            style={{
              position: 'absolute',
              right: 40,
              top: '50%',
              gap: 12,
              ...fadeIn(0.55, 'translateY(-50%)'),
            }}
          >
            <PhotoCard
              img={CARD_IMAGES[0]}
              size={158}
              radius={28}
              shadow="0 8px 32px rgba(0,0,0,0.45)"
              contentInset={12}
            >
              <PlayCircle size={30} />
              <span style={{ fontSize: 18, color: '#fff' }}>View Reel</span>
            </PhotoCard>
            <PhotoCard
              img={CARD_IMAGES[1]}
              size={158}
              radius={28}
              shadow="0 8px 32px rgba(0,0,0,0.45)"
              contentInset={12}
            >
              <PatronCount numberSize={36} labelSize={18} />
            </PhotoCard>
            <PhotoCard
              img={CARD_IMAGES[2]}
              size={158}
              radius={28}
              shadow="0 8px 32px rgba(0,0,0,0.45)"
              contentInset={12}
            >
              <PlayCircle size={30} />
              <span style={{ fontSize: 18, color: '#fff' }}>View Reel</span>
            </PhotoCard>
          </div>

          {/* Slider dots */}
          <div
            className="absolute bottom-[28px] left-0 right-0 flex justify-center xl:bottom-[40px] xl:left-[60px] xl:right-auto xl:justify-start"
          >
            <div style={fadeIn(0.8)}>
              <SliderDots />
            </div>
          </div>

          {/* Scroll cue (desktop only) */}
          <div
            className="hidden xl:flex"
            style={{
              position: 'absolute',
              bottom: 36,
              left: 0,
              right: 0,
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              ...fadeIn(0.9),
            }}
          >
            <span
              style={{
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              Descend
            </span>
            <ScrollChevron />
          </div>
        </div>

        {/* Scene 2 UI */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 46,
            opacity: scene2Opacity,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div className="mt-[8vh] md:mt-[12vh]" style={{ padding: '0 24px' }}>
            <h2
              style={{
                ...headingFont,
                color: '#fff',
                fontSize: isMobile ? 'clamp(28px, 8vw, 44px)' : 'clamp(38px, 6.5vw, 78px)',
                letterSpacing: '0.03em',
                lineHeight: 1.05,
                textShadow: '0 2px 20px rgba(0,0,0,0.4)',
              }}
            >
              FORGE BEYOND THE REAL
            </h2>
            <p
              style={{
                fontSize: isMobile ? 14 : 20,
                lineHeight: 1.6,
                letterSpacing: '-0.01em',
                maxWidth: isMobile ? 260 : 480,
                color: 'rgba(255,255,255,0.82)',
                margin: '18px auto 0',
              }}
            >
              Singular voyages to astonishing destinations, shaped for those who seek beauty beyond
              the ordinary and the known.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 }}>
          {/* Mobile */}
          <div
            className="flex md:hidden"
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '18px 20px',
            }}
          >
            <a href="#" style={{ ...navLinkStyle, fontSize: 11 }}>
              Explore
            </a>
            <StarLogo />
            <a href="#" style={{ ...navLinkStyle, fontSize: 11 }}>
              Connect
            </a>
          </div>
          {/* Desktop */}
          <div
            className="hidden md:flex"
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '22px 48px',
            }}
          >
            <div style={{ display: 'flex', gap: 36 }}>
              {['Worlds', 'Atelier', 'Immersions'].map((label) => (
                <a key={label} href="#" style={navLinkStyle}>
                  {label}
                </a>
              ))}
            </div>
            <StarLogo />
            <div style={{ display: 'flex', gap: 36 }}>
              {['Craft', 'Codex', 'Connect'].map((label) => (
                <a key={label} href="#" style={navLinkStyle}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}
