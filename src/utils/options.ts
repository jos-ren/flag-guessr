import type { Country } from '@/types';
import type { Difficulty } from '@/types';
import { shuffle } from './shuffle';
import { COUNTRY_REGIONS } from '@/constants';

export function getOptions(correct: Country, pool: Country[], difficulty: Difficulty): Country[] {
  const others = pool.filter(c => c.code !== correct.code);

  let distractors: Country[];

  if (difficulty === 'hard') {
    const correctRegion = COUNTRY_REGIONS[correct.code];
    const sameRegion = shuffle(others.filter(c => COUNTRY_REGIONS[c.code] === correctRegion));
    const rest = shuffle(others.filter(c => COUNTRY_REGIONS[c.code] !== correctRegion));
    const combined = [...sameRegion, ...rest];
    distractors = combined.slice(0, 3);
  } else if (difficulty === 'easy') {
    const correctRegion = COUNTRY_REGIONS[correct.code];
    const diffRegion = shuffle(others.filter(c => COUNTRY_REGIONS[c.code] !== correctRegion));
    const rest = shuffle(others.filter(c => COUNTRY_REGIONS[c.code] === correctRegion));
    const combined = [...diffRegion, ...rest];
    distractors = combined.slice(0, 3);
  } else {
    distractors = shuffle(others).slice(0, 3);
  }

  return shuffle([correct, ...distractors]);
}
