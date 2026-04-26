import { useState, useRef, useCallback } from 'react';
import type { Country } from '@/types';
import styles from './AutofillInput.module.css';

interface Props {
  pool: Country[];
  correct: Country;
  selected: Country | null;
  onSelect: (country: Country) => void;
  isLeaving: boolean;
}

function getSuggestions(query: string, pool: Country[]): Country[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const starts: Country[] = [];
  const contains: Country[] = [];
  for (const c of pool) {
    const n = c.name.toLowerCase();
    if (n.startsWith(q)) starts.push(c);
    else if (n.includes(q)) contains.push(c);
  }
  return [...starts, ...contains].slice(0, 5);
}

export default function AutofillInput({ pool, correct, selected, onSelect, isLeaving }: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Country[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const disabled = selected !== null;
  const isCorrect = selected !== null && selected.code === correct.code;
  const isWrong = selected !== null && selected.code !== correct.code;

  const select = useCallback((country: Country) => {
    setQuery(country.name);
    setIsOpen(false);
    setActiveIndex(-1);
    setSuggestions([]);
    onSelect(country);
  }, [onSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    const next = getSuggestions(val, pool);
    setSuggestions(next);
    setActiveIndex(-1);
    setIsOpen(next.length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (isOpen ? Math.min(i + 1, suggestions.length - 1) : i));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        select(suggestions[activeIndex]!);
      } else if (suggestions.length === 1 && suggestions[0]) {
        select(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 0);
  };

  const wrapperClass = `${styles.wrapper}${isCorrect ? ` ${styles.correct}` : ''}${isWrong ? ` ${styles.wrong}` : ''}${isLeaving ? ` ${styles.leaving}` : ''}`;

  return (
    <div className={wrapperClass}>
      <input
        ref={inputRef}
        className={styles.input}
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder="Type a team name..."
        autoComplete="off"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
      {isOpen && !disabled && suggestions.length > 0 && (
        <div className={styles.dropdown}>
          {suggestions.map((c, i) => (
            <button
              key={c.code}
              className={`${styles.suggestion}${i === activeIndex ? ` ${styles.suggestionActive}` : ''}`}
              onMouseDown={(e) => { e.preventDefault(); select(c); }}
              tabIndex={-1}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
      {isWrong && (
        <div className={styles.revealRow}>
          {correct.name}
        </div>
      )}
    </div>
  );
}
