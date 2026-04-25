import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      developed by{' '}
      <a
        className={styles.link}
        href="https://github.com/jos-ren"
        target="_blank"
        rel="noopener noreferrer"
      >
        josren
      </a>
      {' '}2026{' '}©
    </footer>
  );
}
