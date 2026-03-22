import { Card, CardContent } from '../components/ui/Card'

export function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">Privacy Policy</h1>

      <Card>
        <CardContent className="prose prose-sm max-w-none p-6 space-y-6 text-[var(--text-secondary)]">
          <p className="text-sm text-[var(--text-muted)]">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Introduction</h2>
            <p>
              Welcome to QA Tools ("we," "our," or "us"). We respect your privacy and are committed
              to protecting your personal data. This privacy policy explains how we handle your
              information when you use our website at serbanya.github.io/QA_tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Data We Collect</h2>
            <p>
              <strong>We do not collect any personal data.</strong> All data processing happens
              entirely in your browser. Your JSON, XML, CSV files, and any other data you input
              into our tools never leaves your device and is never sent to any server.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Local Storage</h2>
            <p>
              We use browser's Local Storage to save your preferences (such as dark/light mode).
              This data is stored only on your device and is not transmitted to us or any third party.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Third-Party Services</h2>
            <p>We may use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <strong>Google AdSense:</strong> We display advertisements through Google AdSense.
                Google may use cookies to serve ads based on your prior visits to our website or
                other websites. You can opt out of personalized advertising by visiting{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Ads Settings
                </a>.
              </li>
              <li>
                <strong>GitHub Pages:</strong> Our website is hosted on GitHub Pages. GitHub may
                collect technical information such as IP addresses for security and analytics purposes.
                See{' '}
                <a
                  href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub's Privacy Statement
                </a>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Cookies</h2>
            <p>
              We do not use cookies directly. However, third-party services (like Google AdSense)
              may use cookies to provide their services. You can control cookie settings through
              your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Your Rights</h2>
            <p>Since we don't collect personal data, there is no personal data to access, modify, or delete. Your data stays on your device.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Children's Privacy</h2>
            <p>
              Our service is not directed to children under 13. We do not knowingly collect
              personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any
              changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through
              our GitHub repository:{' '}
              <a
                href="https://github.com/Serbanya/QA_tools"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                github.com/Serbanya/QA_tools
              </a>
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
