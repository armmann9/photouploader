'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, MapPin, Sparkles, Bell, Check, Users,
  Plus, Pencil, Trash2, X, Save, ChevronUp, ChevronDown,
  Lightbulb, Zap
} from 'lucide-react';
import { playTempleBell, playSitarPluck } from '@/utils/audio';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface TimetableItem {
  id: string;
  time: string;
  title: string;
  hindiTitle: string;
  location: string;
  description: string;
  category: 'puja' | 'cultural' | 'food' | 'other';
}

const STORAGE_KEY = 'bpscvs_timetable_v1';

const DEFAULT_SCHEDULE: TimetableItem[] = [
  { id: 's1', time: '06:30 PM', title: 'Maha Lakshmi Sthapana & Ganesh Puja', hindiTitle: 'महालक्ष्मी स्थापना एवं श्री गणेश पूजन', location: 'Central Clubhouse Temple Mandap', description: 'Special colony pandit ji performing Vedic havan. All families invited with thali.', category: 'puja' },
  { id: 's2', time: '07:45 PM', title: 'Grand 108 Diya Maha Aarti & Shankhanaad', hindiTitle: '108 दीप महाआरती एवं शंखनाद', location: 'Main Society Amphitheatre', description: 'Community aarti led by senior citizens and children.', category: 'puja' },
  { id: 's3', time: '08:30 PM', title: 'Navratri Dandiya Raas & Live Dhol Competition', hindiTitle: 'डांडिया रास एवं ढोल प्रतियोगिता', location: 'Society Festival Grounds (Decorated Stage)', description: 'Trophies for Best Traditional Attire, Best Couple Dance & Best Child Dancer.', category: 'cultural' },
  { id: 's4', time: '09:45 PM', title: 'Community Mahaprasad & Festive Dinner', hindiTitle: 'सामूहिक महाप्रसाद एवं प्रीतिभोज', location: 'Banquet Dining Hall', description: 'Pure satvik festive feast prepared by colony volunteers.', category: 'food' },
];

const CATEGORY_OPTIONS: { value: TimetableItem['category']; label: string; emoji: string }[] = [
  { value: 'puja', label: 'Puja & Aarti', emoji: '🪔' },
  { value: 'cultural', label: 'Cultural / Dance', emoji: '💃' },
  { value: 'food', label: 'Mahaprasad / Food', emoji: '🍛' },
  { value: 'other', label: 'Other / General', emoji: '📌' },
];

const categoryColor: Record<TimetableItem['category'], string> = {
  puja: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
  cultural: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
  food: 'bg-green-500/20 text-green-300 border-green-400/30',
  other: 'bg-slate-500/20 text-slate-300 border-slate-400/30',
};

