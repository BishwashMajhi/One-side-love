import React from 'react';
import { X, Volume2, CloudRain, Music, Wind, Sliders, Sparkles } from 'lucide-react';
import { SoundConfig, ReadingTheme } from '../types';

interface AmbientSoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SoundConfig;
  onChangeConfig: (newConfig: Partial<SoundConfig>) => void;
  showPetals: boolean;
  onTogglePetals: () => void;
  theme: ReadingTheme;
}

export const AmbientSoundModal: React.FC<AmbientSoundModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  showPetals,
  onTogglePetals,
  theme,
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'midnight' || theme === 'velvet';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : 'bg-[#FBF9F5] border-stone-200 text-stone-900'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <h3 className="font-devanagari-heading text-lg font-bold">वातावरणीय ध्वनि & संगीत</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {/* Master Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-100 dark:bg-slate-800/80">
            <div>
              <p className="text-sm font-semibold">ध्वनि सक्रिय गर्नुहोस्</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                पठनको लागि प्रत्यक्ष संश्लेषित पृष्ठभूमि स्वर
              </p>
            </div>
            <button
              onClick={() => onChangeConfig({ isPlaying: !config.isPlaying })}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                config.isPlaying
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-stone-300 dark:bg-slate-700 text-stone-800 dark:text-stone-200'
              }`}
            >
              {config.isPlaying ? 'चालू छ' : 'बन्द छ'}
            </button>
          </div>

          {/* Master Volume */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-stone-400" />
                मुख्य भोल्युम (Master)
              </span>
              <span className="tabular-nums text-stone-500 font-mono">
                {Math.round(config.masterVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.masterVolume}
              onChange={(e) => onChangeConfig({ masterVolume: parseFloat(e.target.value) })}
              className="w-full accent-rose-600 h-1.5 bg-stone-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Rain Sound */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                झ्यालको झरी (Window Rain)
              </span>
              <span className="tabular-nums text-stone-500 font-mono">
                {Math.round(config.rainVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.rainVolume}
              onChange={(e) => onChangeConfig({ rainVolume: parseFloat(e.target.value) })}
              className="w-full accent-blue-600 h-1.5 bg-stone-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Melancholic Piano */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-rose-500" />
                उदास पियानो स्वर (Melancholic Chords)
              </span>
              <span className="tabular-nums text-stone-500 font-mono">
                {Math.round(config.pianoVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.pianoVolume}
              onChange={(e) => onChangeConfig({ pianoVolume: parseFloat(e.target.value) })}
              className="w-full accent-rose-600 h-1.5 bg-stone-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Wind Sound */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-emerald-500" />
                सिरसिरे बतास (Gentle Breeze)
              </span>
              <span className="tabular-nums text-stone-500 font-mono">
                {Math.round(config.windVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.windVolume}
              onChange={(e) => onChangeConfig({ windVolume: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600 h-1.5 bg-stone-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Petals visual toggle */}
          <div className="pt-2 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <div>
                <p className="text-xs font-semibold">गुलाफका पातहरू (Falling Petals)</p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  पृष्ठभूमिमा मन्द झर्ने गुलाफी पातहरू
                </p>
              </div>
            </div>
            <button
              onClick={onTogglePetals}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                showPetals
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
                  : 'bg-stone-200 dark:bg-slate-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              {showPetals ? 'चालू' : 'बन्द'}
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium text-white bg-stone-900 dark:bg-rose-700 hover:bg-stone-800 rounded-lg transition-colors"
          >
            बन्द गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};
