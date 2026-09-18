import React, { useState, useEffect } from 'react';
import { Utensils, Users, CheckCircle2, AlertCircle, Heart, Phone, MapPin, Sparkles, Download, Share2, Plus, Minus } from 'lucide-react';
import { FestivalEvent, EventRsvpRecord } from '../types';
import { INITIAL_RSVP_RECORDS } from '../data/bpscvsData';
import { playTempleBell, playSitarPluck } from '../utils/audio';
import { triggerPhoolBarsao } from '../utils/confetti';

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

  const [rsvpList, setRsvpList] = useState<EventRsvpRecord[]>(() => {
    const saved = localStorage.getItem('bpscvs_rsvp_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_RSVP_RECORDS;
      }
    }
    return INITIAL_RSVP_RECORDS;
  });

  // Form State
  const [residentName, setResidentName] = useState('');
  const [bungalowPlot, setBungalowPlot] = useState('');
  const [phone, setPhone] = useState('');
  const [adultsCount, setAdultsCount] = useState(2);
  const [kidsCount, setKidsCount] = useState(1);
  const [dietPreference, setDietPreference] = useState<'regular' | 'jain' | 'falahar'>('regular');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<EventRsvpRecord | null>(null);

  useEffect(() => {
    localStorage.setItem('bpscvs_rsvp_records', JSON.stringify(rsvpList));
  }, [rsvpList]);

  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0];

  // Calculations for active event
  const eventRsvps = rsvpList.filter((r) => r.eventId === selectedEventId);
  const totalHeadcount = eventRsvps.reduce(
    (acc, r) => acc + (r.isAttending ? r.adultsCount + r.kidsCount : 0),
    0
  );
  const totalAdults = eventRsvps.reduce(
    (acc, r) => acc + (r.isAttending ? r.adultsCount : 0),
    0
  );
  const totalKids = eventRsvps.reduce(
    (acc, r) => acc + (r.isAttending ? r.kidsCount : 0),
    0
  );
  const regularPlates = eventRsvps
    .filter((r) => r.dietPreference === 'regular' && r.isAttending)
    .reduce((acc, r) => acc + r.adultsCount + r.kidsCount, 0);
  const jainPlates = eventRsvps
    .filter((r) => r.dietPreference === 'jain' && r.isAttending)
    .reduce((acc, r) => acc + r.adultsCount + r.kidsCount, 0);
  const falaharPlates = eventRsvps
    .filter((r) => r.dietPreference === 'falahar' && r.isAttending)
    .reduce((acc, r) => acc + r.adultsCount + r.kidsCount, 0);

  const handleSubmit = (e: React.FormEvent) => {
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
      dietPreference,
      isAttending: true,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    setRsvpList((prev) => [newRecord, ...prev]);
    setSubmittedRecord(newRecord);
    setIsSubmitted(true);
    playTempleBell(980);
    triggerPhoolBarsao();
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setSubmittedRecord(null);
    setResidentName('');
    setBungalowPlot('');
    setPhone('');
    setAdultsCount(2);
    setKidsCount(1);
    setDietPreference('regular');
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
            <Utensils className="w-4 h-4 text-amber-400" />
            <span>भोजन व बैठक व्यवस्था • Live Mahaprasad Plate Counter</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display text-amber-100">
            Resident RSVP & Dinner Attendance
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-2xl">
            Bani Park Sindhi Colony Vikas Samiti (BPSCVS) official head-count planner. Confirm your family attendance so the catering committee can prepare fresh satvik prasad without food wastage.
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

      {/* Live Committee Catering Metrics (The 3 Key Plate Metrics) */}
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
            {totalAdults} Adults • {totalKids} Kids
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-700/80 shadow-md">
          <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-emerald-300" />
            <span>Standard Satvik</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-200 mt-1">
            {regularPlates} <span className="text-xs text-emerald-400 font-normal">Plates</span>
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1">
            Traditional festive thali
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-700/80 shadow-md">
          <div className="text-[11px] font-bold text-yellow-400 uppercase tracking-wide flex items-center gap-1.5">
            <span>🌾 Jain Satvik</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-yellow-300 mt-1">
            {jainPlates} <span className="text-xs text-emerald-400 font-normal">Plates</span>
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1">
            No onion, garlic or root veg
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-700/80 shadow-md">
          <div className="text-[11px] font-bold text-orange-400 uppercase tracking-wide flex items-center gap-1.5">
            <span>🍎 Vrat / Falahar</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-orange-300 mt-1">
            {falaharPlates} <span className="text-xs text-emerald-400 font-normal">Plates</span>
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1">
            Kuttu, sabudana & fruit prasad
          </div>
        </div>
      </div>

      {/* Main Form & Live Roster Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive RSVP Form (or Confirmation Card) */}
        <div className="lg:col-span-7 bg-emerald-950/70 border border-emerald-800 rounded-2xl p-5 sm:p-6">
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
                Your family's seating & Mahaprasad plates have been recorded for {activeEvent.title}.
              </p>

              {/* Receipt Summary Card */}
              <div className="p-4 rounded-xl bg-black/40 border border-amber-400/40 text-left max-w-md mx-auto mb-6 text-xs space-y-2">
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
                  <span className="text-emerald-400">Prasad Meal Preference:</span>
                  <span className="font-bold text-amber-300 capitalize">
                    {submittedRecord.dietPreference} Satvik
                  </span>
                </div>
                {submittedRecord.notes && (
                  <div className="flex justify-between pt-1 border-t border-emerald-900">
                    <span className="text-emerald-400">Special Note:</span>
                    <span className="text-emerald-200 italic">{submittedRecord.notes}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    const text = `🪔 *BPSCVS Event RSVP Confirmed*\nName: ${submittedRecord.residentName}\nPlot: ${submittedRecord.bungalowPlot}\nEvent: ${activeEvent.title} (${activeEvent.date})\nPlates: ${submittedRecord.adultsCount + submittedRecord.kidsCount} (${submittedRecord.dietPreference})\nSee you at the colony celebration!`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-md"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share on WhatsApp</span>
                </button>

                <button
                  onClick={handleResetForm}
                  className="px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-200 font-semibold text-xs border border-emerald-700 transition-all"
                >
                  + Add Another Family / Edit
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-amber-200 flex items-center gap-2">
                  <span>परिवार उपस्थिति फॉर्म (Family Registration)</span>
                </h3>
                <span className="text-[11px] text-amber-400/90 font-medium">
                  {activeEvent.title}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-emerald-200 mb-1">
                    Resident Name / Head of Family *
                  </label>
                  <input
                    id="rsvp-input-name"
                    type="text"
                    required
                    placeholder="e.g. Ramesh Lalwani"
                    value={residentName}
                    onChange={(e) => setResidentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-950 border border-emerald-700 text-amber-100 placeholder-emerald-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-emerald-200 mb-1">
                    Bungalow / Plot / Flat No. *
                  </label>
                  <input
                    id="rsvp-input-plot"
                    type="text"
                    required
                    placeholder="e.g. Plot 42-A, Sindhi Colony"
                    value={bungalowPlot}
                    onChange={(e) => setBungalowPlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-950 border border-emerald-700 text-amber-100 placeholder-emerald-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-emerald-200 mb-1">
                  WhatsApp Contact Number
                </label>
                <input
                  id="rsvp-input-phone"
                  type="tel"
                  placeholder="+91 98290 XXXXX (for token updates)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-950 border border-emerald-700 text-amber-100 placeholder-emerald-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Headcount Step Steppers */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-800">
                  <span className="text-xs text-emerald-300 block mb-1 font-semibold">
                    Adults (10+ yrs)
                  </span>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                      className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700 text-amber-300 flex items-center justify-center hover:bg-emerald-800"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-lg font-bold font-mono text-white">
                      {adultsCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAdultsCount(adultsCount + 1)}
                      className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700 text-amber-300 flex items-center justify-center hover:bg-emerald-800"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-800">
                  <span className="text-xs text-emerald-300 block mb-1 font-semibold">
                    Children (&lt; 10 yrs)
                  </span>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setKidsCount(Math.max(0, kidsCount - 1))}
                      className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700 text-amber-300 flex items-center justify-center hover:bg-emerald-800"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-lg font-bold font-mono text-white">
                      {kidsCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setKidsCount(kidsCount + 1)}
                      className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700 text-amber-300 flex items-center justify-center hover:bg-emerald-800"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Diet Selection Pills */}
              <div>
                <label className="block text-xs font-medium text-emerald-200 mb-1.5">
                  Mahaprasad Meal Type *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDietPreference('regular')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                      dietPreference === 'regular'
                        ? 'bg-amber-500 text-emerald-950 border-amber-300 font-bold'
                        : 'bg-emerald-950/80 text-emerald-200 border-emerald-800 hover:bg-emerald-900'
                    }`}
                  >
                    Regular Satvik
                  </button>
                  <button
                    type="button"
                    onClick={() => setDietPreference('jain')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                      dietPreference === 'jain'
                        ? 'bg-amber-500 text-emerald-950 border-amber-300 font-bold'
                        : 'bg-emerald-950/80 text-emerald-200 border-emerald-800 hover:bg-emerald-900'
                    }`}
                  >
                    Jain Satvik
                  </button>
                  <button
                    type="button"
                    onClick={() => setDietPreference('falahar')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                      dietPreference === 'falahar'
                        ? 'bg-amber-500 text-emerald-950 border-amber-300 font-bold'
                        : 'bg-emerald-950/80 text-emerald-200 border-emerald-800 hover:bg-emerald-900'
                    }`}
                  >
                    Vrat Falahar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-emerald-200 mb-1">
                  Optional Remarks / Senior Citizen Seating Need
                </label>
                <input
                  id="rsvp-input-notes"
                  type="text"
                  placeholder="e.g. Need chair seating for elderly grandparents"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-emerald-950 border border-emerald-700 text-amber-100 placeholder-emerald-600 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <button
                id="rsvp-submit-btn"
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-emerald-950 font-black text-sm shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 border border-yellow-200"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-950 stroke-[2.5]" />
                <span>Confirm Attendance & Reserve {adultsCount + kidsCount} Plates</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Live Confirmed Colony Roster */}
        <div className="lg:col-span-5 bg-emerald-950/50 border border-emerald-800/80 rounded-2xl p-4 sm:p-5 flex flex-col h-[420px]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Confirmed Society Families ({eventRsvps.length})</span>
            </h4>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-900/60 px-2 py-0.5 rounded-full">
              Live Roster
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
            {eventRsvps.length === 0 ? (
              <div className="text-center py-10 text-xs text-emerald-400">
                No RSVPs yet. Be the first family to confirm!
              </div>
            ) : (
              eventRsvps.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-800 hover:border-amber-400/40 transition-all text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-100">{rsvp.residentName}</span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold text-[11px] border border-amber-400/30">
                      {rsvp.adultsCount + rsvp.kidsCount} Plates
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-emerald-300 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {rsvp.bungalowPlot}
                    </span>
                    <span className="text-[10px] text-emerald-400 uppercase font-semibold">
                      {rsvp.dietPreference}
                    </span>
                  </div>

                  {rsvp.notes && (
                    <div className="text-[10px] text-emerald-400/80 italic mt-1 pt-1 border-t border-emerald-900/80">
                      "{rsvp.notes}"
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