// ─── Quick-parse the AI-style prompt ─────────────────────────────────────────
function parsePrompt(prompt: string): Partial<TimetableItem> {
  const result: Partial<TimetableItem> = {};

  // Extract time like "6 PM", "6:30 PM", "18:30", "18:00"
  const timeMatch = prompt.match(/\b(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)?\b/);
  if (timeMatch) {
    let h = parseInt(timeMatch[1], 10);
    const m = timeMatch[2] ? timeMatch[2] : '00';
    const meridiem = (timeMatch[3] || '').toUpperCase();
    if (meridiem === 'PM' && h < 12) h += 12;
    if (meridiem === 'AM' && h === 12) h = 0;
    if (!meridiem && h <= 12) {
      // Default: assume PM for common evening times
      if (h >= 5 && h <= 11) h += 12;
    }
    result.time = `${String(h % 12 || 12).padStart(2, '0')}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
  }

  // Extract location: "at <location>" or "in <location>"
  const atMatch = prompt.match(/\b(?:at|in|@)\s+([A-Za-z0-9 ,\-&]+?)(?:\.|$|,|\bat\b)/i);
  if (atMatch) result.location = atMatch[1].trim();

  // Category detection
  const lower = prompt.toLowerCase();
  if (/puja|aarti|havan|prayer|worship|ganesh|lakshmi|temple|mandir/.test(lower)) result.category = 'puja';
  else if (/dandiya|dance|cultural|programme|program|music|dhol|raas|stage/.test(lower)) result.category = 'cultural';
  else if (/mahaprasad|dinner|food|lunch|meal|prasad|langar|feast/.test(lower)) result.category = 'food';
  else result.category = 'other';

  // Title: everything that isn't time or location
  let title = prompt
    .replace(/\b(\d{1,2})(:\d{2})?\s*(AM|PM|am|pm)/gi, '')
    .replace(/\b(?:at|in|@)\s+[A-Za-z0-9 ,\-&]+/gi, '')
    .replace(/add|create|schedule|please|new|slot|item/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (title) result.title = title.charAt(0).toUpperCase() + title.slice(1);

  return result;
}

// ─── Blank form ───────────────────────────────────────────────────────────────
const blankForm = (): Omit<TimetableItem, 'id'> => ({
  time: '',
  title: '',
  hindiTitle: '',
  location: '',
  description: '',
  category: 'puja',
});

// ─── Main Component ───────────────────────────────────────────────────────────
interface Props {
  /** If true (public-facing), hides all editing controls */
  readOnly?: boolean;
}

export const FestivalPanchangSchedule: React.FC<Props> = ({ readOnly = true }) => {
  const [items, setItems] = useState<TimetableItem[]>(DEFAULT_SCHEDULE);
  const [activeTab, setActiveTab] = useState<'all' | TimetableItem['category']>('all');
  const [remindersSet, setRemindersSet] = useState<Record<string, boolean>>({});

  // Editor state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(blankForm());

  // AI prompt state
  const [prompt, setPrompt] = useState('');
  const [promptFeedback, setPromptFeedback] = useState<string | null>(null);

  // Persist to localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = (next: TimetableItem[]) => {
    setItems(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  };

  const filtered = activeTab === 'all' ? items : items.filter(i => i.category === activeTab);

  // ─── Sort items by time ──────────────────────────────────────────────────────
  const sortedItems = [...filtered].sort((a, b) => {
    const toMinutes = (t: string) => {
      const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!m) return 0;
      let h = parseInt(m[1]); const min = parseInt(m[2]);
      const pm = m[3].toUpperCase() === 'PM';
      if (pm && h !== 12) h += 12;
      if (!pm && h === 12) h = 0;
      return h * 60 + min;
    };
    return toMinutes(a.time) - toMinutes(b.time);
  });

  // ─── Reminder toggle ─────────────────────────────────────────────────────────
  const toggleReminder = (id: string) => {
    playSitarPluck('Ga');
    setRemindersSet(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // ─── Open form for new or editing ────────────────────────────────────────────
  const openNew = () => {
    setEditingId(null);
    setForm(blankForm());
    setShowForm(true);
    setPromptFeedback(null);
  };

  const openEdit = (item: TimetableItem) => {
    setEditingId(item.id);
    setForm({ time: item.time, title: item.title, hindiTitle: item.hindiTitle, location: item.location, description: item.description, category: item.category });
    setShowForm(true);
    setPromptFeedback(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(blankForm());
    setPromptFeedback(null);
  };

  // ─── Save form ───────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!form.title.trim() || !form.time.trim()) return;
    let next: TimetableItem[];
    if (editingId) {
      next = items.map(i => i.id === editingId ? { ...i, ...form } : i);
    } else {
      const newItem: TimetableItem = { ...form, id: `s-${Date.now()}` };
      next = [...items, newItem];
    }
    persist(next);
    playTempleBell();
    closeForm();
  };

  // ─── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Delete "${title}" from the timetable?`)) return;
    persist(items.filter(i => i.id !== id));
  };

  // ─── Move up/down ────────────────────────────────────────────────────────────
  const moveItem = (id: string, dir: 'up' | 'down') => {
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return;
    const next = [...items];
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= next.length) return;
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    persist(next);
  };

  // ─── AI Prompt parser ────────────────────────────────────────────────────────
  const handlePrompt = () => {
    if (!prompt.trim()) return;
    const parsed = parsePrompt(prompt.trim());
    setForm(prev => ({
      ...prev,
      ...parsed,
    }));
    setPromptFeedback(`✅ Fields auto-filled from your description. Review and click Save.`);
    setShowForm(true);
    setEditingId(null);
    setPrompt('');
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="rounded-3xl bg-gradient-to-b from-emerald-900/70 to-emerald-950/90 border border-amber-400/30 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6"
      id="society-panchang-schedule"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Colony Festival Schedule • उत्सव पंचांग</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-display text-amber-100">
            Panchang &amp; Timetable
          </h3>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
            {readOnly
              ? 'Official RWA celebration programme. Bring your family and join the festivities!'
              : 'Add, edit, or rearrange the colony event timetable. Changes save instantly.'}
          </p>
        </div>

        {/* Admin action buttons */}
        {!readOnly && (
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-emerald-950 font-bold text-xs shadow-lg hover:scale-105 transition-transform shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Timetable Slot
          </button>
        )}
      </div>

      {/* ── AI Prompt Bar (admin only) ─────────────────────────────────────── */}
      {!readOnly && (
        <div className="bg-emerald-950/80 border border-amber-400/20 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Quick Add via Prompt (AI-style auto-fill)
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePrompt()}
              placeholder="e.g. Maha Aarti at 8 PM at Temple Mandap"
              className="flex-1 bg-[#021812]/80 border border-emerald-700/60 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder:text-emerald-400/40 focus:outline-none focus:border-amber-400 transition-colors"
            />
            <button
              onClick={handlePrompt}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              Auto-fill
            </button>
          </div>
          <p className="text-[10px] text-emerald-400/60">
            Tip: Include the time, activity name, and location. The form will be pre-filled for you to review.
          </p>
        </div>
      )}

      {/* ── Add / Edit Form ────────────────────────────────────────────────── */}
      {!readOnly && showForm && (
        <div className="bg-emerald-950/90 border border-amber-400/30 rounded-2xl p-5 space-y-4 shadow-xl">
          {/* Prompt feedback */}
          {promptFeedback && (
            <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-400/30 rounded-xl px-3 py-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              {promptFeedback}
            </div>
          )}

          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-amber-300 font-display">
              {editingId ? '✏️ Edit Timetable Slot' : '➕ New Timetable Slot'}
            </h4>
            <button onClick={closeForm} className="text-emerald-400 hover:text-amber-300 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Time */}
            <div>
              <label className="block text-[10px] font-semibold text-emerald-300/80 mb-1 uppercase tracking-wider">
                Time <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={form.time}
                onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                placeholder="e.g. 07:30 PM"
                className="w-full bg-[#021812]/80 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-amber-100 placeholder:text-emerald-400/30 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] font-semibold text-emerald-300/80 mb-1 uppercase tracking-wider">
                Category <span className="text-amber-400">*</span>
              </label>
              <select
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value as TimetableItem['category'] }))}
                className="w-full bg-[#021812]/80 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-amber-100 focus:outline-none focus:border-amber-400 transition-colors"
              >
                {CATEGORY_OPTIONS.map(c => (
                  <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold text-emerald-300/80 mb-1 uppercase tracking-wider">
                Activity / Event Title <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Grand 108 Diya Maha Aarti"
                className="w-full bg-[#021812]/80 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-amber-100 placeholder:text-emerald-400/30 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Hindi Title */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold text-emerald-300/80 mb-1 uppercase tracking-wider">
                Hindi Title (optional)
              </label>
              <input
                type="text"
                value={form.hindiTitle}
                onChange={e => setForm(p => ({ ...p, hindiTitle: e.target.value }))}
                placeholder="e.g. १०८ दीप महाआरती एवं शंखनाद"
                className="w-full bg-[#021812]/80 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-amber-100 placeholder:text-emerald-400/30 focus:outline-none focus:border-amber-400 transition-colors font-hindi"
              />
            </div>

            {/* Location */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold text-emerald-300/80 mb-1 uppercase tracking-wider">
                Location / Venue
              </label>
              <input
                type="text"
                value={form.location}
                onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                placeholder="e.g. Main Society Amphitheatre"
                className="w-full bg-[#021812]/80 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-amber-100 placeholder:text-emerald-400/30 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold text-emerald-300/80 mb-1 uppercase tracking-wider">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Short note for residents — e.g. Bring your family thali, traditional dress encouraged."
                rows={2}
                className="w-full bg-[#021812]/80 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-amber-100 placeholder:text-emerald-400/30 focus:outline-none focus:border-amber-400 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Save / Cancel */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={!form.title.trim() || !form.time.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-emerald-950 font-bold text-xs shadow-md hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Save className="w-3.5 h-3.5" />
              {editingId ? 'Save Changes' : 'Add to Timetable'}
            </button>
            <button
              onClick={closeForm}
              className="px-5 py-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 font-semibold text-xs hover:bg-emerald-900 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Category Filter Tabs ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800 self-start">
        {[{ value: 'all', label: 'All Events', emoji: '✨' }, ...CATEGORY_OPTIONS].map(tab => (
          <button
            key={tab.value}
            onClick={() => { playSitarPluck('Re'); setActiveTab(tab.value as typeof activeTab); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab.value
                ? 'bg-amber-500 text-emerald-950 shadow-sm'
                : 'text-emerald-300 hover:text-amber-200 hover:bg-emerald-900/60'
            }`}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      {/* ── Schedule Cards ─────────────────────────────────────────────────── */}
      {sortedItems.length === 0 ? (
        <div className="text-center py-12 text-emerald-400/60 text-sm">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
          No items in this category yet.
          {!readOnly && (
            <button onClick={openNew} className="block mx-auto mt-3 text-amber-400 hover:text-amber-300 text-xs font-semibold underline">
              + Add the first slot
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedItems.map((item, idx) => {
            const isReminded = !!remindersSet[item.id];
            const catInfo = CATEGORY_OPTIONS.find(c => c.value === item.category);
            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-emerald-950/70 border border-emerald-800/80 hover:border-amber-400/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {item.time}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${categoryColor[item.category]}`}>
                      {catInfo?.emoji} {catInfo?.label}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold font-display text-amber-100 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h4>
                  {item.hindiTitle && (
                    <div className="text-xs text-amber-400 font-folk mb-2">{item.hindiTitle}</div>
                  )}
                  {item.description && (
                    <p className="text-xs text-emerald-200/80 leading-relaxed mb-3">{item.description}</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-emerald-900 gap-2 flex-wrap">
                  {/* Venue */}
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{item.location || '—'}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Reminder (shown to everyone) */}
                    <button
                      onClick={() => toggleReminder(item.id)}
                      className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
                        isReminded
                          ? 'bg-amber-500 text-emerald-950 font-bold'
                          : 'bg-emerald-900/60 text-emerald-300 hover:text-amber-300'
                      }`}
                      title="Toggle reminder"
                    >
                      {isReminded ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                    </button>

                    {/* Admin controls */}
                    {!readOnly && (
                      <>
                        <button
                          onClick={() => moveItem(item.id, 'up')}
                          disabled={idx === 0}
                          title="Move up"
                          className="p-1.5 rounded-lg bg-emerald-900/60 text-emerald-400 hover:text-amber-300 disabled:opacity-30 transition-colors"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveItem(item.id, 'down')}
                          disabled={idx === sortedItems.length - 1}
                          title="Move down"
                          className="p-1.5 rounded-lg bg-emerald-900/60 text-emerald-400 hover:text-amber-300 disabled:opacity-30 transition-colors"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEdit(item)}
                          title="Edit"
                          className="p-1.5 rounded-lg bg-emerald-900/60 text-emerald-400 hover:text-amber-300 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          title="Delete"
                          className="p-1.5 rounded-lg bg-red-900/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Items count */}
      <p className="text-[11px] text-emerald-400/50 text-right">
        {items.length} total slot{items.length !== 1 ? 's' : ''} in timetable
        {!readOnly && ' • Changes saved to browser storage'}
      </p>
    </div>
  );
};
