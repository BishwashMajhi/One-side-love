import React, { useState, useEffect } from 'react';
import { PenLine, Trash2, Heart, Download, Plus, BookHeart, Calendar } from 'lucide-react';
import { JournalEntry, ReadingTheme } from '../types';

interface PersonalJournalProps {
  theme: ReadingTheme;
}

const STORAGE_KEY = 'adhuro_journal_entries';

export const PersonalJournal: React.FC<PersonalJournalProps> = ({ theme }) => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'sample-entry-1',
        date: new Date().toLocaleDateString('ne-NP', { year: 'numeric', month: 'long', day: 'numeric' }),
        title: 'मनको एउटा अनकही पाना',
        content: '“अधुरो अध्याय” पढ्दा वर्षौं पुरानो त्यो कलेजको पहिलो दिन र झ्याल नजिकै बस्ने त्यो अनुहार आँखा अगाडि आयो। केही कथाहरू अधुरो रहेर पनि जीवनभरका लागि मनमा जीवित रहन्छन्...',
        mood: 'nostalgic',
        isFavorite: true,
      },
    ];
  });

  const [isComposing, setIsComposing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [mood, setMood] = useState<JournalEntry['mood']>('nostalgic');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // storage error
    }
  }, [entries]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      date: new Date().toLocaleDateString('ne-NP', { year: 'numeric', month: 'long', day: 'numeric' }),
      title: title.trim() || 'शीर्षक बिनाको सम्झना',
      content: content.trim(),
      mood,
      isFavorite: false,
    };

    setEntries([newEntry, ...entries]);
    setTitle('');
    setContent('');
    setIsComposing(false);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry
      )
    );
  };

  const handleExportJournal = () => {
    const textContent = entries
      .map(
        (e) =>
          `------------------------------\n${e.title} (${e.date})\nभाव: ${e.mood}\n\n${e.content}\n`
      )
      .join('\n');

    const blob = new Blob([`मेरो अधुरो अध्याय — व्यक्तिगत डायरी\n\n${textContent}`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mero-adhuro-diary-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isDark = theme === 'midnight' || theme === 'velvet';

  const prompts = [
    'कक्षाको त्यो पहिलो दिनको सम्झना...',
    'भन्न चाहेर पनि भन्न नसकेको त्यो एउटा वाक्य...',
    'कसैको "हुँदैन" लाई स्वीकार गर्दाको मनको अवस्था...',
    'अधुरो भएर पनि मनमा अमर रहेको मान्छे...',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header section */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-2">
          <BookHeart className="w-4 h-4" />
          <span>तपाईंको आफ्नै संस्मरण</span>
        </div>
        <h2 className="font-devanagari-heading text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          मेरो अधुरो अध्याय 🥀
        </h2>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 font-devanagari-serif leading-relaxed">
          हरेक मानिसको मनभित्र एउटा यस्तो अध्याय हुन्छ, जसको अन्त्य अधुरो भयो तर त्यो सबैभन्दा सुन्दर रह्यो।
          आफ्ना अनकही भावनाहरू यहाँ सुरक्षित लिपिबद्ध गर्नुहोस्।
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setIsComposing(!isComposing)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{isComposing ? 'फारम बन्द गर्नुहोस्' : 'नयाँ संस्मरण लेख्नुहोस्'}</span>
          </button>
          {entries.length > 0 && (
            <button
              onClick={handleExportJournal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>डायरी सेभ / डाउनलोड</span>
            </button>
          )}
        </div>
      </div>

      {/* Writing Box */}
      {isComposing && (
        <form
          onSubmit={handleAddEntry}
          className={`mb-10 p-6 rounded-2xl border transition-all ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-[#FBF9F5] border-stone-200 text-stone-900 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-slate-800 mb-4">
            <h3 className="font-devanagari-heading text-base font-bold flex items-center gap-2">
              <PenLine className="w-4 h-4 text-rose-600" />
              <span>नयाँ भावना लिपिबद्ध गर्नुहोस्</span>
            </h3>
            <span className="text-xs text-stone-400 font-mono">
              {new Date().toLocaleDateString('ne-NP')}
            </span>
          </div>

          {/* Quick Prompts */}
          <div className="mb-4">
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
              विचार सुझावहरू (Inspiring Prompts):
            </p>
            <div className="flex flex-wrap gap-1.5">
              {prompts.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setTitle(p)}
                  className="text-[11px] py-1 px-2.5 rounded-full border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-800/60 hover:border-rose-400 transition-colors text-stone-600 dark:text-stone-300"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="संस्मरणको शीर्षक (उदाहरण: कक्षाको त्यो झ्याल, अनकही प्रेम...)"
                className="w-full px-3 py-2 text-sm font-devanagari-heading font-medium rounded-lg border border-stone-200 dark:border-slate-800 bg-transparent focus:ring-1 focus:ring-rose-600 outline-none"
              />
            </div>

            <div>
              <textarea
                rows={5}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="मनमा गुम्सिएका शब्दहरू यहाँ पोख्नुहोस्..."
                className="w-full p-3 text-sm font-devanagari-serif leading-relaxed rounded-lg border border-stone-200 dark:border-slate-800 bg-transparent focus:ring-1 focus:ring-rose-600 outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500">मनोभाव:</span>
                {(
                  [
                    { id: 'nostalgic', label: 'नोस्टाल्जिक' },
                    { id: 'bittersweet', label: 'मीठो पीडा' },
                    { id: 'peaceful', label: 'शान्ति & मुक्ति' },
                    { id: 'healing', label: 'स्वीकार' },
                  ] as const
                ).map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setMood(m.id)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                      mood === m.id
                        ? 'border-rose-600 bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-semibold'
                        : 'border-stone-200 dark:border-slate-800 text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors"
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors"
                >
                  डायरीमा सुरक्षित गर्नुहोस्
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-stone-200 dark:border-slate-800 rounded-2xl">
            <PenLine className="w-8 h-8 text-stone-300 dark:text-stone-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
              अहिलेसम्म कुनै संस्मरण लेखिएको छैन।
            </p>
            <p className="text-xs text-stone-400 mt-1">
              माथिको "नयाँ संस्मरण लेख्नुहोस्" बटन थिचेर आफ्ना भावनाहरू लिपिबद्ध गर्नुहोस्।
            </p>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className={`p-6 rounded-2xl border transition-all ${
                isDark
                  ? 'bg-slate-900/70 border-slate-800 text-slate-100 hover:border-slate-700'
                  : 'bg-[#FBF9F5] border-stone-200/90 text-stone-900 hover:border-stone-300 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h4 className="font-devanagari-heading text-base font-bold">
                    {entry.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {entry.date}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize text-rose-700 dark:text-rose-400 font-medium">
                      {entry.mood === 'nostalgic'
                        ? 'नोस्टाल्जिक'
                        : entry.mood === 'bittersweet'
                        ? 'मीठो पीडा'
                        : entry.mood === 'peaceful'
                        ? 'शान्ति & मुक्ति'
                        : 'स्वीकार'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleFavorite(entry.id)}
                    title="मनपर्ने चिन्ह लगाउनुहोस्"
                    className={`p-1.5 rounded-lg transition-colors ${
                      entry.isFavorite
                        ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/50'
                        : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${entry.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    title="हटाउनुहोस्"
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="mt-3 text-sm font-devanagari-serif leading-relaxed whitespace-pre-line text-stone-700 dark:text-stone-300">
                {entry.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
