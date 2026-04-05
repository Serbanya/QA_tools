import { useState, useCallback, useRef, useEffect } from 'react'
import { Copy, Trash2, CheckCircle, ArrowLeftRight, Upload, Download } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { AdBanner } from '../components/layout/AdBanner'
import { copyToClipboard } from '../utils/fileDownload'
import * as Diff from 'diff'

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  value: string
  leftLineNum?: number
  rightLineNum?: number
}

function computeSideBySideDiff(left: string, right: string): { leftLines: DiffLine[]; rightLines: DiffLine[] } {
  const changes = Diff.diffLines(left, right)
  const leftLines: DiffLine[] = []
  const rightLines: DiffLine[] = []
  let leftNum = 1
  let rightNum = 1

  for (const change of changes) {
    const lines = change.value.replace(/\n$/, '').split('\n')

    if (change.added) {
      for (const line of lines) {
        leftLines.push({ type: 'unchanged', value: '', leftLineNum: undefined })
        rightLines.push({ type: 'added', value: line, rightLineNum: rightNum++ })
      }
    } else if (change.removed) {
      for (const line of lines) {
        leftLines.push({ type: 'removed', value: line, leftLineNum: leftNum++ })
        rightLines.push({ type: 'unchanged', value: '', rightLineNum: undefined })
      }
    } else {
      for (const line of lines) {
        leftLines.push({ type: 'unchanged', value: line, leftLineNum: leftNum++ })
        rightLines.push({ type: 'unchanged', value: line, rightLineNum: rightNum++ })
      }
    }
  }

  return { leftLines, rightLines }
}

function computeInlineDiff(left: string, right: string): DiffLine[] {
  const changes = Diff.diffLines(left, right)
  const lines: DiffLine[] = []
  let leftNum = 1
  let rightNum = 1

  for (const change of changes) {
    const lineValues = change.value.replace(/\n$/, '').split('\n')

    if (change.added) {
      for (const line of lineValues) {
        lines.push({ type: 'added', value: line, rightLineNum: rightNum++ })
      }
    } else if (change.removed) {
      for (const line of lineValues) {
        lines.push({ type: 'removed', value: line, leftLineNum: leftNum++ })
      }
    } else {
      for (const line of lineValues) {
        lines.push({ type: 'unchanged', value: line, leftLineNum: leftNum++, rightLineNum: rightNum++ })
      }
    }
  }

  return lines
}

function getStats(left: string, right: string) {
  const changes = Diff.diffLines(left, right)
  let added = 0
  let removed = 0
  let unchanged = 0

  for (const change of changes) {
    const count = change.value.replace(/\n$/, '').split('\n').length
    if (change.added) added += count
    else if (change.removed) removed += count
    else unchanged += count
  }

  return { added, removed, unchanged }
}

const sampleLeft = `function greet(name) {
  console.log("Hello, " + name);
  return true;
}

const users = ["Alice", "Bob"];
for (const user of users) {
  greet(user);
}`

const sampleRight = `function greet(name, greeting = "Hello") {
  console.log(greeting + ", " + name + "!");
  return true;
}

const users = ["Alice", "Bob", "Charlie"];
for (const user of users) {
  greet(user, "Hi");
}`

