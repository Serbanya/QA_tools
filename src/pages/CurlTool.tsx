import { useState, useCallback } from 'react'
import {
  Copy,
  CheckCircle,
  AlertCircle,
  Trash2,
  Code,
  FileJson,
  Globe,
  Key,
  Cookie,
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Textarea } from '../components/ui/Textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs'
import { AdBanner } from '../components/layout/AdBanner'
import { parseCurl, formatParsedCurl, generateCodeSnippet, type ParsedCurl } from '../utils/curlParser'
import { copyToClipboard } from '../utils/fileDownload'

const sampleCurl = `curl -X POST 'https://api.example.com/users' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer token123' \\
  -d '{"name": "John Doe", "email": "john@example.com"}'`

export function CurlTool() {
  const [input, setInput] = useState('')
  const [parsed, setParsed] = useState<ParsedCurl | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const handleParse = useCallback(() => {
    const result = parseCurl(input)
    setParsed(result)
  }, [input])

  const handleClear = useCallback(() => {
    setInput('')
    setParsed(null)
  }, [])

  const handleLoadSample = useCallback(() => {
    setInput(sampleCurl)
    setParsed(null)
  }, [])

  const handleCopy = useCallback(async (text: string, key: string) => {
    await copyToClipboard(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">cURL Parser</h1>
        <p className="text-[var(--text-secondary)]">
          Parse cURL commands into readable format and convert to code snippets
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="font-semibold text-[var(--text-primary)]">cURL Command</h2>
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
              placeholder="Paste your cURL command here..."
              className="h-[300px]"
            />
            <div className="mt-4">
              <Button onClick={handleParse} disabled={!input.trim()}>
                <Code className="w-4 h-4" />
                Parse
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-[var(--text-primary)]">Parsed Result</h2>
          </CardHeader>
          <CardContent>
            {!parsed ? (
              <div className="h-[300px] flex items-center justify-center text-[var(--text-muted)] bg-[var(--bg-secondary)] rounded-lg">
                Parsed result will appear here
              </div>
            ) : !parsed.isValid ? (
              <div className="h-[300px] flex flex-col items-center justify-center text-error bg-error/5 rounded-lg p-4">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p>{parsed.error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Method & URL */}
                <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-xs text-[var(--text-muted)]">Request</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      parsed.method === 'GET' ? 'bg-success/20 text-success' :
                      parsed.method === 'POST' ? 'bg-primary/20 text-primary' :
                      parsed.method === 'PUT' ? 'bg-warning/20 text-warning' :
                      parsed.method === 'DELETE' ? 'bg-error/20 text-error' :
                      'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                    }`}>
                      {parsed.method}
                    </span>
                    <code className="text-sm break-all flex-1">{parsed.url}</code>
                    <button
                      onClick={() => handleCopy(parsed.url, 'url')}
                      className="p-1 hover:bg-[var(--bg-tertiary)] rounded flex-shrink-0"
                    >
                      {copied === 'url' ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <Copy className="w-4 h-4 text-[var(--text-muted)]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Headers */}
                {Object.keys(parsed.headers).length > 0 && (
                  <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                    <div className="flex items-center gap-2 mb-2">
                      <FileJson className="w-4 h-4 text-primary" />
                      <span className="text-xs text-[var(--text-muted)]">Headers</span>
                    </div>
                    <div className="space-y-1">
                      {Object.entries(parsed.headers).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-[var(--text-primary)]">{key}:</span>
                          <span className="text-[var(--text-secondary)] break-all">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auth */}
                {parsed.auth && (
                  <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                    <div className="flex items-center gap-2 mb-2">
                      <Key className="w-4 h-4 text-primary" />
                      <span className="text-xs text-[var(--text-muted)]">Authentication</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{parsed.auth.type}:</span>{' '}
                      <code>{parsed.auth.credentials}</code>
                    </div>
                  </div>
                )}

                {/* Cookies */}
                {Object.keys(parsed.cookies).length > 0 && (
                  <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                    <div className="flex items-center gap-2 mb-2">
                      <Cookie className="w-4 h-4 text-primary" />
                      <span className="text-xs text-[var(--text-muted)]">Cookies</span>
                    </div>
                    <div className="space-y-1">
                      {Object.entries(parsed.cookies).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-medium">{key}</span>={value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Body */}
                {parsed.data && (
                  <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-primary" />
                        <span className="text-xs text-[var(--text-muted)]">
                          Body ({parsed.dataType})
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(parsed.data || '', 'body')}
                        className="p-1 hover:bg-[var(--bg-tertiary)] rounded"
                      >
                        {copied === 'body' ? (
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : (
                          <Copy className="w-4 h-4 text-[var(--text-muted)]" />
                        )}
                      </button>
                    </div>
                    <pre className="text-sm overflow-auto max-h-[150px] p-2 bg-[var(--bg-primary)] rounded">
                      {parsed.dataType === 'json'
                        ? (() => {
                            try {
                              return JSON.stringify(JSON.parse(parsed.data), null, 2)
                            } catch {
                              return parsed.data
                            }
                          })()
                        : parsed.data}
                    </pre>
                  </div>
                )}

                {/* Flags */}
                {parsed.flags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {parsed.flags.map((flag) => (
                      <span
                        key={flag}
                        className="px-2 py-1 rounded-full text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                      >
                        {flag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Code Snippets */}
      {parsed?.isValid && (
        <Card className="mb-8">
          <CardHeader>
            <h2 className="font-semibold text-[var(--text-primary)]">Code Snippets</h2>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="javascript">
              <TabsList className="mb-4">
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="php">PHP</TabsTrigger>
                <TabsTrigger value="formatted">Formatted</TabsTrigger>
              </TabsList>

              <TabsContent value="javascript">
                <CodeBlock
                  code={generateCodeSnippet(parsed, 'javascript')}
                  onCopy={() => handleCopy(generateCodeSnippet(parsed, 'javascript'), 'js')}
                  copied={copied === 'js'}
                />
              </TabsContent>

              <TabsContent value="python">
                <CodeBlock
                  code={generateCodeSnippet(parsed, 'python')}
                  onCopy={() => handleCopy(generateCodeSnippet(parsed, 'python'), 'py')}
                  copied={copied === 'py'}
                />
              </TabsContent>

              <TabsContent value="php">
                <CodeBlock
                  code={generateCodeSnippet(parsed, 'php')}
                  onCopy={() => handleCopy(generateCodeSnippet(parsed, 'php'), 'php')}
                  copied={copied === 'php'}
                />
              </TabsContent>

              <TabsContent value="formatted">
                <CodeBlock
                  code={formatParsedCurl(parsed)}
                  onCopy={() => handleCopy(formatParsedCurl(parsed), 'formatted')}
                  copied={copied === 'formatted'}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <AdBanner slot="curl-bottom" format="horizontal" className="mx-auto max-w-3xl" />
    </div>
  )
}

interface CodeBlockProps {
  code: string
  onCopy: () => void
  copied: boolean
}

function CodeBlock({ code, onCopy, copied }: CodeBlockProps) {
  return (
    <div className="relative">
      <pre className="p-4 rounded-lg bg-[var(--bg-secondary)] overflow-auto max-h-[400px] text-sm font-mono">
        {code}
      </pre>
      <button
        onClick={onCopy}
        className="absolute top-2 right-2 p-2 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)]"
      >
        {copied ? (
          <CheckCircle className="w-4 h-4 text-success" />
        ) : (
          <Copy className="w-4 h-4 text-[var(--text-muted)]" />
        )}
      </button>
    </div>
  )
}
