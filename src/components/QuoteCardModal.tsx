import React, { useState, useRef } from 'react';
import { X, Download, Copy, Check, Share2, Sparkles } from 'lucide-react';
import { QuoteItem, ReadingTheme } from '../types';

interface QuoteCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuote?: QuoteItem | null;
  allQuotes: QuoteItem[];
  theme: ReadingTheme;
}

export const QuoteCardModal: React.FC<QuoteCardModalProps> = ({
  isOpen,
  onClose,
  initialQuote,
  allQuotes,
  theme,
}) => {
  const [selectedQuote, setSelectedQuote] = useState<string>(
    initialQuote?.nepaliText || allQuotes[0]?.nepaliText || ''
  );
  const [cardStyle, setCardStyle] = useState<'parchment' | 'midnight' | 'velvet' | 'monochrome'>('parchment');
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen) return null;

  const isDark = theme === 'midnight' || theme === 'velvet';

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(`"${selectedQuote}"\n\n— अधुरो अध्याय 🥀`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'अधुरो अध्याय 🥀',
          text: `"${selectedQuote}"\n\n— अधुरो अध्याय`,
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      handleCopyText();
    }
  };

  const downloadImageCard = () => {
    setIsGenerating(true);
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsGenerating(false);
      return;
    }

    // Color definitions
    let bgColor = '#F7F4EE';
    let textColor = '#1C1917';
    let accentColor = '#9F1239';
    let borderColor = '#E7E2D7';
    let watermarkColor = '#78716C';

    if (cardStyle === 'midnight') {
      bgColor = '#0B0F19';
      textColor = '#F8FAFC';
      accentColor = '#FB7185';
      borderColor = '#1E293B';
      watermarkColor = '#64748B';
    } else if (cardStyle === 'velvet') {
      bgColor = '#1C131D';
      textColor = '#FFF1F2';
      accentColor = '#F43F5E';
      borderColor = '#4C0519';
      watermarkColor = '#9F1239';
    } else if (cardStyle === 'monochrome') {
      bgColor = '#FFFFFF';
      textColor = '#0F172A';
      accentColor = '#0F172A';
      borderColor = '#E2E8F0';
      watermarkColor = '#64748B';
    }

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 1200, 1200);

    // Inner ornamental border
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, 1080, 1080);

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(76, 76, 1048, 1048);

    // Header badge
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 28px "Noto Serif Devanagari", "Martel", serif';
    ctx.textAlign = 'center';
    ctx.fillText('अ ध या य  ·  सं स्म र ण', 600, 180);

    // Decorative quote marks
    ctx.font = '80px Georgia, serif';
    ctx.fillStyle = accentColor;
    ctx.fillText('“', 600, 300);

    // Main Quote wrapping
    ctx.font = '500 42px "Martel", "Noto Serif Devanagari", serif';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';

    const words = selectedQuote.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    const maxWidth = 900;

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    const lineHeight = 68;
    const startY = 480 - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, 600, startY + index * lineHeight);
    });

    // Divider line
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(450, startY + lines.length * lineHeight + 40);
    ctx.lineTo(750, startY + lines.length * lineHeight + 40);
    ctx.stroke();

    // Footer book title
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 36px "Martel", "Noto Serif Devanagari", serif';
    ctx.fillText('अधुरो अध्याय 🥀', 600, startY + lines.length * lineHeight + 110);

    ctx.fillStyle = watermarkColor;
    ctx.font = '22px "Noto Sans Devanagari", sans-serif';
    ctx.fillText('जीवनको सबैभन्दा सुन्दर अधुरो अध्यायको सम्झना', 600, startY + lines.length * lineHeight + 160);

    // Create download
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `adhuro-adhyaya-quote-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className={`w-full max-w-2xl rounded-2xl border p-6 sm:p-8 shadow-2xl transition-all my-8 ${
          isDark
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : 'bg-[#FBF9F5] border-stone-200 text-stone-900'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <h3 className="font-devanagari-heading text-lg font-bold">
              उद्धरण कार्ड जनरेटर (Quote Card Generator)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6">
          {/* Card Preview Box */}
          <div
            className={`p-8 rounded-xl border relative transition-all text-center flex flex-col items-center justify-center min-h-[260px] ${
              cardStyle === 'midnight'
                ? 'bg-[#0B0F19] text-slate-100 border-slate-800 shadow-xl'
                : cardStyle === 'velvet'
                ? 'bg-[#1C131D] text-rose-100 border-rose-950 shadow-xl'
                : cardStyle === 'monochrome'
                ? 'bg-white text-slate-900 border-slate-300 shadow-md'
                : 'bg-[#F7F4EE] text-stone-900 border-stone-300 shadow-md'
            }`}
          >
            <span
              className={`text-xs uppercase tracking-widest font-semibold mb-4 ${
                cardStyle === 'midnight'
                  ? 'text-rose-400'
                  : cardStyle === 'velvet'
                  ? 'text-rose-300'
                  : 'text-rose-800'
              }`}
            >
              अ ध या य  ·  सं स्म र ण
            </span>

            <div className="text-4xl leading-none text-rose-600/70 mb-2 font-serif">“</div>

            <p className="font-devanagari-heading text-lg sm:text-xl font-medium leading-relaxed max-w-lg mx-auto">
              {selectedQuote}
            </p>

            <div className="w-16 h-px bg-stone-300 dark:bg-stone-700 my-4" />

            <p
              className={`text-sm font-bold font-devanagari-heading ${
                cardStyle === 'midnight'
                  ? 'text-rose-400'
                  : cardStyle === 'velvet'
                  ? 'text-rose-300'
                  : 'text-rose-800'
              }`}
            >
              अधुरो अध्याय 🥀
            </p>
          </div>

          {/* Style Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              कार्डको सौन्दर्य शैली (Visual Style)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'parchment', name: 'विंटेज कागजी' },
                { id: 'midnight', name: 'मध्यरात स्लेट' },
                { id: 'velvet', name: 'मखमली गुलाफ' },
                { id: 'monochrome', name: 'आधुनिक मोनो' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setCardStyle(st.id as typeof cardStyle)}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                    cardStyle === st.id
                      ? 'border-rose-600 bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-bold'
                      : 'border-stone-200 dark:border-slate-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Select Quotes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              कथाका चर्चित हरफहरू छान्नुहोस्
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {allQuotes.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuote(q.nepaliText)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors border ${
                    selectedQuote === q.nepaliText
                      ? 'border-rose-600 bg-rose-50/70 text-rose-900 dark:bg-rose-950/50 dark:text-rose-200 font-medium'
                      : 'border-stone-200/70 dark:border-slate-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="line-clamp-2">"{q.nepaliText}"</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Editable Text */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
              वा आफ्नै शब्द सम्पादन गर्नुहोस्
            </label>
            <textarea
              rows={2}
              value={selectedQuote}
              onChange={(e) => setSelectedQuote(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-stone-200 dark:border-slate-800 bg-transparent focus:ring-1 focus:ring-rose-600 outline-none"
              placeholder="यहाँ कुनै पनि हरफ लेख्नुहोस्..."
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 pt-4 border-t border-stone-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'कपी भयो!' : 'पाठ कपी गर्नुहोस्'}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>सेयर</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 transition-colors"
            >
              बन्द गर्नुहोस्
            </button>
            <button
              onClick={downloadImageCard}
              disabled={isGenerating || !selectedQuote.trim()}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'तयार हुँदैछ...' : 'फोटो डाउनलोड (HD)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
