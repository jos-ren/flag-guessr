import { useState, useRef, useEffect, useCallback } from 'react';
import type { Country, Phase, GuessRecord } from '@/types';
import { HS_KEY, HS_KEY_STATES, HS_KEY_PROVINCES, HS_KEY_AFRICA, HS_KEY_NORTH_AMERICA, HS_KEY_SOUTH_AMERICA, HS_KEY_ASIA, HS_KEY_EUROPE, HS_KEY_OCEANIA, HS_KEY_ONE_PIECE, HS_KEY_NBA, HS_KEY_NHL, HS_KEY_MLB, HS_KEY_NFL, HS_KEY_CAPITALS, CONTINENTS, GAME_MODES } from '@/constants';
import { shuffle, getOptions } from '@/utils';
import { loadStats, recordAnswer, COUNTRY_STATS_KEY, STATE_STATS_KEY, PROVINCE_STATS_KEY, AFRICA_STATS_KEY, NORTH_AMERICA_STATS_KEY, SOUTH_AMERICA_STATS_KEY, ASIA_STATS_KEY, EUROPE_STATS_KEY, OCEANIA_STATS_KEY, ONE_PIECE_STATS_KEY, NBA_STATS_KEY, NHL_STATS_KEY, MLB_STATS_KEY, NFL_STATS_KEY, CAPITALS_STATS_KEY, type StatsMap } from '@/stats';
import COUNTRIES from '@/data/countries.json';
import STATES from '@/data/us-states.json';
import PROVINCES from '@/data/canada-provinces.json';
import PIRATE_CREWS from '@/data/pirate-crews.json';
import NBA_TEAMS from '@/data/nba-teams.json';
import NHL_TEAMS from '@/data/nhl-teams.json';
import MLB_TEAMS from '@/data/mlb-teams.json';
import NFL_TEAMS from '@/data/nfl-teams.json';
import CAPITALS from '@/data/capitals.json';

interface UseGameReturn {
  current: Country | null;
  options: Country[];
  selected: Country | null;
  streak: number;
  finalStreak: number;
  stumpedBy: Country | null;
  highScore: number;
  isNewHigh: boolean;
  phase: Phase;
  animKey: number;
  imgLoaded: boolean;
  setImgLoaded: (val: boolean) => void;
  startGame: (modeId?: string) => void;
  handleSelect: (country: Country) => void;
  isGameOver: boolean;
  isLeaving: boolean;
  isQuizComplete: boolean;
  guessHistory: GuessRecord[];
  currentMode: string;
  statsKey: string;
  pool: Country[];
  answerMode: 'multiple-choice' | 'text-input';
}

const ALL_COUNTRIES = COUNTRIES as Country[];
const ALL_STATES = STATES as Country[];
const ALL_PROVINCES = PROVINCES as Country[];
const ALL_PIRATE_CREWS = PIRATE_CREWS as Country[];
const ALL_NBA = NBA_TEAMS as Country[];
const ALL_NHL = NHL_TEAMS as Country[];
const ALL_MLB = MLB_TEAMS as Country[];
const ALL_NFL = NFL_TEAMS as Country[];
const ALL_CAPITALS = CAPITALS as Country[];

const MODE_POOLS: Record<string, Country[]> = {
  'country-flags': ALL_COUNTRIES,
  'us-state-flags': ALL_STATES,
  'ca-province-flags': ALL_PROVINCES,
  'africa-flags': ALL_COUNTRIES.filter(c => c.continent === CONTINENTS.AFRICA),
  'north-america-flags': ALL_COUNTRIES.filter(c => c.continent === CONTINENTS.NORTH_AMERICA),
  'south-america-flags': ALL_COUNTRIES.filter(c => c.continent === CONTINENTS.SOUTH_AMERICA),
  'asia-flags': ALL_COUNTRIES.filter(c => c.continent === CONTINENTS.ASIA),
  'europe-flags': ALL_COUNTRIES.filter(c => c.continent === CONTINENTS.EUROPE),
  'oceania-flags': ALL_COUNTRIES.filter(c => c.continent === CONTINENTS.OCEANIA),
  'one-piece-flags': ALL_PIRATE_CREWS,
  'nba-logos': ALL_NBA,
  'nhl-logos': ALL_NHL,
  'mlb-logos': ALL_MLB,
  'nfl-logos': ALL_NFL,
  'capital-quiz': ALL_CAPITALS,
};

const MODE_HS_KEYS: Record<string, string> = {
  'country-flags': HS_KEY,
  'us-state-flags': HS_KEY_STATES,
  'ca-province-flags': HS_KEY_PROVINCES,
  'africa-flags': HS_KEY_AFRICA,
  'north-america-flags': HS_KEY_NORTH_AMERICA,
  'south-america-flags': HS_KEY_SOUTH_AMERICA,
  'asia-flags': HS_KEY_ASIA,
  'europe-flags': HS_KEY_EUROPE,
  'oceania-flags': HS_KEY_OCEANIA,
  'one-piece-flags': HS_KEY_ONE_PIECE,
  'nba-logos': HS_KEY_NBA,
  'nhl-logos': HS_KEY_NHL,
  'mlb-logos': HS_KEY_MLB,
  'nfl-logos': HS_KEY_NFL,
  'capital-quiz': HS_KEY_CAPITALS,
};

