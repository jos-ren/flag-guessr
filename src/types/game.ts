import type { Country } from './country';

export interface ResultMessage {
  text: string;
  sub: string;
}

export type Phase = 'idle' | 'active' | 'answered' | 'leaving' | 'gameover' | 'quizcomplete';

export interface GuessRecord {
  country: Country;
  correct: boolean;
  selected?: Country;
}

export interface StatEntry {
  country: Country;
  count: number;
  correct: boolean;
}

export type GameModeSection = 'world' | 'subdivisions' | 'general' | 'sports';

export interface GameMode {
  id: string;
  title: string;
  description: string;
  flagCode: string;
  flagImageUrl?: string;
  available: boolean;
  section: GameModeSection;
  answerMode?: 'text-input';
}