export function DiffTool() {
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')
  const [viewMode, setViewMode] = useState<'side-by-side' | 'inline'>('side-by-side')
  const [showDiff, setShowDiff] = useState(false)
  const [copied, setCopied] = useState(false)
  const leftDiffRef = useRef<HTMLDivElement>(null)
  const rightDiffRef = useRef<HTMLDivElement>(null)
  const syncingRef = useRef(false)

  const handleCompare = useCallback(() => {
    setShowDiff(true)
  }, [])

  const handleClear = useCallback(() => {
    setLeft('')
    setRight('')
    setShowDiff(false)
  }, [])

  const handleSwap = useCallback(() => {
    setLeft(right)
    setRight(left)
    if (showDiff) setShowDiff(true)
  }, [left, right, showDiff])

  const handleLoadSample = useCallback(() => {
    setLeft(sampleLeft)
    setRight(sampleRight)
    setShowDiff(false)
  }, [])

  const handleFileLoad = useCallback((side: 'left' | 'right') => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.txt,.js,.ts,.tsx,.jsx,.json,.xml,.csv,.html,.css,.py,.java,.go,.rs,.md,.yaml,.yml,.toml,.ini,.cfg,.sh,.bat,.sql,.php,.rb,.swift,.kt,.scala,.c,.cpp,.h,.hpp'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          const text = ev.target?.result as string
          if (side === 'left') setLeft(text)
          else setRight(text)
          setShowDiff(false)
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }, [])

  const handleCopyDiff = useCallback(async () => {
    const changes = Diff.diffLines(left, right)
    let unifiedDiff = ''
    for (const change of changes) {
      const lines = change.value.replace(/\n$/, '').split('\n')
      const prefix = change.added ? '+' : change.removed ? '-' : ' '
      for (const line of lines) {
        unifiedDiff += prefix + line + '\n'
      }
    }
    const success = await copyToClipboard(unifiedDiff)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [left, right])

  const handleExportDiff = useCallback(() => {
    const changes = Diff.createPatch('file', left, right)
    const blob = new Blob([changes], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'diff.patch'
    a.click()
    URL.revokeObjectURL(url)
  }, [left, right])

  // Synchronized scrolling
  useEffect(() => {
    const leftEl = leftDiffRef.current
    const rightEl = rightDiffRef.current
    if (!leftEl || !rightEl) return

    const syncScroll = (source: HTMLDivElement, target: HTMLDivElement) => () => {
      if (syncingRef.current) return
      syncingRef.current = true
      target.scrollTop = source.scrollTop
      target.scrollLeft = source.scrollLeft
      syncingRef.current = false
    }

    const leftHandler = syncScroll(leftEl, rightEl)
    const rightHandler = syncScroll(rightEl, leftEl)

    leftEl.addEventListener('scroll', leftHandler)
    rightEl.addEventListener('scroll', rightHandler)

    return () => {
      leftEl.removeEventListener('scroll', leftHandler)
      rightEl.removeEventListener('scroll', rightHandler)
    }
  }, [showDiff, viewMode])

  const stats = showDiff && left && right ? getStats(left, right) : null
  const sideBySide = showDiff && viewMode === 'side-by-side' ? computeSideBySideDiff(left, right) : null
  const inlineLines = showDiff && viewMode === 'inline' ? computeInlineDiff(left, right) : null

  const lineClass = (type: DiffLine['type']) => {
    switch (type) {
      case 'added': return 'bg-green-500/20 text-green-700 dark:text-green-300'
      case 'removed': return 'bg-red-500/20 text-red-700 dark:text-red-300'
      default: return 'text-[var(--text-primary)]'
    }
  }

  const lineNumClass = (type: DiffLine['type']) => {
    switch (type) {
      case 'added': return 'text-green-600 dark:text-green-400'
      case 'removed': return 'text-red-600 dark:text-red-400'
      default: return 'text-[var(--text-tertiary)]'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Code Compare</h1>
        <p className="text-[var(--text-secondary)]">
          Compare two texts or code snippets side-by-side with highlighted differences
        </p>
      </div>

      <AdBanner slot="diff-top" format="horizontal" className="mb-6 mx-auto max-w-3xl" />

      {/* Controls */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleCompare} disabled={!left && !right}>
              Compare
            </Button>
            <Button variant="outline" onClick={handleSwap} disabled={!left && !right}>
              <ArrowLeftRight className="w-4 h-4 mr-1" />
              Swap
            </Button>
            <Button variant="outline" onClick={handleLoadSample}>
              Load Sample
            </Button>
            <Button variant="ghost" onClick={handleClear}>
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>

            <div className="ml-auto flex items-center gap-2">
              {showDiff && (
                <>
                  <Button variant="ghost" size="sm" onClick={handleCopyDiff}>
                    {copied ? <CheckCircle className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                    {copied ? 'Copied' : 'Copy Diff'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleExportDiff}>
                    <Download className="w-4 h-4 mr-1" />
                    Export .patch
                  </Button>
                </>
              )}
              <div className="flex rounded-lg overflow-hidden border border-[var(--border-primary)]">
                <button
                  onClick={() => setViewMode('side-by-side')}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    viewMode === 'side-by-side'
                      ? 'bg-primary text-white'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  Side by Side
                </button>
                <button
                  onClick={() => setViewMode('inline')}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    viewMode === 'inline'
                      ? 'bg-primary text-white'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  Inline
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {stats && (
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-700 dark:text-green-300 text-sm font-medium">
            +{stats.added} added
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-700 dark:text-red-300 text-sm font-medium">
            -{stats.removed} removed
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-sm font-medium">
            {stats.unchanged} unchanged
          </div>
        </div>
      )}

      {/* Input panels */}
      {!showDiff && (
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
              <span className="font-semibold text-[var(--text-primary)]">Original</span>
              <Button variant="ghost" size="sm" onClick={() => handleFileLoad('left')}>
                <Upload className="w-4 h-4 mr-1" />
                Load File
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <textarea
                value={left}
                onChange={(e) => setLeft(e.target.value)}
                placeholder="Paste original text or code here..."
                className="w-full h-80 p-4 bg-transparent text-[var(--text-primary)] font-mono text-sm resize-none focus:outline-none border-t border-[var(--border-primary)]"
                spellCheck={false}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
              <span className="font-semibold text-[var(--text-primary)]">Modified</span>
              <Button variant="ghost" size="sm" onClick={() => handleFileLoad('right')}>
                <Upload className="w-4 h-4 mr-1" />
                Load File
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <textarea
                value={right}
                onChange={(e) => setRight(e.target.value)}
                placeholder="Paste modified text or code here..."
                className="w-full h-80 p-4 bg-transparent text-[var(--text-primary)] font-mono text-sm resize-none focus:outline-none border-t border-[var(--border-primary)]"
                spellCheck={false}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Side-by-side diff */}
      {showDiff && viewMode === 'side-by-side' && sideBySide && (
        <div className="grid md:grid-cols-2 gap-0 mb-6">
          <Card className="rounded-r-none border-r-0">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
              <span className="font-semibold text-[var(--text-primary)]">Original</span>
              <Button variant="ghost" size="sm" onClick={() => setShowDiff(false)}>
                Edit
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div
                ref={leftDiffRef}
                className="overflow-auto h-[500px] border-t border-[var(--border-primary)]"
              >
                {sideBySide.leftLines.map((line, i) => (
                  <div key={i} className={`flex font-mono text-sm leading-6 ${lineClass(line.type)}`}>
                    <span className={`w-12 shrink-0 text-right pr-3 select-none ${lineNumClass(line.type)}`}>
                      {line.leftLineNum ?? ''}
                    </span>
                    <span className="px-2 whitespace-pre">{line.type === 'removed' ? '−' : ' '}</span>
                    <span className="whitespace-pre flex-1">{line.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-l-none">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
              <span className="font-semibold text-[var(--text-primary)]">Modified</span>
              <Button variant="ghost" size="sm" onClick={() => setShowDiff(false)}>
                Edit
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div
                ref={rightDiffRef}
                className="overflow-auto h-[500px] border-t border-[var(--border-primary)]"
              >
                {sideBySide.rightLines.map((line, i) => (
                  <div key={i} className={`flex font-mono text-sm leading-6 ${lineClass(line.type)}`}>
                    <span className={`w-12 shrink-0 text-right pr-3 select-none ${lineNumClass(line.type)}`}>
                      {line.rightLineNum ?? ''}
                    </span>
                    <span className="px-2 whitespace-pre">{line.type === 'added' ? '+' : ' '}</span>
                    <span className="whitespace-pre flex-1">{line.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Inline diff */}
      {showDiff && viewMode === 'inline' && inlineLines && (
        <Card className="mb-6">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
            <span className="font-semibold text-[var(--text-primary)]">Diff</span>
            <Button variant="ghost" size="sm" onClick={() => setShowDiff(false)}>
              Edit
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto h-[500px] border-t border-[var(--border-primary)]">
              {inlineLines.map((line, i) => (
                <div key={i} className={`flex font-mono text-sm leading-6 ${lineClass(line.type)}`}>
                  <span className={`w-12 shrink-0 text-right pr-3 select-none ${lineNumClass(line.type)}`}>
                    {line.leftLineNum ?? ''}
                  </span>
                  <span className={`w-12 shrink-0 text-right pr-3 select-none ${lineNumClass(line.type)}`}>
                    {line.rightLineNum ?? ''}
                  </span>
                  <span className="px-2 whitespace-pre">
                    {line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' '}
                  </span>
                  <span className="whitespace-pre flex-1">{line.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <AdBanner slot="diff-bottom" format="horizontal" className="mx-auto max-w-3xl" />
    </div>
  )
}
