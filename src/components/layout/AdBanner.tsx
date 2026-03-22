import { useEffect } from 'react'
import { cn } from '../../utils/cn'

interface AdBannerProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export function AdBanner({ slot, format = 'auto', className }: AdBannerProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('AdSense error:', e)
    }
  }, [])

  const isProduction = import.meta.env.PROD

  if (!isProduction) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-[var(--bg-tertiary)] border-2 border-dashed border-[var(--border-color)] rounded-lg text-[var(--text-muted)] text-sm',
          {
            'h-[90px]': format === 'horizontal',
            'h-[250px] w-[300px]': format === 'rectangle',
            'h-[600px] w-[160px]': format === 'vertical',
            'h-[100px]': format === 'auto',
          },
          className
        )}
      >
        Ad Space ({slot})
      </div>
    )
  }

  return (
    <ins
      className={cn('adsbygoogle block', className)}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}
