'use client';

import React, { useState, useEffect } from 'react';
import { Users, CheckCircle2, Phone, MapPin, Sparkles, Plus, Minus, UserCheck, Calendar } from 'lucide-react';
import { FestivalEvent, EventRsvpRecord } from '@/types/utsav';
import { INITIAL_RSVP_RECORDS } from '@/data/bpscvsData';
import { playTempleBell, playSitarPluck } from '@/utils/audio';
import { triggerPhoolBarsao } from '@/utils/confetti';
import { getAllRsvps, saveRsvpRecord, safeLocalStorageSet } from '@/lib/db';

interface BpscvsRsvpWidgetProps {
  events: FestivalEvent[];
  initialSelectedEventId?: string;
}

export const BpscvsRsvpWidget: React.FC<BpscvsRsvpWidgetProps> = ({
  events,
  initialSelectedEventId,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(
    initialSelectedEventId || events[0]?.id || 'diwali-2024'
  );

  const [rsvpList, setRsvpList] = useState<EventRsvpRecord[]>(INITIAL_RSVP_RECORDS);

  useEffect(() => {
    async function loadRsvps() {
      const records = await getAllRsvps();
      if (records && records.length > 0) {
        setRsvpList(records);
      }
    }
    loadRsvps();

    const handleUpdate = () => {
      getAllRsvps().then((records) => {
        if (records && records.length > 0) setRsvpList(records);
      });
    };
    window.addEventListener('bpscvs_rsvp_updated', handleUpdate);
    return () => window.removeEventListener('bpscvs_rsvp_updated', handleUpdate);
  }, []);

  // Form State
  const [residentName, setResidentName] = useState('');
  const [bungalowPlot, setBungalowPlot] = useState('');
  const [phone, setPhone] = useState('');
  const [adultsCount, setAdultsCount] = useState(2);
  const [kidsCount, setKidsCount] = useState(1);
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<EventRsvpRecord | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      safeLocalStorageSet(window.localStorage, 'bpscvs_rsvp_records', JSON.stringify(rsvpList));
    }
  }, [rsvpList]);

  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0];

  // Calculations for active event
  const eventRsvps = rsvpList.filter((r) => r.eventId === selectedEventId);
  const totalHeadcount = eventRsvps.reduce(
    (acc, r) => acc + (r.isAttending ? r.adultsCount + r.kidsCount : 0),
    0
  );
  const totalFamilies = eventRsvps.filter((r) => r.isAttending).length;
  const totalAdults = eventRsvps.reduce(
    (acc, r) => acc + (r.isAttending ? r.adultsCount : 0),
    0
  );
  const totalKids = eventRsvps.reduce(
    (acc, r) => acc + (r.isAttending ? r.kidsCount : 0),
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!residentName.trim() || !bungalowPlot.trim()) return;

    const newRecord: EventRsvpRecord = {
      id: `rsvp-${Date.now()}`,
      eventId: selectedEventId,
      residentName: residentName.trim(),
      bungalowPlot: bungalowPlot.trim(),
      phone: phone.trim() || '+91 98290 XXXXX',
      adultsCount,
      kidsCount,
      dietPreference: 'regular',
      isAttending: true,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    setRsvpList((prev) => [newRecord, ...prev]);
    setSubmittedRecord(newRecord);
    setIsSubmitted(true);
    playTempleBell(980);
    triggerPhoolBarsao();

    // Persist to Supabase if configured and dispatch update
    await saveRsvpRecord(newRecord);
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setSubmittedRecord(null);
    setResidentName('');
    setBungalowPlot('');
    setPhone('');
    setAdultsCount(2);
    setKidsCount(1);
    setNotes('');
  };

  return (
    <div
      className="rounded-3xl bg-gradient-to-b from-emerald-900/80 via-emerald-950/90 to-[#021812] border border-amber-400/40 p-6 sm:p-8 shadow-2xl backdrop-blur-md"
      id="bpscvs-rsvp-counter-section"
    >
      {/* Header with Colony Branding */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-emerald-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>उपस्थिति पंजीकरण • Event Attendance & RSVP</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display text-amber-100">
            Resident RSVP & Attendance Registration
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-2xl">
            Bani Park Sindhi Colony Vikas Samiti (BPSCVS) official attendance registration. Confirm your family attendance for upcoming colony celebrations and gatherings.
          </p>
        </div>

        {/* Event Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-amber-300 font-semibold whitespace-nowrap">
            Select Festival:
          </label>
          <select
            id="rsvp-event-selector"
            value={selectedEventId}
            onChange={(e) => {
              playSitarPluck('Re');
              setSelectedEventId(e.target.value);
              setIsSubmitted(false);
            }}
            className="px-3 py-2 rounded-xl bg-emerald-950 text-amber-200 border border-amber-400/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id} className="bg-emerald-950 text-amber-100">
                {ev.title} ({ev.date})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Committee Attendance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-amber-400/40 shadow-md">
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Total Attendees</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white mt-1">
            {totalHeadcount} <span className="text-xs text-emerald-400 font-normal">Members</span>
          </div>
          <div className="text-[11px] text-emerald-300 mt-1">
            Expected in Colony Lawn
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-700/80 shadow-md">
          <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-300" />
            <span>Registered Families</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-200 mt-1">
            {totalFamilies} <span className="text-xs text-emerald-400 font-normal">Plots/Bungalows</span>
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1">
            Bani Park Sindhi Colony
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-700/80 shadow-md">
          <div className="text-[11px] font-bold text-yellow-400 uppercase tracking-wide flex items-center gap-1.5">
            <span>Adults (वयस्क)</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-yellow-300 mt-1">
            {totalAdults} <span className="text-xs text-emerald-400 font-normal">Adults</span>
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1">
            Registered residents
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-700/80 shadow-md">
          <div className="text-[11px] font-bold text-orange-400 uppercase tracking-wide flex items-center gap-1.5">
            <span>Children (बच्चे)</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-orange-300 mt-1">
            {totalKids} <span className="text-xs text-emerald-400 font-normal">Kids</span>
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1">
            Activities & celebrations
          </div>
        </div>
      </div>

      {/* Main Interactive RSVP Form Layout */}
      <div className="max-w-2xl mx-auto w-full">
        {/* Interactive RSVP Form (or Confirmation Card) */}
        <div className="bg-emerald-950/70 border border-emerald-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md">
          {isSubmitted && submittedRecord ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                BPSCVS RSVP Confirmed
              </span>
              <h3 className="text-xl sm:text-2xl font-display text-white mt-1">
                धन्यवाद, {submittedRecord.residentName}!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 mb-6">
                Your family's attendance has been recorded for {activeEvent.title}.
              </p>

              {/* Receipt Summary Card */}
              <div className="p-4 rounded-2xl bg-black/40 border border-amber-400/40 text-left max-w-md mx-auto mb-6 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-emerald-400">Plot / Bungalow:</span>
                  <span className="font-bold text-white">{submittedRecord.bungalowPlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400">Registered Members:</span>
                  <span className="font-bold text-white">
                    {submittedRecord.adultsCount} Adults + {submittedRecord.kidsCount} Kids ({submittedRecord.adultsCount + submittedRecord.kidsCount} Total)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400">Contact Number:</span>
                  <span className="font-bold text-white">{submittedRecord.phone}</span>
                </div>
                {submittedRecord.notes && (
                  <div className="flex justify-between pt-1 border-t border-emerald-900">
                    <span className="text-emerald-400">Special Note:</span>
                    <span className="text-emerald-200 italic">{submittedRecord.notes}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleResetForm}
                className="px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-semibold text-xs transition-colors border border-emerald-700"
              >
                + Register Another Family Member / Neighbor
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-emerald-800/80">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-amber-200">
                  Quick Attendance RSVP ({activeEvent.title})
                </h3>
              </div>

              {/* Resident Name and Plot Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-emerald-300 font-semibold mb-1">
                    Resident Name (श्री / श्रीमती) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Wadhwani"
                    value={residentName}
                    onChange={(e) => setResidentName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-emerald-950 border border-emerald-700 text-white text-xs placeholder-emerald-600 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-emerald-300 font-semibold mb-1">
                    Bungalow / Plot No. *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Plot 24-B, Main Road"
                    value={bungalowPlot}
                    onChange={(e) => setBungalowPlot(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-emerald-950 border border-emerald-700 text-white text-xs placeholder-emerald-600 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* WhatsApp Contact */}
              <div>
                <label className="block text-xs text-emerald-300 font-semibold mb-1">
                  WhatsApp Contact (Optional for Event Updates)
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-emerald-500" />
                  <input
                    type="tel"
                    placeholder="+91 98290 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-emerald-950 border border-emerald-700 text-white text-xs placeholder-emerald-600 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Adults and Kids Counter Controls */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Adults (वयस्क)</span>
                    <span className="text-[10px] text-emerald-400">12+ years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdultsCount((c) => Math.max(1, c - 1))}
                      className="w-7 h-7 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-bold text-sm text-white w-4 text-center">
                      {adultsCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAdultsCount((c) => c + 1)}
                      className="w-7 h-7 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Children (बच्चे)</span>
                    <span className="text-[10px] text-emerald-400">Below 12 years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setKidsCount((c) => Math.max(0, c - 1))}
                      className="w-7 h-7 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-bold text-sm text-white w-4 text-center">
                      {kidsCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setKidsCount((c) => c + 1)}
                      className="w-7 h-7 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs text-emerald-300 font-semibold mb-1">
                  Special Notes / Accessibility Requests
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior citizen seating required, wheelchair access..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-emerald-950 border border-emerald-700 text-white text-xs placeholder-emerald-600 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="submit-rsvp-btn"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-emerald-950 font-extrabold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 border border-amber-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                <span>Confirm Attendance ({adultsCount + kidsCount} Family Members)</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
