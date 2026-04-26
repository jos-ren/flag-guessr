import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <a
        className={styles.link}
        href="https://github.com/jos-ren"
        target="_blank"
        rel="noopener noreferrer"
      >
        developed by josren 2026 ©
      </a>
    </footer>
  );
}
