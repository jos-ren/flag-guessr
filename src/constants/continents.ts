export const CONTINENTS = {
  AFRICA: 1,
  NORTH_AMERICA: 2,
  ASIA: 3,
  EUROPE: 4,
  OCEANIA: 5,
  SOUTH_AMERICA: 6,
} as const;

export type ContinentId = typeof CONTINENTS[keyof typeof CONTINENTS];
