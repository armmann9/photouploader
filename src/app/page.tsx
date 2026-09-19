'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Camera,
  Volume2,
  VolumeX,
  Calendar,
  Users,
  ArrowUpRight,
  ShieldCheck,
  UserCheck,
  Menu,
  X,
} from 'lucide-react';

import { FESTIVAL_EVENTS } from '@/data/festivalEvents';
import { FestivalEvent, EventPhoto, FestiveTheme, EventRsvpRecord } from '@/types/utsav';
import { getMergedFestivalEvents } from '@/lib/db';
import { INITIAL_RSVP_RECORDS } from '@/data/bpscvsData';
import HomeFaceFinder from '@/components/HomeFaceFinder';

import {
  ToranGarland,
  TemplePillars,
  PetalCanvas,
  GlowingMandala,
  TiltCard,
  EventGalleryModal,
  FestiveFairyLights,
  InteractiveDiyaLighting,
  FestivalPanchangSchedule,
  BpscvsRsvpWidget,
  AboutSocietyTeam,
} from '@/components/utsav';

import { playTempleBell, playSitarPluck, toggleFestiveDrone } from '@/utils/audio';
import { triggerPhoolBarsao } from '@/utils/confetti';

export default function HomePage() {
  const [eventsList, setEventsList] = useState<FestivalEvent[]>(FESTIVAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<FestivalEvent | null>(null);
  const [activePhoto, setActivePhoto] = useState<EventPhoto | null>(null);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  // Live RSVP records — synced from localStorage so event card count updates in real-time
  const [rsvpList, setRsvpList] = useState<EventRsvpRecord[]>(INITIAL_RSVP_RECORDS);

  // Festive Theme State & Controls
  const [currentTheme, setCurrentTheme] = useState<FestiveTheme>('deepotsav');
  const [particleMode, setParticleMode] = useState<'few' | 'normal' | 'off'>('few');
  const [mandalaIntensity, setMandalaIntensity] = useState<'soft' | 'minimal' | 'off'>('soft');
  const [fairyLightsOn, setFairyLightsOn] = useState<boolean>(true);

  // Load saved theme preferences on mount & listen to changes
  useEffect(() => {
    const applySavedThemeSettings = () => {
      try {
        const savedTheme = localStorage.getItem('bpscvs_festive_theme') as FestiveTheme;
        if (savedTheme && ['deepotsav', 'dandiya', 'rangotsav', 'ganesh'].includes(savedTheme)) {
          setCurrentTheme(savedTheme);
        }
        const savedParticles = localStorage.getItem('bpscvs_particle_mode') as 'few' | 'normal' | 'off';
        if (savedParticles) setParticleMode(savedParticles);

        const savedMandala = localStorage.getItem('bpscvs_mandala_intensity') as 'soft' | 'minimal' | 'off';
        if (savedMandala) setMandalaIntensity(savedMandala);

        const savedLights = localStorage.getItem('bpscvs_fairy_lights');
        if (savedLights !== null) setFairyLightsOn(savedLights === 'true');
      } catch {
        // ignore
      }
    };

    applySavedThemeSettings();

    const handleThemeUpdate = () => {
      applySavedThemeSettings();
    };

    window.addEventListener('bpscvs_theme_settings_updated', handleThemeUpdate);
    window.addEventListener('storage', handleThemeUpdate);
    return () => {
      window.removeEventListener('bpscvs_theme_settings_updated', handleThemeUpdate);
      window.removeEventListener('storage', handleThemeUpdate);
    };
  }, []);

  // Dynamic Event Synchronization with Admin Panel & DB
  useEffect(() => {
    let isMounted = true;
    const loadEvents = async () => {
      try {
        const merged = await getMergedFestivalEvents();
        if (isMounted && merged && merged.length > 0) {
          setEventsList(merged);
        }
      } catch (err) {
        console.warn('Failed to load merged festival events:', err);
      }
    };
    loadEvents();

    const handleUpdate = () => {
      loadEvents();
    };

    window.addEventListener('bpscvs_events_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('bpscvs_events_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Sync RSVP list from localStorage whenever it changes (e.g. after RSVP widget submission)
  useEffect(() => {
    const syncRsvp = () => {
      try {
        const saved = localStorage.getItem('bpscvs_rsvp_records');
        if (saved) setRsvpList(JSON.parse(saved));
      } catch { /* ignore */ }
    };
    syncRsvp();
    window.addEventListener('storage', syncRsvp);
    // Also re-sync whenever RSVP widget fires after submit (same tab)
    window.addEventListener('bpscvs_rsvp_updated', syncRsvp);
    return () => {
      window.removeEventListener('storage', syncRsvp);
      window.removeEventListener('bpscvs_rsvp_updated', syncRsvp);
    };
  }, []);

  // Helper: compute live headcount from RSVP records for a given eventId
  const getLiveAttendees = (eventId: string) => {
    const eventRsvps = rsvpList.filter((r) => r.eventId === eventId && r.isAttending);
    const rsvpTotal = eventRsvps.reduce((sum, r) => sum + r.adultsCount + r.kidsCount, 0);
    // Merge with hardcoded base count from the event data
    const baseEvent = FESTIVAL_EVENTS.find((e) => e.id === eventId);
    const base = baseEvent?.attendeesCount ?? 0;
    return rsvpTotal > 0 ? base + rsvpTotal : base;
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x: nx, y: ny });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const handleAudioToggle = () => {
    const newState = toggleFestiveDrone();
    setIsAudioOn(newState);
    if (newState) {
      playTempleBell(960);
    }
  };

  const handleOpenPhoto = (photo: EventPhoto) => {
    setActivePhoto(photo);
    const parentEvent = eventsList.find((e) => e.id === photo.eventId) || null;
    setSelectedEvent(parentEvent);
    playSitarPluck('Sa');
  };

  const scrollToSection = (sectionId: string) => {
    playSitarPluck('Re');
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const themeBgClasses: Record<FestiveTheme, string> = {
    deepotsav: 'bg-[#021812] selection:bg-amber-500 selection:text-emerald-950',
    dandiya: 'bg-[#09081a] selection:bg-fuchsia-500 selection:text-white',
    rangotsav: 'bg-[#15051a] selection:bg-pink-500 selection:text-white',
    ganesh: 'bg-[#1a0b02] selection:bg-amber-600 selection:text-white',
  };

  return (
    <div className={`relative min-h-screen ${themeBgClasses[currentTheme]} text-amber-50 transition-colors duration-700 overflow-x-hidden`}>
      {/* 1. Top Marigold & Red Rose Toran with physics breeze sway */}
      <ToranGarland interactive={true} />

      {/* Hanging Festive Golden Fairy String Lights under Toran */}
      <FestiveFairyLights enabled={fairyLightsOn} />

      {/* 2. Left & Right Carved Temple Pillars with 3D Parallax */}
      <TemplePillars parallaxX={mousePos.x} parallaxY={mousePos.y} />

      {/* 3. Multi-layer floating petals canvas */}
      <PetalCanvas mode={particleMode} />

      {/* Top Floating Festive Navigation Bar */}
      <nav className="fixed top-8 sm:top-12 md:top-14 left-0 right-0 z-30 flex flex-col items-center px-3 sm:px-4 pointer-events-none">
        {/* Desktop Navbar (md and up) */}
        <div className="pointer-events-auto hidden md:flex items-center gap-2 p-2 rounded-full bg-emerald-950/95 border border-amber-400/40 shadow-[0_8px_30px_rgba(0,0,0,0.85)] backdrop-blur-md">
          <button
            onClick={() => scrollToSection('hero-section')}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-400/20 hover:from-amber-500/30 hover:to-yellow-400/30 text-amber-300 font-extrabold text-xs flex items-center gap-1.5 border border-amber-400/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>बनी पार्क सिंधी कॉलोनी</span>
          </button>

          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => scrollToSection('about-society-team-section')}
              className="px-2.5 py-1.5 rounded-full text-amber-300 font-semibold hover:bg-emerald-900/60 transition-colors flex items-center gap-1"
            >
              <Users className="w-3 h-3 text-amber-400" />
              <span>About & Team</span>
            </button>
            <button
              onClick={() => scrollToSection('face-match-portal')}
              className="px-2.5 py-1.5 rounded-full text-emerald-200 hover:text-amber-300 hover:bg-emerald-900/60 transition-colors flex items-center gap-1"
            >
              <Camera className="w-3 h-3 text-amber-400" />
              <span>AI Face Finder</span>
            </button>
            <button
              onClick={() => scrollToSection('festival-albums-section')}
              className="px-2.5 py-1.5 rounded-full text-emerald-200 hover:text-amber-300 hover:bg-emerald-900/60 transition-colors"
            >
              Albums
            </button>
            <Link
              href="/events"
              className="px-2.5 py-1.5 rounded-full text-emerald-200 hover:text-amber-300 hover:bg-emerald-900/60 transition-colors flex items-center gap-1"
            >
              <Calendar className="w-3 h-3 text-amber-400" />
              <span>Events List</span>
            </Link>
            <button
              onClick={() => scrollToSection('bpscvs-rsvp-counter-section')}
              className="px-2.5 py-1.5 rounded-full text-amber-300 font-semibold hover:bg-emerald-900/60 transition-colors flex items-center gap-1"
            >
              <UserCheck className="w-3 h-3 text-amber-400" />
              <span>RSVP</span>
            </button>
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-100 transition-colors flex items-center gap-1.5 font-semibold border border-amber-400/40"
            >
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>🔐 Staff Login</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navbar (under md) - 100% responsive, never cut off */}
        <div className="pointer-events-auto flex md:hidden items-center justify-between w-full max-w-sm px-3 py-1.5 rounded-full bg-emerald-950/95 border border-amber-400/40 shadow-[0_8px_30px_rgba(0,0,0,0.85)] backdrop-blur-md">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              scrollToSection('hero-section');
            }}
            className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-400/20 text-amber-300 font-extrabold text-xs flex items-center gap-1 border border-amber-400/40 shrink-0"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>बनी पार्क BPSCVS</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToSection('face-match-portal');
              }}
              className="px-2.5 py-1 rounded-full text-emerald-200 hover:text-amber-300 bg-emerald-900/70 border border-emerald-700/50 flex items-center gap-1 font-medium text-[11px]"
            >
              <Camera className="w-3 h-3 text-amber-400" />
              <span>Face</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToSection('bpscvs-rsvp-counter-section');
              }}
              className="px-2 py-1 rounded-full text-amber-300 bg-emerald-900/70 border border-amber-400/30 font-semibold flex items-center gap-1 text-[11px]"
            >
              <UserCheck className="w-3 h-3 text-amber-400" />
              <span>RSVP</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 flex items-center gap-1 font-bold text-[11px]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
              <span>{mobileMenuOpen ? 'बंद' : 'Menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto mt-2 w-full max-w-sm p-3.5 rounded-2xl bg-emerald-950/98 border border-amber-400/50 shadow-[0_12px_40px_rgba(0,0,0,0.95)] backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-200 flex flex-col gap-1 md:hidden">
            <div className="text-[11px] text-amber-400/90 font-bold px-2 py-1 flex items-center justify-between border-b border-emerald-800/80 mb-1">
              <span>🌸 जय झूलेलाल • BPSCVS Quick Menu</span>
              <span className="text-[10px] text-emerald-300 font-normal">स्थापना 1970</span>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToSection('about-society-team-section');
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-amber-200 hover:bg-emerald-900/80 flex items-center gap-2.5 transition-colors"
            >
              <Users className="w-4 h-4 text-amber-400 shrink-0" />
              <span>About Colony & Committee Team</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToSection('festival-albums-section');
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-amber-200 hover:bg-emerald-900/80 flex items-center gap-2.5 transition-colors"
            >
              <Camera className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Society Festival Photo Albums</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToSection('festival-panchang-section');
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-amber-200 hover:bg-emerald-900/80 flex items-center gap-2.5 transition-colors"
            >
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Colony Festival Panchang & Schedule</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToSection('bpscvs-rsvp-counter-section');
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-amber-200 hover:bg-emerald-900/80 flex items-center gap-2.5 transition-colors"
            >
              <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Live Event RSVP Attendance</span>
            </button>

            <Link
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-amber-200 hover:bg-emerald-900/80 flex items-center gap-2.5 transition-colors"
            >
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Browse All Events Archive</span>
            </Link>

            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 flex items-center justify-between transition-colors mt-1"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Executive & Staff Login</span>
              </span>
              <span className="text-[10px] bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full font-black">Portal →</span>
            </Link>
          </div>
        )}
      </nav>

      {/* Floating Audio & Celebration Action Dock */}
      <div className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-40 flex items-center gap-2 sm:gap-3">
        <button
          id="phool-barsao-btn"
          onClick={() => {
            playTempleBell(940);
            triggerPhoolBarsao();
          }}
          className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-emerald-950 font-bold text-[11px] sm:text-xs shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:from-amber-400 hover:to-yellow-300 transition-all active:scale-95 flex items-center gap-1.5 sm:gap-2 border border-amber-300"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-950" />
          <span>🌸 फूल बरसाओ</span>
        </button>

        <button
          id="ambient-sound-toggle-btn"
          onClick={handleAudioToggle}
          title={isAudioOn ? 'Mute Festive Tanpura' : 'Play Festive Tanpura Sound'}
          className={`p-2.5 sm:p-3 rounded-full border transition-all shadow-lg ${
            isAudioOn
              ? 'bg-amber-500 text-emerald-950 border-amber-300 shadow-[0_0_15px_#fbbf24]'
              : 'bg-emerald-950/80 text-amber-300 border-emerald-700 hover:bg-emerald-900'
          }`}
        >
          {isAudioOn ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
      </div>

      {/* Main Content Area (Framed between left and right pillars) */}
      <main className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pt-24 sm:pt-28 md:pt-32 pb-24">
        {/* HERO SECTION WITH ROTATING SACRED MANDALA */}
        <section className="relative flex flex-col items-center text-center py-6 sm:py-10 md:py-16 mb-16" id="hero-section">
          {/* Centered Glowing Rotating Sacred Mandala directly behind headline */}
          <div
            className="absolute top-16 md:top-28 left-1/2 -z-10 transition-transform duration-300 ease-out pointer-events-none"
            style={{
              transform: `translate(calc(-50% + ${mousePos.x * 12}px), ${mousePos.y * 12}px)`,
            }}
          >
            {mandalaIntensity !== 'off' && (
              <GlowingMandala
                size={typeof window !== 'undefined' && window.innerWidth < 768 ? 320 : 580}
                opacity={mandalaIntensity === 'soft' ? 0.85 : 0.5}
              />
            )}
          </div>

          {/* Colony / Society Identification Badge */}
          <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-emerald-900/80 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold mb-5 shadow-lg backdrop-blur-md max-w-full">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span className="truncate">🌸 जय झूलेलाल • BPSCVS जयपुर (स्थापना 1970)</span>
          </div>

          {/* Royal Headline with Indian Typography */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-amber-300 to-yellow-400 drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] max-w-4xl mx-auto leading-tight mb-3">
            बनी पार्क सिंधी कॉलोनी
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-serif text-amber-200 font-medium max-w-2xl mx-auto mb-2 tracking-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
            त्योहार, उत्सव एवं सांस्कृतिक स्मृतियों का डिजिटल संग्रह
          </p>
          <p className="text-[11px] sm:text-xs md:text-sm text-amber-300/80 font-medium tracking-wide uppercase max-w-2xl mx-auto mb-4">
            Festival Celebrations, Community Memories & AI Photo Portal
          </p>

          <p className="text-emerald-200/90 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-6 drop-shadow-sm px-2">
            Official digital community portal for our colony residents: Explore festival photo albums, register family attendance for celebrations, and preserve our shared heritage.
          </p>

          {/* Interactive Auspicious Diya Ceremony (शुभ दीप प्रज्वलन) */}
          <div className="w-full">
            <InteractiveDiyaLighting />
          </div>

          {/* Navigation CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-5">
            <button
              id="cta-find-my-photos"
              onClick={() => scrollToSection('face-match-portal')}
              className="py-3.5 px-7 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-emerald-950 font-black text-sm md:text-base shadow-[0_10px_25px_rgba(245,158,11,0.45)] transition-all active:scale-95 flex items-center gap-2.5 border-2 border-yellow-200"
            >
              <Camera className="w-5 h-5 text-emerald-950 stroke-[2.5]" />
              <span>ढूंढो मेरी तस्वीर (Find My Photos)</span>
            </button>

            <button
              id="cta-rsvp"
              onClick={() => scrollToSection('bpscvs-rsvp-counter-section')}
              className="py-3.5 px-6 rounded-2xl bg-emerald-900/90 hover:bg-emerald-800 text-amber-200 font-extrabold text-sm md:text-base shadow-md transition-all active:scale-95 flex items-center gap-2.5 border border-emerald-600"
            >
              <UserCheck className="w-5 h-5 text-amber-400" />
              <span>✨ Event RSVP</span>
            </button>

            <button
              id="cta-view-events"
              onClick={() => scrollToSection('festival-albums-section')}
              className="py-3.5 px-5 rounded-2xl bg-emerald-950/90 hover:bg-emerald-900 text-amber-200 font-bold text-sm md:text-base border border-emerald-700 shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Browse Albums</span>
            </button>
          </div>
        </section>

        {/* AI BIOMETRIC FACE FINDER PORTAL */}
        <HomeFaceFinder events={eventsList} />

        {/* 3D TILT EVENT CARDS GRID */}
        <section className="mb-20" id="festival-albums-section">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              <span>Festival Photo Archive</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display text-amber-200">
              Society Festival Albums
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventsList.map((event) => (
              <TiltCard
                key={event.id}
                id={`event-card-${event.id}`}
                onClick={() => {
                  setSelectedEvent(event);
                  setActivePhoto(event.photos[0] || null);
                  playTempleBell(840);
                }}
                className="h-[430px]"
              >
                <div className="relative h-full flex flex-col justify-between bg-gradient-to-b from-emerald-900/90 to-emerald-950/95 border border-emerald-700/60 p-5 group">
                  {/* Event Cover Image */}
                  <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-emerald-950">
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent opacity-60" />

                    {/* Badge: Photo Count */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow">
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                      <span>{event.photoCount} Photos</span>
                    </div>

                    {/* Hindi Title Overlay */}
                    {event.hindiTitle && (
                      <div className="absolute bottom-2 left-3 text-amber-300 font-folk text-xs bg-emerald-950/80 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-emerald-700/60">
                        {event.hindiTitle}
                      </div>
                    )}
                  </div>

                  {/* Title and Metadata */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold font-display text-amber-100 group-hover:text-amber-300 transition-colors line-clamp-1 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-xs text-emerald-200/80 line-clamp-2 leading-relaxed mb-3">
                        {event.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs text-emerald-300/80 pt-3 border-t border-emerald-800/80 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" /> {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-amber-400" /> {getLiveAttendees(event.id)} Residents
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-amber-400 font-semibold group-hover:underline flex items-center gap-1">
                          Open Full Album <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>

                        <div className="flex -space-x-2 overflow-hidden">
                          {event.photos.slice(0, 3).map((p, idx) => (
                            <img
                              key={idx}
                              src={p.url}
                              alt=""
                              className="inline-block h-6 w-6 rounded-full ring-2 ring-emerald-900 object-cover"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* COLONY FESTIVAL PANCHANG & TIMETABLE SCHEDULE */}
        <section id="festival-panchang-section" className="mb-20">
          <FestivalPanchangSchedule />
        </section>

        {/* BPSCVS LIVE RSVP SECTION */}
        <section className="mb-20" id="bpscvs-rsvp-counter-section">
          <BpscvsRsvpWidget events={eventsList} />
        </section>

        {/* ABOUT US & SOCIETY TEAM */}
        <section id="about-society-team-section" className="mb-20">
          <AboutSocietyTeam onNavigateToSection={scrollToSection} />
        </section>

        {/* TRADITIONAL FESTIVE FOOTER */}
        <footer className="pt-12 border-t border-emerald-800/80 text-center" id="colony-footer">
          {/* Decorative Rangoli Pattern */}
          <div className="w-24 h-24 mx-auto mb-4 opacity-40">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
              <circle cx="50" cy="50" r="40" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,2" fill="none" />
              <circle cx="50" cy="50" r="25" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
              <polygon points="50,10 90,50 50,90 10,50" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
              <circle cx="50" cy="50" r="6" fill="#fef08a" />
            </svg>
          </div>

          <h4 className="text-xl font-display text-amber-300 mb-1">
            बनी पार्क सिंधी कॉलोनी विकास समिति (BPSCVS)
          </h4>
          <div className="text-xs font-serif text-amber-200/90 mb-2">
            Bani Park Sindhi Colony Vikas Samiti, Jaipur • Regd. Community Society
          </div>
          <p className="text-xs text-emerald-300/80 max-w-lg mx-auto mb-6">
            Building harmony, celebrating cultural heritage, and preserving colony festival memories forever.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-emerald-400 mb-8">
            <button onClick={() => scrollToSection('hero-section')} className="hover:text-amber-300 transition-colors">Top</button>
            <button onClick={() => scrollToSection('about-society-team-section')} className="text-amber-300 font-semibold hover:underline transition-colors">About Us & Team</button>
            <button onClick={() => scrollToSection('festival-albums-section')} className="hover:text-amber-300 transition-colors">Festivals</button>
            <button onClick={() => scrollToSection('bpscvs-rsvp-counter-section')} className="hover:text-amber-300 transition-colors">RSVP</button>
            <button onClick={() => scrollToSection('face-match-portal')} className="hover:text-amber-300 transition-colors">AI Face Finder</button>
            <Link href="/login" className="hover:text-amber-300 transition-colors font-semibold">🔐 Staff Login</Link>
          </div>

          <p className="text-[11px] text-emerald-400/80 tracking-wide font-medium">
            🌸 एकता में शक्ति, मिलकर मनाएं हर त्योहार — बनी पार्क सिंधी कॉलोनी परिवार 🌸
          </p>
        </footer>
      </main>

      {/* Full Screen Interactive Lightbox Modal */}
      <EventGalleryModal
        event={selectedEvent}
        activePhoto={activePhoto}
        onClose={() => {
          setSelectedEvent(null);
          setActivePhoto(null);
        }}
        onSelectPhoto={(photo) => setActivePhoto(photo)}
      />
    </div>
  );
}
