import React from 'react';
import { Volume2, VolumeX, SlidersHorizontal, BookOpen, Quote, PenLine, Sparkles } from 'lucide-react';
import { ReadingTheme } from '../types';

interface HeaderProps {
  activeTab: 'story' | 'quotes' | 'journal' | 'reflections';
  setActiveTab: (tab: 'story' | 'quotes' | 'journal' | 'reflections') => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onOpenSoundModal: () => void;
  onOpenSettingsModal: () => void;
  theme: ReadingTheme;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isAudioPlaying,
  onToggleAudio,
  onOpenSoundModal,
  onOpenSettingsModal,
  theme,
}) => {
  const isDark = theme === 'midnight' || theme === 'velvet';

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-200 border-b ${
        isDark
          ? 'bg-slate-950/90 border-slate-800/80 text-slate-100 backdrop-blur-md'
          : theme === 'parchment'
          ? 'bg-[#FBF9F5]/90 border-stone-200/80 text-stone-900 backdrop-blur-md'
          : 'bg-white/90 border-neutral-200/80 text-neutral-900 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('story')}
          className="font-devanagari-heading text-lg sm:text-xl font-bold tracking-tight hover:opacity-85 transition-opacity text-left whitespace-nowrap shrink-0"
        >
          अधुरो अध्याय 🥀
        </button>

        {/* Zone 2: 4 clean text navigation links with subtle underline */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveTab('story')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'story'
                ? 'font-semibold underline decoration-rose-600 underline-offset-8 decoration-2'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>कथा वाचन</span>
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'quotes'
                ? 'font-semibold underline decoration-rose-600 underline-offset-8 decoration-2'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
            }`}
          >
            <Quote className="w-4 h-4" />
            <span>उद्धरण संग्रह</span>
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'journal'
                ? 'font-semibold underline decoration-rose-600 underline-offset-8 decoration-2'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
            }`}
          >
            <PenLine className="w-4 h-4" />
            <span>मेरो अधुरो अध्याय</span>
          </button>

          <button
            onClick={() => setActiveTab('reflections')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'reflections'
                ? 'font-semibold underline decoration-rose-600 underline-offset-8 decoration-2'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>भाव विमर्श</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Ambient Sound Trigger */}
          <div className="flex items-center rounded-lg border border-stone-200 dark:border-slate-800 p-0.5">
            <button
              onClick={onToggleAudio}
              title={isAudioPlaying ? 'ध्वनि बन्द गर्नुहोस्' : 'वातावरणीय संगीत सुरु गर्नुहोस्'}
              className={`p-2 rounded-md transition-colors flex items-center gap-1.5 text-xs font-medium ${
                isAudioPlaying
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                  : 'text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white'
              }`}
            >
              {isAudioPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 animate-pulse text-rose-600 dark:text-rose-400" />
                  <span className="hidden sm:inline">संगीत चालू</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden sm:inline">संगीत</span>
                </>
              )}
            </button>
            <button
              onClick={onOpenSoundModal}
              title="ध्वनि सेटिङहरू"
              className="p-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-white transition-colors"
            >
              <span className="text-xs">▾</span>
            </button>
          </div>

          {/* Reader / Theme Settings */}
          <button
            onClick={onOpenSettingsModal}
            title="पठन शैली र विषयवस्तु"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-stone-200 dark:border-slate-800 hover:bg-stone-100 dark:hover:bg-slate-800/60 transition-colors whitespace-nowrap"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">शैली & फन्ट</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row (clean single line) */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200/60 dark:border-slate-800/60 px-2 py-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('story')}
          className={`px-2 py-1 transition-colors ${
            activeTab === 'story'
              ? 'font-bold text-rose-600 dark:text-rose-400'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          कथा वाचन
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-2 py-1 transition-colors ${
            activeTab === 'quotes'
              ? 'font-bold text-rose-600 dark:text-rose-400'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          उद्धरणहरू
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={`px-2 py-1 transition-colors ${
            activeTab === 'journal'
              ? 'font-bold text-rose-600 dark:text-rose-400'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          मेरो डायरी
        </button>
        <button
          onClick={() => setActiveTab('reflections')}
          className={`px-2 py-1 transition-colors ${
            activeTab === 'reflections'
              ? 'font-bold text-rose-600 dark:text-rose-400'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          भाव विमर्श
        </button>
      </div>
    </header>
  );
};
