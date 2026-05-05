import type { ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent';

const badgeClass: Record<BadgeVariant, string> = {
  success: 'badge badge-success',
  warning: 'badge badge-warning',
  danger: 'badge badge-danger',
  info: 'badge badge-primary',
  accent: 'badge badge-accent',
  neutral: 'badge badge-neutral',
};

export default function Badge({ variant, children }: { variant: BadgeVariant; children: ReactNode }) {
  return <span className={badgeClass[variant]}>{children}</span>;
}
