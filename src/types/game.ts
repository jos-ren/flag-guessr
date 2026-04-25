import type { Country } from './country';

export interface ResultMessage {
  text: string;
  sub: string;
}

export type Phase = 'idle' | 'active' | 'answered' | 'leaving' | 'gameover';

export interface GuessRecord {
  country: Country;
  correct: boolean;
}

export interface StatEntry {
  country: Country;
  count: number;
  correct: boolean;
}

export interface GameMode {
  id: string;
  title: string;
  description: string;
  flagCode: string;
  flagImageUrl?: string;
  available: boolean;
}
