import Papa from 'papaparse'

export interface CsvData {
  headers: string[]
  rows: string[][]
}

export interface ParseResult {
  success: boolean
  data: CsvData
  error?: string
}

export function parseCsv(input: string, delimiter: string = ','): ParseResult {
  try {
    const result = Papa.parse<string[]>(input, {
      delimiter,
      skipEmptyLines: true,
    })

    if (result.errors.length > 0) {
      return {
        success: false,
        data: { headers: [], rows: [] },
        error: result.errors[0].message,
      }
    }

    const data = result.data
    if (data.length === 0) {
      return {
        success: true,
        data: { headers: [], rows: [] },
      }
    }

    const headers = data[0]
    const rows = data.slice(1)

    return {
      success: true,
      data: { headers, rows },
    }
  } catch (e) {
    return {
      success: false,
      data: { headers: [], rows: [] },
      error: e instanceof Error ? e.message : 'Failed to parse CSV',
    }
  }
}

export function stringifyCsv(data: CsvData, delimiter: string = ','): string {
  const allRows = [data.headers, ...data.rows]
  return Papa.unparse(allRows, { delimiter })
}

export function createEmptyCsv(cols: number = 3, rows: number = 5): CsvData {
  const headers = Array.from({ length: cols }, (_, i) => `Column ${i + 1}`)
  const emptyRows = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => '')
  )
  return { headers, rows: emptyRows }
}

export function addRow(data: CsvData, index?: number): CsvData {
  const newRow = Array(data.headers.length).fill('')
  const rows = [...data.rows]

  if (index !== undefined && index >= 0 && index <= rows.length) {
    rows.splice(index, 0, newRow)
  } else {
    rows.push(newRow)
  }

  return { ...data, rows }
}

export function removeRow(data: CsvData, index: number): CsvData {
  const rows = data.rows.filter((_, i) => i !== index)
  return { ...data, rows }
}

export function addColumn(data: CsvData, name?: string, index?: number): CsvData {
  const colName = name || `Column ${data.headers.length + 1}`
  const headers = [...data.headers]
  const rows = data.rows.map((row) => [...row])

  if (index !== undefined && index >= 0 && index <= headers.length) {
    headers.splice(index, 0, colName)
    rows.forEach((row) => row.splice(index, 0, ''))
  } else {
    headers.push(colName)
    rows.forEach((row) => row.push(''))
  }

  return { headers, rows }
}

export function removeColumn(data: CsvData, index: number): CsvData {
  const headers = data.headers.filter((_, i) => i !== index)
  const rows = data.rows.map((row) => row.filter((_, i) => i !== index))
  return { headers, rows }
}

export function updateCell(
  data: CsvData,
  rowIndex: number,
  colIndex: number,
  value: string
): CsvData {
  const rows = data.rows.map((row, i) =>
    i === rowIndex ? row.map((cell, j) => (j === colIndex ? value : cell)) : row
  )
  return { ...data, rows }
}

export function updateHeader(
  data: CsvData,
  colIndex: number,
  value: string
): CsvData {
  const headers = data.headers.map((h, i) => (i === colIndex ? value : h))
  return { ...data, headers }
}

export function sortByColumn(
  data: CsvData,
  colIndex: number,
  ascending: boolean = true
): CsvData {
  const rows = [...data.rows].sort((a, b) => {
    const aVal = a[colIndex] || ''
    const bVal = b[colIndex] || ''

    const aNum = parseFloat(aVal)
    const bNum = parseFloat(bVal)

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return ascending ? aNum - bNum : bNum - aNum
    }

    return ascending
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal)
  })

  return { ...data, rows }
}
