import React from 'react';
import { Palette, Sparkles, SunDim, Lightbulb, Check } from 'lucide-react';
import { FestiveTheme } from '../types';
import { playSitarPluck } from '../utils/audio';

interface ThemeCustomizerBarProps {
  currentTheme: FestiveTheme;
  onThemeChange: (theme: FestiveTheme) => void;
  particleMode: 'few' | 'normal' | 'off';
  onParticleModeChange: (mode: 'few' | 'normal' | 'off') => void;
  mandalaIntensity: 'soft' | 'minimal' | 'off';
  onMandalaIntensityChange: (intensity: 'soft' | 'minimal' | 'off') => void;
  fairyLightsOn: boolean;
  onFairyLightsToggle: (on: boolean) => void;
}

export const ThemeCustomizerBar: React.FC<ThemeCustomizerBarProps> = ({
  currentTheme,
  onThemeChange,
  particleMode,
  onParticleModeChange,
  mandalaIntensity,
  onMandalaIntensityChange,
  fairyLightsOn,
  onFairyLightsToggle,
}) => {
  return (
    <div 
      className="w-full max-w-4xl mx-auto mb-8 p-3 sm:p-4 rounded-2xl bg-emerald-950/80 border border-amber-400/30 shadow-lg backdrop-blur-md"
      id="festive-theme-controls"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Festival Theme Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <Palette className="w-3.5 h-3.5" /> Festival Mood:
          </span>

          <button
            id="theme-deepotsav-btn"
            onClick={() => {
              playSitarPluck('Sa');
              onThemeChange('deepotsav');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentTheme === 'deepotsav'
                ? 'bg-amber-500 text-emerald-950 font-bold shadow-md shadow-amber-500/30'
                : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            <span>🪔 Deepotsav (Diwali)</span>
          </button>

          <button
            id="theme-dandiya-btn"
            onClick={() => {
              playSitarPluck('Re');
              onThemeChange('dandiya');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentTheme === 'dandiya'
                ? 'bg-amber-500 text-emerald-950 font-bold shadow-md shadow-amber-500/30'
                : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            <span>💃 Navratri Dandiya</span>
          </button>

          <button
            id="theme-rangotsav-btn"
            onClick={() => {
              playSitarPluck('Ga');
              onThemeChange('rangotsav');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentTheme === 'rangotsav'
                ? 'bg-amber-500 text-emerald-950 font-bold shadow-md shadow-amber-500/30'
                : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            <span>🌸 Rangotsav (Holi)</span>
          </button>

          <button
            id="theme-ganesh-btn"
            onClick={() => {
              playSitarPluck('Ma');
              onThemeChange('ganesh');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentTheme === 'ganesh'
                ? 'bg-amber-500 text-emerald-950 font-bold shadow-md shadow-amber-500/30'
                : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            <span>🐘 Ganesh Utsav</span>
          </button>
        </div>

        {/* Right: Fine-tuned controls (Stars/Petals + Mandala + Fairy Lights) */}
        <div className="flex flex-wrap items-center gap-3 border-t lg:border-t-0 pt-2 lg:pt-0 border-emerald-800/80">
          {/* Rotating Mandala Lightness */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-emerald-300/80 flex items-center gap-1">
              <SunDim className="w-3.5 h-3.5 text-amber-400" /> Mandala:
            </span>
            <button
              onClick={() => onMandalaIntensityChange('soft')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                mandalaIntensity === 'soft' ? 'bg-amber-500 text-emerald-950 font-bold' : 'text-emerald-300 hover:text-amber-200'
              }`}
            >
              Soft
            </button>
            <button
              onClick={() => onMandalaIntensityChange('minimal')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                mandalaIntensity === 'minimal' ? 'bg-amber-500 text-emerald-950 font-bold' : 'text-emerald-300 hover:text-amber-200'
              }`}
            >
              Ultra-light
            </button>
            <button
              onClick={() => onMandalaIntensityChange('off')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                mandalaIntensity === 'off' ? 'bg-amber-500 text-emerald-950 font-bold' : 'text-emerald-300 hover:text-amber-200'
              }`}
            >
              Off
            </button>
          </div>

          {/* Floating Stars / Petals Count */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-emerald-300/80 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Stars/Petals:
            </span>
            <button
              onClick={() => onParticleModeChange('few')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                particleMode === 'few' ? 'bg-amber-500 text-emerald-950 font-bold' : 'text-emerald-300 hover:text-amber-200'
              }`}
            >
              Few (Subtle)
            </button>
            <button
              onClick={() => onParticleModeChange('normal')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                particleMode === 'normal' ? 'bg-amber-500 text-emerald-950 font-bold' : 'text-emerald-300 hover:text-amber-200'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => onParticleModeChange('off')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                particleMode === 'off' ? 'bg-amber-500 text-emerald-950 font-bold' : 'text-emerald-300 hover:text-amber-200'
              }`}
            >
              Off
            </button>
          </div>

          {/* Fairy Lights Toggle */}
          <button
            onClick={() => onFairyLightsToggle(!fairyLightsOn)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              fairyLightsOn
                ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/40'
                : 'bg-emerald-900/40 text-emerald-400 border border-emerald-800'
            }`}
            title="Toggle hanging fairy string lights"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Fairy Lights {fairyLightsOn ? 'ON' : 'OFF'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
