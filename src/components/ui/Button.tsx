import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const variants: Record<Variant, string> = {
  primary: 'bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-neutral-900',
  secondary: 'bg-white text-neutral-800 border border-neutral-300 hover:bg-neutral-50 focus:ring-neutral-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
  ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-400',
};

export function Button({ variant = 'primary', className = '', ...props }: Props) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    />
  );
}
