import { useState, useCallback, useMemo } from 'react'
import {
  Copy,
  CheckCircle,
  Trash2,
  Type,
  Hash,
  FileText,
  AlignLeft,
  LetterText,
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Textarea } from '../components/ui/Textarea'
import { AdBanner } from '../components/layout/AdBanner'
import { copyToClipboard } from '../utils/fileDownload'

interface TextStats {
  characters: number
  charactersNoSpaces: number
  words: number
  sentences: number
  paragraphs: number
  lines: number
  bytes: number
  readingTime: string
}

function calculateStats(text: string): TextStats {
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length
  const lines = text ? text.split('\n').length : 0
  const bytes = new Blob([text]).size

  const wordsPerMinute = 200
  const minutes = Math.ceil(words / wordsPerMinute)
  const readingTime = minutes < 1 ? '< 1 min' : `${minutes} min`

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    lines,
    bytes,
    readingTime,
  }
}

interface CharFrequency {
  char: string
  count: number
  percentage: number
}

function getCharFrequency(text: string): CharFrequency[] {
  const freq: Record<string, number> = {}
  const cleanText = text.toLowerCase().replace(/\s/g, '')

  for (const char of cleanText) {
    freq[char] = (freq[char] || 0) + 1
  }

  const total = cleanText.length
  return Object.entries(freq)
    .map(([char, count]) => ({
      char,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)
}

const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`

export function CharacterCounter() {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)

  const stats = useMemo(() => calculateStats(text), [text])
  const charFrequency = useMemo(() => getCharFrequency(text), [text])

  const handleClear = useCallback(() => {
    setText('')
  }, [])

  const handleLoadSample = useCallback(() => {
    setText(sampleText)
  }, [])

  const handleCopy = useCallback(async () => {
    const statsText = `Characters: ${stats.characters}
Characters (no spaces): ${stats.charactersNoSpaces}
Words: ${stats.words}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Lines: ${stats.lines}
Bytes: ${stats.bytes}
Reading time: ${stats.readingTime}`

    await copyToClipboard(statsText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [stats])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Character Counter</h1>
        <p className="text-[var(--text-secondary)]">
          Count characters, words, sentences, and analyze text statistics
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="font-semibold text-[var(--text-primary)]">Input Text</h2>
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
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                className="h-[400px] resize-none"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Main Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="font-semibold text-[var(--text-primary)]">Statistics</h2>
              <button
                onClick={handleCopy}
                className="p-1 hover:bg-[var(--bg-secondary)] rounded"
                title="Copy stats"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4 text-[var(--text-muted)]" />
                )}
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <StatRow
                  icon={Type}
                  label="Characters"
                  value={stats.characters.toLocaleString()}
                />
                <StatRow
                  icon={LetterText}
                  label="Characters (no spaces)"
                  value={stats.charactersNoSpaces.toLocaleString()}
                />
                <StatRow
                  icon={FileText}
                  label="Words"
                  value={stats.words.toLocaleString()}
                />
                <StatRow
                  icon={AlignLeft}
                  label="Sentences"
                  value={stats.sentences.toLocaleString()}
                />
                <StatRow
                  icon={Hash}
                  label="Paragraphs"
                  value={stats.paragraphs.toLocaleString()}
                />
                <StatRow
                  icon={Hash}
                  label="Lines"
                  value={stats.lines.toLocaleString()}
                />
                <div className="border-t border-[var(--border-color)] pt-3 mt-3">
                  <StatRow
                    icon={Hash}
                    label="Bytes"
                    value={stats.bytes.toLocaleString()}
                  />
                  <StatRow
                    icon={FileText}
                    label="Reading time"
                    value={stats.readingTime}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Character Frequency */}
          {charFrequency.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-[var(--text-primary)]">Character Frequency</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[250px] overflow-y-auto">
                  {charFrequency.map(({ char, count, percentage }) => (
                    <div key={char} className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded bg-[var(--bg-secondary)] flex items-center justify-center font-mono text-sm">
                        {char === ' ' ? '␣' : char}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[var(--text-secondary)]">{count}×</span>
                          <span className="text-[var(--text-muted)]">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AdBanner slot="character-counter-bottom" format="horizontal" className="mx-auto max-w-3xl" />
    </div>
  )
}

interface StatRowProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}

function StatRow({ icon: Icon, label, value }: StatRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      </div>
      <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{value}</span>
    </div>
  )
}
