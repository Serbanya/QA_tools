import { useState, useCallback } from 'react'
import {
  Copy,
  Download,
  RefreshCw,
  CheckCircle,
  User,
  Mail,
  MapPin,
  CreditCard,
  Plus,
  Trash2,
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { AdBanner } from '../components/layout/AdBanner'
import {
  countries,
  generateMultipleData,
  validateIBAN,
  type GeneratedData,
} from '../utils/testDataGenerator'
import { copyToClipboard, downloadCsv } from '../utils/fileDownload'

export function TestDataTool() {
  const [selectedCountry, setSelectedCountry] = useState('GB')
  const [count, setCount] = useState(1)
  const [data, setData] = useState<GeneratedData[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  const handleGenerate = useCallback(() => {
    const newData = generateMultipleData(selectedCountry, count)
    setData(newData)
  }, [selectedCountry, count])

  const handleAddMore = useCallback(() => {
    const newData = generateMultipleData(selectedCountry, count)
    setData((prev) => [...prev, ...newData])
  }, [selectedCountry, count])

  const handleClear = useCallback(() => {
    setData([])
  }, [])

  const handleCopyField = useCallback(async (value: string, field: string) => {
    await copyToClipboard(value)
    setCopied(field)
    setTimeout(() => setCopied(null), 1500)
  }, [])

  const handleCopyAll = useCallback(async () => {
    const text = data
      .map((d, i) => {
        return `--- Record ${i + 1} ---
Name: ${d.name.fullName}
Email: ${d.email}
Address: ${d.address.fullAddress}
Postcode: ${d.address.postcode}
${d.ibanFormatted ? `IBAN: ${d.ibanFormatted}` : ''}`
      })
      .join('\n\n')

    await copyToClipboard(text)
    setCopied('all')
    setTimeout(() => setCopied(null), 1500)
  }, [data])

  const handleExportCsv = useCallback(() => {
    const headers = ['Name', 'Email', 'Street', 'Number', 'City', 'Postcode', 'Full Address', 'IBAN']
    const rows = data.map((d) => [
      d.name.fullName,
      d.email,
      d.address.street,
      d.address.number,
      d.address.city,
      d.address.postcode,
      d.address.fullAddress,
      d.iban || '',
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
    downloadCsv(csv, 'test-data.csv')
  }, [data])

  const countryOptions = Object.entries(countries).map(([code, config]) => ({
    code,
    name: config.name,
    hasIban: config.ibanLength > 0,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Test Data Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate realistic test data: names, emails, addresses, postcodes, and valid IBANs
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-[var(--text-secondary)]">Country:</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm min-w-[180px]"
              >
                {countryOptions.map(({ code, name, hasIban }) => (
                  <option key={code} value={code}>
                    {name} {!hasIban && '(no IBAN)'}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-[var(--text-secondary)]">Count:</label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm"
              >
                {[1, 5, 10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <Button onClick={handleGenerate}>
              <RefreshCw className="w-4 h-4" />
              Generate
            </Button>

            {data.length > 0 && (
              <>
                <Button variant="secondary" onClick={handleAddMore}>
                  <Plus className="w-4 h-4" />
                  Add More
                </Button>

                <div className="flex-1" />

                <Button variant="ghost" size="sm" onClick={handleCopyAll}>
                  {copied === 'all' ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleExportCsv}>
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {data.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <User className="w-16 h-16 mx-auto text-[var(--text-muted)] mb-4" />
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                No Data Generated
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Select a country and click Generate to create test data
              </p>
              <Button onClick={handleGenerate}>
                <RefreshCw className="w-4 h-4" />
                Generate Test Data
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.map((record, index) => (
            <Card key={index}>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--text-muted)]">
                    Record #{index + 1}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {countries[selectedCountry]?.name}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="py-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Name */}
                  <DataField
                    icon={User}
                    label="Name"
                    value={record.name.fullName}
                    onCopy={() => handleCopyField(record.name.fullName, `name-${index}`)}
                    copied={copied === `name-${index}`}
                  />

                  {/* Email */}
                  <DataField
                    icon={Mail}
                    label="Email"
                    value={record.email}
                    onCopy={() => handleCopyField(record.email, `email-${index}`)}
                    copied={copied === `email-${index}`}
                  />

                  {/* Address */}
                  <DataField
                    icon={MapPin}
                    label="Address"
                    value={record.address.fullAddress}
                    onCopy={() => handleCopyField(record.address.fullAddress, `address-${index}`)}
                    copied={copied === `address-${index}`}
                    className="md:col-span-2"
                  />

                  {/* Postcode */}
                  <DataField
                    icon={MapPin}
                    label="Postcode"
                    value={record.address.postcode}
                    onCopy={() => handleCopyField(record.address.postcode, `postcode-${index}`)}
                    copied={copied === `postcode-${index}`}
                  />

                  {/* IBAN */}
                  {record.ibanFormatted && (
                    <DataField
                      icon={CreditCard}
                      label="IBAN"
                      value={record.ibanFormatted}
                      onCopy={() => handleCopyField(record.iban || '', `iban-${index}`)}
                      copied={copied === `iban-${index}`}
                      badge={
                        validateIBAN(record.iban || '') ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">
                            Valid
                          </span>
                        ) : null
                      }
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8">
        <AdBanner slot="testdata-bottom" format="horizontal" className="mx-auto max-w-3xl" />
      </div>
    </div>
  )
}

interface DataFieldProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  onCopy: () => void
  copied: boolean
  className?: string
  badge?: React.ReactNode
}

function DataField({ icon: Icon, label, value, onCopy, copied, className, badge }: DataFieldProps) {
  return (
    <div className={`flex items-start gap-3 ${className || ''}`}>
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-[var(--text-muted)]">{label}</span>
          {badge}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-primary)] font-mono break-all">{value}</span>
          <button
            onClick={onCopy}
            className="p-1 hover:bg-[var(--bg-secondary)] rounded flex-shrink-0"
            title="Copy"
          >
            {copied ? (
              <CheckCircle className="w-4 h-4 text-success" />
            ) : (
              <Copy className="w-4 h-4 text-[var(--text-muted)]" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
