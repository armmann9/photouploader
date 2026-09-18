'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { getAllEvents, createEvent, updateEvent, deleteEvent, resetToSeed, getAllRsvps, safeLocalStorageSet } from '@/lib/db';
import { INITIAL_EVENTS } from '@/lib/sampleData';
import { EventItem } from '@/lib/types';
import { FESTIVAL_EVENTS } from '@/data/festivalEvents';
import { formatFestiveDate } from '@/utils/dateUtils';
import { EventRsvpRecord, FestivalEvent } from '@/types/utsav';
import {
  Calendar, Clock, Users, Wrench,
  LogOut, Eye, Plus, Minus, Pencil, Trash2, Check, X as XIcon,
  ChevronRight, ShieldCheck, Download, Search,
  Printer, Bell, Menu, ArrowUpRight, Camera, QrCode, Sparkles, MapPin, RefreshCw,
  Sliders, Settings, SunDim, Palette, Lightbulb, Save, CheckCircle2, Globe, Database, Radio, Flame,
  UserCheck, Phone
} from 'lucide-react';
import QRCodeModal from '@/components/QRCodeModal';
import {
  NoticeBoardPosterModal,
  WhatsAppBroadcastModal,
  FestivalPanchangSchedule,
  ThemeCustomizerBar,
} from '@/components/utsav';
import { FestiveTheme } from '@/types/utsav';
import { INITIAL_RSVP_RECORDS } from '@/data/bpscvsData';
import { playSitarPluck, playTempleBell } from '@/utils/audio';
import { triggerPhoolBarsao } from '@/utils/confetti';

// ─── Demo RSVP data ────────────────────────────────────────────────────────────
const DEMO_RSVPS: EventRsvpRecord[] = [
  { id: 'r1', eventId: 'deepotsav-2024', residentName: 'Ramesh Advani', bungalowPlot: 'B-12', phone: '9876543210', adultsCount: 3, kidsCount: 2, dietPreference: 'regular', isAttending: true, createdAt: '2026-09-01T10:00:00Z' },
  { id: 'r2', eventId: 'deepotsav-2024', residentName: 'Sunita Mirchandani', bungalowPlot: 'A-5', phone: '9812345678', adultsCount: 2, kidsCount: 1, dietPreference: 'jain', isAttending: true, createdAt: '2026-09-02T11:00:00Z' },
  { id: 'r3', eventId: 'deepotsav-2024', residentName: 'Mohan Lalwani', bungalowPlot: 'C-22', phone: '9800011223', adultsCount: 4, kidsCount: 3, dietPreference: 'falahar', isAttending: true, createdAt: '2026-09-03T09:30:00Z' },
  { id: 'r4', eventId: 'deepotsav-2024', residentName: 'Priya Thadani', bungalowPlot: 'D-8', phone: '9988776655', adultsCount: 2, kidsCount: 0, dietPreference: 'regular', isAttending: true, createdAt: '2026-09-04T14:00:00Z' },
  { id: 'r5', eventId: 'deepotsav-2024', residentName: 'Kiran Chandiramani', bungalowPlot: 'E-3', phone: '9001122334', adultsCount: 3, kidsCount: 2, dietPreference: 'jain', isAttending: true, createdAt: '2026-09-05T16:00:00Z' },
];

type AdminSection = 'events' | 'panchang' | 'rsvp' | 'tools' | 'settings';

// ─── Sidebar nav items ─────────────────────────────────────────────────────────
const NAV_ITEMS: { id: AdminSection; label: string; labelHindi: string; icon: React.ReactNode }[] = [
  { id: 'events', label: 'Event Management', labelHindi: 'कार्यक्रम प्रबंधन', icon: <Calendar className="w-4 h-4" /> },
  { id: 'panchang', label: 'Panchang & Timeline', labelHindi: 'पंचांग व समयसारिणी', icon: <Clock className="w-4 h-4" /> },
  { id: 'rsvp', label: 'RSVP & Mahaprasad', labelHindi: 'महाप्रसाद रोस्टर', icon: <Users className="w-4 h-4" /> },
  { id: 'tools', label: 'Quick Tools', labelHindi: 'त्वरित उपकरण', icon: <Wrench className="w-4 h-4" /> },
  { id: 'settings', label: 'Festival Mood & Settings', labelHindi: 'उत्सव थीम व सेटिंग्स', icon: <Sliders className="w-4 h-4" /> },
];

