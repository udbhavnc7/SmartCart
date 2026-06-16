import { cn } from '@/lib/utils'

export function Badge({ className, children, variant = 'default' }: { className?: string; children: React.ReactNode; variant?: 'default' | 'success' | 'warning' }) {
  const variants = {
    default: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    success: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  }
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}
