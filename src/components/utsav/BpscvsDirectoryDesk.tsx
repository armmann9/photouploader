'use client';

import React, { useState } from 'react';
import { Phone, MessageSquare, Shield, Heart, Zap, Wrench, Ambulance, Users, Building, ExternalLink, Sparkles } from 'lucide-react';
import { BPSCVS_COMMITTEE_MEMBERS, BPSCVS_EMERGENCY_CONTACTS } from '@/data/bpscvsData';
import { playSitarPluck } from '@/utils/audio';

export const BpscvsDirectoryDesk: React.FC = () => {
  const [activeWing, setActiveWing] = useState<'all' | 'executive' | 'cultural' | 'youth' | 'senior'>('all');

  const filteredMembers =
    activeWing === 'all'
      ? BPSCVS_COMMITTEE_MEMBERS
      : BPSCVS_COMMITTEE_MEMBERS.filter((m) => m.wing === activeWing);

  const getEmergencyIcon = (type: string) => {
    switch (type) {
      case 'shield':
        return <Shield className="w-5 h-5 text-amber-400" />;
      case 'temple':
        return <Heart className="w-5 h-5 text-rose-400" />;
      case 'ambulance':
        return <Ambulance className="w-5 h-5 text-red-400" />;
      case 'zap':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'wrench':
        return <Wrench className="w-5 h-5 text-blue-400" />;
      default:
        return <Phone className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div
      className="rounded-3xl bg-gradient-to-b from-emerald-950 via-[#031d16] to-[#01140f] border border-emerald-800/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md"
      id="bpscvs-directory-desk-section"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-emerald-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <Building className="w-4 h-4 text-amber-400" />
            <span>समिति व आपातकालीन संपर्क • Official Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display text-amber-100">
            BPSCVS Committee & Emergency Helpline
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-2xl">
            Direct access to elected office bearers, festival organizing committees, and 24/7 colony emergency services for all residents of Bani Park Sindhi Colony.
          </p>
        </div>

        {/* Wing Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => {
              playSitarPluck('Sa');
              setActiveWing('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeWing === 'all'
                ? 'bg-amber-500 text-emerald-950 font-bold shadow-md'
                : 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800'
            }`}
          >
            All Office Bearers
          </button>
          <button
            onClick={() => {
              playSitarPluck('Re');
              setActiveWing('executive');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeWing === 'executive'
                ? 'bg-amber-500 text-emerald-950 font-bold shadow-md'
                : 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800'
            }`}
          >
            Executive Committee
          </button>
          <button
            onClick={() => {
              playSitarPluck('Ga');
              setActiveWing('cultural');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeWing === 'cultural'
                ? 'bg-amber-500 text-emerald-950 font-bold shadow-md'
                : 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800'
            }`}
          >
            Cultural & Mahila Mandal
          </button>
          <button
            onClick={() => {
              playSitarPluck('Pa');
              setActiveWing('youth');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeWing === 'youth'
                ? 'bg-amber-500 text-emerald-950 font-bold shadow-md'
                : 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800'
            }`}
          >
            Youth & IT Wing
          </button>
        </div>
      </div>

      {/* Part 1: Committee Members Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800/80 hover:border-amber-400/50 transition-all flex flex-col justify-between group shadow-md"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-amber-400/60 shadow-md bg-emerald-900">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors">
                    {member.name}
                  </h3>
                  <div className="text-[11px] font-medium text-amber-300 font-serif">
                    {member.hindiName}
                  </div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-900/80 text-[10px] font-bold text-amber-400 border border-emerald-700">
                    {member.designation} ({member.hindiDesignation})
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-emerald-300/80 mb-3 bg-black/20 p-2 rounded-xl">
                📍 {member.plotNo}
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-900/80">
              <a
                href={`tel:${member.phone.replace(/\s+/g, '')}`}
                className="py-1.5 px-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-emerald-700"
              >
                <Phone className="w-3.5 h-3.5 text-amber-300" />
                <span>Call</span>
              </a>

              <a
                href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  'नमस्ते, बनी पार्क सिंधी कॉलोनी विकास समिति (BPSCVS) के संबंध में जानकारी चाहिए।'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="py-1.5 px-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-emerald-600/40"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Part 2: 24x7 Colony Emergency & Utility Services */}
      <div className="border-t border-emerald-800/80 pt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-rose-400" />
            <h3 className="text-lg font-bold text-white">
              24/7 आपातकालीन व जरूरी सोसायटी सेवाएं (Emergency Helpline)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded-full">
            Verified Contacts
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BPSCVS_EMERGENCY_CONTACTS.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800 hover:border-emerald-600/80 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black/40 border border-emerald-800 flex items-center justify-center shrink-0">
                  {getEmergencyIcon(item.iconType)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-[11px] text-amber-300/90 font-serif">{item.hindiTitle}</p>
                  <p className="text-[10px] text-emerald-400 mt-0.5">{item.role} • {item.availability}</p>
                </div>
              </div>

              <a
                href={`tel:${item.phone.split('/')[0].trim().replace(/\s+/g, '')}`}
                className="w-8 h-8 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-emerald-950 border border-amber-400/40 flex items-center justify-center transition-all shrink-0 ml-2"
                title={`Call ${item.phone}`}
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
