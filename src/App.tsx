/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StoryReader } from './components/StoryReader';
import { QuotesGallery } from './components/QuotesGallery';
import { PersonalJournal } from './components/PersonalJournal';
import { ReflectionsView } from './components/ReflectionsView';
import { QuoteCardModal } from './components/QuoteCardModal';
import { AmbientSoundModal } from './components/AmbientSoundModal';
import { ReadingSettingsModal } from './components/ReadingSettingsModal';
import { PetalCanvas } from './components/PetalCanvas';
import { STORY_CHAPTERS, FAMOUS_QUOTES, STORY_META } from './data/storyData';
import { SoundConfig, ReaderSettings, ReadingTheme, QuoteItem } from './types';
import { ambientSound } from './utils/audioEngine';
import { BookOpen, Volume2, Sparkles, Quote, Heart, ArrowDown } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'story' | 'quotes' | 'journal' | 'reflections'>('story');
  const [activeChapterId, setActiveChapterId] = useState<number>(1);

  // Sound Engine State
  const [soundConfig, setSoundConfig] = useState<SoundConfig>({
    isPlaying: false,
    rainVolume: 0.5,
    pianoVolume: 0.45,
    windVolume: 0.25,
    masterVolume: 0.7,
    ambientType: 'combined',
  });

  // Reader Customization State
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    try {
      const saved = localStorage.getItem('adhuro_reader_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      fontSize: 'medium',
      lineSpacing: 'relaxed',
      fontFamily: 'serif',
      theme: 'parchment',
      showPetals: true,
      autoScroll: false,
    };
  });

  // Modals
  const [isSoundModalOpen, setIsSoundModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState<boolean>(false);
  const [activeQuoteForModal, setActiveQuoteForModal] = useState<QuoteItem | null>(null);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem('adhuro_reader_settings', JSON.stringify(settings));
    } catch {
      // storage error
    }
  }, [settings]);

  // Audio Playback Handler
  const handleToggleAudio = () => {
    if (soundConfig.isPlaying) {
      ambientSound.stop();
      setSoundConfig((prev) => ({ ...prev, isPlaying: false }));
    } else {
      ambientSound.start({
        rain: soundConfig.rainVolume,
        piano: soundConfig.pianoVolume,
        wind: soundConfig.windVolume,
        master: soundConfig.masterVolume,
      });
      setSoundConfig((prev) => ({ ...prev, isPlaying: true }));
    }
  };

  const handleUpdateSoundConfig = (newConfig: Partial<SoundConfig>) => {
    const updated = { ...soundConfig, ...newConfig };
    setSoundConfig(updated);

    if (newConfig.isPlaying !== undefined) {
      if (newConfig.isPlaying) {
        ambientSound.start({
          rain: updated.rainVolume,
          piano: updated.pianoVolume,
          wind: updated.windVolume,
          master: updated.masterVolume,
        });
      } else {
        ambientSound.stop();
      }
    } else if (updated.isPlaying) {
      ambientSound.updateVolumes({
        rain: updated.rainVolume,
        piano: updated.pianoVolume,
        wind: updated.windVolume,
        master: updated.masterVolume,
      });
    }
  };

  const handleOpenQuoteCard = (quoteInput: string | QuoteItem) => {
    if (typeof quoteInput === 'string') {
      const match = FAMOUS_QUOTES.find((q) => q.nepaliText === quoteInput);
      if (match) {
        setActiveQuoteForModal(match);
      } else {
        setActiveQuoteForModal({
          id: `custom-${Date.now()}`,
          nepaliText: quoteInput,
          context: 'कथाको हरफ',
          tag: 'संस्मरण',
        });
      }
    } else {
      setActiveQuoteForModal(quoteInput);
    }
    setIsCardModalOpen(true);
  };

  // Theme-specific background and text styling
  const themeClasses: Record<ReadingTheme, { bg: string; text: string; heroOverlay: string }> = {
    parchment: {
      bg: 'bg-[#FBF9F5]',
      text: 'text-stone-900',
      heroOverlay: 'from-[#FBF9F5] via-[#FBF9F5]/70 to-transparent',
    },
    midnight: {
      bg: 'bg-[#0B0F19]',
      text: 'text-slate-100',
      heroOverlay: 'from-[#0B0F19] via-[#0B0F19]/80 to-transparent',
    },
    velvet: {
      bg: 'bg-[#140E17]',
      text: 'text-rose-100',
      heroOverlay: 'from-[#140E17] via-[#140E17]/85 to-transparent',
    },
    minimal: {
      bg: 'bg-white',
      text: 'text-neutral-900',
      heroOverlay: 'from-white via-white/80 to-transparent',
    },
  };

  const currentThemeStyle = themeClasses[settings.theme];
  const isDark = settings.theme === 'midnight' || settings.theme === 'velvet';

  return (
    <div className={`min-h-screen ${currentThemeStyle.bg} ${currentThemeStyle.text} transition-colors duration-300 relative flex flex-col selection:bg-rose-200 selection:text-rose-900`}>
      {/* Falling Rose Petals Atmosphere */}
      <PetalCanvas active={settings.showPetals} />

      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAudioPlaying={soundConfig.isPlaying}
        onToggleAudio={handleToggleAudio}
        onOpenSoundModal={() => setIsSoundModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        theme={settings.theme}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* Editorial Hero Marquee (Visible on 'story' tab) */}
        {activeTab === 'story' && (
          <section className="relative w-full border-b border-stone-200/80 dark:border-slate-800/80 overflow-hidden">
            <div className="relative h-[380px] sm:h-[460px] lg:h-[500px] w-full overflow-hidden bg-stone-950">
              <img
                src="/src/assets/images/hero_incomplete_chapter_1790525320362.jpg"
                alt="अधुरो अध्याय — कलेजको पहिलो दिन र अधुरो प्रेमकथा"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-60 scale-102 transform duration-1000"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${currentThemeStyle.heroOverlay} flex items-end`}
              >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14 w-full">
                  {/* Clean unboxed metadata with · separators */}
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-3 font-semibold">
                    <span>नेपाली साहित्यिक संस्मरण</span>
                    <span aria-hidden="true">·</span>
                    <span>{STORY_META.totalParts}</span>
                    <span aria-hidden="true">·</span>
                    <span>{STORY_META.readTime}</span>
                  </div>

                  <h1 className="font-devanagari-heading text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance text-stone-900 dark:text-stone-100">
                    अधुरो अध्याय 🥀
                  </h1>

                  <p className="mt-4 text-sm sm:text-base lg:text-lg font-devanagari-serif leading-relaxed max-w-2xl opacity-90">
                    {STORY_META.subheading}
                  </p>

                  {/* Primary Editorial Actions */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        window.scrollTo({
                          top: 480,
                          behavior: 'smooth',
                        });
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors shadow-sm"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>कथा पढ्न सुरु गर्नुहोस्</span>
                      <ArrowDown className="w-3.5 h-3.5 opacity-80" />
                    </button>

                    <button
                      onClick={handleToggleAudio}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg border border-stone-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Volume2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <span>{soundConfig.isPlaying ? 'वातावरणीय संगीत बन्द' : 'झरी र पियानो संगीत चालू'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenQuoteCard(FAMOUS_QUOTES[1])}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg border border-stone-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>फोटो कार्ड बनाउनुहोस्</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab 1: Story Reader */}
        {activeTab === 'story' && (
          <StoryReader
            chapters={STORY_CHAPTERS}
            settings={settings}
            activeChapterId={activeChapterId}
            setActiveChapterId={setActiveChapterId}
            onOpenCardModal={handleOpenQuoteCard}
            onOpenSoundModal={() => setIsSoundModalOpen(true)}
          />
        )}

        {/* Tab 2: Quotes Showcase */}
        {activeTab === 'quotes' && (
          <QuotesGallery
            quotes={FAMOUS_QUOTES}
            theme={settings.theme}
            onOpenCardModal={handleOpenQuoteCard}
          />
        )}

        {/* Tab 3: Reader's Personal Reflection Journal */}
        {activeTab === 'journal' && <PersonalJournal theme={settings.theme} />}

        {/* Tab 4: Literary & Emotional Reflections */}
        {activeTab === 'reflections' && (
          <ReflectionsView
            theme={settings.theme}
            onNavigateToStory={(chapId) => {
              if (chapId) setActiveChapterId(chapId);
              setActiveTab('story');
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="mt-20 border-t border-stone-200/80 dark:border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 text-rose-700 dark:text-rose-400">
            <span className="font-devanagari-heading font-bold text-base">अधुरो अध्याय 🥀</span>
          </div>

          <p className="text-xs sm:text-sm font-devanagari-serif text-stone-500 dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
            “कहिलेकाहीँ कसैलाई साँचो मनले चाहेर पनि उसको निर्णयलाई स्वीकार गर्नु पनि माया रहेछ।”
          </p>

          <div className="flex items-center justify-center gap-3 text-xs text-stone-400 font-mono">
            <span>नेपाली साहित्य संस्मरण</span>
            <span aria-hidden="true">·</span>
            <span>अविस्मरणीय पहिलो प्रेम</span>
            <span aria-hidden="true">·</span>
            <span>निःस्वार्थ समर्पण</span>
          </div>

          <p className="text-[11px] text-stone-400 pt-4">
            साँचो भावना र जीवनका ती अनमोल अधुरा कथाहरूको सम्मानमा समर्पित।
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AmbientSoundModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
        config={soundConfig}
        onChangeConfig={handleUpdateSoundConfig}
        showPetals={settings.showPetals}
        onTogglePetals={() =>
          setSettings((prev) => ({ ...prev, showPetals: !prev.showPetals }))
        }
        theme={settings.theme}
      />

      <ReadingSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={(newVals) =>
          setSettings((prev) => ({ ...prev, ...newVals }))
        }
      />

      <QuoteCardModal
        isOpen={isCardModalOpen}
        onClose={() => {
          setIsCardModalOpen(false);
          setActiveQuoteForModal(null);
        }}
        initialQuote={activeQuoteForModal}
        allQuotes={FAMOUS_QUOTES}
        theme={settings.theme}
      />
    </div>
  );
}
