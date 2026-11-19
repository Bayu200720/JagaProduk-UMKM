import React from 'react';

type Props = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
};

export function Card({ title, subtitle, children, className = '', actions }: Props) {
  return (
    <section className={`bg-white rounded-xl border border-neutral-200 shadow-sm ${className}`}>
      {(title || subtitle || actions) && (
        <div className="px-5 py-4 border-b border-neutral-100 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-sm text-neutral-500">{subtitle}</p>}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}
