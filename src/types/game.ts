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
