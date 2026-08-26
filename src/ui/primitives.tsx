import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

/* Shared primitives. One coherent visual language across every screen —
   screens must not look like they came from different libraries. */

const base =
  'tap inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 ' +
  'font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const variants = {
  primary: 'bg-brand-700 text-white hover:bg-brand-900 disabled:hover:bg-brand-700',
  secondary: 'bg-paper-0 text-ink-900 ring-1 ring-paper-200 hover:bg-paper-100',
  quiet: 'text-brand-700 underline underline-offset-4 hover:text-brand-900 px-2',
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

/** Used for the state/UT no-refund warning — an observed, expensive citizen mistake. */
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
    info: 'bg-brand-50 text-ink-900 ring-brand-100',
    warn: 'bg-warn-100 text-warn-700 ring-warn-500/30',
  } as const;
  return (
    <div className={`rounded-xl p-4 ring-1 ${tones[tone]}`}>
      {title && <p className="font-semibold">{title}</p>}
      <div className={title ? 'mt-1' : ''}>{children}</div>
    </div>
  );
}

export function PageTitle({ children, lede }: { children: ReactNode; lede?: ReactNode }) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl sm:text-3xl">{children}</h1>
      {lede && <p className="mt-3 text-ink-700">{lede}</p>}
    </header>
  );
}
