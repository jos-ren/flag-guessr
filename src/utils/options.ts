import type { Country } from '@/types';
import { shuffle } from './shuffle';

export function getOptions(correct: Country, pool: Country[]): Country[] {
  const others = shuffle(pool.filter(c => c.code !== correct.code));
  return shuffle([correct, ...others.slice(0, 3)]);
}