const MODE_STATS_KEYS: Record<string, string> = {
  'country-flags': COUNTRY_STATS_KEY,
  'us-state-flags': STATE_STATS_KEY,
  'ca-province-flags': PROVINCE_STATS_KEY,
  'africa-flags': AFRICA_STATS_KEY,
  'north-america-flags': NORTH_AMERICA_STATS_KEY,
  'south-america-flags': SOUTH_AMERICA_STATS_KEY,
  'asia-flags': ASIA_STATS_KEY,
  'europe-flags': EUROPE_STATS_KEY,
  'oceania-flags': OCEANIA_STATS_KEY,
  'one-piece-flags': ONE_PIECE_STATS_KEY,
  'nba-logos': NBA_STATS_KEY,
  'nhl-logos': NHL_STATS_KEY,
  'mlb-logos': MLB_STATS_KEY,
  'nfl-logos': NFL_STATS_KEY,
  'capital-quiz': CAPITALS_STATS_KEY,
};

function getPool(modeId: string): Country[] {
  return MODE_POOLS[modeId] ?? ALL_COUNTRIES;
}


export function useGame(): UseGameReturn {
  const [current, setCurrent] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [selected, setSelected] = useState<Country | null>(null);
  const [streak, setStreak] = useState(0);
  const [finalStreak, setFinalStreak] = useState(0);
  const [stumpedBy, setStumpedBy] = useState<Country | null>(null);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem(HS_KEY) ?? '0', 10));
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [animKey, setAnimKey] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [, setStats] = useState<StatsMap>(loadStats);
  const [guessHistory, setGuessHistory] = useState<GuessRecord[]>([]);
  const deckRef = useRef<Country[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [currentMode, setCurrentMode] = useState('country-flags');
  const currentModeRef = useRef('country-flags');
  const hsKeyRef = useRef(HS_KEY);
  const statsKeyRef = useRef(COUNTRY_STATS_KEY);

  const dealNext = useCallback(() => {
    const pool = getPool(currentModeRef.current);
    if (deckRef.current.length === 0) {
      deckRef.current = shuffle([...pool]);
    }
    const country = deckRef.current.shift()!;
    setCurrent(country);
    setOptions(getOptions(country, pool));
    setSelected(null);
    setImgLoaded(false);
    setAnimKey(k => k + 1);
  }, []);

  const startGame = useCallback((modeId?: string) => {
    if (modeId !== undefined) {
      currentModeRef.current = modeId;
      setCurrentMode(modeId);
      hsKeyRef.current = MODE_HS_KEYS[modeId] ?? HS_KEY;
      statsKeyRef.current = MODE_STATS_KEYS[modeId] ?? COUNTRY_STATS_KEY;
      setHighScore(parseInt(localStorage.getItem(hsKeyRef.current) ?? '0', 10));
    }
    const pool = getPool(currentModeRef.current);
    deckRef.current = shuffle([...pool]);
    setStreak(0);
    setFinalStreak(0);
    setStumpedBy(null);
    setIsNewHigh(false);
    setGuessHistory([]);
    setPhase('active');
    const country = deckRef.current.shift()!;
    setCurrent(country);
    setOptions(getOptions(country, pool));
    setSelected(null);
    setImgLoaded(false);
    setAnimKey(k => k + 1);
  }, []);

  const handleSelect = useCallback((country: Country) => {
    if (selected || phase !== 'active' || !current) return;
    setSelected(country);
    setPhase('answered');
    const isCorrect = country.code === current.code;

    setStats(prev => recordAnswer(prev, current.code, isCorrect, statsKeyRef.current));
    setGuessHistory(prev => [...prev, { country: current, correct: isCorrect, selected: isCorrect ? undefined : country }]);

    if (isCorrect) {
      setStreak(s => s + 1);
      timerRef.current = setTimeout(() => {
        setPhase('leaving');
        setTimeout(() => {
          dealNext();
          setPhase('active');
        }, 320);
      }, 1100);
    } else {
      setStumpedBy(current);
      setFinalStreak(streak);
      if (streak > highScore) {
        localStorage.setItem(hsKeyRef.current, String(streak));
        setHighScore(streak);
        setIsNewHigh(true);
      }
      timerRef.current = setTimeout(() => {
        setPhase('gameover');
      }, 1400);
    }
  }, [selected, phase, current, streak, highScore, dealNext]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const currentModeConfig = GAME_MODES.find(m => m.id === currentMode);

  return {
    current,
    options,
    selected,
    streak,
    finalStreak,
    stumpedBy,
    highScore,
    isNewHigh,
    phase,
    animKey,
    imgLoaded,
    setImgLoaded,
    startGame,
    handleSelect,
    isGameOver: phase === 'gameover',
    isLeaving: phase === 'leaving',
    isQuizComplete: phase === 'quizcomplete',
    guessHistory,
    currentMode,
    statsKey: statsKeyRef.current,
    pool: getPool(currentMode),
    answerMode: currentModeConfig?.answerMode === 'text-input' ? 'text-input' : 'multiple-choice',
  };
}
