import { useState, useRef, useEffect, useCallback } from 'react';
import type { Country, Phase, GuessRecord } from '@/types';
import { CONTINENTS, GAME_MODES } from '@/constants';
import { shuffle, getOptions } from '@/utils';
import COUNTRIES from '@/data/countries.json';
import STATES from '@/data/us-states.json';
import PROVINCES from '@/data/canada-provinces.json';
import PIRATE_CREWS from '@/data/pirate-crews.json';
import NBA_TEAMS from '@/data/nba-teams.json';
import NHL_TEAMS from '@/data/nhl-teams.json';
import MLB_TEAMS from '@/data/mlb-teams.json';
import NFL_TEAMS from '@/data/nfl-teams.json';
import CAPITALS from '@/data/capitals.json';

const MAX_LIVES = 3;

interface UseGameReturn {
  current: Country | null;
  options: Country[];
  selected: Country | null;
  streak: number;
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
  pool: Country[];
  answerMode: 'multiple-choice' | 'text-input';
  lives: number;
  maxLives: number;
  elapsedSeconds: number;
  eliminatedOptions: string[];
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

function getPool(modeId: string): Country[] {
  return MODE_POOLS[modeId] ?? ALL_COUNTRIES;
}


export function useGame(): UseGameReturn {
  const [current, setCurrent] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [selected, setSelected] = useState<Country | null>(null);
  const [streak, setStreak] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [lives, setLives] = useState(MAX_LIVES);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [guessHistory, setGuessHistory] = useState<GuessRecord[]>([]);
  const deckRef = useRef<Country[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [currentMode, setCurrentMode] = useState('country-flags');
  const currentModeRef = useRef('country-flags');

  const dealNext = useCallback(() => {
    const pool = getPool(currentModeRef.current);
    const country = deckRef.current.shift()!;
    setCurrent(country);
    setOptions(getOptions(country, pool));
    setSelected(null);
    setEliminatedOptions([]);
    setImgLoaded(false);
    setAnimKey(k => k + 1);
  }, []);

  const startGame = useCallback((modeId?: string) => {
    if (modeId !== undefined) {
      currentModeRef.current = modeId;
      setCurrentMode(modeId);
    }
    const pool = getPool(currentModeRef.current);
    deckRef.current = shuffle([...pool]);
    setStreak(0);
    setGuessHistory([]);
    setLives(MAX_LIVES);
    setEliminatedOptions([]);
    setElapsedSeconds(0);
    setPhase('active');
    const country = deckRef.current.shift()!;
    setCurrent(country);
    setOptions(getOptions(country, pool));
    setSelected(null);
    setImgLoaded(false);
    setAnimKey(k => k + 1);
  }, []);

  const handleSelect = useCallback((country: Country) => {
    if (phase !== 'active' || !current) return;
    if (eliminatedOptions.includes(country.code)) return;

    const isCorrect = country.code === current.code;

    const advance = () => {
      setPhase('leaving');
      setTimeout(() => {
        if (deckRef.current.length === 0) {
          setPhase('quizcomplete');
        } else {
          dealNext();
          setPhase('active');
        }
      }, 320);
    };

    if (isCorrect) {
      setSelected(country);
      setPhase('answered');
      setGuessHistory(prev => [...prev, { country: current, correct: true }]);
      setStreak(s => s + 1);
      timerRef.current = setTimeout(advance, 1100);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setSelected(country);
        setPhase('answered');
        setGuessHistory(prev => [...prev, { country: current, correct: false, selected: country }]);
        timerRef.current = setTimeout(() => setPhase('gameover'), 1400);
      } else {
        setEliminatedOptions(prev => [...prev, country.code]);
        setGuessHistory(prev => [...prev, { country: current, correct: false, selected: country }]);
      }
    }
  }, [phase, current, lives, eliminatedOptions, dealNext]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  useEffect(() => {
    const running = phase === 'active' || phase === 'answered' || phase === 'leaving';
    if (!running) return;
    const id = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  const currentModeConfig = GAME_MODES.find(m => m.id === currentMode);

  return {
    current,
    options,
    selected,
    streak,
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
    pool: getPool(currentMode),
    answerMode: currentModeConfig?.answerMode === 'text-input' ? 'text-input' : 'multiple-choice',
    lives,
    maxLives: MAX_LIVES,
    elapsedSeconds,
    eliminatedOptions,
  };
}
