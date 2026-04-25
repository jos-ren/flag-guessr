import { useState, useRef, useEffect, useCallback } from 'react';
import type { Country, Phase, GuessRecord } from '@/types';
import { HS_KEY } from '@/constants';
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

export function useGame(): UseGameReturn {
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

  const dealNext = useCallback((excludeCode?: string) => {
    if (deckRef.current.length === 0) {
      deckRef.current = shuffle(ALL_COUNTRIES).filter(
        c => excludeCode ? c.code !== excludeCode : true
      );
    }
    const country = deckRef.current.shift()!;
    setCurrent(country);
    setOptions(getOptions(country, ALL_COUNTRIES));
    setSelected(null);
    setImgLoaded(false);
    setAnimKey(k => k + 1);
  }, []);

  const startGame = useCallback(() => {
    deckRef.current = shuffle([...ALL_COUNTRIES]);
    setStreak(0);
    setFinalStreak(0);
    setStumpedBy(null);
    setIsNewHigh(false);
    setGuessHistory([]);
    setPhase('active');
    const country = deckRef.current.shift()!;
    setCurrent(country);
    setOptions(getOptions(country, ALL_COUNTRIES));
    setSelected(null);
    setImgLoaded(false);
    setAnimKey(k => k + 1);
  }, []);

  useEffect(() => { startGame(); }, [startGame]);

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
