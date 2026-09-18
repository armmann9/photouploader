import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Sparkles, Bell, Check, Users } from 'lucide-react';
import { playTempleBell, playSitarPluck } from '../utils/audio';

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  hindiTitle: string;
  location: string;
  description: string;
  category: 'puja' | 'cultural' | 'food';
}

const UPCOMING_SCHEDULE: ScheduleItem[] = [
  {
    id: 's1',
    time: '06:30 PM',
    title: 'Maha Lakshmi Sthapana & Ganesh Puja',
    hindiTitle: 'महालक्ष्मी स्थापना एवं श्री गणेश पूजन',
    location: 'Central Clubhouse Temple Mandap',
    description: 'Special colony pandit ji performing Vedic havan. All families invited with thali.',
    category: 'puja',
  },
  {
    id: 's2',
    time: '07:45 PM',
    title: 'Grand 108 Diya Maha Aarti & Shankhanaad',
    hindiTitle: '108 दीप महाआरती एवं शंखनाद',
    location: 'Main Society Amphitheatre',
    description: 'Community aarti led by senior citizens and children.',
    category: 'puja',
  },
  {
    id: 's3',
    time: '08:30 PM',
    title: 'Navratri Dandiya Raas & Live Dhol Competition',
    hindiTitle: 'डांडिया रास एवं ढोल प्रतियोगिता',
    location: 'Society Festival Grounds (Decorated Stage)',
    description: 'Trophies for Best Traditional Attire, Best Couple Dance & Best Child Dancer.',
    category: 'cultural',
  },
  {
    id: 's4',
    time: '09:45 PM',
    title: 'Community Mahaprasad & Festive Dinner',
    hindiTitle: 'सामूहिक महाप्रसाद एवं प्रीतिभोज',
    location: 'Banquet Dining Hall',
    description: 'Pure satvik festive feast prepared by colony volunteers.',
    category: 'food',
  },
];

export const FestivalPanchangSchedule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'puja' | 'cultural' | 'food'>('all');
  const [remindersSet, setRemindersSet] = useState<Record<string, boolean>>({});

  const filteredItems = activeTab === 'all' 
    ? UPCOMING_SCHEDULE 
    : UPCOMING_SCHEDULE.filter(i => i.category === activeTab);

  const toggleReminder = (id: string) => {
    playSitarPluck('Ga');
    setRemindersSet(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div 
      className="rounded-3xl bg-gradient-to-b from-emerald-900/70 to-emerald-950/90 border border-amber-400/30 p-6 sm:p-8 shadow-2xl backdrop-blur-md"
      id="society-panchang-schedule"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Colony Festival Schedule • उत्सव पंचांग</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-display text-amber-100">
            Grand Diwali & Navratri Timetable
          </h3>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
            Official RWA celebration program. Bring your family and join the festivities!
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-emerald-950/80 border border-emerald-800 self-start md:self-auto">
          <button
            onClick={() => {
              playSitarPluck('Re');
              setActiveTab('all');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-amber-500 text-emerald-950'
                : 'text-emerald-300 hover:text-amber-200'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => {
              playSitarPluck('Re');
              setActiveTab('puja');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'puja'
                ? 'bg-amber-500 text-emerald-950'
                : 'text-emerald-300 hover:text-amber-200'
            }`}
          >
            🪔 Puja & Aarti
          </button>
          <button
            onClick={() => {
              playSitarPluck('Re');
              setActiveTab('cultural');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'cultural'
                ? 'bg-amber-500 text-emerald-950'
                : 'text-emerald-300 hover:text-amber-200'
            }`}
          >
            💃 Dandiya / Dance
          </button>
          <button
            onClick={() => {
              playSitarPluck('Re');
              setActiveTab('food');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'food'
                ? 'bg-amber-500 text-emerald-950'
                : 'text-emerald-300 hover:text-amber-200'
            }`}
          >
            🍛 Mahaprasad
          </button>
        </div>
      </div>

      {/* Schedule Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const isReminded = !!remindersSet[item.id];
          return (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-emerald-950/70 border border-emerald-800/80 hover:border-amber-400/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold font-mono flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {item.time}
                  </span>

                  <button
                    onClick={() => toggleReminder(item.id)}
                    className={`p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                      isReminded
                        ? 'bg-amber-500 text-emerald-950 font-bold'
                        : 'bg-emerald-900/60 text-emerald-300 hover:text-amber-300 hover:bg-emerald-900'
                    }`}
                    title="Toggle reminder"
                  >
                    {isReminded ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                    <span>{isReminded ? 'Reminder Set' : 'Set Alert'}</span>
                  </button>
                </div>

                <h4 className="text-base sm:text-lg font-bold font-display text-amber-100 group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h4>
                <div className="text-xs text-amber-400 font-folk mb-2">
                  {item.hindiTitle}
                </div>

                <p className="text-xs text-emerald-200/80 leading-relaxed mb-3">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-400 pt-3 border-t border-emerald-900">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{item.location}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
