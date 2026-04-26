import type { GuessRecord } from '@/types';
import { assetUrl } from '@/utils';
import styles from './GuessTrail.module.css';

function circleUrl(code: string): string {
  return `https://hatscripts.github.io/circle-flags/flags/${code.toLowerCase()}.svg`;
}

interface Props {
  guessHistory: GuessRecord[];
}

export default function GuessTrail({ guessHistory }: Props) {
  if (guessHistory.length === 0) return null;

  const reversed = [...guessHistory].reverse();
  const total = guessHistory.length;

  return (
    <div className={styles.track}>
      {reversed.map(({ country, correct }, i) => (
        <div
          key={(total - 1 - i).toString()}
          className={`${styles.bubble}${correct ? ` ${styles.correct}` : ` ${styles.wrong}`}`}
        >
          <img
            src={country.imageUrl ? assetUrl(country.imageUrl) : circleUrl(country.code)}
            alt={country.name}
            className={styles.img}
          />
        </div>
      ))}
    </div>
  );
}
