import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { Country, Phase, GuessRecord, Difficulty, RegionFilter } from '@/types';
import { HS_KEY, COUNTRY_REGIONS, ICONIC_COUNTRY_CODES } from '@/constants';
import { shuffle, getOptions } from '@/utils';
import { loadStats, recordAnswer, type StatsMap } from '@/stats';
import COUNTRIES from '@/data/countries.json';

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
  startGame: () => void;
  handleSelect: (country: Country) => void;
  isGameOver: boolean;
  isLeaving: boolean;
  guessHistory: GuessRecord[];
}

const ALL_COUNTRIES = COUNTRIES as Country[];

function buildDeck(pool: Country[], difficulty: Difficulty, excludeCode?: string): Country[] {
  let deck = pool.filter(c => excludeCode ? c.code !== excludeCode : true);

  if (difficulty === 'easy') {
    const iconic = shuffle(deck.filter(c => ICONIC_COUNTRY_CODES.has(c.code)));
    const rest = shuffle(deck.filter(c => !ICONIC_COUNTRY_CODES.has(c.code)));
    deck = [...iconic, ...rest];
  } else if (difficulty === 'hard') {
    const nonIconic = shuffle(deck.filter(c => !ICONIC_COUNTRY_CODES.has(c.code)));
    const iconic = shuffle(deck.filter(c => ICONIC_COUNTRY_CODES.has(c.code)));
    deck = [...nonIconic, ...iconic];
  } else {
    deck = shuffle(deck);
  }

  return deck;
}

export function useGame(difficulty: Difficulty, regionFilter: RegionFilter): UseGameReturn {
  const [current, setCurrent] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [selected, setSelected] = useState<Country | null>(null);
  const [streak, setStreak] = useState(0);
  const [finalStreak, setFinalStreak] = useState(0);
  const [stumpedBy, setStumpedBy] = useState<Country | null>(null);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem(HS_KEY) ?? '0', 10));
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [phase, setPhase] = useState<Phase>('gameover');
  const [animKey, setAnimKey] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [stats, setStats] = useState<StatsMap>(loadStats);
  const [guessHistory, setGuessHistory] = useState<GuessRecord[]>([]);
  const deckRef = useRef<Country[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const countryPool = useMemo(() => {
    const base = regionFilter === 'all'
      ? ALL_COUNTRIES
      : ALL_COUNTRIES.filter(c => COUNTRY_REGIONS[c.code] === regionFilter);
    return base.length >= 8 ? base : ALL_COUNTRIES;
  }, [regionFilter]);

  // Use refs to avoid stale closures in callbacks while still reacting to changes via useEffect
  const countryPoolRef = useRef(countryPool);
  const difficultyRef = useRef(difficulty);
  useEffect(() => { countryPoolRef.current = countryPool; }, [countryPool]);
  useEffect(() => { difficultyRef.current = difficulty; }, [difficulty]);

  const dealNext = useCallback((excludeCode?: string) => {
    const pool = countryPoolRef.current;
    const diff = difficultyRef.current;
    if (deckRef.current.length === 0) {
      deckRef.current = buildDeck(pool, diff, excludeCode);
    }
    const country = deckRef.current.shift()!;
    setCurrent(country);
    setOptions(getOptions(country, pool, diff));
    setSelected(null);
    setImgLoaded(false);
    setAnimKey(k => k + 1);
  }, []);

  const startGame = useCallback(() => {
    const pool = countryPoolRef.current;
    const diff = difficultyRef.current;
    deckRef.current = buildDeck(pool, diff);
    setStreak(0);
    setFinalStreak(0);
    setStumpedBy(null);
    setIsNewHigh(false);
    setGuessHistory([]);
    setPhase('active');
    const country = deckRef.current.shift()!;
    setCurrent(country);
    setOptions(getOptions(country, pool, diff));
    setSelected(null);
    setImgLoaded(false);
    setAnimKey(k => k + 1);
  }, []);

  useEffect(() => { startGame(); }, [startGame]);

  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) { isFirstMount.current = false; return; }
    startGame();
  }, [difficulty, regionFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = useCallback((country: Country) => {
    if (selected || phase !== 'active' || !current) return;
    setSelected(country);
    setPhase('answered');
    const isCorrect = country.code === current.code;

    setStats(prev => recordAnswer(prev, current.code, isCorrect));
    setGuessHistory(prev => [...prev, { country: current, correct: isCorrect }]);

    if (isCorrect) {
      setStreak(s => s + 1);
      timerRef.current = setTimeout(() => {
        setPhase('leaving');
        setTimeout(() => {
          dealNext(country.code);
          setPhase('active');
        }, 320);
      }, 1100);
    } else {
      setStumpedBy(current);
      setFinalStreak(streak);
      if (streak > highScore) {
        localStorage.setItem(HS_KEY, String(streak));
        setHighScore(streak);
        setIsNewHigh(true);
      }
      timerRef.current = setTimeout(() => {
        setPhase('gameover');
      }, 1400);
    }
  }, [selected, phase, current, streak, highScore, dealNext]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

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
    guessHistory,
  };
}