// ─── Main component ───────────────────────────────────────────────────────────
function AdminPanelContent() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>('events');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNoticePosterOpen, setIsNoticePosterOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!isLoading && user?.role !== 'admin') {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#021812] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-amber-300 font-semibold text-sm">Loading Admin Panel...</p>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#021812] flex flex-col items-center justify-center px-4">
        <div className="bg-emerald-950/80 border border-emerald-700/60 rounded-3xl p-8 max-w-md w-full text-center shadow-lg backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-amber-100 mb-2">Admin Access Required</h2>
          <p className="text-emerald-200/80 text-sm mb-6">
            Please log in with your Executive Committee credentials to access this dashboard.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-emerald-950 font-bold text-sm transition-all shadow-[0_4px_20px_rgba(245,158,11,0.3)]"
            >
              Sign In as Admin
            </Link>
            <Link
              href="/"
              className="py-2.5 px-6 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700 text-amber-200 text-sm font-semibold transition-all"
            >
              Return to Community Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <div className="min-h-screen bg-[#021812] text-amber-50 flex font-sans">
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-50 w-64 bg-emerald-950/95 border-r border-emerald-700/50
        flex flex-col transition-transform duration-300 shadow-[4px_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-emerald-700/50">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-950" />
            </div>
            <div>
              <div className="text-sm font-display font-bold text-amber-200">BPSCVS Admin</div>
              <div className="text-[11px] text-emerald-300/70">समिति व्यवस्थापक</div>
            </div>
          </div>
          <div className="mt-3 px-3 py-2 rounded-xl bg-emerald-900/60 border border-emerald-700/50">
            <div className="text-[10px] text-emerald-400/80 uppercase tracking-wider font-semibold">Logged in as</div>
            <div className="text-xs font-semibold text-amber-300 truncate">{user.email}</div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all duration-150 ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-amber-500/20 to-yellow-400/20 text-amber-300 font-semibold border border-amber-400/30 shadow-sm'
                  : 'text-emerald-200/80 hover:bg-emerald-900/60 hover:text-amber-200 font-medium'
              }`}
            >
              <span className={activeSection === item.id ? 'text-amber-400' : 'text-emerald-400'}>
                {item.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs truncate">{item.label}</div>
              </div>
              {activeSection === item.id && <ChevronRight className="w-3.5 h-3.5 text-amber-400/80" />}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-emerald-700/50 space-y-1.5">
          <Link
            href="/"
            className="flex items-center gap-2 w-full px-3.5 py-2 rounded-xl text-emerald-200/80 hover:bg-emerald-900/60 hover:text-amber-200 transition-all text-xs font-semibold"
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>View Public Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3.5 py-2 rounded-xl text-red-400 hover:bg-red-900/30 transition-all text-xs font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────────── */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-emerald-950/90 border-b border-emerald-700/40 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-amber-300 hover:text-amber-100 p-1"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-amber-200 font-display">
                {NAV_ITEMS.find(n => n.id === activeSection)?.label}
              </h1>
              <p className="text-xs text-emerald-300/70">
                {NAV_ITEMS.find(n => n.id === activeSection)?.labelHindi}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Admin Panel Active
            </span>
          </div>
        </header>

        {/* Section Content */}
        <main className="flex-1 p-6 md:p-8">
          {activeSection === 'events' && (
            <EventManagementSection showToast={showToast} />
          )}
          {activeSection === 'panchang' && (
            <div>
              <SectionHeader title="Colony Festival Panchang" subtitle="Manage puja timings, cultural programme schedule, and Mahaprasad hours." />
              <div className="mt-6 bg-emerald-950/60 p-6 rounded-3xl border border-emerald-700/50 shadow-sm backdrop-blur-sm">
                <FestivalPanchangSchedule />
              </div>
            </div>
          )}
          {activeSection === 'rsvp' && (
            <RsvpRosterSection showToast={showToast} />
          )}
          {activeSection === 'tools' && (
            <QuickToolsSection
              onOpenPoster={() => setIsNoticePosterOpen(true)}
              onOpenBroadcast={() => setIsBroadcastModalOpen(true)}
            />
          )}
          {activeSection === 'settings' && (
            <FestivalSettingsSection showToast={showToast} />
          )}
        </main>
      </div>

      {/* Modals */}
      <NoticeBoardPosterModal isOpen={isNoticePosterOpen} onClose={() => setIsNoticePosterOpen(false)} events={FESTIVAL_EVENTS} />
      <WhatsAppBroadcastModal isOpen={isBroadcastModalOpen} onClose={() => setIsBroadcastModalOpen(false)} events={FESTIVAL_EVENTS} />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-emerald-950 font-bold text-sm shadow-[0_4px_20px_rgba(245,158,11,0.4)] flex items-center gap-2 animate-bounce">
          <Bell className="w-4 h-4 text-emerald-950" />
          {toast}
        </div>
      )}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-3xl font-display font-bold text-amber-200">{title}</h2>
      <p className="text-emerald-200/70 text-sm mt-1">{subtitle}</p>
    </div>
  );
}

// ─── 1. Event Management (Side-by-Side Clean Layout with Pill Buttons) ───────────
function EventManagementSection({ showToast }: { showToast: (m: string) => void }) {
  // Start empty — loadEvents() fills from localStorage/DB immediately
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedQrEvent, setSelectedQrEvent] = useState<EventItem | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Deepotsav');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('18:00');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState('');
  const [status, setStatus] = useState<'upcoming' | 'completed'>('upcoming');

  const refreshEvents = async () => {
    setLoadingEvents(true);
    const data = await getAllEvents();
    setEvents(data);
    setLoadingEvents(false);
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setCategory('Deepotsav');
    setDate('');
    setTime('18:00');
    setVenue('');
    setDescription('');
    setCover('');
    setStatus('upcoming');
  };

  const loadIntoForm = (ev: EventItem) => {
    setEditingId(ev.id);
    setName(ev.title);
    setCategory(ev.category || 'Deepotsav');
    setDate(ev.date);
    setTime(ev.time || '18:00');
    setVenue(ev.location);
    setDescription(ev.description || '');
    setCover(ev.coverImage);
    setStatus(ev.status || 'upcoming');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const coverPhoto = cover.trim() || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80';

    if (editingId) {
      await updateEvent(editingId, {
        title: name.trim(),
        category,
        slug,
        date,
        time,
        location: venue.trim(),
        description: description.trim(),
        coverImage: coverPhoto,
        status,
      });
      showToast('✅ Event updated successfully.');
    } else {
      await createEvent({
        title: name.trim(),
        category,
        slug,
        date,
        time,
        location: venue.trim(),
        description: description.trim(),
        coverImage: coverPhoto,
        status,
        isPublic: true,
      });
      showToast('✅ Event created successfully.');
    }
    resetForm();
    await refreshEvents();
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      await deleteEvent(id);
      showToast('🗑️ Event deleted.');
      await refreshEvents();
    }
  };

  const handleResetToSample = async () => {
    if (confirm('Reset events back to initial seed/sample data? This cannot be undone.')) {
      await resetToSeed();
      await refreshEvents();
      showToast('🔄 Reset to sample data.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Description Banner */}
      <div>
        <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">Admin Panel</h1>
        <p className="text-emerald-200/70 text-sm mt-1">
          Create and manage events. Changes save to this browser (via localStorage) — wire this up to the real backend when it's ready.
        </p>
      </div>

      {/* Two-Column Side-by-Side Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Create / Edit Event Form */}
        <div className="lg:col-span-4 bg-emerald-950/60 border border-emerald-700/50 rounded-3xl p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-emerald-700/50">
            <h2 className="text-lg font-display font-bold text-amber-300">
              {editingId ? 'Edit event' : 'Create event'}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-red-400 hover:text-red-300 font-semibold"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-amber-200/80 mb-1.5">Event name</label>
              <input
                required
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Annual Function 2027"
                className="w-full bg-emerald-900/50 border border-emerald-700/60 rounded-xl px-3.5 py-2.5 text-sm text-amber-50 placeholder:text-emerald-400/50 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-amber-200/80 mb-1.5">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-emerald-900/50 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-amber-50 focus:outline-none focus:border-amber-400/60"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-amber-200/80 mb-1.5">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full bg-emerald-900/50 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-amber-50 focus:outline-none focus:border-amber-400/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-200/80 mb-1.5">Venue</label>
              <input
                required
                type="text"
                value={venue}
                onChange={e => setVenue(e.target.value)}
                placeholder="e.g. Community Hall, Bani Park"
                className="w-full bg-emerald-900/50 border border-emerald-700/60 rounded-xl px-3.5 py-2.5 text-sm text-amber-50 placeholder:text-emerald-400/50 focus:outline-none focus:border-amber-400/60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-200/80 mb-1.5">Short description</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What's happening at this event?"
                className="w-full bg-emerald-900/50 border border-emerald-700/60 rounded-xl px-3.5 py-2.5 text-sm text-amber-50 placeholder:text-emerald-400/50 focus:outline-none focus:border-amber-400/60 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-200/80 mb-1.5">Cover photo URL</label>
              <input
                type="text"
                value={cover}
                onChange={e => setCover(e.target.value)}
                placeholder="https://..."
                className="w-full bg-emerald-900/50 border border-emerald-700/60 rounded-xl px-3.5 py-2 text-xs text-amber-50 placeholder:text-emerald-400/50 focus:outline-none focus:border-amber-400/60"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-amber-200/80 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-emerald-900/50 border border-emerald-700/60 rounded-xl px-2.5 py-2 text-xs text-amber-50 focus:outline-none focus:border-amber-400/60"
                >
                  <option value="Deepotsav">Deepotsav</option>
                  <option value="Cheti Chand">Cheti Chand</option>
                  <option value="Cultural">Cultural</option>
                  <option value="National">National</option>
                  <option value="Community">Community</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-200/80 mb-1.5">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as 'upcoming' | 'completed')}
                  className="w-full bg-emerald-900/50 border border-emerald-700/60 rounded-xl px-2.5 py-2 text-xs text-amber-50 focus:outline-none focus:border-amber-400/60"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-emerald-950 font-bold text-sm shadow-[0_4px_20px_rgba(245,158,11,0.3)] transition-all active:scale-[0.98]"
            >
              {editingId ? 'Save changes' : 'Create event'}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: All Events Table */}
        <div className="lg:col-span-8 bg-emerald-950/60 border border-emerald-700/50 rounded-3xl p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-emerald-700/50">
            <h2 className="text-xl font-display font-bold text-amber-300">
              {loadingEvents ? 'Loading events...' : `All events (${events.length})`}
            </h2>
            <button
              onClick={handleResetToSample}
              className="text-xs font-bold text-amber-400 hover:underline"
            >
              Reset to sample data
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-emerald-300/70 font-semibold border-b border-emerald-700/50">
                  <th className="pb-3 pl-1 font-medium">Cover</th>
                  <th className="pb-3 px-3 font-medium">Event</th>
                  <th className="pb-3 px-3 font-medium">Date</th>
                  <th className="pb-3 px-3 font-medium">Status</th>
                  <th className="pb-3 pr-1 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-800/50">
                {events.map((ev) => {
                  const isUpcoming = ev.status === 'upcoming' || (!ev.status && new Date(ev.date) >= new Date());
                  return (
                    <tr key={ev.id} className="hover:bg-emerald-900/40 transition-colors">
                      {/* Cover Thumbnail */}
                      <td className="py-3.5 pl-1">
                        <img
                          src={ev.coverImage}
                          alt={ev.title}
                          className="w-12 h-10 rounded-lg object-cover border border-emerald-700/50"
                        />
                      </td>

                      {/* Title & Venue */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-amber-100 text-sm leading-tight">{ev.title}</div>
                        <div className="text-xs text-emerald-300/60 mt-0.5">{ev.location}</div>
                      </td>

                      {/* Date — use formatFestiveDate to handle all formats */}
                      <td className="py-3.5 px-3 text-xs text-emerald-200/80 whitespace-nowrap">
                        {formatFestiveDate(ev.date)}
                      </td>

                      {/* Status Pill */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          isUpcoming
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {isUpcoming ? 'Upcoming' : 'Completed'}
                        </span>
                      </td>

                      {/* Action Pill Buttons */}
                      <td className="py-3.5 pr-1 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* View */}
                          <Link
                            href={`/event/${ev.slug || ev.id}`}
                            className="px-3 py-1 rounded-xl border border-amber-400/40 text-amber-300 hover:bg-amber-500/20 font-semibold text-xs transition-all"
                          >
                            View
                          </Link>

                          {/* Edit */}
                          <button
                            onClick={() => loadIntoForm(ev)}
                            className="px-3 py-1 rounded-xl border border-amber-400/40 text-amber-300 hover:bg-amber-500/20 font-semibold text-xs transition-all"
                          >
                            Edit
                          </button>

                          {/* Upload */}
                          <Link
                            href={`/admin/upload/${ev.id}`}
                            className="px-3 py-1 rounded-xl border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 font-semibold text-xs transition-all"
                          >
                            Upload
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(ev.id, ev.title)}
                            className="px-3 py-1 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/20 font-semibold text-xs transition-all"
                          >
                            Delete
                          </button>

                          {/* QR */}
                          <button
                            onClick={() => setSelectedQrEvent(ev)}
                            className="px-2.5 py-1 rounded-xl border border-emerald-600/40 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition-all"
                            title="QR Code"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedQrEvent && (
        <QRCodeModal
          event={selectedQrEvent}
          onClose={() => setSelectedQrEvent(null)}
        />
      )}
    </div>
  );
}

// ─── 3. RSVP Roster & Interactive Form Creator ──────────────────────────────
function RsvpRosterSection({ showToast }: { showToast: (m: string) => void }) {
  const [events, setEvents] = useState<FestivalEvent[]>(FESTIVAL_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState<string>('diwali-2024');
  const [rsvpList, setRsvpList] = useState<EventRsvpRecord[]>(INITIAL_RSVP_RECORDS);

  // Form State
  const [residentName, setResidentName] = useState('');
  const [bungalowPlot, setBungalowPlot] = useState('');
  const [phone, setPhone] = useState('');
  const [adultsCount, setAdultsCount] = useState(2);
  const [kidsCount, setKidsCount] = useState(1);
  const [dietPreference, setDietPreference] = useState<'regular' | 'jain' | 'falahar'>('regular');
  const [notes, setNotes] = useState('');
  const [search, setSearch] = useState('');

  // Load RSVPs and Events on mount
  useEffect(() => {
    async function loadRsvps() {
      const records = await getAllRsvps();
      if (records && records.length > 0) {
        setRsvpList(records);
      }
    }
    loadRsvps();
  }, []);

  // Save to localStorage when rsvpList changes
  const saveRsvps = (newList: EventRsvpRecord[]) => {
    setRsvpList(newList);
    if (typeof window !== 'undefined') {
      safeLocalStorageSet(window.localStorage, 'bpscvs_rsvp_records', JSON.stringify(newList));
      window.dispatchEvent(new Event('bpscvs_rsvp_updated'));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0] || {
    id: 'diwali-2024',
    title: 'Grand Diwali Deepotsav & Mela',
    date: '1 Nov 2024',
  };

  // Filter for metrics & cards
  const displayedRsvps = selectedEventId === 'all'
    ? rsvpList
    : rsvpList.filter((r) => r.eventId === selectedEventId || !r.eventId || r.eventId === 'deepotsav-2024' && selectedEventId === 'diwali-2024');

  const totalHeadcount = displayedRsvps.reduce(
    (acc, r) => acc + (r.isAttending ? (r.adultsCount || 0) + (r.kidsCount || 0) : 0),
    0
  );
  const totalFamilies = displayedRsvps.filter((r) => r.isAttending).length;
  const totalAdults = displayedRsvps.reduce(
    (acc, r) => acc + (r.isAttending ? r.adultsCount || 0 : 0),
    0
  );
  const totalKids = displayedRsvps.reduce(
    (acc, r) => acc + (r.isAttending ? r.kidsCount || 0 : 0),
    0
  );
  const jainCount = displayedRsvps.filter(r => r.dietPreference === 'jain').length;
  const falaharCount = displayedRsvps.filter(r => r.dietPreference === 'falahar').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!residentName.trim() || !bungalowPlot.trim()) {
      showToast('⚠️ Please enter Resident Name and Bungalow Plot number');
      return;
    }

    const newRecord: EventRsvpRecord = {
      id: `rsvp-${Date.now()}`,
      eventId: selectedEventId === 'all' ? (events[0]?.id || 'diwali-2024') : selectedEventId,
      residentName: residentName.trim(),
      bungalowPlot: bungalowPlot.trim(),
      phone: phone.trim() || '+91 98290 XXXXX',
      adultsCount,
      kidsCount,
      dietPreference,
      isAttending: true,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [newRecord, ...rsvpList];
    saveRsvps(updated);

    // Reset form
    setResidentName('');
    setBungalowPlot('');
    setPhone('');
    setAdultsCount(2);
    setKidsCount(1);
    setNotes('');

    playTempleBell(980);
    triggerPhoolBarsao();
    showToast(`✅ RSVP registered for ${residentName} (${adultsCount + kidsCount} Pax)!`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this RSVP registration?')) {
      const updated = rsvpList.filter((r) => r.id !== id);
      saveRsvps(updated);
      showToast('🗑️ RSVP record removed');
    }
  };

  const exportCsv = () => {
    const header = 'Name,Plot,Phone,Adults,Kids,Total Pax,Diet,Event,Notes,Attending\n';
    const rows = displayedRsvps.map(r =>
      `"${r.residentName}","${r.bungalowPlot}","${r.phone || ''}",${r.adultsCount},${r.kidsCount},${(r.adultsCount || 0) + (r.kidsCount || 0)},"${r.dietPreference || 'regular'}","${r.eventId || ''}","${(r.notes || '').replace(/"/g, '""')}",${r.isAttending}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `bpscvs_rsvp_${selectedEventId}.csv`; a.click();
    URL.revokeObjectURL(url);
    showToast('📥 RSVP CSV exported successfully!');
  };

  const dietLabel: Record<string, string> = { regular: 'Satvik Regular', jain: 'Pure Jain', falahar: 'Vrat Falahar' };

  // Filtered table list
  const tableFiltered = displayedRsvps.filter(r =>
    r.residentName.toLowerCase().includes(search.toLowerCase()) ||
    r.bungalowPlot.toLowerCase().includes(search.toLowerCase()) ||
    (r.phone && r.phone.includes(search)) ||
    (r.notes && r.notes.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8" id="admin-rsvp-section">
      {/* ── Top Header with Event Selector & Actions ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>उपस्थिति पंजीकरण • EVENT ATTENDANCE & RSVP</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-amber-100">
            Resident RSVP & Attendance Registration
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-2xl">
            Bani Park Sindhi Colony Vikas Samiti (BPSCVS) official attendance registration. Confirm your family attendance for upcoming colony celebrations and gatherings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-950/90 border border-amber-400/40 px-3.5 py-2 rounded-2xl shadow-sm">
            <label className="text-xs text-amber-300 font-semibold whitespace-nowrap">
              Select Festival:
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => {
                playSitarPluck('Re');
                setSelectedEventId(e.target.value);
              }}
              className="bg-transparent text-amber-100 text-xs font-bold focus:outline-none cursor-pointer"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id} className="bg-emerald-950 text-amber-100">
                  {ev.title} ({ev.date})
                </option>
              ))}
              <option value="all" className="bg-emerald-950 text-amber-100">
                ✨ All Festivals Combined
              </option>
            </select>
          </div>

          <button
            onClick={exportCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-900/80 border border-emerald-700/60 hover:bg-emerald-800 text-amber-300 text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* ── 4 Key Stat Metric Cards (Matching Screenshot) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-amber-400/40 shadow-md backdrop-blur-sm">
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>TOTAL ATTENDEES</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white mt-1">
            {totalHeadcount} <span className="text-xs text-emerald-400 font-normal">Members</span>
          </div>
          <div className="text-[11px] text-emerald-300 mt-1">
            Expected in Colony Lawn
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-700/80 shadow-md backdrop-blur-sm">
          <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-300" />
            <span>REGISTERED FAMILIES</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-200 mt-1">
            {totalFamilies} <span className="text-xs text-emerald-400 font-normal">Plots/Bungalows</span>
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1">
            Bani Park Sindhi Colony
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-700/80 shadow-md backdrop-blur-sm">
          <div className="text-[11px] font-bold text-yellow-400 uppercase tracking-wide flex items-center gap-1.5">
            <span>ADULTS (वयस्क)</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-yellow-300 mt-1">
            {totalAdults} <span className="text-xs text-emerald-400 font-normal">Adults</span>
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1">
            Registered residents
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-700/80 shadow-md backdrop-blur-sm">
          <div className="text-[11px] font-bold text-orange-400 uppercase tracking-wide flex items-center gap-1.5">
            <span>CHILDREN (बच्चे)</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-orange-300 mt-1">
            {totalKids} <span className="text-xs text-emerald-400 font-normal">Kids</span>
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1">
            Activities & celebrations
          </div>
        </div>
      </div>

      {/* ── Main Two-Column Layout: Create RSVP Form & Confirmed Roster ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive RSVP Form (Create/Register Attendance) */}
        <div className="lg:col-span-6 bg-emerald-950/70 border border-emerald-800/80 rounded-3xl p-5 sm:p-7 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-emerald-800/60">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold font-display text-amber-200 truncate">
              Quick Attendance RSVP ({activeEvent?.title || 'Selected Festival'})
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">
                  Resident Name (श्री / श्रीमती) *
                </label>
                <input
                  type="text"
                  required
                  value={residentName}
                  onChange={(e) => setResidentName(e.target.value)}
                  placeholder="e.g. Ramesh Wadhwani"
                  className="w-full px-3.5 py-2 rounded-xl bg-emerald-900/50 border border-emerald-700/80 text-amber-50 text-xs placeholder:text-emerald-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">
                  Bungalow / Plot No. *
                </label>
                <input
                  type="text"
                  required
                  value={bungalowPlot}
                  onChange={(e) => setBungalowPlot(e.target.value)}
                  placeholder="e.g. Plot 24-B, Main Road"
                  className="w-full px-3.5 py-2 rounded-xl bg-emerald-900/50 border border-emerald-700/80 text-amber-50 text-xs placeholder:text-emerald-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">
                WhatsApp Contact (Optional for Event Updates)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98290 12345"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-emerald-900/50 border border-emerald-700/80 text-amber-50 text-xs placeholder:text-emerald-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Adults & Kids Count Pickers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-800">
                <label className="block text-[11px] font-bold text-amber-300 mb-0.5">
                  Adults (वयस्क)
                </label>
                <span className="text-[10px] text-emerald-400 block mb-2">12+ years</span>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setAdultsCount((prev) => Math.max(1, prev - 1))}
                    className="w-7 h-7 rounded-lg bg-emerald-950 hover:bg-emerald-800 border border-emerald-700 text-amber-300 flex items-center justify-center font-bold text-sm"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-base font-bold font-mono text-white">{adultsCount}</span>
                  <button
                    type="button"
                    onClick={() => setAdultsCount((prev) => prev + 1)}
                    className="w-7 h-7 rounded-lg bg-emerald-950 hover:bg-emerald-800 border border-emerald-700 text-amber-300 flex items-center justify-center font-bold text-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-800">
                <label className="block text-[11px] font-bold text-amber-300 mb-0.5">
                  Children (बच्चे)
                </label>
                <span className="text-[10px] text-emerald-400 block mb-2">Below 12 years</span>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setKidsCount((prev) => Math.max(0, prev - 1))}
                    className="w-7 h-7 rounded-lg bg-emerald-950 hover:bg-emerald-800 border border-emerald-700 text-amber-300 flex items-center justify-center font-bold text-sm"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-base font-bold font-mono text-white">{kidsCount}</span>
                  <button
                    type="button"
                    onClick={() => setKidsCount((prev) => prev + 1)}
                    className="w-7 h-7 rounded-lg bg-emerald-950 hover:bg-emerald-800 border border-emerald-700 text-amber-300 flex items-center justify-center font-bold text-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Diet Preference Chips */}
            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1.5">
                Mahaprasad Catering Diet Preference
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'regular', label: 'Satvik Regular' },
                  { id: 'jain', label: 'Pure Jain' },
                  { id: 'falahar', label: 'Vrat Falahar' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDietPreference(d.id as any)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all border text-center truncate ${
                      dietPreference === d.id
                        ? 'bg-amber-500 text-emerald-950 border-amber-400 font-bold shadow-sm'
                        : 'bg-emerald-900/40 text-emerald-200 border-emerald-700/60 hover:bg-emerald-800/40'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Notes */}
            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">
                Special Notes / Accessibility Requests
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Senior citizen seating required, wheelchair access..."
                className="w-full px-3.5 py-2 rounded-xl bg-emerald-900/50 border border-emerald-700/80 text-amber-50 text-xs placeholder:text-emerald-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-emerald-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(245,158,11,0.35)] transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Attendance ({adultsCount + kidsCount} Family Members)</span>
            </button>
          </form>
        </div>

        {/* Right Column: Confirmed Attendance Cards (Live Community Roster) */}
        <div className="lg:col-span-6 bg-emerald-950/70 border border-emerald-800/80 rounded-3xl p-5 sm:p-7 shadow-lg backdrop-blur-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-800/60">
            <div>
              <h3 className="text-base sm:text-lg font-bold font-display text-amber-200 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                Confirmed Attendance ({displayedRsvps.length})
              </h3>
              <span className="text-[11px] text-emerald-300/70">Live Community Roster</span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
              {totalHeadcount} Total Pax
            </span>
          </div>

          {displayedRsvps.length === 0 ? (
            <div className="text-center py-12 text-emerald-300/60">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-xs">No RSVPs registered yet for this festival.</p>
              <p className="text-[11px] text-emerald-400/60 mt-1">Use the form on the left to add attendees!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {displayedRsvps.map((r) => {
                const paxTotal = (r.adultsCount || 0) + (r.kidsCount || 0);
                return (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-2xl bg-emerald-900/40 border border-emerald-800/70 hover:border-amber-400/40 transition-all flex flex-col gap-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-amber-100">{r.residentName}</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-[10px] font-semibold">
                          {r.bungalowPlot}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-400/20 text-[10px] font-semibold">
                          {dietLabel[r.dietPreference || 'regular']}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <span className="text-xs font-bold font-mono text-amber-300">{paxTotal} Pax</span>
                          <span className="text-[10px] text-emerald-400/80 block">{r.adultsCount}A • {r.kidsCount}K</span>
                        </div>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Delete RSVP Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {r.notes && (
                      <p className="text-[11px] text-emerald-300/90 italic pl-1 border-l-2 border-amber-400/40">
                        "{r.notes}"
                      </p>
                    )}

                    {r.phone && r.phone !== '+91 98290 XXXXX' && (
                      <div className="flex items-center justify-between pt-1 border-t border-emerald-800/40 text-[10px]">
                        <span className="text-emerald-400">{r.phone}</span>
                        <a
                          href={`https://wa.me/${r.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-300 hover:text-amber-200 font-semibold"
                        >
                          WhatsApp Chat ↗
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Complete Searchable Attendance Table ── */}
      <div className="bg-emerald-950/60 border border-emerald-700/50 rounded-3xl p-6 shadow-sm backdrop-blur-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-display font-bold text-amber-100">
            Full Attendance Register ({tableFiltered.length} Entries)
          </h3>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/60" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, plot, notes..."
              className="w-full bg-emerald-900/50 border border-emerald-700/60 rounded-xl pl-10 pr-4 py-2 text-xs text-amber-50 placeholder:text-emerald-400/50 focus:outline-none focus:border-amber-400/60"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-emerald-300/70 border-b border-emerald-700/50 pb-2 text-left">
                <th className="pb-3 font-semibold">Resident Name</th>
                <th className="pb-3 font-semibold">Plot / Bungalow</th>
                <th className="pb-3 font-semibold">Phone</th>
                <th className="text-center pb-3 font-semibold">Adults</th>
                <th className="text-center pb-3 font-semibold">Kids</th>
                <th className="text-center pb-3 font-semibold">Total Pax</th>
                <th className="pb-3 font-semibold">Diet Preference</th>
                <th className="pb-3 font-semibold">Notes</th>
                <th className="text-right pb-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-800/50">
              {tableFiltered.map((r) => (
                <tr key={r.id} className="hover:bg-emerald-900/40 transition-colors">
                  <td className="py-3 font-semibold text-amber-100">{r.residentName}</td>
                  <td className="py-3 text-emerald-200/80">{r.bungalowPlot}</td>
                  <td className="py-3 text-emerald-300/80 font-mono">{r.phone || '—'}</td>
                  <td className="py-3 text-center font-bold text-yellow-300">{r.adultsCount}</td>
                  <td className="py-3 text-center font-bold text-orange-300">{r.kidsCount}</td>
                  <td className="py-3 text-center font-bold text-amber-300 font-mono">
                    {(r.adultsCount || 0) + (r.kidsCount || 0)}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-400/20">
                      {dietLabel[r.dietPreference || 'regular']}
                    </span>
                  </td>
                  <td className="py-3 text-emerald-200/70 max-w-xs truncate">{r.notes || '—'}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── 5. Quick Tools ───────────────────────────────────────────────────────────
function QuickToolsSection({ onOpenPoster, onOpenBroadcast }: { onOpenPoster: () => void; onOpenBroadcast: () => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Executive Quick Tools" subtitle="Generate printable notices, broadcast messages, and manage communications." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="p-6 rounded-3xl bg-emerald-950/60 border border-emerald-700/50 shadow-sm flex flex-col justify-between backdrop-blur-sm">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-400 mb-4 border border-amber-400/20">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-amber-100 mb-1">Notice Board QR Poster</h3>
            <p className="text-xs text-emerald-300/60 mb-6">Generate ready-to-print official colony notice board posters with event QR codes.</p>
          </div>
          <button
            onClick={onOpenPoster}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-emerald-950 text-xs font-bold transition-all shadow-[0_4px_15px_rgba(245,158,11,0.25)]"
          >
            Open Poster Generator
          </button>
        </div>

        <div className="p-6 rounded-3xl bg-emerald-950/60 border border-emerald-700/50 shadow-sm flex flex-col justify-between backdrop-blur-sm">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-amber-100 mb-1">WhatsApp Broadcast Composer</h3>
            <p className="text-xs text-emerald-300/60 mb-6">Compose formatted invitation broadcasts with event links ready to forward to colony WhatsApp groups.</p>
          </div>
          <button
            onClick={onOpenBroadcast}
            className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-200 text-xs font-bold transition-all border border-emerald-600"
          >
            Open WhatsApp Broadcast
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 6. Festival Mood & Portal Settings ───────────────────────────────────────
function FestivalSettingsSection({ showToast }: { showToast: (m: string) => void }) {
  // Festive Theme State & Controls
  const [currentTheme, setCurrentTheme] = useState<FestiveTheme>('deepotsav');
  const [particleMode, setParticleMode] = useState<'few' | 'normal' | 'off'>('few');
  const [mandalaIntensity, setMandalaIntensity] = useState<'soft' | 'minimal' | 'off'>('soft');
  const [fairyLightsOn, setFairyLightsOn] = useState<boolean>(true);

  // Society Metadata
  const [societyName, setSocietyName] = useState('Bani Park Sindhi Colony Vikas Samiti');
  const [colonyAddress, setColonyAddress] = useState('Bani Park, Jaipur, Rajasthan - 302016');
  const [helplinePhone, setHelplinePhone] = useState('+91 98290 12345');
  const [allowPublicUploads, setAllowPublicUploads] = useState(true);
  const [allowRsvp, setAllowRsvp] = useState(true);

  // Cloud Sync
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [cloudStatus, setCloudStatus] = useState<'configured' | 'offline'>('offline');

  // Load initial settings
  useEffect(() => {
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

      const sName = localStorage.getItem('bpscvs_society_name');
      if (sName) setSocietyName(sName);

      const sAddr = localStorage.getItem('bpscvs_society_address');
      if (sAddr) setColonyAddress(sAddr);

      const sPhone = localStorage.getItem('bpscvs_helpline_phone');
      if (sPhone) setHelplinePhone(sPhone);

      const customUrl = localStorage.getItem('eventlens_supabase_url') || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const customKey = localStorage.getItem('eventlens_supabase_key') || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      setSupabaseUrl(customUrl);
      setSupabaseKey(customKey);
      if (customUrl && customUrl.startsWith('http')) {
        setCloudStatus('configured');
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSaveThemeSettings = () => {
    try {
      localStorage.setItem('bpscvs_festive_theme', currentTheme);
      localStorage.setItem('bpscvs_particle_mode', particleMode);
      localStorage.setItem('bpscvs_mandala_intensity', mandalaIntensity);
      localStorage.setItem('bpscvs_fairy_lights', String(fairyLightsOn));

      window.dispatchEvent(new CustomEvent('bpscvs_theme_settings_updated', {
        detail: { theme: currentTheme, particleMode, mandalaIntensity, fairyLightsOn }
      }));
      window.dispatchEvent(new Event('storage'));

      playSitarPluck('Sa');
      showToast('✨ Festive mood & visual settings saved as public default!');
    } catch (e) {
      showToast('⚠️ Could not save settings to localStorage');
    }
  };

  const handleSaveSocietyInfo = () => {
    try {
      localStorage.setItem('bpscvs_society_name', societyName);
      localStorage.setItem('bpscvs_society_address', colonyAddress);
      localStorage.setItem('bpscvs_helpline_phone', helplinePhone);
      playSitarPluck('Re');
      showToast('🏛️ Samiti profile details updated successfully!');
    } catch (e) {
      showToast('⚠️ Failed to save society profile');
    }
  };

  const handleSaveCloudSettings = () => {
    try {
      if (supabaseUrl.trim()) {
        localStorage.setItem('eventlens_supabase_url', supabaseUrl.trim());
      } else {
        localStorage.removeItem('eventlens_supabase_url');
      }
      if (supabaseKey.trim()) {
        localStorage.setItem('eventlens_supabase_key', supabaseKey.trim());
      } else {
        localStorage.removeItem('eventlens_supabase_key');
      }

      if (supabaseUrl.trim().startsWith('http')) {
        setCloudStatus('configured');
        showToast('☁️ Supabase Cloud credentials saved!');
      } else {
        setCloudStatus('offline');
        showToast('💾 Reverted to local storage offline mode.');
      }
    } catch {
      showToast('⚠️ Error updating cloud configuration');
    }
  };

  const handleResetSeedData = async () => {
    if (confirm('Are you sure you want to reset festival events back to the canonical seed data?')) {
      await resetToSeed();
      window.dispatchEvent(new Event('bpscvs_events_updated'));
      showToast('🔄 Database reset to official BPSCVS Festival seed data!');
    }
  };

  const themeMeta: Record<FestiveTheme, { title: string; hindi: string; desc: string; bgTone: string; accentColor: string; pillColor: string }> = {
    deepotsav: {
      title: 'Grand Diwali Deepotsav',
      hindi: 'दीपावली महा उत्सव - प्रकाश एवं सौहार्द पर्व',
      desc: 'Deepotsav Dark Emerald backdrop (#021812) with glowing Diya amber highlights and golden marigolds.',
      bgTone: '#021812',
      accentColor: '#f59e0b',
      pillColor: 'bg-amber-500 text-emerald-950',
    },
    dandiya: {
      title: 'Navratri Dandiya Raas',
      hindi: 'नवरात्रि डांडिया रास - गरबा एवं भक्ति रात्रि',
      desc: 'Royal Indigo backdrop (#09081a) with vibrant fuchsia neon accents, energetic Dandiya rhythms, and mirror-work aesthetics.',
      bgTone: '#09081a',
      accentColor: '#ec4899',
      pillColor: 'bg-fuchsia-500 text-white',
    },
    rangotsav: {
      title: 'Rangotsav (Holi Milan)',
      hindi: 'रंगोत्सव फाग महोत्सव - अबीर गुलाल मिलन',
      desc: 'Mystic Plum backdrop (#15051a) with joyous splashes of gulal pink and traditional Pichkari tunes.',
      bgTone: '#15051a',
      accentColor: '#f43f5e',
      pillColor: 'bg-pink-500 text-white',
    },
    ganesh: {
      title: 'Ganesh Utsav Mahotsav',
      hindi: 'गणेश चतुर्थी महा उत्सव - विघ्नहर्ता मंगल पर्व',
      desc: 'Sacred Saffron ochre backdrop (#1a0b02) with auspicious temple gold highlights and rhythmic dhol ambiance.',
      bgTone: '#1a0b02',
      accentColor: '#f97316',
      pillColor: 'bg-amber-600 text-white',
    },
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <SectionHeader
        title="Festival Mood & Portal Settings"
        subtitle="Manage live festive visual themes, lighting animations, society profile, and cloud synchronization."
      />

      {/* ── 1. FESTIVAL MOOD & VISUAL AMBIENCE CONTROL (Exact match to feature bar) ── */}
      <div className="p-6 md:p-8 rounded-3xl bg-emerald-950/70 border border-amber-400/30 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-emerald-800/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Palette className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-display font-bold text-amber-100">Live Festival Mood & Atmosphere</h3>
            </div>
            <p className="text-xs text-emerald-300/80">
              Select the active festival theme, mandala glow intensity, particle density, and fairy lights for all colony residents.
            </p>
          </div>

          <button
            onClick={handleSaveThemeSettings}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-emerald-950 font-bold text-xs flex items-center gap-2 transition-all shadow-[0_4px_15px_rgba(245,158,11,0.3)] shrink-0 self-start sm:self-auto"
          >
            <Save className="w-4 h-4" />
            <span>Save as Default</span>
          </button>
        </div>

        {/* The Exact Festival Mood Bar Component */}
        <div className="mb-6">
          <ThemeCustomizerBar
            currentTheme={currentTheme}
            onThemeChange={(th) => {
              setCurrentTheme(th);
              playSitarPluck(th === 'deepotsav' ? 'Sa' : th === 'dandiya' ? 'Re' : th === 'rangotsav' ? 'Ga' : 'Ma');
            }}
            particleMode={particleMode}
            onParticleModeChange={setParticleMode}
            mandalaIntensity={mandalaIntensity}
            onMandalaIntensityChange={setMandalaIntensity}
            fairyLightsOn={fairyLightsOn}
            onFairyLightsToggle={setFairyLightsOn}
          />
        </div>

        {/* Live Theme Preview Card */}
        <div
          className="p-5 rounded-2xl border transition-all duration-500"
          style={{
            backgroundColor: themeMeta[currentTheme].bgTone,
            borderColor: `${themeMeta[currentTheme].accentColor}55`,
            boxShadow: `0 8px 30px ${themeMeta[currentTheme].accentColor}20`,
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${themeMeta[currentTheme].pillColor}`}>
                  Active Mood: {themeMeta[currentTheme].title}
                </span>
                <span className="text-xs text-amber-300/80 font-medium">
                  {themeMeta[currentTheme].hindi}
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 leading-relaxed max-w-2xl">
                {themeMeta[currentTheme].desc}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2">
                <span className="text-emerald-300/80">Lights:</span>
                <span className={fairyLightsOn ? 'text-yellow-300 font-bold' : 'text-emerald-400/50'}>
                  {fairyLightsOn ? '💡 Active' : 'Off'}
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2">
                <span className="text-emerald-300/80">Particles:</span>
                <span className="text-amber-300 font-bold capitalize">{particleMode}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2">
                <span className="text-emerald-300/80">Mandala:</span>
                <span className="text-amber-300 font-bold capitalize">{mandalaIntensity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. SAMITI & COLONY PROFILE CONFIGURATION ── */}
      <div className="p-6 md:p-8 rounded-3xl bg-emerald-950/60 border border-emerald-700/50 shadow-sm backdrop-blur-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-emerald-800/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-amber-100">Samiti & Colony Information</h3>
              <p className="text-xs text-emerald-300/70">Displayed in portal footers, invitation posters, and notice board broadcasts.</p>
            </div>
          </div>
          <button
            onClick={handleSaveSocietyInfo}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-200 text-xs font-bold transition-all border border-emerald-600"
          >
            Save Info
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              Society / Samiti Title
            </label>
            <input
              type="text"
              value={societyName}
              onChange={(e) => setSocietyName(e.target.value)}
              className="w-full bg-emerald-900/50 border border-emerald-700/60 rounded-xl px-4 py-2.5 text-sm text-amber-50 focus:outline-none focus:border-amber-400/60"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              Emergency Samiti Helpline
            </label>
            <input
              type="text"
              value={helplinePhone}
              onChange={(e) => setHelplinePhone(e.target.value)}
              className="w-full bg-emerald-900/50 border border-emerald-700/60 rounded-xl px-4 py-2.5 text-sm text-amber-50 focus:outline-none focus:border-amber-400/60"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              Colony Address & Jurisdiction
            </label>
            <input
              type="text"
              value={colonyAddress}
              onChange={(e) => setColonyAddress(e.target.value)}
              className="w-full bg-emerald-900/50 border border-emerald-700/60 rounded-xl px-4 py-2.5 text-sm text-amber-50 focus:outline-none focus:border-amber-400/60"
            />
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-emerald-800/50">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-900/40 border border-emerald-800/60">
            <div>
              <div className="text-xs font-bold text-amber-200">Public Photo Drop</div>
              <div className="text-[11px] text-emerald-300/70">Allow colony residents to upload festival photos</div>
            </div>
            <button
              onClick={() => setAllowPublicUploads(!allowPublicUploads)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                allowPublicUploads
                  ? 'bg-amber-500 text-emerald-950 shadow-sm'
                  : 'bg-emerald-900/80 text-emerald-400 border border-emerald-700'
              }`}
            >
              {allowPublicUploads ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-900/40 border border-emerald-800/60">
            <div>
              <div className="text-xs font-bold text-amber-200">RSVP & Mahaprasad Roster</div>
              <div className="text-[11px] text-emerald-300/70">Accept live attendee registrations from families</div>
            </div>
            <button
              onClick={() => setAllowRsvp(!allowRsvp)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                allowRsvp
                  ? 'bg-amber-500 text-emerald-950 shadow-sm'
                  : 'bg-emerald-900/80 text-emerald-400 border border-emerald-700'
              }`}
            >
              {allowRsvp ? 'Open' : 'Closed'}
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. SUPABASE CLOUD SYNC & STORAGE ── */}
      <div className="p-6 md:p-8 rounded-3xl bg-emerald-950/60 border border-emerald-700/50 shadow-sm backdrop-blur-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-800/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-amber-100">Supabase Cloud Database & Storage</h3>
              <p className="text-xs text-emerald-300/70">Connect cloud backend for multi-device sync and high-res media storage.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              cloudStatus === 'configured'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                : 'bg-amber-500/15 text-amber-300 border border-amber-400/20'
            }`}>
              <span className={`w-2 h-2 rounded-full ${cloudStatus === 'configured' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              {cloudStatus === 'configured' ? 'Cloud Connected' : 'Local Offline Mode'}
            </span>
            <button
              onClick={handleSaveCloudSettings}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-emerald-950 font-bold text-xs transition-all shadow-sm"
            >
              Save Cloud Config
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              Supabase Project URL
            </label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full bg-emerald-900/50 border border-emerald-700/60 rounded-xl px-4 py-2.5 text-sm text-amber-50 placeholder:text-emerald-400/40 focus:outline-none focus:border-amber-400/60 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              Supabase Anon Public API Key
            </label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              className="w-full bg-emerald-900/50 border border-emerald-700/60 rounded-xl px-4 py-2.5 text-sm text-amber-50 placeholder:text-emerald-400/40 focus:outline-none focus:border-amber-400/60 font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* ── 4. SYSTEM MAINTENANCE & RECOVERY ── */}
      <div className="p-6 md:p-8 rounded-3xl bg-emerald-950/60 border border-emerald-700/50 shadow-sm backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-amber-200 mb-1 flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4 text-amber-400" /> Reset to Canonical Seed Data
          </h4>
          <p className="text-xs text-emerald-300/70">
            Restore all official BPSCVS 2026 festival events, panchang details, and default gallery images.
          </p>
        </div>

        <button
          onClick={handleResetSeedData}
          className="px-4 py-2.5 rounded-xl border border-red-500/40 text-red-300 hover:bg-red-500/20 text-xs font-bold transition-all shrink-0"
        >
          Reset All Events
        </button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#021812] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AdminPanelContent />
    </Suspense>
  );
}

