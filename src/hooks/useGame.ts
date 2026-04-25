import { useState, useRef, useEffect, useCallback } from 'react';
import type { Country, Phase, GuessRecord } from '@/types';
import { HS_KEY, HS_KEY_STATES, HS_KEY_PROVINCES } from '@/constants';
import { shuffle, getOptions } from '@/utils';
import { loadStats, recordAnswer, COUNTRY_STATS_KEY, STATE_STATS_KEY, PROVINCE_STATS_KEY, type StatsMap } from '@/stats';
import COUNTRIES from '@/data/countries.json';
import STATES from '@/data/states.json';
import PROVINCES from '@/data/provinces.json';

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
  guessHistory: GuessRecord[];
  currentMode: string;
}

const ALL_COUNTRIES = COUNTRIES as Country[];
const ALL_STATES = STATES as Country[];
const ALL_PROVINCES = PROVINCES as Country[];

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

  const getActivePool = useCallback(() => {
    if (currentModeRef.current === 'us-state-flags') return ALL_STATES;
    if (currentModeRef.current === 'ca-province-flags') return ALL_PROVINCES;
    return ALL_COUNTRIES;
  }, []);

  const dealNext = useCallback((excludeCode?: string) => {
    const pool = getActivePool();
    if (deckRef.current.length === 0) {
      deckRef.current = shuffle(pool.filter(c => excludeCode ? c.code !== excludeCode : true));
    }
    const country = deckRef.current.shift()!;
    setCurrent(country);
    setOptions(getOptions(country, pool));
    setSelected(null);
    setImgLoaded(false);
    setAnimKey(k => k + 1);
  }, [getActivePool]);

  const startGame = useCallback((modeId?: string) => {
    if (modeId !== undefined) {
      currentModeRef.current = modeId;
      setCurrentMode(modeId);
      const newHsKey = modeId === 'us-state-flags' ? HS_KEY_STATES : modeId === 'ca-province-flags' ? HS_KEY_PROVINCES : HS_KEY;
      hsKeyRef.current = newHsKey;
      statsKeyRef.current = modeId === 'us-state-flags' ? STATE_STATS_KEY : modeId === 'ca-province-flags' ? PROVINCE_STATS_KEY : COUNTRY_STATS_KEY;
      setHighScore(parseInt(localStorage.getItem(newHsKey) ?? '0', 10));
    }
    const pool = getActivePool();
    deckRef.current = shuffle(pool);
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
  }, [getActivePool]);

  const handleSelect = useCallback((country: Country) => {
    if (selected || phase !== 'active' || !current) return;
    setSelected(country);
    setPhase('answered');
    const isCorrect = country.code === current.code;

    setStats(prev => recordAnswer(prev, current.code, isCorrect, statsKeyRef.current));
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
    currentMode,
  };
}
