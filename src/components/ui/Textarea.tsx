import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-lg border bg-[var(--bg-primary)] px-4 py-3',
          'font-mono text-sm leading-relaxed',
          'placeholder:text-[var(--text-muted)]',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'resize-none transition-colors',
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

Textarea.displayName = 'Textarea'
