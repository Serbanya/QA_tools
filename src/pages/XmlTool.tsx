import { useState, useCallback } from 'react'
import { Copy, Download, Trash2, CheckCircle, AlertCircle, Minimize2, Maximize2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Textarea } from '../components/ui/Textarea'
import { AdBanner } from '../components/layout/AdBanner'
import { formatXml, minifyXml, validateXml, highlightXml } from '../utils/xmlFormatter'
import { downloadXml, copyToClipboard } from '../utils/fileDownload'

const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="1">
    <title>The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <price>10.99</price>
  </book>
  <book id="2">
    <title>1984</title>
    <author>George Orwell</author>
    <year>1949</year>
    <price>12.99</price>
  </book>
</catalog>`

export function XmlTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleFormat = useCallback(() => {
    const result = formatXml(input)
    if (result.success) {
      setOutput(result.formatted)
      setError(null)
    } else {
      setError(result.error || 'Invalid XML')
      setOutput('')
    }
  }, [input])

  const handleMinify = useCallback(() => {
    const result = minifyXml(input)
    if (result.success) {
      setOutput(result.formatted)
      setError(null)
    } else {
      setError(result.error || 'Invalid XML')
      setOutput('')
    }
  }, [input])

  const handleValidate = useCallback(() => {
    const result = validateXml(input)
    if (result.valid) {
      setError(null)
      alert('Valid XML!')
    } else {
      setError(result.error || 'Invalid XML')
    }
  }, [input])

  const handleCopy = useCallback(async () => {
    await copyToClipboard(output || input)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output, input])

  const handleDownload = useCallback(() => {
    downloadXml(output || input, 'formatted.xml')
  }, [output, input])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput('')
    setError(null)
  }, [])

  const handleLoadSample = useCallback(() => {
    setInput(sampleXml)
    setError(null)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">XML Formatter</h1>
        <p className="text-[var(--text-secondary)]">
          Pretty print and validate XML documents with proper indentation
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="font-semibold text-[var(--text-primary)]">Input</h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleLoadSample}>
                Load Sample
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your XML here..."
              className="h-[400px]"
              error={!!error}
            />
            {error && (
              <div className="mt-3 flex items-start gap-2 text-error text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="break-all">{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="font-semibold text-[var(--text-primary)]">Output</h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output && !input}>
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDownload} disabled={!output && !input}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {output ? (
              <pre
                className="h-[400px] overflow-auto p-4 rounded-lg bg-[var(--bg-secondary)] font-mono text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: highlightXml(output) }}
              />
            ) : (
              <div className="h-[400px] flex items-center justify-center text-[var(--text-muted)] bg-[var(--bg-secondary)] rounded-lg">
                Formatted XML will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button onClick={handleFormat} disabled={!input}>
              <Maximize2 className="w-4 h-4" />
              Format
            </Button>
            <Button variant="secondary" onClick={handleMinify} disabled={!input}>
              <Minimize2 className="w-4 h-4" />
              Minify
            </Button>
            <Button variant="outline" onClick={handleValidate} disabled={!input}>
              <CheckCircle className="w-4 h-4" />
              Validate
            </Button>
          </div>
        </CardContent>
      </Card>

      <AdBanner slot="xml-bottom" format="horizontal" className="mx-auto max-w-3xl" />
    </div>
  )
}
