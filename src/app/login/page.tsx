'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import {
  Eye,
  EyeOff,
  Zap,
  Camera,
  ShieldCheck,
  Users,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
  Calendar,
  Flame,
  Award,
} from 'lucide-react';

type RoleTab = 'admin' | 'photographer' | 'resident';

export default function ModernLoginPage() {
  const router = useRouter();
  const { login, loginAsResident, user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<RoleTab>('admin');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Tab change handler
  const handleTabChange = (tab: RoleTab) => {
    setActiveTab(tab);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (activeTab === 'resident') {
      loginAsResident();
      router.replace('/');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const ok = await login(activeTab, email, password);
      if (ok) {
        router.replace(activeTab === 'admin' ? '/admin' : '/studio');
      } else {
        setError('Invalid credentials. Please verify email and password.');
        setSubmitting(false);
      }
    } catch {
      setError('An unexpected login error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#021812] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-amber-200/70 text-sm font-medium">Securing session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02140e] text-amber-50 flex flex-col justify-between relative overflow-x-hidden selection:bg-amber-500 selection:text-emerald-950 font-sans">
      {/* Background Lighting & Atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[650px] h-[650px] rounded-full bg-amber-500/[0.07] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[650px] h-[650px] rounded-full bg-emerald-500/[0.08] blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-amber-400/[0.03] blur-[140px]" />
        
        {/* Subtle decorative grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(rgba(245, 158, 11, 0.8) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Top Navbar Header */}
      <header className="relative z-20 px-6 sm:px-12 py-5 flex items-center justify-between border-b border-amber-500/10 backdrop-blur-md bg-emerald-950/20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_18px_rgba(245,158,11,0.35)] group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-[#021812] fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-amber-300 tracking-wider">BPSCVS</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-semibold border border-amber-400/30">PORTAL</span>
            </div>
            <p className="text-[11px] text-emerald-300/70 font-medium">बनी पार्क सिंधी कॉलोनी विकास समिति</p>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-300/80 hover:text-amber-300 px-4 py-2 rounded-xl bg-emerald-900/30 border border-emerald-700/40 hover:border-amber-400/50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Gallery</span>
        </Link>
      </header>

      {/* Main Split-Screen Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* LEFT COLUMN: Royal Visual & Value Showcase */}
          <div className="lg:col-span-6 flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-950/70 via-emerald-900/30 to-[#021812]/90 border border-amber-500/20 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Top Banner Tag */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>॥ श्री झूलेलाल विजयते ॥ Official Portal</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-display font-bold text-amber-100 leading-tight mb-4">
                Preserving Memories,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
                  Empowering Community
                </span>
              </h1>

              <p className="text-emerald-200/70 text-sm sm:text-base leading-relaxed mb-8">
                Welcome to the unified digital command center for Bani Park Sindhi Colony Vikas Samiti. Manage festivals, index high-definition photos with AI face search, and orchestrate colony events.
              </p>

              {/* 3 Pillars Showcase Cards */}
              <div className="space-y-3.5">
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-emerald-900/40 border border-emerald-700/40 hover:border-amber-400/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-amber-200">Executive Samiti Administration</h2>
                    <p className="text-xs text-emerald-300/70 mt-0.5">Manage Panchang calendars, Mahaprasad RSVPs, moderate photos, and broadcast instant notices.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-emerald-900/40 border border-emerald-700/40 hover:border-emerald-400/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-400">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-amber-200">Official Photographer Studio</h2>
                    <p className="text-xs text-emerald-300/70 mt-0.5">High-speed bulk photo uploads, event tagger, and interactive 24-point festival shot lists.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-emerald-900/40 border border-emerald-700/40 hover:border-amber-400/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/15 border border-yellow-400/30 flex items-center justify-center shrink-0 text-yellow-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-amber-200">Resident Digital Experience</h2>
                    <p className="text-xs text-emerald-300/70 mt-0.5">Instant AI Face Recognition to locate family photos across 10,000+ festival captures.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Colony Seal */}
            <div className="mt-8 pt-6 border-t border-emerald-800/40 flex items-center justify-between text-xs text-emerald-400/70">
              <span className="flex items-center gap-1.5 font-medium">
                <Award className="w-4 h-4 text-amber-400" /> Bani Park, Jaipur (Raj.)
              </span>
              <span className="font-mono text-[11px] text-amber-400/60">ESTD 1978</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Modern Auth Interactive Card */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="p-8 sm:p-10 rounded-3xl bg-emerald-950/80 border border-amber-500/30 shadow-[0_32px_100px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative">
              
              {/* Segmented Top Tabs */}
              <div className="grid grid-cols-3 p-1.5 rounded-2xl bg-[#021812]/90 border border-emerald-800/60 mb-8">
                <button
                  type="button"
                  onClick={() => handleTabChange('admin')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                    activeTab === 'admin'
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-[0_4px_16px_rgba(245,158,11,0.3)]'
                      : 'text-emerald-300/70 hover:text-amber-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('photographer')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                    activeTab === 'photographer'
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-[0_4px_16px_rgba(16,185,129,0.3)]'
                      : 'text-emerald-300/70 hover:text-amber-200'
                  }`}
                >
                  <Camera className="w-4 h-4 shrink-0" />
                  <span>Studio</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('resident')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                    activeTab === 'resident'
                      ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-[0_4px_16px_rgba(234,179,8,0.3)]'
                      : 'text-emerald-300/70 hover:text-amber-200'
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Resident</span>
                </button>
              </div>

              {/* TAB 1 & 2: ADMIN / PHOTOGRAPHER FORM */}
              {activeTab !== 'resident' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-amber-200 tracking-tight">
                      {activeTab === 'admin' ? 'Executive Admin Login' : 'Photographer Studio Login'}
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-300/70 mt-1">
                      {activeTab === 'admin'
                        ? 'Enter committee credentials to access event controls & rosters'
                        : 'Sign in to access bulk photo ingestion and shot lists'}
                    </p>
                  </div>

                  {/* Login Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-emerald-300/90 mb-1.5">Official Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@bpscvs.org"
                          className="w-full bg-[#021812]/80 border border-emerald-700/60 rounded-xl pl-10 pr-4 py-3 text-sm text-amber-100 placeholder:text-emerald-600 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-emerald-300/90 mb-1.5">Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#021812]/80 border border-emerald-700/60 rounded-xl pl-10 pr-11 py-3 text-sm text-amber-100 placeholder:text-emerald-600 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60 hover:text-amber-300 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                        <span>⚠️</span>
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting || !email || !password}
                      className={`w-full mt-2 py-3.5 px-4 rounded-xl font-bold text-sm shadow-[0_8px_24px_rgba(245,158,11,0.25)] transition-all flex items-center justify-center gap-2 ${
                        activeTab === 'admin'
                          ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white hover:from-amber-400 hover:to-amber-600'
                          : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white hover:from-emerald-400 hover:to-emerald-600'
                      } active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                          <span>Signing in to {activeTab === 'admin' ? 'Admin Panel' : 'Studio'}...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to {activeTab === 'admin' ? 'Executive Admin' : 'Photographer Studio'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: RESIDENT PORTAL GATEWAY */}
              {activeTab === 'resident' && (
                <div className="text-center py-2">
                  <div className="w-16 h-16 rounded-2xl bg-yellow-500/15 border border-yellow-400/30 flex items-center justify-center mx-auto mb-4 text-yellow-400 shadow-[0_0_24px_rgba(234,179,8,0.2)]">
                    <Users className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-amber-200 mb-2">Welcome, Colony Resident!</h2>
                  <p className="text-emerald-300/70 text-sm max-w-sm mx-auto mb-6">
                    No password is required to explore festival galleries, search family pictures with AI face recognition, or submit RSVPs.
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-left mb-6">
                    <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/40">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> AI Face Match
                      </div>
                      <p className="text-[11px] text-emerald-300/60">Find every photo of you with 1 selfie scan.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/40">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" /> Utsav Panchang
                      </div>
                      <p className="text-[11px] text-emerald-300/60">View upcoming festival dates and timings.</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      loginAsResident();
                      router.replace('/');
                    }}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-emerald-950 font-bold text-sm shadow-[0_8px_28px_rgba(245,158,11,0.35)] hover:from-amber-400 hover:to-yellow-400 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <span>Enter Community Portal as Resident</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Bottom Security Footer */}
              <div className="mt-8 pt-5 border-t border-emerald-800/40 flex items-center justify-between text-[11px] text-emerald-400/60">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" /> 256-bit Encrypted Session
                </span>
                <span>BPSCVS v1.0 • 2026</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-emerald-400/50 border-t border-amber-500/10 backdrop-blur-md">
        © 2026 Bani Park Sindhi Colony Vikas Samiti (BPSCVS) • Jaipur, Rajasthan
      </footer>
    </div>
  );
}
