import type { GameMode } from '@/types';

export const GAME_MODES: GameMode[] = [
  {
    id: 'country-flags',
    title: 'World Country Flags',
    description: 'Identify countries by their flag. How long can your streak go?',
    flagCode: 'jp',
    available: true,
  },
  {
    id: 'us-state-flags',
    title: 'US State Flags',
    description: 'Identify all 50 American state flags. Can you name them all?',
    flagCode: 'us-tx',
    available: true,
  },
  {
    id: 'ca-province-flags',
    title: 'Canadian Province Flags',
    description: 'Identify all 13 Canadian provinces and territories by their flag.',
    flagCode: 'ca-qc',
    flagImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Flag_of_Quebec.svg',
    available: true,
  },
  {
    id: 'capital-quiz',
    title: 'Capital Quiz',
    description: 'See a flag — name the capital city.',
    flagCode: 'fr',
    available: false,
  },
  {
    id: 'streak-builder',
    title: 'Streak Builder',
    description: 'Unlimited rounds, no wrong answers. Pure flag mastery.',
    flagCode: 'no',
    available: false,
  },
  {
    id: 'speed-round',
    title: 'Speed Round',
    description: 'Name as many flags as you can in 60 seconds.',
    flagCode: 'br',
    available: false,
  },
];
