export interface FormatResult {
  success: boolean
  formatted: string
  error?: string
}

export function formatJson(input: string, indent: number = 2): FormatResult {
  try {
    const parsed = JSON.parse(input)
    const formatted = JSON.stringify(parsed, null, indent)
    return { success: true, formatted }
  } catch (e) {
    return {
      success: false,
      formatted: input,
      error: e instanceof Error ? e.message : 'Invalid JSON',
    }
  }
}

export function minifyJson(input: string): FormatResult {
  try {
    const parsed = JSON.parse(input)
    const formatted = JSON.stringify(parsed)
    return { success: true, formatted }
  } catch (e) {
    return {
      success: false,
      formatted: input,
      error: e instanceof Error ? e.message : 'Invalid JSON',
    }
  }
}

export function validateJson(input: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(input)
    return { valid: true }
  } catch (e) {
    return {
      valid: false,
      error: e instanceof Error ? e.message : 'Invalid JSON',
    }
  }
}

export function highlightJson(json: string): string {
  return json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'syntax-number'
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'syntax-key'
            match = match.slice(0, -1) + '</span>:'
            return `<span class="${cls}">${match}`
          } else {
            cls = 'syntax-string'
          }
        } else if (/true|false/.test(match)) {
          cls = 'syntax-boolean'
        } else if (/null/.test(match)) {
          cls = 'syntax-null'
        }
        return `<span class="${cls}">${match}</span>`
      }
    )
    .replace(/([{}\[\]])/g, '<span class="syntax-bracket">$1</span>')
}
