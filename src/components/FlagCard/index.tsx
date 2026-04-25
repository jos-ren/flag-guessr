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
  let containerClass = styles.container;
  if (animated) containerClass += ` ${styles.containerAnimated}`;
  if (isLeaving) containerClass += ` ${styles.containerLeaving}`;
  if (ring === 'error') containerClass += ` ${styles.containerRingError}`;

  let imageClass = styles.image;
  if (imgLoaded !== undefined) {
    imageClass += imgLoaded ? ` ${styles.imageFadeVisible}` : ` ${styles.imageFade}`;
  }

  return (
    <div className={containerClass}>
      <img
        src={`https://flagcdn.com/w640/${code}.png`}
        alt={alt}
        draggable={false}
        onLoad={onLoad}
        className={imageClass}
      />
    </div>
  );
}
