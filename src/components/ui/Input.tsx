import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'w-full rounded-lg border bg-[var(--bg-primary)] px-4 py-2',
          'text-sm placeholder:text-[var(--text-muted)]',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'transition-colors',
          error
            ? 'border-error focus:ring-error'
            : 'border-[var(--border-color)]',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
