import React, { useState } from 'react';
import { Quote, Sparkles, Copy, Check, Share2, Image as ImageIcon } from 'lucide-react';
import { QuoteItem, ReadingTheme } from '../types';

interface QuotesGalleryProps {
  quotes: QuoteItem[];
  theme: ReadingTheme;
  onOpenCardModal: (quote: QuoteItem) => void;
}

export const QuotesGallery: React.FC<QuotesGalleryProps> = ({
  quotes,
  theme,
  onOpenCardModal,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (quote: QuoteItem) => {
    navigator.clipboard.writeText(`"${quote.nepaliText}"\n\n— अधुरो अध्याय 🥀`);
    setCopiedId(quote.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isDark = theme === 'midnight' || theme === 'velvet';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Intro */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-2">
          <Quote className="w-4 h-4" />
          <span>अविस्मरणीय हरफहरू</span>
        </div>
        <h2 className="font-devanagari-heading text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          कथाका मर्मस्पर्शी उद्धरणहरू 🥀
        </h2>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 font-devanagari-serif leading-relaxed">
          जसले मायाको गहिराइ, अस्वीकारको शान्त पीडा र समझदारीको उचाइलाई शब्दहरूमा उतारेका छन्।
          कुनै पनि हरफलाई HD फोटो कार्ड बनाई सेभ वा सेयर गर्नुहोस्।
        </p>
      </div>

      {/* Grid of quote cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quotes.map((q) => (
          <div
            key={q.id}
            className={`p-6 sm:p-7 rounded-2xl border flex flex-col justify-between transition-all ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 text-slate-100 hover:border-slate-700'
                : 'bg-[#FBF9F5] border-stone-200 text-stone-900 hover:border-stone-300 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs text-stone-400 mb-4 pb-3 border-b border-stone-200/60 dark:border-slate-800/60">
                <span className="font-semibold text-rose-700 dark:text-rose-400">
                  {q.context}
                </span>
                <span className="font-mono text-[11px] opacity-75">
                  {q.tag}
                </span>
              </div>

              <div className="relative">
                <span className="text-3xl font-serif text-rose-600/40 leading-none absolute -top-4 -left-2 select-none">
                  “
                </span>
                <p className="font-devanagari-heading text-base sm:text-lg font-medium leading-relaxed pl-3 text-stone-800 dark:text-stone-200">
                  {q.nepaliText}
                </p>
              </div>

              {q.englishTranslation && (
                <p className="mt-3 pl-3 text-xs italic font-serif text-stone-500 dark:text-stone-400 leading-normal">
                  {q.englishTranslation}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-stone-200/60 dark:border-slate-800/60 flex items-center justify-between">
              <button
                onClick={() => onOpenCardModal(q)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors shadow-xs"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>फोटो कार्ड बनाउनुहोस्</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopy(q)}
                  title="पाठ कपी गर्नुहोस्"
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-stone-200 dark:border-slate-800 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {copiedId === q.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px]">कपी भयो!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-400" />
                      <span className="text-[11px]">कपी</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
