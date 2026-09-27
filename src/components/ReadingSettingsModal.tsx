import React from 'react';
import { X, Check, Type, Palette, AlignLeft } from 'lucide-react';
import { ReaderSettings, ReadingTheme } from '../types';

interface ReadingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
}

export const ReadingSettingsModal: React.FC<ReadingSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const themes: { id: ReadingTheme; name: string; desc: string; bgClass: string; textClass: string }[] = [
    {
      id: 'parchment',
      name: 'विंटेज डायरी',
      desc: 'पुरातन कागजी पाना (#FBF9F5)',
      bgClass: 'bg-[#FBF9F5] border-stone-300',
      textClass: 'text-stone-900',
    },
    {
      id: 'midnight',
      name: 'मध्यरातको एकान्त',
      desc: 'गहिरो स्लेट नीलो (#0B0F19)',
      bgClass: 'bg-[#0B0F19] border-slate-700',
      textClass: 'text-slate-100',
    },
    {
      id: 'velvet',
      name: 'गुलाबी साँझ',
      desc: 'मखमली लालित्य (#1A1620)',
      bgClass: 'bg-[#1A1620] border-rose-900/60',
      textClass: 'text-rose-100',
    },
    {
      id: 'minimal',
      name: 'न्यूनतम शुद्ध',
      desc: 'आधुनिक सफा सेतो (#FFFFFF)',
      bgClass: 'bg-white border-neutral-300',
      textClass: 'text-neutral-900',
    },
  ];

  const fontOptions: { id: ReaderSettings['fontFamily']; label: string; sample: string }[] = [
    { id: 'serif', label: 'साहित्यिक सेरिफ (Serif)', sample: 'अधुरो अध्याय' },
    { id: 'heading', label: 'शास्त्रीय मार्तेल (Martel)', sample: 'अधुरो अध्याय' },
    { id: 'sans', label: 'सरल देवनागरी (Sans)', sample: 'अधुरो अध्याय' },
  ];

  const isDark = settings.theme === 'midnight' || settings.theme === 'velvet';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : 'bg-[#FBF9F5] border-stone-200 text-stone-900'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <h3 className="font-devanagari-heading text-lg font-bold">पठन शैली र रूपरेखा</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6">
          {/* Themes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2.5">
              पृष्ठभूमि विषयवस्तु (Reading Theme)
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {themes.map((th) => (
                <button
                  key={th.id}
                  onClick={() => onUpdateSettings({ theme: th.id })}
                  className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                    th.bgClass
                  } ${
                    settings.theme === th.id
                      ? 'ring-2 ring-rose-600 ring-offset-1 ring-offset-transparent'
                      : 'hover:border-stone-400 opacity-90'
                  }`}
                >
                  <div>
                    <p className={`text-xs font-bold ${th.textClass}`}>{th.name}</p>
                    <p className={`text-[10px] mt-0.5 opacity-70 ${th.textClass}`}>{th.desc}</p>
                  </div>
                  {settings.theme === th.id && (
                    <Check className="w-4 h-4 text-rose-600 shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Typography Choice */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2.5">
              फन्ट परिवार (Typography)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {fontOptions.map((font) => (
                <button
                  key={font.id}
                  onClick={() => onUpdateSettings({ fontFamily: font.id })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    settings.fontFamily === font.id
                      ? 'border-rose-600 bg-rose-50/60 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold'
                      : 'border-stone-200 dark:border-slate-800 hover:border-stone-300'
                  }`}
                >
                  <p className="text-xs truncate">{font.label}</p>
                  <span className="text-sm block mt-1 font-devanagari-serif opacity-80">
                    {font.sample}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size & Line Spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5" />
                  अक्षरको आकार (Size)
                </span>
              </label>
              <div className="flex rounded-lg border border-stone-200 dark:border-slate-800 p-1">
                {(['small', 'medium', 'large', 'extra-large'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => onUpdateSettings({ fontSize: sz })}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      settings.fontSize === sz
                        ? 'bg-stone-900 text-white dark:bg-rose-700'
                        : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                    }`}
                  >
                    {sz === 'small' ? 'सानो' : sz === 'medium' ? 'मध्यम' : sz === 'large' ? 'ठूलो' : 'विशाल'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <AlignLeft className="w-3.5 h-3.5" />
                  लाइन दूरी (Line Spacing)
                </span>
              </label>
              <div className="flex rounded-lg border border-stone-200 dark:border-slate-800 p-1">
                {(['normal', 'relaxed', 'loose'] as const).map((sp) => (
                  <button
                    key={sp}
                    onClick={() => onUpdateSettings({ lineSpacing: sp })}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      settings.lineSpacing === sp
                        ? 'bg-stone-900 text-white dark:bg-rose-700'
                        : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                    }`}
                  >
                    {sp === 'normal' ? 'सामान्य' : sp === 'relaxed' ? 'फराकिलो' : 'खुला'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium text-white bg-stone-900 dark:bg-rose-700 hover:bg-stone-800 rounded-lg transition-colors"
          >
            लागु गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};
