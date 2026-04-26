import type { Country, GuessRecord } from '@/types';
import FlagCard from '@/components/FlagCard';
import OptionButton from '@/components/OptionButton';
import type { OptionState } from '@/components/OptionButton';
import AutofillInput from '@/components/AutofillInput';
import GuessTrail from '@/components/GuessTrail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
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
  lives: number;
  maxLives: number;
  elapsedSeconds: number;
  eliminatedOptions: string[];
}

function getOptionState(country: Country, current: Country, selected: Country | null, eliminatedOptions: string[]): OptionState {
  if (eliminatedOptions.includes(country.code)) return 'wrong';
  if (!selected) return 'entering';
  if (country.code === current.code) return 'correct';
  if (selected.code === country.code) return 'wrong';
  return 'dimmed';
}

function formatTime(s: number): string {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export default function GameScreen({
  current, streak, isRecord, options, selected, animKey,
  imgLoaded, isLeaving, onSelect, onImgLoad, answerMode, pool, guessHistory, lives, maxLives, elapsedSeconds, eliminatedOptions,
}: Props) {
  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <div className={styles.timerLabel}>{formatTime(elapsedSeconds)}</div>
        <div className={`${styles.streakLabel}${isRecord ? ` ${styles.streakLabelRecord}` : ''}`}>
          {streak}
        </div>
        <div className={styles.lives}>
          {Array.from({ length: maxLives }, (_, i) => (
            <FontAwesomeIcon
              key={i}
              icon={i < lives ? faHeart : faHeartOutline}
              className={`${styles.heart}${i < lives ? ` ${styles.heartFull}` : ` ${styles.heartEmpty}`}`}
            />
          ))}
        </div>
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
              state={getOptionState(country, current, selected, eliminatedOptions)}
              enterDelay={!selected && !eliminatedOptions.includes(country.code) ? i * 0.06 : undefined}
              onClick={() => onSelect(country)}
              disabled={selected != null || eliminatedOptions.includes(country.code)}
            />
          ))}
        </div>
      )}

      <GuessTrail guessHistory={guessHistory} />

    </div>
  );
}
