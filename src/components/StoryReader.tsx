import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  BookOpen,
  AlignLeft,
  Compass,
  Bookmark,
  Share2,
  Check,
  Volume2
} from 'lucide-react';
import { Chapter, ReaderSettings, ReadingMode } from '../types';
import { SpeechController } from '../utils/audioEngine';

interface StoryReaderProps {
  chapters: Chapter[];
  settings: ReaderSettings;
  activeChapterId: number;
  setActiveChapterId: (id: number) => void;
  onOpenCardModal: (quoteText: string) => void;
  onOpenSoundModal: () => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({
  chapters,
  settings,
  activeChapterId,
  setActiveChapterId,
  onOpenCardModal,
  onOpenSoundModal,
}) => {
  const [readingMode, setReadingMode] = useState<ReadingMode>('chapters');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);
  const [bookmarkedChapters, setBookmarkedChapters] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('adhuro_bookmarks');
      return saved ? JSON.parse(saved) : [1];
    } catch {
      return [1];
    }
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const currentChapter = chapters.find((c) => c.id === activeChapterId) || chapters[0];

  // Save bookmarks
  const toggleBookmark = (id: number) => {
    const updated = bookmarkedChapters.includes(id)
      ? bookmarkedChapters.filter((b) => b !== id)
      : [...bookmarkedChapters, id];
    setBookmarkedChapters(updated);
    try {
      localStorage.setItem('adhuro_bookmarks', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Text-To-Speech Read-Along
  const handleToggleSpeech = () => {
    if (isSpeaking) {
      if (isPaused) {
        SpeechController.resume();
        setIsPaused(false);
      } else {
        SpeechController.pause();
        setIsPaused(true);
      }
    } else {
      const fullText =
        readingMode === 'continuous'
          ? chapters.map((c) => `${c.titleNepali}. ${c.paragraphs.join(' ')}`).join(' ')
          : `${currentChapter.titleNepali}. ${currentChapter.paragraphs.join(' ')}`;

      setIsSpeaking(true);
      setIsPaused(false);

      SpeechController.speakText(fullText, {
        rate: 0.88,
        onEnd: () => {
          setIsSpeaking(false);
          setIsPaused(false);
        },
        onError: () => {
          setIsSpeaking(false);
          setIsPaused(false);
        },
      });
    }
  };

  const handleStopSpeech = () => {
    SpeechController.stop();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  useEffect(() => {
    return () => {
      SpeechController.stop();
    };
  }, [activeChapterId, readingMode]);

  // Typography class calculations
  const fontClass =
    settings.fontFamily === 'heading'
      ? 'font-devanagari-heading'
      : settings.fontFamily === 'sans'
      ? 'font-devanagari-sans'
      : 'font-devanagari-serif';

  const sizeClass =
    settings.fontSize === 'small'
      ? 'text-sm sm:text-base'
      : settings.fontSize === 'medium'
      ? 'text-base sm:text-lg'
      : settings.fontSize === 'large'
      ? 'text-lg sm:text-xl'
      : 'text-xl sm:text-2xl';

  const lineSpacingClass =
    settings.lineSpacing === 'normal'
      ? 'leading-relaxed'
      : settings.lineSpacing === 'relaxed'
      ? 'leading-[1.9]'
      : 'leading-[2.2]';

  const isDark = settings.theme === 'midnight' || settings.theme === 'velvet';

  return (
    <div className="w-full">
      {/* Editorial Control Toolbar */}
      <div className="sticky top-16 z-30 w-full border-b border-stone-200/80 dark:border-slate-800/80 bg-inherit backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/60 dark:bg-slate-800/80 rounded-lg text-xs font-medium">
            <button
              onClick={() => setReadingMode('chapters')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                readingMode === 'chapters'
                  ? 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 font-bold shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>अध्याय-क्रम</span>
            </button>
            <button
              onClick={() => setReadingMode('continuous')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                readingMode === 'continuous'
                  ? 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 font-bold shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span>अविराम वाचन</span>
            </button>
            <button
              onClick={() => setReadingMode('visual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                readingMode === 'visual'
                  ? 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 font-bold shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>दृश्य-काव्य</span>
            </button>
          </div>

          {/* Audio / Read-along Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSpeech}
              title={isSpeaking ? (isPaused ? 'पुनः सुरु' : 'पज') : 'अडियो वाचन सुन्नुहोस्'}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                isSpeaking
                  ? 'border-rose-600 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                  : 'border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800'
              }`}
            >
              {isSpeaking && !isPaused ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden sm:inline">पज गर्नुहोस्</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden sm:inline">
                    {isPaused ? 'जारी राख्नुहोस्' : 'वाचन सुन्नुहोस्'}
                  </span>
                </>
              )}
            </button>

            {isSpeaking && (
              <button
                onClick={handleStopSpeech}
                title="वाचन रोक्नुहोस्"
                className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {readingMode === 'chapters' && (
              <button
                onClick={() => toggleBookmark(currentChapter.id)}
                title="यस अध्यायलाई बुकमार्क गर्नुहोस्"
                className={`p-1.5 rounded-lg border border-stone-200 dark:border-slate-800 transition-colors ${
                  bookmarkedChapters.includes(currentChapter.id)
                    ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/50'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${
                    bookmarkedChapters.includes(currentChapter.id) ? 'fill-current' : ''
                  }`}
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODE 1: CHAPTER-BY-CHAPTER (EDITORIAL WALKTHROUGH) */}
      {/* ------------------------------------------------------------- */}
      {readingMode === 'chapters' && (
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14" ref={scrollRef}>
          {/* Chapter Metadata Kicker */}
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono uppercase tracking-widest text-rose-700 dark:text-rose-400 font-semibold">
                {currentChapter.partNumberNepali}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-serif italic">{currentChapter.englishTitle}</span>
            </div>
            <span className="font-mono text-[11px] tabular-nums">
              अध्याय {currentChapter.id} / {chapters.length}
            </span>
          </div>

          {/* Chapter Title */}
          <h1 className="font-devanagari-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100 text-balance">
            {currentChapter.titleNepali}
          </h1>

          {/* Hairline Separator */}
          <div className="w-full h-px bg-stone-200 dark:bg-slate-800 my-6" />

          {/* Chapter Lead Quote */}
          <div className="p-4 sm:p-5 rounded-xl border border-stone-200/80 dark:border-slate-800/80 bg-stone-50/50 dark:bg-slate-900/40 mb-8">
            <p className="font-devanagari-heading text-sm sm:text-base italic text-stone-700 dark:text-stone-300 leading-relaxed">
              {currentChapter.leadQuote}
            </p>
          </div>

          {/* Chapter Editorial Imagery with Zero Broken Image Fallback */}
          <div className="mb-10 rounded-2xl overflow-hidden border border-stone-200 dark:border-slate-800 shadow-md">
            <div className="relative aspect-4/3 sm:aspect-16/9 bg-stone-200 dark:bg-slate-800">
              <img
                src={currentChapter.image}
                alt={currentChapter.imageCaption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
                onError={(e) => {
                  // Fallback container
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.innerHTML = `
                      <div class="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-100 dark:bg-slate-800">
                        <span class="text-3xl mb-2">🥀</span>
                        <p class="text-xs font-serif text-stone-500">${currentChapter.imageCaption}</p>
                      </div>
                    `;
                  }
                }}
              />
            </div>
            <div className="px-4 py-2.5 bg-stone-100/70 dark:bg-slate-900/70 border-t border-stone-200 dark:border-slate-800">
              <p className="text-xs font-serif italic text-stone-500 dark:text-stone-400 text-center">
                {currentChapter.imageCaption}
              </p>
            </div>
          </div>

          {/* Chapter Paragraphs with Drop-Cap on 1st paragraph */}
          <div className={`space-y-6 ${fontClass} ${sizeClass} ${lineSpacingClass} text-stone-800 dark:text-stone-200`}>
            {currentChapter.paragraphs.map((p, pIndex) => (
              <p
                key={pIndex}
                className={pIndex === 0 && currentChapter.id === 1 ? 'nepali-drop-cap' : ''}
              >
                {p}
              </p>
            ))}
          </div>

          {/* Highlight Pull-Quote Callout */}
          {currentChapter.highlightQuote && (
            <div className="my-10 p-6 sm:p-8 border-y-2 border-stone-200 dark:border-slate-800 text-center relative">
              <span className="text-4xl text-rose-600/40 font-serif leading-none block mb-1">
                “
              </span>
              <p className="font-devanagari-heading text-lg sm:text-xl font-medium leading-relaxed max-w-xl mx-auto text-stone-900 dark:text-stone-100">
                {currentChapter.highlightQuote}
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => onOpenCardModal(currentChapter.highlightQuote!)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>यो हरफको फोटो कार्ड बनाउनुहोस्</span>
                </button>
              </div>
            </div>
          )}

          {/* Chapter Navigation Bar */}
          <div className="mt-12 pt-6 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                if (currentChapter.id > 1) {
                  setActiveChapterId(currentChapter.id - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              disabled={currentChapter.id <= 1}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>अघिल्लो अध्याय</span>
            </button>

            {/* Chapter Dots */}
            <div className="flex items-center gap-1.5">
              {chapters.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setActiveChapterId(ch.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  title={ch.titleNepali}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    ch.id === currentChapter.id
                      ? 'bg-rose-700 w-6'
                      : 'bg-stone-300 dark:bg-slate-700 hover:bg-stone-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                if (currentChapter.id < chapters.length) {
                  setActiveChapterId(currentChapter.id + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              disabled={currentChapter.id >= chapters.length}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <span>पछिल्लो अध्याय</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </article>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODE 2: CONTINUOUS FLOW (SINGLE UNINTERRUPTED ESSAY) */}
      {/* ------------------------------------------------------------- */}
      {readingMode === 'continuous' && (
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          {/* Header Marquee */}
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-rose-700 dark:text-rose-400 font-mono font-semibold block mb-2">
              सम्पूर्ण संस्मरण वाचन · Full Memoir
            </span>
            <h1 className="font-devanagari-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              अधुरो अध्याय 🥀
            </h1>
            <p className="mt-3 text-sm text-stone-500 font-serif italic">
              ५ भागहरू · अखण्डित शान्त पठन
            </p>
            <div className="w-16 h-0.5 bg-rose-700 mx-auto my-6" />
          </div>

          <div className="space-y-16">
            {chapters.map((ch, idx) => (
              <section key={ch.id} className="relative">
                <div className="flex items-center gap-3 text-xs text-stone-400 font-mono mb-4">
                  <span className="text-rose-700 dark:text-rose-400 font-bold uppercase">
                    {ch.partNumberNepali}
                  </span>
                  <span aria-hidden="true">·</span>
                  <h2 className="font-devanagari-heading text-lg font-bold text-stone-900 dark:text-stone-100">
                    {ch.titleNepali}
                  </h2>
                </div>

                <div className={`space-y-5 ${fontClass} ${sizeClass} ${lineSpacingClass} text-stone-800 dark:text-stone-200`}>
                  {ch.paragraphs.map((p, pIdx) => (
                    <p
                      key={pIdx}
                      className={idx === 0 && pIdx === 0 ? 'nepali-drop-cap' : ''}
                    >
                      {p}
                    </p>
                  ))}
                </div>

                {ch.highlightQuote && (
                  <div className="my-8 p-5 border-l-2 border-rose-700 bg-stone-50/60 dark:bg-slate-900/40 rounded-r-xl">
                    <p className="font-devanagari-heading text-base font-medium italic text-stone-800 dark:text-stone-200">
                      “{ch.highlightQuote}”
                    </p>
                  </div>
                )}

                {idx < chapters.length - 1 && (
                  <div className="w-full flex items-center justify-center my-12 opacity-40">
                    <span className="text-lg">❦</span>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Epilogue */}
          <div className="mt-16 pt-8 border-t border-stone-200 dark:border-slate-800 text-center">
            <p className="font-devanagari-heading text-lg font-semibold text-rose-700 dark:text-rose-400">
              — समाप्त —
            </p>
            <p className="text-xs text-stone-500 font-serif italic mt-1">
              “कम्तीमा एकपटक त मैले कसैलाई साँचो मनले माया गरेको थिएँ।”
            </p>
          </div>
        </article>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODE 3: VISUAL SCENE BY SCENE (CINEMATIC SLIDES) */}
      {/* ------------------------------------------------------------- */}
      {readingMode === 'visual' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div
            className={`rounded-3xl overflow-hidden border shadow-2xl relative transition-all ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-[#FBF9F5] border-stone-200 text-stone-900'
            }`}
          >
            {/* Cinematic Hero Image */}
            <div className="relative aspect-16/9 w-full overflow-hidden bg-stone-900">
              <img
                src={currentChapter.image}
                alt={currentChapter.imageCaption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-6 sm:p-10">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-rose-300 font-bold block mb-1">
                    {currentChapter.partNumberNepali} · दृश्य {currentChapter.id}
                  </span>
                  <h2 className="font-devanagari-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {currentChapter.titleNepali}
                  </h2>
                </div>
              </div>
            </div>

            {/* Story Card Content */}
            <div className="p-6 sm:p-10">
              <div className={`space-y-6 ${fontClass} ${sizeClass} ${lineSpacingClass} text-stone-800 dark:text-stone-200`}>
                {currentChapter.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Bottom Visual Card Navigation */}
              <div className="mt-10 pt-6 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (currentChapter.id > 1) {
                      setActiveChapterId(currentChapter.id - 1);
                    }
                  }}
                  disabled={currentChapter.id <= 1}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-medium rounded-lg border border-stone-300 dark:border-slate-700 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>अघिल्लो दृश्य</span>
                </button>

                <span className="text-xs font-mono text-stone-400">
                  {currentChapter.id} / {chapters.length}
                </span>

                <button
                  onClick={() => {
                    if (currentChapter.id < chapters.length) {
                      setActiveChapterId(currentChapter.id + 1);
                    }
                  }}
                  disabled={currentChapter.id >= chapters.length}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg disabled:opacity-30"
                >
                  <span>अर्को दृश्य</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
