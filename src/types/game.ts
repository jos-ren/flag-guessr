import type { Country } from './country';

export interface ResultMessage {
  text: string;
  sub: string;
}

export type Phase = 'active' | 'answered' | 'leaving' | 'gameover';

export interface GuessRecord {
  country: Country;
  correct: boolean;
}

export interface StatEntry {
  country: Country;
  count: number;
  correct: boolean;
}

export type Difficulty = 'easy' | 'normal' | 'hard';
export type RegionFilter = 'all' | 'africa' | 'americas' | 'asia' | 'europe' | 'middle-east' | 'oceania';

export interface GameMode {
  id: string;
  title: string;
  description: string;
  flagCode: string;
  available: boolean;
}
