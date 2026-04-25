import type { CSSProperties, ButtonHTMLAttributes } from 'react';
import styles from './ActionButton.module.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  bg: string;
  color: string;
  glow?: string;
  border?: string;
}

export default function ActionButton({ bg, color, glow, border, style, className, ...props }: Props) {
  return (
    <button
      className={`${styles.button}${className ? ` ${className}` : ''}`}
      style={{ '--btn-bg': bg, '--btn-color': color, '--btn-glow': glow, '--btn-border': border, ...style } as CSSProperties}
      {...props}
    />
  );
}
