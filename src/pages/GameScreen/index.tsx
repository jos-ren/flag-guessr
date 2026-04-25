import type { Country } from '@/types';
import FlagCard from '@/components/FlagCard';
import OptionButton from '@/components/OptionButton';
import type { OptionState } from '@/components/OptionButton';
import StreakPill from '@/components/StreakPill';
import styles from './GameScreen.module.css';

interface Props {
  current: Country;
  streak: number;
  options: Country[];
  selected: Country | null;
  animKey: number;
  imgLoaded: boolean;
  isLeaving: boolean;
  onSelect: (country: Country) => void;
  onImgLoad: () => void;
}

function getOptionState(country: Country, current: Country, selected: Country | null): OptionState {
  if (!selected) return 'entering';
  if (country.code === current.code) return 'correct';
  if (selected.code === country.code) return 'wrong';
  return 'dimmed';
}

export default function GameScreen({
  current, streak, options, selected, animKey,
  imgLoaded, isLeaving, onSelect, onImgLoad,
}: Props) {
  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <span className={styles.label}>Flag Guesser</span>
        <StreakPill streak={streak} />
      </div>

      <div className={styles.flagWrap}>
        <FlagCard
          key={`flag-${animKey}`}
          code={current.code}
          alt="country flag"
          animated
          isLeaving={isLeaving}
          imgLoaded={imgLoaded}
          onLoad={onImgLoad}
        />
      </div>

      <div className={`${styles.prompt}${isLeaving ? ` ${styles.promptLeaving}` : ''}`}>
        Which country is this?
      </div>

      <div
        key={`opts-${animKey}`}
        className={`${styles.optionsGrid}${isLeaving ? ` ${styles.optionsGridLeaving}` : ''}`}
      >
        {options.map((country, i) => (
          <OptionButton
            key={country.code}
            country={country}
            state={getOptionState(country, current, selected)}
            enterDelay={!selected ? i * 0.06 : undefined}
            onClick={() => onSelect(country)}
            disabled={selected != null}
          />
        ))}
      </div>
    </div>
  );
}
