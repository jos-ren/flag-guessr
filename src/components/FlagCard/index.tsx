import { useState, type CSSProperties } from 'react';
import styles from './FlagCard.module.css';

interface Props {
  code: string;
  alt: string;
  animated?: boolean;
  isLeaving?: boolean;
  imgLoaded?: boolean;
  onLoad?: () => void;
  ring?: 'error';
}

export default function FlagCard({ code, alt, animated, isLeaving, imgLoaded, onLoad, ring }: Props) {
  const [ratio, setRatio] = useState<number | null>(null);

  function handleLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalHeight > 0) setRatio(naturalWidth / naturalHeight);
    onLoad?.();
  }

  let cardClass = styles.card;
  if (animated) cardClass += ` ${styles.cardAnimated}`;
  if (isLeaving) cardClass += ` ${styles.cardLeaving}`;
  if (ring === 'error') cardClass += ` ${styles.cardRingError}`;

  const cardStyle = ratio !== null
    ? { '--flag-ratio': String(ratio) } as CSSProperties
    : undefined;

  let imageClass = styles.image;
  if (imgLoaded !== undefined) {
    imageClass += imgLoaded ? ` ${styles.imageFadeVisible}` : ` ${styles.imageFade}`;
  }

  return (
    <div className={styles.outer}>
      <div className={cardClass} style={cardStyle}>
        <img
          src={`https://flagcdn.com/w640/${code}.png`}
          alt={alt}
          draggable={false}
          onLoad={handleLoad}
          className={imageClass}
        />
      </div>
    </div>
  );
}
