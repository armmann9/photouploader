'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Users,
  Award,
  Calendar,
  ArrowLeft,
  Flame,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  ExternalLink,
  Heart
} from 'lucide-react';
import { AboutSocietyTeam } from '@/components/utsav';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#021812] text-amber-100 font-sans selection:bg-amber-400 selection:text-emerald-950">
      {/* ── Top Navigation Bar ─────────────────────────────── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-amber-400/20 bg-[#021812]/85 backdrop-blur-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-decoration-none group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-emerald-950" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold text-amber-300 tracking-wider">BPSCVS</div>
            <div className="text-[10px] text-emerald-300/80 -mt-0.5 tracking-wide">Community Portal</div>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-amber-200 px-3 py-1.5 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-700/50 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <Link
            href="/events"
            className="text-xs font-semibold text-amber-200 hover:text-white px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 transition-all"
          >
            Events & Gallery
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-950 border border-emerald-700/60 transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>
        </nav>
      </header>

      {/* ── Page Hero ─────────────────────────────────────── */}
      <section className="relative px-4 sm:px-8 py-12 sm:py-16 border-b border-emerald-800/40 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Regd. Public Samiti Trust • Established 1968</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 tracking-tight">
            About BPSCVS
          </h1>

          <p className="text-sm sm:text-base text-emerald-200/90 max-w-2xl mx-auto leading-relaxed">
            <strong>Bani Park Sindhi Colony Vikas Samiti</strong> — dedicated to preserving timeless Sindhi cultural heritage,
            maintaining colony infrastructure, organizing grand Utsavs, and uniting generations under one shared umbrella.
          </p>

          <p className="text-xs sm:text-sm text-amber-300/75 italic max-w-xl mx-auto font-hindi">
            बनी पार्क सिंधी कॉलोनी विकास समिति — 1968 से समाज सेवा, सनातन-सिंधी संस्कृति संरक्षण एवं कॉलोनी विकास को समर्पित।
          </p>
        </div>
      </section>

      {/* ── Main Content Container ────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-12">
        {/* Key Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-emerald-950/50 border border-emerald-700/50 p-6 sm:p-8 backdrop-blur-md shadow-xl hover:border-amber-400/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-amber-200 mb-2">Grand Celebrations</h3>
            <p className="text-xs sm:text-sm text-emerald-300/80 leading-relaxed">
              Organizing Cheti Chand, Deepotsav, Dandiya Raas, Holi Sneh Milan, and Ramlila gatherings uniting 500+ resident families with authentic Mahaprasad banquets.
            </p>
          </div>

          <div className="rounded-3xl bg-emerald-950/50 border border-emerald-700/50 p-6 sm:p-8 backdrop-blur-md shadow-xl hover:border-amber-400/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-amber-200 mb-2">Community Welfare</h3>
            <p className="text-xs sm:text-sm text-emerald-300/80 leading-relaxed">
              Transparent community administration, colony park maintenance, solar commons lighting, senior citizen health camps, and youth sports tournaments.
            </p>
          </div>

          <div className="rounded-3xl bg-emerald-950/50 border border-emerald-700/50 p-6 sm:p-8 backdrop-blur-md shadow-xl hover:border-amber-400/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-amber-200 mb-2">AI Memory Archive</h3>
            <p className="text-xs sm:text-sm text-emerald-300/80 leading-relaxed">
              A private, high-resolution festival archive powered by on-device facial recognition vector embeddings so residents can instantly locate family pictures with a selfie.
            </p>
          </div>
        </div>

        {/* ── Interactive Samiti Team Directory & Wings ── */}
        <section>
          <AboutSocietyTeam />
        </section>

        {/* ── Office Timings & Samiti Bhawan Desk ─────────── */}
        <div className="rounded-3xl bg-emerald-950/70 border border-emerald-700/60 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-amber-200 mb-6 flex items-center gap-3">
              <Building2 className="w-6 h-6 text-amber-400" />
              <span>Samiti Bhawan Office & Resident Desk</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-amber-100">Samiti Bhawan & Jhulelal Community Hall</div>
                    <div className="text-emerald-300/70 mt-0.5">
                      Sindhi Colony, Near Central Park & Jhulelal Mandir, Bani Park, Jaipur, Rajasthan 302016
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="text-emerald-300/90 font-mono">+91 98290 12345 / +91 141 220 8910</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="text-emerald-300/90 font-mono">contact@bpscvs.org</span>
                </div>
              </div>

              <div className="bg-emerald-900/40 rounded-2xl p-5 border border-emerald-700/40 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Public Office Timings</span>
                </div>
                <div className="text-xs text-emerald-300/80 space-y-1">
                  <p><strong>Monday – Saturday:</strong> 10:00 AM – 1:00 PM & 5:00 PM – 8:00 PM</p>
                  <p><strong>Sunday:</strong> 10:00 AM – 2:00 PM (Samiti Sabha)</p>
                  <p className="text-amber-400/80 pt-1"><strong>Emergency Guard Gate:</strong> 24 Hours Active</p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-emerald-950 font-bold text-xs shadow-md transition-all"
                  >
                    <span>Explore Festival Calendar</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-emerald-800/50 py-8 px-4 sm:px-8 text-center bg-[#021812]/90 mt-12">
        <div className="max-w-4xl mx-auto space-y-3">
          <p className="text-xs text-emerald-300/70">
            © {new Date().getFullYear()} Bani Park Sindhi Colony Vikas Samiti (BPSCVS), Jaipur. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-amber-400/80">
            <Link href="/" className="hover:text-amber-300 transition-colors">Portal Home</Link>
            <span>•</span>
            <Link href="/events" className="hover:text-amber-300 transition-colors">Festivals</Link>
            <span>•</span>
            <Link href="/login" className="hover:text-amber-300 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
