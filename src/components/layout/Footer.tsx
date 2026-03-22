import { Link } from 'react-router-dom'
import { Github, Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-error fill-error" />
            <span>for QA Engineers</span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Terms of Service
            </Link>
            <a
              href="https://github.com/Serbanya/QA_tools"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>

          <p className="text-sm text-[var(--text-muted)]">
            &copy; {currentYear} QA Tools. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
