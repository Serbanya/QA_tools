import { useState, useCallback, useRef } from 'react'
import {
  Copy,
  Download,
  Trash2,
  CheckCircle,
  Upload,
  Plus,
  Minus,
  ArrowUpDown,
  FileSpreadsheet,
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { AdBanner } from '../components/layout/AdBanner'
import {
  parseCsv,
  stringifyCsv,
  createEmptyCsv,
  addRow,
  removeRow,
  addColumn,
  removeColumn,
  updateCell,
  updateHeader,
  sortByColumn,
  type CsvData,
} from '../utils/csvParser'
import { downloadCsv, copyToClipboard, readFileAsText } from '../utils/fileDownload'

export function CsvTool() {
  const [data, setData] = useState<CsvData>({ headers: [], rows: [] })
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [sortColumn, setSortColumn] = useState<number | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [delimiter, setDelimiter] = useState(',')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const hasData = data.headers.length > 0

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      try {
        const content = await readFileAsText(file)
        const result = parseCsv(content, delimiter)
        if (result.success) {
          setData(result.data)
          setError(null)
        } else {
          setError(result.error || 'Failed to parse CSV')
        }
      } catch {
        setError('Failed to read file')
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [delimiter]
  )

  const handleCreateNew = useCallback(() => {
    setData(createEmptyCsv(4, 5))
    setError(null)
  }, [])

  const handleClear = useCallback(() => {
    setData({ headers: [], rows: [] })
    setError(null)
    setSortColumn(null)
  }, [])

  const handleAddRow = useCallback(() => {
    setData((prev) => addRow(prev))
  }, [])

  const handleRemoveRow = useCallback((index: number) => {
    setData((prev) => removeRow(prev, index))
  }, [])

  const handleAddColumn = useCallback(() => {
    setData((prev) => addColumn(prev))
  }, [])

  const handleRemoveColumn = useCallback((index: number) => {
    setData((prev) => removeColumn(prev, index))
  }, [])

  const handleCellChange = useCallback(
    (rowIndex: number, colIndex: number, value: string) => {
      setData((prev) => updateCell(prev, rowIndex, colIndex, value))
    },
    []
  )

  const handleHeaderChange = useCallback((colIndex: number, value: string) => {
    setData((prev) => updateHeader(prev, colIndex, value))
  }, [])

  const handleSort = useCallback(
    (colIndex: number) => {
      const newAsc = sortColumn === colIndex ? !sortAsc : true
      setSortColumn(colIndex)
      setSortAsc(newAsc)
      setData((prev) => sortByColumn(prev, colIndex, newAsc))
    },
    [sortColumn, sortAsc]
  )

  const handleCopy = useCallback(async () => {
    const csv = stringifyCsv(data, delimiter)
    await copyToClipboard(csv)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [data, delimiter])

  const handleDownload = useCallback(() => {
    const csv = stringifyCsv(data, delimiter)
    downloadCsv(csv, 'data.csv')
  }, [data, delimiter])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">CSV Editor</h1>
        <p className="text-[var(--text-secondary)]">
          Create, edit, and export CSV files with a powerful table editor
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4" />
              Import CSV
            </Button>
            <Button variant="secondary" onClick={handleCreateNew}>
              <FileSpreadsheet className="w-4 h-4" />
              New Table
            </Button>

            <div className="flex items-center gap-2">
              <label className="text-sm text-[var(--text-secondary)]">Delimiter:</label>
              <select
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-1.5 text-sm"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="\t">Tab</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>

            <div className="flex-1" />

            {hasData && (
              <>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDownload}>
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

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-error/10 text-error text-sm">{error}</div>
      )}

      {!hasData ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <FileSpreadsheet className="w-16 h-16 mx-auto text-[var(--text-muted)] mb-4" />
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                No CSV Data
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Import a CSV file or create a new table to get started
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4" />
                  Import CSV
                </Button>
                <Button variant="secondary" onClick={handleCreateNew}>
                  <FileSpreadsheet className="w-4 h-4" />
                  New Table
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="font-semibold text-[var(--text-primary)]">
                {data.rows.length} rows x {data.headers.length} columns
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleAddColumn}>
                <Plus className="w-4 h-4" />
                Column
              </Button>
              <Button variant="outline" size="sm" onClick={handleAddRow}>
                <Plus className="w-4 h-4" />
                Row
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-secondary)]">
                    <th className="w-12 px-2 py-3 text-center text-xs font-medium text-[var(--text-muted)] border-b border-[var(--border-color)]">
                      #
                    </th>
                    {data.headers.map((header, colIndex) => (
                      <th
                        key={colIndex}
                        className="min-w-[220px] px-2 py-2 border-b border-[var(--border-color)]"
                      >
                        <div className="flex items-center gap-1">
                          <Input
                            value={header}
                            onChange={(e) => handleHeaderChange(colIndex, e.target.value)}
                            className="font-medium text-sm min-w-[140px]"
                          />
                          <button
                            onClick={() => handleSort(colIndex)}
                            className="p-1 hover:bg-[var(--bg-tertiary)] rounded"
                            title="Sort"
                          >
                            <ArrowUpDown className="w-4 h-4 text-[var(--text-muted)]" />
                          </button>
                          <button
                            onClick={() => handleRemoveColumn(colIndex)}
                            className="p-1 hover:bg-error/10 rounded text-[var(--text-muted)] hover:text-error"
                            title="Remove column"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-[var(--bg-secondary)]/50">
                      <td className="px-2 py-2 text-center text-xs text-[var(--text-muted)] border-b border-[var(--border-color)]">
                        <div className="flex items-center justify-center gap-1">
                          <span>{rowIndex + 1}</span>
                          <button
                            onClick={() => handleRemoveRow(rowIndex)}
                            className="p-1 hover:bg-error/10 rounded text-[var(--text-muted)] hover:text-error opacity-0 group-hover:opacity-100"
                            title="Remove row"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      {row.map((cell, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-2 py-1 border-b border-[var(--border-color)]"
                        >
                          <Input
                            value={cell}
                            onChange={(e) =>
                              handleCellChange(rowIndex, colIndex, e.target.value)
                            }
                            className="text-sm"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <AdBanner slot="csv-bottom" format="horizontal" className="mx-auto max-w-3xl" />
    </div>
  )
}
