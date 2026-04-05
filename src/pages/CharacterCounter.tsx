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
  Shuffle,
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

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
  'accusamus', 'iusto', 'odio', 'dignissimos', 'ducimus', 'blanditiis',
  'praesentium', 'voluptatum', 'deleniti', 'atque', 'corrupti', 'quos', 'dolores',
  'quas', 'molestias', 'recusandae', 'itaque', 'earum', 'rerum', 'hic', 'tenetur',
  'sapiente', 'delectus', 'aut', 'reiciendis', 'voluptatibus', 'maiores', 'alias',
  'perferendis', 'doloribus', 'asperiores', 'repellat', 'temporibus', 'quibusdam',
  'illum', 'fugit', 'quo', 'voluptas', 'nemo', 'ipsam', 'quia', 'voluptatem',
  'sequi', 'nesciunt', 'neque', 'porro', 'quisquam', 'numquam', 'eius', 'modi',
  'tempora', 'magni', 'ratione', 'vitae', 'dicta', 'explicabo', 'aspernatur',
  'odit', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'consequuntur',
]

function generateLoremSentence(minWords: number, maxWords: number): string {
  const count = minWords + Math.floor(Math.random() * (maxWords - minWords + 1))
  const words: string[] = []
  for (let i = 0; i < count; i++) {
    words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)])
  }
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  return words.join(' ') + '.'
}

function generateLoremParagraph(targetWords?: number): string {
  if (!targetWords) {
    const sentenceCount = 3 + Math.floor(Math.random() * 5)
    const sentences: string[] = []
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateLoremSentence(5, 15))
    }
    return sentences.join(' ')
  }

  const sentences: string[] = []
  let wordCount = 0
  while (wordCount < targetWords) {
    const remaining = targetWords - wordCount
    const maxWords = Math.min(remaining, 15)
    const minWords = Math.min(5, maxWords)
    const sentence = generateLoremSentence(minWords, maxWords)
    wordCount += sentence.replace(/\.$/, '').split(' ').length
    sentences.push(sentence)
  }
  return sentences.join(' ')
}

type LoremUnit = 'paragraphs' | 'words' | 'characters'

function generateLorem(count: number, unit: LoremUnit, startWithLorem: boolean, wordsPerParagraph?: number): string {
  if (unit === 'paragraphs') {
    const paragraphs: string[] = []
    for (let i = 0; i < count; i++) {
      let p = generateLoremParagraph(wordsPerParagraph)
      if (i === 0 && startWithLorem) {
        p = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + p
      }
      paragraphs.push(p)
    }
    return paragraphs.join('\n\n')
  }

  if (unit === 'words') {
    const words: string[] = []
    while (words.length < count) {
      const sentence = generateLoremSentence(5, 12)
      const sentenceWords = sentence.replace(/\.$/, '').split(' ')
      for (const w of sentenceWords) {
        if (words.length < count) words.push(w)
      }
    }
    if (startWithLorem && words.length >= 2) {
      words[0] = 'Lorem'
      words[1] = 'ipsum'
    }
    return words.join(' ') + '.'
  }

  // characters
  let text = ''
  while (text.length < count) {
    text += generateLoremParagraph() + '\n\n'
  }
  if (startWithLorem) {
    text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + text
  }
  return text.slice(0, count)
}

const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`

export function CharacterCounter() {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)
  const [loremCount, setLoremCount] = useState(3)
  const [loremUnit, setLoremUnit] = useState<LoremUnit>('paragraphs')
  const [loremWordsPerParagraph, setLoremWordsPerParagraph] = useState(50)
  const [loremStart, setLoremStart] = useState(true)
  const [loremCopied, setLoremCopied] = useState(false)

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

      {/* Lorem Ipsum Generator */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="font-semibold text-[var(--text-primary)]">Lorem Ipsum Generator</h2>
          <div className="flex items-center gap-2">
            {loremCopied ? (
              <span className="text-xs text-success flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Copied
              </span>
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-sm text-[var(--text-secondary)]">Generate</span>
            <input
              type="number"
              min={1}
              max={999}
              value={loremCount}
              onChange={(e) => setLoremCount(Math.max(1, Math.min(999, Number(e.target.value))))}
              className="w-20 px-3 py-1.5 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <div className="flex rounded-lg overflow-hidden border border-[var(--border-primary)]">
              {(['paragraphs', 'words', 'characters'] as LoremUnit[]).map((unit) => (
                <button
                  key={unit}
                  onClick={() => setLoremUnit(unit)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors capitalize ${
                    loremUnit === unit
                      ? 'bg-primary text-white'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
            {loremUnit === 'paragraphs' && (
              <>
                <span className="text-sm text-[var(--text-secondary)]">by</span>
                <input
                  type="number"
                  min={5}
                  max={500}
                  value={loremWordsPerParagraph}
                  onChange={(e) => setLoremWordsPerParagraph(Math.max(5, Math.min(500, Number(e.target.value))))}
                  className="w-20 px-3 py-1.5 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <span className="text-sm text-[var(--text-secondary)]">words each</span>
              </>
            )}
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={loremStart}
                onChange={(e) => setLoremStart(e.target.checked)}
                className="rounded border-[var(--border-primary)] accent-[var(--color-primary)]"
              />
              Start with "Lorem ipsum..."
            </label>
            <div className="flex gap-2 ml-auto">
              <Button
                size="sm"
                onClick={() => {
                  const generated = generateLorem(loremCount, loremUnit, loremStart, loremUnit === 'paragraphs' ? loremWordsPerParagraph : undefined)
                  setText(generated)
                }}
              >
                <Shuffle className="w-4 h-4 mr-1" />
                Generate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const generated = generateLorem(loremCount, loremUnit, loremStart, loremUnit === 'paragraphs' ? loremWordsPerParagraph : undefined)
                  const success = await copyToClipboard(generated)
                  if (success) {
                    setLoremCopied(true)
                    setTimeout(() => setLoremCopied(false), 2000)
                  }
                }}
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
