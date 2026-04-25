import type { CSSProperties } from 'react';
import type { Country } from '@/types';
import styles from './OptionButton.module.css';

export type OptionState = 'idle' | 'entering' | 'correct' | 'wrong' | 'reveal' | 'dimmed';

interface Props {
  country: Country;
  state: OptionState;
  enterDelay?: number;
  onClick: () => void;
  disabled: boolean;
}

const STATE_CLASS: Record<OptionState, string> = {
  idle: '',
  entering: styles.entering ?? '',
  correct: styles.correct ?? '',
  wrong: styles.wrong ?? '',
  reveal: styles.reveal ?? '',
  dimmed: styles.dimmed ?? '',
};

export default function OptionButton({ country, state, enterDelay, onClick, disabled }: Props) {
  const className = [styles.btn, STATE_CLASS[state]].filter(Boolean).join(' ');
  const style = state === 'entering' && enterDelay != null
    ? { '--ans-delay': `${enterDelay}s` } as CSSProperties
    : undefined;

  return (
    <button className={className} style={style} onClick={onClick} disabled={disabled}>
      {country.name}
    </button>
  );
}
