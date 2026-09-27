export type ReadingTheme = 'parchment' | 'midnight' | 'velvet' | 'minimal';

export type ReadingMode = 'chapters' | 'continuous' | 'visual';

export interface Chapter {
  id: number;
  partNumberNepali: string;
  titleNepali: string;
  englishTitle: string;
  leadQuote: string;
  paragraphs: string[];
  highlightQuote?: string;
  image: string;
  imageCaption: string;
  themeMood: string;
}

export interface QuoteItem {
  id: string;
  nepaliText: string;
  englishTranslation?: string;
  context: string;
  tag: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: 'nostalgic' | 'peaceful' | 'healing' | 'bittersweet';
  isFavorite: boolean;
}

export interface SoundConfig {
  isPlaying: boolean;
  rainVolume: number;
  pianoVolume: number;
  windVolume: number;
  masterVolume: number;
  ambientType: 'rain' | 'piano' | 'wind' | 'combined';
}

export interface ReaderSettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  lineSpacing: 'normal' | 'relaxed' | 'loose';
  fontFamily: 'serif' | 'heading' | 'sans';
  theme: ReadingTheme;
  showPetals: boolean;
  autoScroll: boolean;
}
