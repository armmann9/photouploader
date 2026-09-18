import React, { useState, useEffect } from 'react';
import { Sparkles, Camera, Volume2, VolumeX, BookOpen, HardDrive, Calendar, MapPin, Users, ArrowUpRight, Share2, Layers, Heart, ShieldCheck, Download, FolderArchive, Utensils, Printer, MessageSquare, Building } from 'lucide-react';
import { FESTIVAL_EVENTS } from './data/festivalEvents';
import { FestivalEvent, EventPhoto, FestiveTheme } from './types';
import { ToranGarland } from './components/ToranGarland';
import { TemplePillars } from './components/TemplePillars';
import { PetalCanvas } from './components/PetalCanvas';
import { GlowingMandala } from './components/GlowingMandala';
import { TiltCard } from './components/TiltCard';
import { FaceMatchFinder } from './components/FaceMatchFinder';
import { BulkPhotoUploader } from './components/BulkPhotoUploader';
import { SocietyTechGuide } from './components/SocietyTechGuide';
import { EventGalleryModal } from './components/EventGalleryModal';
import { DownloadZipModal } from './components/DownloadZipModal';
import { FestiveFairyLights } from './components/FestiveFairyLights';
import { InteractiveDiyaLighting } from './components/InteractiveDiyaLighting';
import { FestivalPanchangSchedule } from './components/FestivalPanchangSchedule';
import { ThemeCustomizerBar } from './components/ThemeCustomizerBar';
import { BpscvsRsvpWidget } from './components/BpscvsRsvpWidget';
import { NoticeBoardPosterModal } from './components/NoticeBoardPosterModal';
import { WhatsAppBroadcastModal } from './components/WhatsAppBroadcastModal';
import { ResidentPhotoDropModal } from './components/ResidentPhotoDropModal';
import { BpscvsDirectoryDesk } from './components/BpscvsDirectoryDesk';
import { AboutSocietyTeam } from './components/AboutSocietyTeam';
import { playTempleBell, playSitarPluck, toggleFestiveDrone, isDroneActive } from './utils/audio';
import { triggerPhoolBarsao } from './utils/confetti';

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState<FestivalEvent | null>(null);
  const [activePhoto, setActivePhoto] = useState<EventPhoto | null>(null);
  const [activeSection, setActiveSection] = useState<'home' | 'face-search' | 'events' | 'bulk-upload' | 'guide'>('home');
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isZipModalOpen, setIsZipModalOpen] = useState<boolean>(false);

  // New BPSCVS Tool Modals
  const [isNoticePosterOpen, setIsNoticePosterOpen] = useState<boolean>(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState<boolean>(false);
  const [isPhotoDropOpen, setIsPhotoDropOpen] = useState<boolean>(false);

  // Festive Theme State & Intensity Controls (addressed to user request)
  const [currentTheme, setCurrentTheme] = useState<FestiveTheme>('deepotsav');
  const [particleMode, setParticleMode] = useState<'few' | 'normal' | 'off'>('few');
  const [mandalaIntensity, setMandalaIntensity] = useState<'soft' | 'minimal' | 'off'>('soft');
  const [fairyLightsOn, setFairyLightsOn] = useState<boolean>(true);

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
    const parentEvent = FESTIVAL_EVENTS.find(e => e.id === photo.eventId) || null;
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
    <div className={`relative min-h-screen ${themeBgClasses[currentTheme]} text-amber-50 transition-colors duration-700`}>
      {/* 1. Top Marigold & Red Rose Toran with physics breeze sway */}
      <ToranGarland interactive={true} />

      {/* Hanging Festive Golden Fairy String Lights under Toran */}
      <FestiveFairyLights enabled={fairyLightsOn} />

      {/* 2. Left & Right Carved Temple Pillars with 3D Parallax ("shaking / 3D imaging") */}
      <TemplePillars parallaxX={mousePos.x} parallaxY={mousePos.y} />

      {/* 3. Multi-layer floating petals canvas (mode adjusted to user preference) */}
      <PetalCanvas mode={particleMode} />

      {/* Top Floating Festive Navigation & Download Bar */}
      <nav className="fixed top-12 md:top-14 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-full bg-emerald-950/90 border border-amber-400/40 shadow-[0_8px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <button
            id="top-nav-download-zip-btn"
            onClick={() => {
              playTempleBell(980);
              setIsZipModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-emerald-950 font-extrabold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all active:scale-95 border border-amber-300"
          >
            <Download className="w-3.5 h-3.5 text-emerald-950 stroke-[2.5]" />
            <span>Download Code (.ZIP)</span>
          </button>

          <div className="hidden sm:flex items-center gap-1 text-xs">
            <button
              onClick={() => scrollToSection('about-society-team-section')}
              className="px-2.5 py-1.5 rounded-full text-amber-300 font-semibold hover:bg-emerald-900/60 transition-colors flex items-center gap-1"
            >
              <Users className="w-3 h-3 text-amber-400" />
              <span>About & Team</span>
            </button>
            <button
              onClick={() => scrollToSection('face-match-portal')}
              className="px-2.5 py-1.5 rounded-full text-emerald-200 hover:text-amber-300 hover:bg-emerald-900/60 transition-colors"
            >
              AI Face Finder
            </button>
            <button
              onClick={() => scrollToSection('festival-albums-section')}
              className="px-2.5 py-1.5 rounded-full text-emerald-200 hover:text-amber-300 hover:bg-emerald-900/60 transition-colors"
            >
              Albums
            </button>
            <button
              onClick={() => scrollToSection('bpscvs-rsvp-counter-section')}
              className="px-2.5 py-1.5 rounded-full text-amber-300 font-semibold hover:bg-emerald-900/60 transition-colors flex items-center gap-1"
            >
              <Utensils className="w-3 h-3 text-amber-400" />
              <span>RSVP & Meals</span>
            </button>
            <button
              onClick={() => {
                playTempleBell(960);
                setIsNoticePosterOpen(true);
              }}
              className="px-2.5 py-1.5 rounded-full text-emerald-200 hover:text-amber-300 hover:bg-emerald-900/60 transition-colors flex items-center gap-1"
            >
              <Printer className="w-3 h-3 text-amber-400" />
              <span>QR Poster</span>
            </button>
            <button
              onClick={() => {
                playSitarPluck('Re');
                setIsBroadcastModalOpen(true);
              }}
              className="px-2.5 py-1.5 rounded-full text-emerald-200 hover:text-amber-300 hover:bg-emerald-900/60 transition-colors flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3 text-emerald-400" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Floating Audio & Celebration Action Dock */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <button
          id="dock-download-zip-btn"
          onClick={() => {
            playTempleBell(980);
            setIsZipModalOpen(true);
          }}
          className="px-3.5 py-2.5 rounded-full bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 font-bold text-xs shadow-lg border border-amber-400/40 transition-all active:scale-95 flex items-center gap-1.5"
          title="Download complete code as ZIP"
        >
          <FolderArchive className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Download Code ZIP</span>
        </button>

        <button
          id="phool-barsao-btn"
          onClick={() => {
            playTempleBell(940);
            triggerPhoolBarsao();
          }}
          className="px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-emerald-950 font-bold text-xs shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:from-amber-400 hover:to-yellow-300 transition-all active:scale-95 flex items-center gap-2 border border-amber-300"
        >
          <Sparkles className="w-4 h-4 text-emerald-950" />
          <span>🌸 फूल बरसाओ (Shower Petals)</span>
        </button>

        <button
          id="ambient-sound-toggle-btn"
          onClick={handleAudioToggle}
          title={isAudioOn ? 'Mute Festive Tanpura' : 'Play Festive Tanpura Sound'}
          className={`p-3 rounded-full border transition-all shadow-lg ${
            isAudioOn
              ? 'bg-amber-500 text-emerald-950 border-amber-300 shadow-[0_0_15px_#fbbf24]'
              : 'bg-emerald-950/80 text-amber-300 border-emerald-700 hover:bg-emerald-900'
          }`}
        >
          {isAudioOn ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Content Area (Framed between left and right pillars) */}
      <main className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pt-24 md:pt-32 pb-24">
        
        {/* HERO SECTION WITH ROTATING SACRED MANDALA */}
        <section className="relative flex flex-col items-center text-center py-10 md:py-16 mb-16" id="hero-section">
          {/* Centered Glowing Rotating Mandala (Delicate, Softened & Non-Intrusive) */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 transition-transform duration-300 ease-out pointer-events-none"
            style={{
              transform: `translate(calc(-50% + ${mousePos.x * 15}px), calc(-50% + ${mousePos.y * 15}px))`,
            }}
          >
            {mandalaIntensity !== 'off' && (
              <GlowingMandala 
                size={window.innerWidth < 768 ? 350 : 540} 
                opacity={mandalaIntensity === 'soft' ? 0.35 : 0.18}
              />
            )}
          </div>

          {/* Colony / Society Identification Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-emerald-900/80 border border-amber-400/40 text-amber-300 text-xs md:text-sm font-semibold mb-6 shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>बनी पार्क सिंधी कॉलोनी विकास समिति (BPSCVS) • Official Community & Festival Hub</span>
          </div>

          {/* Royal Headline with Indian Typography & Crisp Contrast */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-amber-300 to-yellow-400 drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] max-w-4xl mx-auto leading-tight md:leading-none mb-6">
            उत्सव मंडप
          </h1>
          <p className="text-xl md:text-2xl font-serif text-amber-100 font-medium max-w-2xl mx-auto mb-4 tracking-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
            Bani Park Sindhi Colony Vikas Samiti • Community & Festival Portal
          </p>

          <p className="text-emerald-200/90 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-6 drop-shadow-sm">
            Official digital hub for our colony residents: Instant <strong>AI Face Match</strong> to find your photos, live <strong>Mahaprasad RSVP & plate counter</strong>, printable <strong>Notice Board QR posters</strong>, and 24/7 committee directory.
          </p>

          {/* Interactive Auspicious Diya Ceremony (शुभ दीप प्रज्वलन) */}
          <div className="w-full">
            <InteractiveDiyaLighting />
          </div>

          {/* Navigation CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-5">
            <button
              id="cta-download-zip"
              onClick={() => {
                playTempleBell(980);
                setIsZipModalOpen(true);
              }}
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-emerald-950 font-black text-sm md:text-base shadow-[0_10px_25px_rgba(245,158,11,0.45)] transition-all active:scale-95 flex items-center gap-2.5 border-2 border-yellow-200 animate-pulse"
            >
              <Download className="w-5 h-5 text-emerald-950 stroke-[2.5]" />
              <span>📦 Download Code (.ZIP)</span>
            </button>

            <button
              id="cta-find-my-photos"
              onClick={() => scrollToSection('face-match-portal')}
              className="py-3.5 px-6 rounded-2xl bg-emerald-900/90 hover:bg-emerald-800 text-amber-200 font-extrabold text-sm md:text-base shadow-md transition-all active:scale-95 flex items-center gap-2.5 border border-emerald-600"
            >
              <Camera className="w-5 h-5 text-amber-400" />
              <span>ढूंढो मेरी तस्वीर (Find My Photos)</span>
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

          {/* BPSCVS Official Community Quick Action Toolbar */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8 p-2 rounded-2xl bg-emerald-950/80 border border-amber-400/30 max-w-3xl mx-auto shadow-lg">
            <button
              onClick={() => {
                playSitarPluck('Sa');
                scrollToSection('bpscvs-rsvp-counter-section');
              }}
              className="px-3 py-2 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 border border-emerald-700"
            >
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              <span>🍽️ Live RSVP & Meals</span>
            </button>

            <button
              onClick={() => {
                playTempleBell(980);
                setIsNoticePosterOpen(true);
              }}
              className="px-3 py-2 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 border border-emerald-700"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>🖨️ Lift/Gate QR Poster</span>
            </button>

            <button
              onClick={() => {
                playSitarPluck('Re');
                setIsBroadcastModalOpen(true);
              }}
              className="px-3 py-2 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 border border-emerald-700"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>📲 WhatsApp Invite</span>
            </button>

            <button
              onClick={() => {
                playSitarPluck('Ga');
                setIsPhotoDropOpen(true);
              }}
              className="px-3 py-2 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 border border-emerald-700"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>📸 Resident Photo Drop</span>
            </button>

            <button
              onClick={() => {
                playSitarPluck('Pa');
                scrollToSection('bpscvs-directory-desk-section');
              }}
              className="px-3 py-2 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 border border-emerald-700"
            >
              <Building className="w-3.5 h-3.5 text-amber-400" />
              <span>☎️ Helpline</span>
            </button>

            <button
              onClick={() => {
                playSitarPluck('Dha');
                scrollToSection('about-society-team-section');
              }}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-400/20 hover:from-amber-500/30 hover:to-amber-400/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 border border-amber-400/40 shadow"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>👥 About Us & Team</span>
            </button>
          </div>

          {/* Theme Mood & Visual Density Customizer (Particle count & Mandala brightness) */}
          <ThemeCustomizerBar
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
            particleMode={particleMode}
            onParticleModeChange={setParticleMode}
            mandalaIntensity={mandalaIntensity}
            onMandalaIntensityChange={setMandalaIntensity}
            fairyLightsOn={fairyLightsOn}
            onFairyLightsToggle={setFairyLightsOn}
          />

          {/* Key Society Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-12 pt-8 border-t border-emerald-800/60">
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 backdrop-blur-sm">
              <span className="text-2xl md:text-3xl font-bold font-display text-amber-300 block">5 Festivals</span>
              <span className="text-xs text-emerald-300/80">Celebrated this year</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 backdrop-blur-sm">
              <span className="text-2xl md:text-3xl font-bold font-display text-amber-300 block">1,800+</span>
              <span className="text-xs text-emerald-300/80">High-Res Photos Stored</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 backdrop-blur-sm">
              <span className="text-2xl md:text-3xl font-bold font-display text-amber-300 block">2 Sec</span>
              <span className="text-xs text-emerald-300/80">AI Face Search Speed</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 backdrop-blur-sm">
              <span className="text-2xl md:text-3xl font-bold font-display text-amber-300 block">₹0 Cost</span>
              <span className="text-xs text-emerald-300/80">Using Cloud Free Tier</span>
            </div>
          </div>
        </section>

        {/* 3D TILT EVENT CARDS GRID */}
        <section className="mb-20" id="festival-albums-section">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                <span>Festival Photo Archive</span>
                <span className="text-emerald-500">•</span>
                <span>3D Interactive Cards</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display text-amber-200">
                Society Festival Albums
              </h2>
              <p className="text-xs md:text-sm text-emerald-300/80 mt-1 max-w-xl">
                Hover over the cards below to see the dynamic 3D tilt perspective. Click any album to open the full high-resolution gallery!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="uploader-jump-btn"
                onClick={() => scrollToSection('bulk-uploader-section')}
                className="px-4 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-emerald-700 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <HardDrive className="w-4 h-4" />
                <span>Upload 300 Photos</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FESTIVAL_EVENTS.map((event) => (
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
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-amber-400" /> {event.date}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-amber-400" /> {event.attendeesCount} Residents</span>
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

        {/* BPSCVS LIVE RSVP & MAHAPRASAD PLATE COUNTER */}
        <section className="mb-20">
          <BpscvsRsvpWidget events={FESTIVAL_EVENTS} />
        </section>

        {/* AI FACE MATCH FINDER COMPONENT */}
        <section className="mb-20">
          <FaceMatchFinder onOpenPhotoModal={handleOpenPhoto} />
        </section>

        {/* 300+ PHOTO BULK UPLOADER & ENGINE COMPONENT */}
        <section className="mb-20">
          <BulkPhotoUploader />
        </section>

        {/* ABOUT US & SOCIETY TEAM (OUR TEAM + COMPLETE PORTAL PURPOSE) */}
        <section id="about-society-team-section" className="mb-20">
          <AboutSocietyTeam onNavigateToSection={scrollToSection} />
        </section>

        {/* BPSCVS COMMITTEE DIRECTORY & 24x7 EMERGENCY DESK */}
        <section id="bpscvs-directory-desk-section" className="mb-20">
          <BpscvsDirectoryDesk />
        </section>

        {/* SOCIETY TECH SETUP & DOMAIN GUIDE */}
        <section className="mb-16">
          <SocietyTechGuide />
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
            <button onClick={() => scrollToSection('bpscvs-rsvp-counter-section')} className="hover:text-amber-300 transition-colors">RSVP & Meals</button>
            <button onClick={() => scrollToSection('face-match-portal')} className="hover:text-amber-300 transition-colors">AI Face Finder</button>
            <button onClick={() => scrollToSection('bpscvs-directory-desk-section')} className="hover:text-amber-300 transition-colors">Helpline & Directory</button>
            <button onClick={() => scrollToSection('society-tech-guide-section')} className="hover:text-amber-300 transition-colors">Tech Guide</button>
            <button 
              id="footer-download-zip-btn"
              onClick={() => {
                playTempleBell(980);
                setIsZipModalOpen(true);
              }}
              className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30 transition-colors font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Project ZIP</span>
            </button>
          </div>

          <p className="text-[11px] text-emerald-500">
            Crafted for Community Welfare • 100% Free Hosting Architecture • Zero Cloud Bills
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

      {/* One-Click Source Code ZIP Exporter Modal */}
      <DownloadZipModal
        isOpen={isZipModalOpen}
        onClose={() => setIsZipModalOpen(false)}
      />

      {/* Printable Notice Board & Lift QR Poster Modal */}
      <NoticeBoardPosterModal
        isOpen={isNoticePosterOpen}
        onClose={() => setIsNoticePosterOpen(false)}
        events={FESTIVAL_EVENTS}
      />

      {/* Secretary 1-Click WhatsApp Broadcast Generator Modal */}
      <WhatsAppBroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        events={FESTIVAL_EVENTS}
      />

      {/* Crowdsourced Resident Photo Drop Modal */}
      <ResidentPhotoDropModal
        isOpen={isPhotoDropOpen}
        onClose={() => setIsPhotoDropOpen(false)}
        events={FESTIVAL_EVENTS}
      />
    </div>
  );
}
