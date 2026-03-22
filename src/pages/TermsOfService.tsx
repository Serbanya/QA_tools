import { Card, CardContent } from '../components/ui/Card'

export function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">Terms of Service</h1>

      <Card>
        <CardContent className="prose prose-sm max-w-none p-6 space-y-6 text-[var(--text-secondary)]">
          <p className="text-sm text-[var(--text-muted)]">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Agreement to Terms</h2>
            <p>
              By accessing and using QA Tools (serbanya.github.io/QA_tools), you agree to be
              bound by these Terms of Service. If you do not agree to these terms, please do
              not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Description of Service</h2>
            <p>
              QA Tools provides free online utilities for software developers and QA engineers,
              including:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>JSON formatting and validation</li>
              <li>XML formatting and validation</li>
              <li>CSV editing and creation</li>
              <li>Test data generation</li>
              <li>cURL command parsing</li>
              <li>Character counting and text analysis</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Use of Service</h2>
            <p>You agree to use QA Tools only for lawful purposes. You must not:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Use the service to process illegal or harmful content</li>
              <li>Attempt to disrupt or interfere with the service</li>
              <li>Use automated systems to access the service in a manner that could damage it</li>
              <li>Reverse engineer or attempt to extract the source code (note: our code is open source on GitHub)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Data Processing</h2>
            <p>
              All data processing occurs locally in your browser. We do not store, transmit, or
              have access to any data you input into our tools. You are solely responsible for
              the data you process using our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Intellectual Property</h2>
            <p>
              The QA Tools service, including its design, code, and content, is open source and
              available under the terms specified in our GitHub repository. You are free to use,
              modify, and distribute the code according to the applicable license.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Disclaimer of Warranties</h2>
            <p>
              QA Tools is provided "as is" without any warranties, express or implied. We do not
              guarantee that:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>The service will be uninterrupted or error-free</li>
              <li>The results obtained will be accurate or reliable</li>
              <li>Any defects will be corrected</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, we shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or any loss of profits or
              revenues, whether incurred directly or indirectly, or any loss of data, use, or
              goodwill.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Generated Test Data</h2>
            <p>
              The Test Data Generator creates fictional data for testing purposes only. Any
              resemblance to real persons, addresses, or financial information is purely
              coincidental. Generated IBANs follow valid format rules but are not connected
              to real bank accounts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Advertisements</h2>
            <p>
              We display third-party advertisements to support the free service. We are not
              responsible for the content of these advertisements or any products/services
              they promote.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting. Your continued use of the service after changes
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Contact</h2>
            <p>
              For questions about these Terms, please contact us through our GitHub repository:{' '}
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
