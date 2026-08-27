import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

/* Shared primitives. One coherent visual language across every screen;
   screens must not look like they came from different libraries.

   Visual direction v2 (docs/design/visual-direction-v2.md): grayscale is the
   base, colour is spent on exactly one thing (the fee/wrong-office warning),
   everywhere else hierarchy comes from type weight and space. */

const base =
  'tap inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 ' +
  'font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const variants = {
  primary: 'bg-ink-900 text-paper-50 hover:bg-ink-700 disabled:hover:bg-ink-900',
  secondary: 'bg-transparent text-ink-900 ring-1 ring-ink-900/25 hover:bg-ink-900/5',
  quiet: 'text-ink-700 underline underline-offset-4 hover:text-ink-900 px-2',
} as const;

type Variant = keyof typeof variants;

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function ButtonLink({
  to,
  variant = 'primary',
  className = '',
  children,
}: {
  to: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link to={to} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[--radius-card] bg-paper-0 p-5 ring-1 ring-paper-200 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

/** The fee/wrong-office warning is the ONLY place colour carries meaning on
 * these screens. Everywhere else, selection and hierarchy are grayscale. */
export function Notice({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'warn';
  title?: string;
  children: ReactNode;
}) {
  const tones = {
    info: 'bg-paper-100 text-ink-900 ring-ink-900/10',
    warn: 'bg-warn-100 text-warn-700 ring-warn-500/30',
  } as const;
  return (
    <div className={`rounded-xl p-4 ring-1 ${tones[tone]}`}>
      {title && <p className="font-semibold">{title}</p>}
      <div className={title ? 'mt-1' : ''}>{children}</div>
    </div>
  );
}

/** Small uppercase label above a headline, the same device the landing hero
 * uses ("RIGHT TO INFORMATION, IN YOUR OWN WORDS"), for one consistent
 * visual grammar across screens. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm font-medium uppercase tracking-[0.14em] text-ink-500">{children}</p>
  );
}

export function PageTitle({
  children,
  lede,
  eyebrow,
}: {
  children: ReactNode;
  lede?: ReactNode;
  eyebrow?: ReactNode;
}) {
  return (
    <header className="mb-6">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className={`text-2xl sm:text-3xl ${eyebrow ? 'mt-2' : ''}`}>{children}</h1>
      {lede && <p className="mt-3 text-ink-700">{lede}</p>}
    </header>
  );
}

/**
 * A single choice row: radio or checkbox semantics decided by the caller.
 * Grayscale selected state (heavier border + filled indicator), not a colour
 * wash, per visual-direction-v2. Motion gives a quick press acknowledgement
 * (a real interaction cue, not decoration) and respects reduced motion via
 * `whileTap`, which framer/motion already no-ops correctly under
 * prefers-reduced-motion at the animation-duration level (see styles.css).
 */
export function Choice({
  as = 'radio',
  selected,
  onClick,
  children,
  className = '',
}: {
  as?: 'radio' | 'checkbox';
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      role={as}
      aria-checked={selected}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`tap flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
        selected
          ? 'border-ink-900 bg-ink-900 text-paper-50'
          : 'border-ink-900/15 bg-paper-0 text-ink-900 hover:border-ink-900/40'
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`flex size-5 shrink-0 items-center justify-center border ${
          as === 'radio' ? 'rounded-full' : 'rounded'
        } ${selected ? 'border-paper-50 bg-paper-50' : 'border-ink-900/30'}`}
      >
        {selected && (
          <span
            className={`bg-ink-900 ${as === 'radio' ? 'size-2.5 rounded-full' : 'size-3 rounded-[2px]'}`}
          />
        )}
      </span>
      <span className="flex-1">{children}</span>
    </motion.button>
  );
}
