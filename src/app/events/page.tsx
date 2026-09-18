'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Search, Eye, Sparkles, ArrowLeft, Flame, Award } from 'lucide-react';
import { getAllEvents } from '@/lib/db';
import { EventItem } from '@/lib/types';
import { formatFestiveDate } from '@/utils/dateUtils';
import EventCard from '@/components/EventCard';

export default function EventsDirectoryPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getAllEvents();
      setEvents(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredEvents = events.filter((ev) => {
    const isUpcoming = ev.status === 'upcoming' || (!ev.status && new Date(ev.date) >= new Date());
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'upcoming'
        ? isUpcoming
        : !isUpcoming;

    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.description && ev.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const totalCount = events.length;
  const upcomingCount = events.filter(e => e.status === 'upcoming' || (!e.status && new Date(e.date) >= new Date())).length;
  const completedCount = totalCount - upcomingCount;

  return (
    <div className="min-h-screen bg-[#021812] text-amber-50 selection:bg-amber-500 selection:text-emerald-950 font-sans relative overflow-x-hidden">
      {/* Background Lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[650px] h-[650px] rounded-full bg-amber-500/[0.06] blur-[120px]" />
        <div className="absolute top-1/2 right-[-10%] w-[650px] h-[650px] rounded-full bg-emerald-500/[0.07] blur-[120px]" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 px-6 sm:px-12 py-4 flex items-center justify-between border-b border-amber-500/10 backdrop-blur-md bg-emerald-950/30">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_16px_rgba(245,158,11,0.35)] group-hover:scale-105 transition-transform">
            <Flame className="w-4 h-4 text-[#021812] fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base text-amber-300 tracking-wider">BPSCVS</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-semibold border border-amber-400/30">DIRECTORY</span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-300/80 hover:text-amber-300 px-4 py-2 rounded-xl bg-emerald-900/40 border border-emerald-700/40 hover:border-amber-400/50 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Community Portal</span>
          </Link>
          <Link
            href="/login"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-400/30 hover:bg-amber-500/20 transition-all"
          >
            <span>🔐 Staff Portal</span>
          </Link>
        </div>
      </header>

      {/* Directory Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-950/80 via-emerald-900/40 to-[#021812]/90 border border-amber-500/30 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Bani Park Sindhi Colony Vikas Samiti</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-amber-100 mb-3">
            All Colony Festivals & Events
          </h1>
          <p className="text-emerald-300/80 text-sm sm:text-base max-w-2xl leading-relaxed">
            Explore upcoming and past community celebrations, cultural nights, Deepotsav Maha Utsav, Cheti Chand processions, and samiti gatherings in Bani Park.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-800/60 mb-8 backdrop-blur-md">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-amber-500 text-emerald-950 shadow-sm'
                  : 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-900/70'
              }`}
            >
              All Festivals ({totalCount})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-emerald-500 text-emerald-950 shadow-sm'
                  : 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-900/70'
              }`}
            >
              Upcoming ({upcomingCount})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'completed'
                  ? 'bg-yellow-600 text-white shadow-sm'
                  : 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-900/70'
              }`}
            >
              Archive ({completedCount})
            </button>
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
            <input
              type="text"
              placeholder="Search festival or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#021812]/90 border border-emerald-700/60 rounded-xl pl-10 pr-4 py-2 text-xs text-amber-100 placeholder:text-emerald-600 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-20 text-emerald-400/70">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading festival archives...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 p-8 rounded-3xl bg-emerald-950/40 border border-emerald-800/50">
            <h3 className="text-xl font-bold text-amber-200 mb-1">No Festivals Found</h3>
            <p className="text-xs text-emerald-400/60">
              Try adjusting your search query or filter tab.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {filteredEvents.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
