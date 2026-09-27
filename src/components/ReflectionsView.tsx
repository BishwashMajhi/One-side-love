import React from 'react';
import { Sparkles, HeartHandshake, Compass, HeartCrack, BookOpen, Clock } from 'lucide-react';
import { ReadingTheme } from '../types';

interface ReflectionsViewProps {
  theme: ReadingTheme;
  onNavigateToStory: (chapterId?: number) => void;
}

export const ReflectionsView: React.FC<ReflectionsViewProps> = ({
  theme,
  onNavigateToStory,
}) => {
  const isDark = theme === 'midnight' || theme === 'velvet';

  const themesData = [
    {
      icon: Clock,
      title: 'पहिलो भेट र नजरको कम्पन',
      english: 'The Involuntary First Glance',
      chapterTarget: 1,
      desc: 'नयाँ ठाउँ, नयाँ अनुहारहरूको भीडमा अनायासै कुनै एउटा अनुहारमा नजर अडिनु संयोग मात्र हुँदैन। त्यो मनभित्र सुरु हुने एउटा असीम कौतूहल र मूक यात्राको थालनी हो।',
    },
    {
      icon: HeartCrack,
      title: 'मौन डर र “हुँदैन” को एक शब्द',
      english: 'The Weight of Rejection',
      chapterTarget: 3,
      desc: 'कहिलेकाहीँ महिनौँसम्म सजाएको सपना भत्काउन एउटा सानो शब्द नै काफी हुन्छ। तर त्यो शब्दले धोका दिएको होइन, सत्य बोलेको हुन्छ। त्यहीँबाट वास्तविक परिपक्वता सुरु हुन्छ।',
    },
    {
      icon: HeartHandshake,
      title: 'मायाको साँचो परिभाषा र स्वीकार',
      english: 'Acceptance Over Possession',
      chapterTarget: 4,
      desc: '“माया भनेको कसैलाई आफ्नो बनाउनु मात्र होइन रहेछ।” कसैको निर्णय र उसको भावनाको सम्मान गर्नु नै साँचो र निःस्वार्थ प्रेमको सबैभन्दा उच्च रूप हो।',
    },
    {
      icon: Compass,
      title: 'अधुरो अध्यायको अमर सौन्दर्य',
      english: 'The Sanctity of Incompleteness',
      chapterTarget: 5,
      desc: 'हरेक कथाको अन्त्य मिलनमा नै हुनुपर्छ भन्ने छैन। केही कथाहरू अधुरै रहेर पनि जीवनको सबैभन्दा पवित्र र अविस्मरणीय पृष्ठ बनिदिन्छन्।',
    },
  ];

  const timelineSteps = [
    { stage: 'चरण १', title: 'अपरिचित भीड', subtitle: 'कक्षाको पहिलो दिन र त्यो अनपेक्षित आकर्षण' },
    { stage: 'चरण २', title: 'मनको द्वन्द्व', subtitle: 'सयौँ पटक भन्न खोज्दा पनि डरले ओठ बन्द हुनु' },
    { stage: 'चरण ३', title: 'साहस र चोट', subtitle: 'भावना पोख्नु र “हुँदैन” भन्ने तीतो सत्य सुन्नु' },
    { stage: 'चरण ४', title: 'बोध र क्षमाशीलता', subtitle: 'न उसलाई दोष, न आफूलाई—केवल भावनाको भिन्नता' },
    { stage: 'चरण ५', title: 'अधुरो अध्याय', subtitle: 'जीवनभर मनमा रहने एउटा सुन्दर, दुःखद तर पवित्र सम्झना' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Intro */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-2">
          <Sparkles className="w-4 h-4" />
          <span>दार्शनिक तथा भाव विश्लेषण</span>
        </div>
        <h2 className="font-devanagari-heading text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          “अधुरो अध्याय” को भित्री भाव 🥀
        </h2>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 font-devanagari-serif leading-relaxed">
          यस संस्मरणले व्यक्त गरेको प्रेम केवल आकर्षण वा मिलनको चाहना मात्र होइन,
          यो कसैको अस्तित्वलाई निष्कपट मनले चाहेर उसको इच्छालाई शीरोधार्य गर्ने उच्च मानवीय संवेदना हो।
        </p>
      </div>

      {/* 4 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {themesData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`p-6 sm:p-7 rounded-2xl border transition-all ${
                isDark
                  ? 'bg-slate-900/80 border-slate-800 text-slate-100'
                  : 'bg-[#FBF9F5] border-stone-200 text-stone-900 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-devanagari-heading text-base font-bold">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-400 font-serif italic">
                    {item.english}
                  </p>
                </div>
              </div>

              <p className="text-sm font-devanagari-serif leading-relaxed text-stone-600 dark:text-stone-300 mb-4">
                {item.desc}
              </p>

              <button
                onClick={() => onNavigateToStory(item.chapterTarget)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:underline"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>यस अध्यायमा जानुहोस् ➔</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Story Timeline */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border ${
          isDark
            ? 'bg-slate-900/60 border-slate-800 text-slate-100'
            : 'bg-[#FBF9F5] border-stone-200 text-stone-900 shadow-xs'
        }`}
      >
        <h3 className="font-devanagari-heading text-lg font-bold text-center mb-6">
          संस्मरणको भावनात्मक यात्राक्रम (Emotional Journey Timeline)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {timelineSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-stone-200/80 dark:border-slate-800/80 bg-stone-50/50 dark:bg-slate-900/40 text-center relative"
            >
              <span className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 block mb-1">
                {step.stage}
              </span>
              <h4 className="font-devanagari-heading text-sm font-bold mb-1">
                {step.title}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-devanagari-serif leading-relaxed">
                {step.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
