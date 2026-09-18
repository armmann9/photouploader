import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Heart, 
  Sparkles, 
  Phone, 
  MessageSquare, 
  ArrowRight, 
  Camera, 
  Search, 
  FolderHeart, 
  Calendar, 
  Info, 
  ShieldCheck, 
  Award, 
  History,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { BPSCVS_COMMITTEE_MEMBERS, SOCIETY_MISSION_INFO } from '../data/bpscvsData';
import { CommitteeMember } from '../types';
import { playTempleBell, playSitarPluck } from '../utils/audio';

interface AboutSocietyTeamProps {
  onNavigateToSection?: (sectionId: string) => void;
}

export const AboutSocietyTeam: React.FC<AboutSocietyTeamProps> = ({ onNavigateToSection }) => {
  const [selectedWing, setSelectedWing] = useState<'all' | 'executive' | 'cultural' | 'youth' | 'senior'>('all');
  const [activeTab, setActiveTab] = useState<'team' | 'purpose' | 'heritage'>('team');
  const [showHindiText, setShowHindiText] = useState<boolean>(true);
  const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null);

  const filteredMembers = selectedWing === 'all' 
    ? BPSCVS_COMMITTEE_MEMBERS 
    : BPSCVS_COMMITTEE_MEMBERS.filter(m => m.wing === selectedWing);

  const founder = BPSCVS_COMMITTEE_MEMBERS.find(m => m.roleType === 'founder');
  const president = BPSCVS_COMMITTEE_MEMBERS.find(m => m.roleType === 'president');
  const vp = BPSCVS_COMMITTEE_MEMBERS.find(m => m.roleType === 'vice_president');
  const secretary = BPSCVS_COMMITTEE_MEMBERS.find(m => m.roleType === 'secretary');
  const treasurer = BPSCVS_COMMITTEE_MEMBERS.find(m => m.roleType === 'treasurer');
  const otherMembers = BPSCVS_COMMITTEE_MEMBERS.filter(m => !['founder', 'president', 'vice_president', 'secretary', 'treasurer'].includes(m.roleType || ''));

  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-emerald-950/90 via-emerald-900/80 to-emerald-950/95 border-2 border-amber-400/40 p-5 sm:p-8 md:p-12 shadow-[0_15px_50px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden" id="about-society-team-section">
      {/* Background Subtle Ornamental Elements */}
      <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Header Tag & Section Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-4">
          <Building2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Bani Park Sindhi Colony Vikas Samiti • Regd. 1968</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display text-amber-300 tracking-wide mb-3">
          About Us & Society Team
        </h2>
        <div className="text-lg font-serif text-amber-100/90 mb-4">
          हमारी कॉलोनी, हमारा गौरव • निस्वार्थ सेवा और सांस्कृतिक धरोहर
        </div>

        <p className="text-emerald-200/90 text-sm md:text-base leading-relaxed">
          BPSCVS is the registered resident welfare and cultural society of Sindhi Colony, Bani Park, Jaipur. Dedicated to preserving Sindhi cultural roots, civic maintenance, and empowering every family through modern community technology.
        </p>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6 p-1.5 rounded-2xl bg-emerald-950/90 border border-emerald-700/80 max-w-md mx-auto">
          <button
            id="tab-btn-team"
            onClick={() => {
              playSitarPluck('Sa');
              setActiveTab('team');
            }}
            className={`flex-1 py-2 px-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'team'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Our Society Team</span>
          </button>

          <button
            id="tab-btn-purpose"
            onClick={() => {
              playSitarPluck('Re');
              setActiveTab('purpose');
            }}
            className={`flex-1 py-2 px-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'purpose'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portal Purpose</span>
          </button>

          <button
            id="tab-btn-heritage"
            onClick={() => {
              playSitarPluck('Ga');
              setActiveTab('heritage');
            }}
            className={`flex-1 py-2 px-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'heritage'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Heritage & Stats</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OUR SOCIETY TEAM */}
      {/* ========================================================================= */}
      {activeTab === 'team' && (
        <div className="space-y-10 animate-fade-in">
          {/* Language Toggle for Short Intros */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-emerald-800/80">
            <div className="text-xs text-emerald-300 font-medium">
              Showing Executive Board & Department Leads ({BPSCVS_COMMITTEE_MEMBERS.length} Key Officers)
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-200">Language:</span>
              <button
                onClick={() => setShowHindiText(false)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  !showHindiText ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-900/80 text-emerald-300 hover:bg-emerald-800'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setShowHindiText(true)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  showHindiText ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-900/80 text-emerald-300 hover:bg-emerald-800'
                }`}
              >
                हिंदी / Sindhi
              </button>
            </div>
          </div>

          {/* 1. FOUNDER & PATRON TRIBUTE BANNER */}
          {founder && (
            <div className="relative rounded-2xl bg-gradient-to-r from-amber-950/70 via-emerald-950/80 to-amber-950/70 border-2 border-amber-400/50 p-6 md:p-8 shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-yellow-500 text-emerald-950 font-black text-[10px] sm:text-xs uppercase tracking-wider py-1 px-4 rounded-bl-xl shadow">
                FOUNDER & ETERNAL PATRON • संस्थापक
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative flex-shrink-0">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] bg-emerald-950">
                    <img 
                      src={founder.avatar} 
                      alt={founder.name}
                      className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500" 
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-emerald-950 text-[10px] font-black px-2.5 py-0.5 rounded-full whitespace-nowrap shadow">
                    EST. 1968
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-2">
                  <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
                    {founder.hindiDesignation} • {founder.designation}
                  </div>
                  <h3 className="text-2xl font-display text-yellow-200">
                    {founder.name}
                  </h3>
                  <p className="text-sm font-serif text-amber-200/90 italic">
                    {founder.hindiName}
                  </p>
                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl pt-1">
                    {showHindiText ? founder.hindiShortIntro : founder.shortIntro}
                  </p>
                  <div className="text-[11px] text-amber-300/80 font-mono pt-1">
                    {founder.tenure}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. CORE EXECUTIVE TRIUMVIRATE: PRESIDENT, VP, SECRETARY, TREASURER */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-display text-amber-300">
                Executive Leadership Board (कार्यकारिणी समिति)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* PRESIDENT CARD */}
              {president && (
                <div className="group rounded-2xl bg-emerald-950/70 hover:bg-emerald-900/70 border border-amber-400/40 hover:border-amber-300 p-5 shadow-lg transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="relative w-28 h-28 mx-auto mb-4 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-md group-hover:scale-105 transition-transform duration-300 bg-emerald-900">
                      <img 
                        src={president.avatar} 
                        alt={president.name} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-1 right-1 bg-amber-400 text-emerald-950 text-[9px] font-black px-1.5 py-0.5 rounded">
                        PRESIDENT
                      </div>
                    </div>

                    <div className="text-center mb-3">
                      <h4 className="text-base font-bold text-amber-200 group-hover:text-yellow-100 transition-colors">
                        {president.name}
                      </h4>
                      <p className="text-xs font-serif text-amber-300/80">
                        {president.hindiName}
                      </p>
                      <div className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-semibold border border-amber-400/30">
                        {president.hindiDesignation} • {president.designation}
                      </div>
                    </div>

                    <p className="text-xs text-emerald-200/90 leading-relaxed text-center mb-4 min-h-[64px]">
                      {showHindiText ? president.hindiShortIntro : president.shortIntro}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-emerald-800/80 space-y-2">
                    <div className="text-[10px] text-emerald-400 text-center font-mono">
                      {president.plotNo}
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={`tel:${president.phone.replace(/\s+/g, '')}`}
                        className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-1 border border-emerald-700 transition-all"
                      >
                        <Phone className="w-3 h-3 text-amber-400" />
                        <span>Call</span>
                      </a>
                      <a 
                        href={`https://wa.me/${president.phone.replace(/[^0-9]/g, '')}?text=Jai%20Jhulelal%20Ji%20President%20Sahab,%20regarding%20BPSCVS%20Colony...`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* VICE PRESIDENT CARD */}
              {vp && (
                <div className="group rounded-2xl bg-emerald-950/70 hover:bg-emerald-900/70 border border-amber-400/30 hover:border-amber-300 p-5 shadow-lg transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="relative w-28 h-28 mx-auto mb-4 rounded-2xl overflow-hidden border-2 border-emerald-600 shadow-md group-hover:scale-105 transition-transform duration-300 bg-emerald-900">
                      <img 
                        src={vp.avatar} 
                        alt={vp.name} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-1 right-1 bg-amber-500/90 text-emerald-950 text-[9px] font-black px-1.5 py-0.5 rounded">
                        VICE PRES.
                      </div>
                    </div>

                    <div className="text-center mb-3">
                      <h4 className="text-base font-bold text-amber-200 group-hover:text-yellow-100 transition-colors">
                        {vp.name}
                      </h4>
                      <p className="text-xs font-serif text-amber-300/80">
                        {vp.hindiName}
                      </p>
                      <div className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800/60 text-emerald-200 text-[11px] font-semibold border border-emerald-700">
                        {vp.hindiDesignation} • {vp.designation}
                      </div>
                    </div>

                    <p className="text-xs text-emerald-200/90 leading-relaxed text-center mb-4 min-h-[64px]">
                      {showHindiText ? vp.hindiShortIntro : vp.shortIntro}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-emerald-800/80 space-y-2">
                    <div className="text-[10px] text-emerald-400 text-center font-mono">
                      {vp.plotNo}
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={`tel:${vp.phone.replace(/\s+/g, '')}`}
                        className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-1 border border-emerald-700 transition-all"
                      >
                        <Phone className="w-3 h-3 text-amber-400" />
                        <span>Call</span>
                      </a>
                      <a 
                        href={`https://wa.me/${vp.phone.replace(/[^0-9]/g, '')}?text=Jai%20Jhulelal%20Ji%20VP%20Sahab...`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* GENERAL SECRETARY CARD */}
              {secretary && (
                <div className="group rounded-2xl bg-emerald-950/70 hover:bg-emerald-900/70 border border-amber-400/40 hover:border-amber-300 p-5 shadow-lg transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="relative w-28 h-28 mx-auto mb-4 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-md group-hover:scale-105 transition-transform duration-300 bg-emerald-900">
                      <img 
                        src={secretary.avatar} 
                        alt={secretary.name} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-1 right-1 bg-amber-400 text-emerald-950 text-[9px] font-black px-1.5 py-0.5 rounded">
                        SECRETARY
                      </div>
                    </div>

                    <div className="text-center mb-3">
                      <h4 className="text-base font-bold text-amber-200 group-hover:text-yellow-100 transition-colors">
                        {secretary.name}
                      </h4>
                      <p className="text-xs font-serif text-amber-300/80">
                        {secretary.hindiName}
                      </p>
                      <div className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-semibold border border-amber-400/30">
                        {secretary.hindiDesignation} • {secretary.designation}
                      </div>
                    </div>

                    <p className="text-xs text-emerald-200/90 leading-relaxed text-center mb-4 min-h-[64px]">
                      {showHindiText ? secretary.hindiShortIntro : secretary.shortIntro}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-emerald-800/80 space-y-2">
                    <div className="text-[10px] text-emerald-400 text-center font-mono">
                      {secretary.plotNo}
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={`tel:${secretary.phone.replace(/\s+/g, '')}`}
                        className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-1 border border-emerald-700 transition-all"
                      >
                        <Phone className="w-3 h-3 text-amber-400" />
                        <span>Call</span>
                      </a>
                      <a 
                        href={`https://wa.me/${secretary.phone.replace(/[^0-9]/g, '')}?text=Jai%20Jhulelal%20Ji%20Secretary%20Sahab...`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* TREASURER CARD */}
              {treasurer && (
                <div className="group rounded-2xl bg-emerald-950/70 hover:bg-emerald-900/70 border border-amber-400/30 hover:border-amber-300 p-5 shadow-lg transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="relative w-28 h-28 mx-auto mb-4 rounded-2xl overflow-hidden border-2 border-emerald-600 shadow-md group-hover:scale-105 transition-transform duration-300 bg-emerald-900">
                      <img 
                        src={treasurer.avatar} 
                        alt={treasurer.name} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-1 right-1 bg-amber-500/90 text-emerald-950 text-[9px] font-black px-1.5 py-0.5 rounded">
                        TREASURER
                      </div>
                    </div>

                    <div className="text-center mb-3">
                      <h4 className="text-base font-bold text-amber-200 group-hover:text-yellow-100 transition-colors">
                        {treasurer.name}
                      </h4>
                      <p className="text-xs font-serif text-amber-300/80">
                        {treasurer.hindiName}
                      </p>
                      <div className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800/60 text-emerald-200 text-[11px] font-semibold border border-emerald-700">
                        {treasurer.hindiDesignation} • {treasurer.designation}
                      </div>
                    </div>

                    <p className="text-xs text-emerald-200/90 leading-relaxed text-center mb-4 min-h-[64px]">
                      {showHindiText ? treasurer.hindiShortIntro : treasurer.shortIntro}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-emerald-800/80 space-y-2">
                    <div className="text-[10px] text-emerald-400 text-center font-mono">
                      {treasurer.plotNo}
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={`tel:${treasurer.phone.replace(/\s+/g, '')}`}
                        className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-1 border border-emerald-700 transition-all"
                      >
                        <Phone className="w-3 h-3 text-amber-400" />
                        <span>Call</span>
                      </a>
                      <a 
                        href={`https://wa.me/${treasurer.phone.replace(/[^0-9]/g, '')}?text=Jai%20Jhulelal%20Ji%20Treasurer%20Sahab...`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. DEPARTMENTAL LEADERS & INCHARGES */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-display text-amber-300">
                Departmental Leads & Coordinators (विभाग प्रमुख)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {otherMembers.map((member) => (
                <div 
                  key={member.id}
                  className="rounded-2xl bg-emerald-950/60 border border-emerald-800/80 p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 hover:border-amber-400/50 transition-all duration-300"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-amber-400/40 flex-shrink-0 bg-emerald-900">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-1.5">
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[11px] font-semibold border border-amber-400/20">
                      {member.hindiDesignation}
                    </div>
                    <h4 className="text-base font-bold text-amber-100">
                      {member.name}
                    </h4>
                    <p className="text-xs font-serif text-amber-300/80">
                      {member.hindiName}
                    </p>
                    <p className="text-xs text-emerald-200/90 leading-relaxed">
                      {showHindiText ? member.hindiShortIntro : member.shortIntro}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
                      <a 
                        href={`tel:${member.phone.replace(/\s+/g, '')}`}
                        className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{member.phone}</span>
                      </a>
                      <span className="text-emerald-600">•</span>
                      <span className="text-emerald-400 font-mono text-[11px]">{member.plotNo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PORTAL PURPOSE & ARCHITECTURE WORKFLOW */}
      {/* ========================================================================= */}
      {activeTab === 'purpose' && (
        <div className="space-y-10 animate-fade-in">
          {/* PROBLEM STATEMENT CARD */}
          <div className="rounded-2xl bg-red-950/30 border-2 border-red-500/40 p-6 md:p-8 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-red-500/20 border border-red-400/40 text-red-300 flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs font-bold uppercase tracking-wider">
                  The Problem We Solved (समस्या)
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-red-100">
                  {SOCIETY_MISSION_INFO.problemStatement.title}
                </h3>
                <p className="text-sm md:text-base text-red-200/90 leading-relaxed">
                  {SOCIETY_MISSION_INFO.problemStatement.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                  {SOCIETY_MISSION_INFO.problemStatement.painPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-red-200/80 bg-red-950/50 p-2.5 rounded-xl border border-red-900/50">
                      <span className="text-red-400 font-bold">✕</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SOLUTION & USER JOURNEY FLOW */}
          <div className="rounded-2xl bg-emerald-950/80 border-2 border-amber-400/50 p-6 md:p-8 space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>The Complete Digital Architecture</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display text-amber-300">
                How Utsav Mandir Works For Every Resident
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200/90 mt-1">
                Zero searching through 10,000 photos. Just follow the unified colony pipeline:
              </p>
            </div>

            {/* FLOW 1: PRIMARY PHOTO DISCOVERY PIPELINE */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 text-center sm:text-left">
                Main Loop: From Event to Personal Gallery
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {SOCIETY_MISSION_INFO.solutionArchitecture.coreLoop.map((item, idx) => (
                  <div 
                    key={idx}
                    className="relative rounded-2xl bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-700/80 p-4 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-7 h-7 rounded-full bg-amber-400 text-emerald-950 font-black text-xs flex items-center justify-center shadow">
                          {item.step}
                        </span>
                        {idx < 3 && (
                          <ArrowRight className="w-4 h-4 text-amber-400/70 hidden lg:block" />
                        )}
                      </div>

                      <h4 className="text-base font-bold text-amber-200 mb-0.5">
                        {item.title}
                      </h4>
                      <p className="text-xs font-serif text-emerald-300 mb-2">
                        {item.subtitle}
                      </p>
                      <p className="text-xs text-emerald-200/80 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-emerald-800/60">
                      {idx === 0 && onNavigateToSection && (
                        <button 
                          onClick={() => onNavigateToSection('festival-albums-section')}
                          className="w-full py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-amber-300 text-[11px] font-semibold flex items-center justify-center gap-1 border border-emerald-700"
                        >
                          <span>Go to Events</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                      {idx === 2 && onNavigateToSection && (
                        <button 
                          onClick={() => onNavigateToSection('face-match-portal')}
                          className="w-full py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 text-[11px] font-extrabold flex items-center justify-center gap-1 shadow"
                        >
                          <span>Try Face Match</span>
                          <Search className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FLOW 2: COMPANION EVENT & LEADERSHIP PIPELINE */}
            <div className="space-y-3 pt-4 border-t border-emerald-800/80">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 text-center sm:text-left">
                Companion Loop: Information, RSVP & Leadership
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {SOCIETY_MISSION_INFO.solutionArchitecture.companionLoop.map((item, idx) => (
                  <div 
                    key={idx}
                    className="rounded-2xl bg-emerald-950/80 border border-emerald-800 p-4 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-amber-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-amber-200">
                        {item.title}
                      </h4>
                      <p className="text-xs text-emerald-200/80 leading-relaxed mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: HERITAGE & KEY METRICS */}
      {/* ========================================================================= */}
      {activeTab === 'heritage' && (
        <div className="space-y-10 animate-fade-in">
          {/* Key Colony Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SOCIETY_MISSION_INFO.stats.map((stat, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-emerald-950/70 border border-amber-400/30 text-center backdrop-blur-sm"
              >
                <div className="text-3xl sm:text-4xl font-display text-amber-300 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs font-serif text-emerald-200">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Historical Timeline */}
          <div className="rounded-2xl bg-emerald-950/70 border border-emerald-800 p-6 md:p-8 space-y-6">
            <h3 className="text-xl font-display text-amber-300 flex items-center gap-2">
              <History className="w-5 h-5 text-amber-400" />
              <span>Colony Milestones & Heritage (इतिहास यात्रा)</span>
            </h3>

            <div className="space-y-4 border-l-2 border-amber-400/40 ml-3 pl-5">
              <div className="relative">
                <span className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-amber-400 ring-4 ring-emerald-950" />
                <div className="text-xs font-bold text-amber-400">1968</div>
                <h4 className="text-sm font-bold text-yellow-100">Bani Park Sindhi Colony Founded</h4>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  Under the stewardship of Late Shri Kishanchand Wadhwani and senior elders, residential plots were laid out with broad avenues and designated parklands.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-amber-400 ring-4 ring-emerald-950" />
                <div className="text-xs font-bold text-amber-400">1974</div>
                <h4 className="text-sm font-bold text-yellow-100">Jhulelal Mandir & Community Well</h4>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  Consecration of the central colony temple where Cheti Chand Chhajj and daily evening aartis continue with devotion.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-amber-400 ring-4 ring-emerald-950" />
                <div className="text-xs font-bold text-amber-400">2012</div>
                <h4 className="text-sm font-bold text-yellow-100">Modern Community Hall & Seniors Library</h4>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  Air-conditioned multipurpose banquet hall for family functions, yoga sessions, and youth mentoring.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-amber-400 ring-4 ring-emerald-950" />
                <div className="text-xs font-bold text-amber-400">2024</div>
                <h4 className="text-sm font-bold text-yellow-100">Utsav Mandir AI Event Portal</h4>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  First colony in Jaipur with instant AI facial matching, digital Mahaprasad RSVP, and printable notice posters for all residents.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
