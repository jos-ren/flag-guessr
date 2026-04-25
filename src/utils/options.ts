import type { Country } from '@/types';
import { shuffle } from './shuffle';

export function getOptions(correct: Country, all: Country[]): Country[] {
  const others = shuffle(all.filter(c => c.code !== correct.code)).slice(0, 3);
  return shuffle([correct, ...others]);
}
