/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { 
  Palette, 
  ChevronRight, 
  MapPin, 
  Home, 
  Bed, 
  ChefHat, 
  Wind, 
  Waves, 
  Car, 
  Trees,
  Download,
  Phone,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  ArrowUp,
  Maximize,
  Bath,
  Calendar,
  Layers,
  Play,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

gsap.registerPlugin(ScrollTrigger);

type Theme = 'purple-blue' | 'cyan-teal' | 'midnight-gold';

const THEMES = {
  'purple-blue': {
    primary: '#050505',
    secondary: '#0f0c29',
    accent: '#7c3aed',
    text: '#ffffff',
    glow: 'rgba(124, 58, 237, 0.4)',
    gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    textGradient: 'from-violet-200 via-purple-400 to-indigo-600'
  },
  'cyan-teal': {
    primary: '#020617',
    secondary: '#004d40',
    accent: '#06b6d4',
    text: '#f8fafc',
    glow: 'rgba(6, 182, 212, 0.4)',
    gradient: 'linear-gradient(135deg, #020617 0%, #004d40 50%, #00796b 100%)',
    textGradient: 'from-cyan-200 via-teal-400 to-emerald-600'
  },
  'midnight-gold': {
    primary: '#0a0a0a',
    secondary: '#1a1a1a',
    accent: '#fbbf24',
    text: '#fafaf9',
    glow: 'rgba(251, 191, 36, 0.4)',
    gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #262626 100%)',
    textGradient: 'from-amber-200 via-yellow-400 to-amber-600'
  }
};

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('reallist-theme');
    return (saved as Theme) || 'midnight-gold';
  });
  const [loading, setLoading] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // Theme Persistence & Application
  useLayoutEffect(() => {
    const root = document.documentElement;
    const currentTheme = THEMES[theme];
    
    // Apply theme attribute for non-animated CSS selectors
    root.setAttribute('data-theme', theme);
    localStorage.setItem('reallist-theme', theme);
    
    // 1. Animate the background layers for the complex gradients
    const tl = gsap.timeline({ overwrite: 'auto' });
    
    tl.to('.theme-bg-layer', {
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut'
    }, 0);
    
    tl.to(`.theme-bg-${theme}`, {
      opacity: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 0);

    // 2. Update ALL CSS variables via GSAP to ensure smooth interpolation
    tl.to([root, 'body'], {
      '--bg-primary': currentTheme.primary,
      '--bg-secondary': currentTheme.secondary,
      '--accent': currentTheme.accent,
      '--text-primary': currentTheme.text,
      '--glow-color': currentTheme.glow,
      duration: 1,
      ease: 'power2.inOut'
    }, 0);

    // Refresh ScrollTrigger to ensure pinned sections are correctly positioned
    // This is critical for the 2nd section (journey-section) which uses pinning.
    // We use a small delay to ensure the DOM has settled after theme changes.
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, [theme]);

  // Custom Cursor Logic
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
      });
      gsap.to(followerRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
      });
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  // Loader Animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    if (loading) return;

    // --- 1. INTRO SCENE ---
    gsap.from('.hero-title', {
      y: 100,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out',
      delay: 0.5,
    });

    gsap.to('.hero-bg', {
      scale: 1.2,
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // --- 2. JOURNEY START (PINNED) ---
    const journeyTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.journey-section',
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    journeyTl
      .to('.house-exterior', { scale: 2, duration: 1 })
      .from('.door-container', { opacity: 0, scale: 0.5, duration: 0.5 }, '-=0.5')
      .to('.door-left', { rotationY: -90, transformOrigin: 'left', duration: 1 })
      .to('.door-right', { rotationY: 90, transformOrigin: 'right', duration: 1 }, '<')
      .to('.journey-overlay', { opacity: 1, duration: 0.5 });

    // --- 3. INTERIOR TRANSITION ---
    gsap.to('.interior-img', {
      clipPath: 'circle(150% at 50% 50%)',
      scrollTrigger: {
        trigger: '.interior-section',
        start: 'top center',
        end: 'bottom center',
        scrub: true,
      },
    });

    // --- 4. ROOM EXPLORATION ---
    const rooms = gsap.utils.toArray('.room-slide');
    rooms.forEach((room: any, i) => {
      gsap.from(room.querySelector('.room-content'), {
        x: i % 2 === 0 ? -100 : 100,
        opacity: 0,
        scrollTrigger: {
          trigger: room,
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
        },
      });
    });

    // --- 6. HORIZONTAL GALLERY ---
    const galleryItems = gsap.utils.toArray('.gallery-item');
    gsap.to(galleryItems, {
      xPercent: -100 * (galleryItems.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: '.horizontal-gallery',
        pin: true,
        scrub: 1,
        snap: 1 / (galleryItems.length - 1),
        end: () => '+=' + (document.querySelector('.horizontal-gallery') as HTMLElement).offsetWidth,
      },
    });

    // --- 7. FEATURE HIGHLIGHTS ---
    gsap.from('.feature-icon', {
      scale: 0,
      opacity: 0,
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.features-section',
        start: 'top 70%',
      },
    });

    // --- 8. LOCATION EXPERIENCE ---
    gsap.to('.location-parallax', {
      y: -200,
      scrollTrigger: {
        trigger: '.location-section',
        scrub: true,
      },
    });

  }, { scope: containerRef, dependencies: [loading] });

  if (loading) {
    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#050505]">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-2 border-reallist-accent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-reallist-accent font-bold tracking-widest uppercase text-xs">
            RealList
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden">
      {/* Global Background Layers */}
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#050505] overflow-hidden">
        <div 
          className={cn("theme-bg-layer theme-bg-purple-blue absolute inset-0 will-change-opacity", theme === 'purple-blue' ? "opacity-100" : "opacity-0")}
          style={{ background: THEMES['purple-blue'].gradient }}
        />
        <div 
          className={cn("theme-bg-layer theme-bg-cyan-teal absolute inset-0 will-change-opacity", theme === 'cyan-teal' ? "opacity-100" : "opacity-0")}
          style={{ background: THEMES['cyan-teal'].gradient }}
        />
        <div 
          className={cn("theme-bg-layer theme-bg-midnight-gold absolute inset-0 will-change-opacity", theme === 'midnight-gold' ? "opacity-100" : "opacity-0")}
          style={{ background: THEMES['midnight-gold'].gradient }}
        />
        {/* Subtle Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url(https://grainy-gradients.vercel.app/noise.svg)]" />
      </div>

      {/* Custom Cursor */}
      <div ref={cursorRef} className="custom-cursor hidden md:block" />
      <div ref={followerRef} className="custom-cursor-follower hidden md:block" />

      {/* Header / Theme Switcher */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
        <div className="text-2xl font-bold tracking-tighter text-reallist-accent">REALLIST</div>
        <div className="flex items-center gap-6 glass px-6 py-3 rounded-full border border-white/10 shadow-2xl">
          <button 
            onClick={() => setTheme('purple-blue')}
            className={cn("h-8 w-8 rounded-full bg-violet-600 border-2 transition-all hover:scale-125 active:scale-95", theme === 'purple-blue' ? "border-white scale-110 shadow-[0_0_15px_rgba(124,58,237,0.5)]" : "border-transparent opacity-50")}
            aria-label="Purple Theme"
          />
          <button 
            onClick={() => setTheme('cyan-teal')}
            className={cn("h-8 w-8 rounded-full bg-cyan-500 border-2 transition-all hover:scale-125 active:scale-95", theme === 'cyan-teal' ? "border-white scale-110 shadow-[0_0_15px_rgba(6,182,212,0.5)]" : "border-transparent opacity-50")}
            aria-label="Cyan Theme"
          />
          <button 
            onClick={() => setTheme('midnight-gold')}
            className={cn("h-8 w-8 rounded-full bg-[#fbbf24] border-2 transition-all hover:scale-125 active:scale-95", theme === 'midnight-gold' ? "border-white scale-110 shadow-[0_0_15px_rgba(251,191,36,0.5)]" : "border-transparent opacity-50")}
            aria-label="Gold Theme"
          />
          <div className="h-6 w-px bg-white/10 mx-1" />
          <Palette className="h-5 w-5 text-white/70" />
        </div>
      </header>

      {/* 1. INTRO SCENE */}
      <section className="hero-section relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div 
          className="hero-bg absolute inset-0 bg-cover bg-center z-0 brightness-50"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000)' }}
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="hero-title text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none">
            Step Into Your <br />
            <span className={cn("text-transparent bg-clip-text bg-gradient-to-r", THEMES[theme].textGradient)}>Dream Property</span>
          </h1>
          <p className="mt-8 text-lg text-white/70 max-w-xl mx-auto font-light tracking-wide">
            Experience real estate like never before. A cinematic journey through luxury and comfort.
          </p>
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="h-12 w-px bg-gradient-to-b from-white/50 to-transparent animate-bounce" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* 2. JOURNEY START (PINNED) */}
      <section className="journey-section relative h-screen w-full overflow-hidden flex items-center justify-center bg-transparent z-10 will-change-transform">
        <div className="house-exterior absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000)' }}
        />
        <div className="door-container relative z-10 w-64 h-96 flex">
          <div className="door-left w-1/2 h-full bg-stone-800 border-r border-stone-700 shadow-2xl" />
          <div className="door-right w-1/2 h-full bg-stone-800 border-l border-stone-700 shadow-2xl" />
        </div>
        <div className="journey-overlay absolute inset-0 bg-black/80 opacity-0 z-20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Welcome Home</h2>
            <p className="text-white/60">The journey begins inside.</p>
          </div>
        </div>
      </section>

      {/* 3. INTERIOR TRANSITION */}
      <section className="interior-section relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000)' }}
        />
        <div 
          className="interior-img absolute inset-0 bg-cover bg-center z-10"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000)',
            clipPath: 'circle(0% at 50% 50%)'
          }}
        />
        <div className="relative z-20 glass p-8 rounded-2xl max-w-md glow-edge">
          <div className="flex items-center gap-2 text-reallist-accent mb-2">
            <MapPin className="h-4 w-4" />
            <span className="text-xs uppercase tracking-widest">Beverly Hills, CA</span>
          </div>
          <h3 className="text-3xl font-bold text-reallist-accent mb-4">The Grand Living Hall</h3>
          <p className="text-white/70 mb-6 font-light">
            Spacious, airy, and filled with natural light. Designed for those who appreciate the finer things.
          </p>
          <div className="text-4xl font-black text-reallist-accent">$12,500,000</div>
        </div>
      </section>

      {/* 3.5 CINEMATIC VIDEO TOUR */}
      <section className="video-tour-section relative py-32 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 mb-16">
            <h2 className="text-sm uppercase tracking-[0.4em] text-reallist-accent font-bold">Immersive Experience</h2>
            <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight">
              A Cinematic <br /> <span className="text-reallist-accent">Journey</span>
            </h3>
            <p className="text-white/50 text-lg font-light max-w-2xl leading-relaxed">
              Experience the property like never before. Our cinematic tour takes you through every corner of this architectural masterpiece, highlighting the seamless blend of luxury and nature.
            </p>
          </div>

          <div 
            className="relative aspect-video w-full rounded-3xl overflow-hidden group cursor-pointer shadow-2xl"
            onClick={() => setIsVideoModalOpen(true)}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000)' }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-reallist-accent flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.6)] group-hover:scale-110 transition-transform duration-500">
                <Play className="h-10 w-10 text-black fill-black" />
              </div>
            </div>
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
              <div className="glass px-6 py-3 rounded-xl border border-white/10">
                <span className="text-xs uppercase tracking-widest text-white/60">Duration</span>
                <p className="text-xl font-bold text-white">03:45</p>
              </div>
              <div className="glass px-6 py-3 rounded-xl border border-white/10">
                <span className="text-xs uppercase tracking-widest text-white/60">Resolution</span>
                <p className="text-xl font-bold text-white">4K HDR</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO MODAL */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl">
          <button 
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <X className="h-10 w-10" />
          </button>
          <div className="w-full max-w-6xl aspect-video px-4">
            <iframe 
              className="w-full h-full rounded-2xl shadow-2xl"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
              title="Property Video Tour"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* 4. ROOM EXPLORATION */}
      <section className="rooms-section relative pt-0 pb-32 bg-transparent overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-10 grayscale brightness-50"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&q=80&w=2000)' }}
        />
        <div className="relative z-10">
          {/* Quick Specs Bar - Seamless Integration */}
          <div className="sticky top-24 z-30 flex justify-center px-4 mb-8">
            <div className="glass px-8 py-4 rounded-full border border-white/10 flex items-center gap-8 shadow-2xl glow-edge">
              <div className="flex items-center gap-2">
                <Maximize className="h-4 w-4 text-reallist-accent" />
                <span className="text-xs font-bold text-white">12,450 <span className="text-white/40 font-light">SQ FT</span></span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-reallist-accent" />
                <span className="text-xs font-bold text-white">7 <span className="text-white/40 font-light">BEDS</span></span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <Bath className="h-4 w-4 text-reallist-accent" />
                <span className="text-xs font-bold text-white">9.5 <span className="text-white/40 font-light">BATHS</span></span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-reallist-accent" />
                <span className="text-xs font-bold text-white">2024 <span className="text-white/40 font-light">BUILT</span></span>
              </div>
            </div>
          </div>

          <div className="room-slide min-h-[80vh] py-24 flex flex-col md:flex-row items-center justify-center gap-12 px-8 overflow-hidden">
          <div className="room-content w-full md:w-1/2 space-y-6">
            <Bed className="h-12 w-12 text-reallist-accent" />
            <h2 className="text-5xl font-bold text-reallist-accent">Master Suite</h2>
            <p className="text-xl text-white/70 font-light leading-relaxed">
              A sanctuary of peace. Featuring panoramic views and a private terrace for your morning coffee.
            </p>
          </div>
          <div className="w-full md:w-1/2 h-[60vh] rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="public/images.jpg" 
              className="w-full h-full object-cover"
              alt="Bedroom"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="room-slide min-h-[80vh] py-24 flex flex-col md:flex-row-reverse items-center justify-center gap-12 px-8 overflow-hidden">
          <div className="room-content w-full md:w-1/2 space-y-6">
            <ChefHat className="h-12 w-12 text-reallist-accent" />
            <h2 className="text-5xl font-bold text-reallist-accent">Gourmet Kitchen</h2>
            <p className="text-xl text-white/70 font-light leading-relaxed">
              Equipped with professional-grade appliances and a massive marble island for entertaining.
            </p>
          </div>
          <div className="w-full md:w-1/2 h-[60vh] rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="public/images (1).jpg" 
              className="w-full h-full object-cover"
              alt="Kitchen"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </section>

      {/* 6. HORIZONTAL PROPERTY GALLERY */}
      <section className="horizontal-gallery h-screen bg-black/20 backdrop-blur-sm overflow-hidden flex items-center">
        <div className="flex h-full">
          {[
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1000',
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1000',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1000'
          ].map((src, i) => (
            <div key={i} className="gallery-item w-screen h-full flex-shrink-0 relative">
              <img src={src} className="w-full h-full object-cover" alt={`Gallery ${i}`} referrerPolicy="no-referrer" />
              <div className="absolute bottom-20 left-20 glass p-6 rounded-xl space-y-4">
                <h4 className="text-2xl font-bold text-reallist-accent">Property View {i + 1}</h4>
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-white/60">
                  <div className="flex items-center gap-1">
                    <Maximize className="h-3 w-3 text-reallist-accent" />
                    <span>12,450 SQ FT</span>
                  </div>
                  <div className="h-3 w-px bg-white/10" />
                  <div className="flex items-center gap-1">
                    <Bed className="h-3 w-3 text-reallist-accent" />
                    <span>7 BEDS</span>
                  </div>
                  <div className="h-3 w-px bg-white/10" />
                  <div className="flex items-center gap-1">
                    <Bath className="h-3 w-3 text-reallist-accent" />
                    <span>9.5 BATHS</span>
                  </div>
                </div>
                <p className="text-white/40 text-xs font-light">Luxury in every detail.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FEATURE HIGHLIGHTS */}
      <section className="features-section py-32 bg-transparent flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold text-reallist-accent mb-20 uppercase tracking-[0.5em]">Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { icon: Waves, label: 'Infinity Pool', img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=800' },
            { icon: Car, label: '4-Car Garage', img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800' },
            { icon: Trees, label: 'Private Garden', img: 'https://images.unsplash.com/photo-1558904541-efa8c1965f1e?auto=format&fit=crop&q=80&w=800' },
            { icon: Wind, label: 'Smart HVAC', img: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800' }
          ].map((item, i) => (
            <div key={i} className="feature-icon flex flex-col items-center gap-4 group cursor-pointer">
              <div className="h-32 w-32 rounded-2xl glass overflow-hidden relative group-hover:glow-edge transition-all duration-500">
                <img src={item.img} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" alt={item.label} referrerPolicy="no-referrer" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <item.icon className="h-10 w-10 text-white group-hover:text-reallist-accent group-hover:scale-110 transition-all drop-shadow-lg" />
                </div>
              </div>
              <span className="text-white/70 uppercase tracking-widest text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. LOCATION EXPERIENCE */}
      <section className="location-section relative h-[120vh] w-full overflow-hidden flex items-center justify-center">
        <div 
          className="location-parallax absolute inset-0 bg-cover bg-center z-0 scale-110"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=2000)' }}
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="relative z-20 text-center space-y-8">
          <h2 className="text-7xl md:text-9xl font-black text-reallist-accent uppercase tracking-tighter">Prime <br /> Location</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-light">
            Located in the heart of the city, with easy access to the best restaurants, shops, and entertainment.
          </p>
          <button className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform">
            View on Map
          </button>
        </div>
      </section>

      {/* 9. TESTIMONIAL SCENE */}
      <section className="testimonial-section relative py-32 bg-transparent flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-5 grayscale"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=2000)' }}
        />
        <div className="max-w-4xl space-y-12 relative z-10">
          <div className="relative inline-block">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" 
              className="h-24 w-24 rounded-full border-4 border-reallist-accent/30 shadow-2xl"
              alt="Client"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-reallist-accent rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">"</span>
            </div>
          </div>
          <p className="text-3xl md:text-5xl font-light italic text-white/90 leading-tight">
            "RealList transformed our home buying experience into a cinematic journey. We didn't just find a house; we found our dream lifestyle."
          </p>
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-reallist-accent">Jonathan Wick</h4>
            <span className="text-reallist-accent uppercase tracking-widest text-xs">Happy Homeowner</span>
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="cta-section relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 brightness-[0.3]"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2000)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-reallist-bg via-reallist-bg-soft to-reallist-accent animate-pulse opacity-30 z-10" />
        <div className="relative z-20 text-center space-y-12">
          <h2 className="text-6xl md:text-8xl font-black text-reallist-accent uppercase tracking-tighter">Ready to <br /> Move In?</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button className="group flex items-center gap-3 px-10 py-5 bg-reallist-accent text-white rounded-full font-bold uppercase tracking-widest hover:glow-edge transition-all">
              <Download className="h-5 w-5" />
              Download Brochure
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group flex items-center gap-3 px-10 py-5 glass text-white rounded-full font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
              <Phone className="h-5 w-5" />
              Contact Agent
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black/60 backdrop-blur-md pt-24 pb-12 px-8 border-t border-white/5 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-10 mix-blend-overlay"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600585154526-990dcea4db0d?auto=format&fit=crop&q=80&w=2000)' }}
        />
        {/* Background Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-t from-reallist-accent/20 to-transparent pointer-events-none z-1" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            {/* Brand Column */}
            <div className="space-y-6">
              <div className="text-3xl font-black tracking-tighter text-reallist-accent">REALLIST</div>
              <p className="text-white/50 font-light leading-relaxed max-w-xs">
                Redefining the luxury real estate experience through cinematic storytelling and immersive technology.
              </p>
              <div className="flex items-center gap-4">
                {[Instagram, Twitter, Facebook, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="h-10 w-10 rounded-full glass flex items-center justify-center hover:glow-edge hover:text-reallist-accent transition-all">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-sm uppercase tracking-[0.3em] text-reallist-accent font-bold">Experience</h4>
              <ul className="space-y-4">
                {['The Intro', 'The Journey', 'Interior Tour', 'Room Gallery', 'Amenities'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/50 hover:text-reallist-accent transition-colors font-light tracking-wide flex items-center group">
                      <ChevronRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-sm uppercase tracking-[0.3em] text-reallist-accent font-bold">Connect</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-white/50 font-light">
                  <MapPin className="h-5 w-5 text-reallist-accent shrink-0" />
                  <span>90210 Sunset Blvd, <br /> Beverly Hills, CA</span>
                </li>
                <li className="flex items-center gap-3 text-white/50 font-light">
                  <Phone className="h-5 w-5 text-reallist-accent shrink-0" />
                  <span>+1 (555) 000-REALLIST</span>
                </li>
                <li className="flex items-center gap-3 text-white/50 font-light">
                  <Mail className="h-5 w-5 text-reallist-accent shrink-0" />
                  <span>concierge@reallist.estate</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-6">
              <h4 className="text-sm uppercase tracking-[0.3em] text-reallist-accent font-bold">Newsletter</h4>
              <p className="text-white/50 font-light">Get exclusive early access to new cinematic properties.</p>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-white placeholder:text-white/20 focus:outline-none focus:border-reallist-accent transition-colors"
                />
                <button className="absolute right-2 top-2 bottom-2 px-6 bg-reallist-accent text-white rounded-full text-xs font-bold uppercase tracking-widest hover:glow-edge transition-all">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white/30 text-[10px] uppercase tracking-[0.5em]">
              &copy; 2026 RealList Real Estate. All Rights Reserved.
            </div>
            <div className="flex items-center gap-8 text-[10px] uppercase tracking-[0.3em] text-white/30">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2 text-reallist-accent hover:text-amber-300 transition-colors"
              >
                Back to Top <ArrowUp className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
