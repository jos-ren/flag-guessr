import type { Country, GuessRecord } from '@/types';
import FlagCard from '@/components/FlagCard';
import OptionButton from '@/components/OptionButton';
import type { OptionState } from '@/components/OptionButton';
import AutofillInput from '@/components/AutofillInput';
import GuessTrail from '@/components/GuessTrail';
import styles from './GameScreen.module.css';

interface Props {
  current: Country;
  streak: number;
  isRecord: boolean;
  options: Country[];
  selected: Country | null;
  animKey: number;
  imgLoaded: boolean;
  isLeaving: boolean;
  onSelect: (country: Country) => void;
  onImgLoad: () => void;
  answerMode: 'multiple-choice' | 'text-input';
  pool: Country[];
  guessHistory: GuessRecord[];
}

function getOptionState(country: Country, current: Country, selected: Country | null): OptionState {
  if (!selected) return 'entering';
  if (country.code === current.code) return 'correct';
  if (selected.code === country.code) return 'wrong';
  return 'dimmed';
}

export default function GameScreen({
  current, streak, isRecord, options, selected, animKey,
  imgLoaded, isLeaving, onSelect, onImgLoad, answerMode, pool, guessHistory,
}: Props) {
  return (
    <div className={styles.container}>

      <div className={`${styles.streakLabel}${isRecord ? ` ${styles.streakLabelRecord}` : ''}`}>
        {streak}
      </div>

      <div className={styles.flagWrap}>
        <FlagCard
          key={`flag-${animKey}`}
          code={current.code}
          imageUrl={current.imageUrl}
          alt="country flag"
          animated
          isLeaving={isLeaving}
          imgLoaded={imgLoaded}
          onLoad={onImgLoad}
        />
      </div>

      <div className={`${styles.prompt}${isLeaving ? ` ${styles.promptLeaving}` : ''}`}>
        {answerMode === 'text-input' ? 'Which team is this?' : 'Which country is this?'}
      </div>

      {answerMode === 'text-input' ? (
        <AutofillInput
          key={`opts-${animKey}`}
          pool={pool}
          correct={current}
          selected={selected}
          onSelect={onSelect}
          isLeaving={isLeaving}
        />
      ) : (
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
      )}

      <GuessTrail guessHistory={guessHistory} />

    </div>
  );
}
