export interface ParsedCurl {
  method: string
  url: string
  headers: Record<string, string>
  data: string | null
  dataType: 'raw' | 'form' | 'json' | null
  cookies: Record<string, string>
  auth: { type: string; credentials: string } | null
  flags: string[]
  isValid: boolean
  error?: string
}

export function parseCurl(curlCommand: string): ParsedCurl {
  const result: ParsedCurl = {
    method: 'GET',
    url: '',
    headers: {},
    data: null,
    dataType: null,
    cookies: {},
    auth: null,
    flags: [],
    isValid: false,
  }

  try {
    // Clean up the command
    let cmd = curlCommand
      .trim()
      .replace(/\\\n/g, ' ') // Handle line continuations
      .replace(/\\\r\n/g, ' ')
      .replace(/\s+/g, ' ')

    // Check if it starts with curl
    if (!cmd.toLowerCase().startsWith('curl ')) {
      result.error = 'Command must start with "curl"'
      return result
    }

    // Remove 'curl ' prefix
    cmd = cmd.slice(5).trim()

    // Tokenize respecting quotes
    const tokens = tokenize(cmd)

    let i = 0
    while (i < tokens.length) {
      const token = tokens[i]

      // URL (not starting with -)
      if (!token.startsWith('-') && !result.url) {
        result.url = token.replace(/^['"]|['"]$/g, '')
        i++
        continue
      }

      // Method
      if (token === '-X' || token === '--request') {
        if (i + 1 < tokens.length) {
          result.method = tokens[i + 1].toUpperCase()
          i += 2
          continue
        }
      }

      // Headers
      if (token === '-H' || token === '--header') {
        if (i + 1 < tokens.length) {
          const header = tokens[i + 1].replace(/^['"]|['"]$/g, '')
          const colonIndex = header.indexOf(':')
          if (colonIndex > 0) {
            const key = header.slice(0, colonIndex).trim()
            const value = header.slice(colonIndex + 1).trim()
            result.headers[key] = value

            // Check for Content-Type to determine data type
            if (key.toLowerCase() === 'content-type') {
              if (value.includes('application/json')) {
                result.dataType = 'json'
              } else if (value.includes('form')) {
                result.dataType = 'form'
              }
            }
          }
          i += 2
          continue
        }
      }

      // Data
      if (token === '-d' || token === '--data' || token === '--data-raw' || token === '--data-binary') {
        if (i + 1 < tokens.length) {
          result.data = tokens[i + 1].replace(/^['"]|['"]$/g, '')
          if (!result.dataType) {
            result.dataType = 'raw'
          }
          // If data looks like JSON, set type
          if (result.data.trim().startsWith('{') || result.data.trim().startsWith('[')) {
            result.dataType = 'json'
          }
          i += 2
          continue
        }
      }

      // Form data
      if (token === '-F' || token === '--form') {
        if (i + 1 < tokens.length) {
          const formData = tokens[i + 1].replace(/^['"]|['"]$/g, '')
          if (!result.data) {
            result.data = formData
          } else {
            result.data += '&' + formData
          }
          result.dataType = 'form'
          i += 2
          continue
        }
      }

      // Cookies
      if (token === '-b' || token === '--cookie') {
        if (i + 1 < tokens.length) {
          const cookieStr = tokens[i + 1].replace(/^['"]|['"]$/g, '')
          cookieStr.split(';').forEach(cookie => {
            const [key, value] = cookie.split('=').map(s => s.trim())
            if (key && value) {
              result.cookies[key] = value
            }
          })
          i += 2
          continue
        }
      }

      // Basic Auth
      if (token === '-u' || token === '--user') {
        if (i + 1 < tokens.length) {
          result.auth = {
            type: 'Basic',
            credentials: tokens[i + 1].replace(/^['"]|['"]$/g, ''),
          }
          i += 2
          continue
        }
      }

      // Common flags
      if (token === '-k' || token === '--insecure') {
        result.flags.push('insecure')
        i++
        continue
      }

      if (token === '-L' || token === '--location') {
        result.flags.push('follow-redirects')
        i++
        continue
      }

      if (token === '-v' || token === '--verbose') {
        result.flags.push('verbose')
        i++
        continue
      }

      if (token === '-s' || token === '--silent') {
        result.flags.push('silent')
        i++
        continue
      }

      if (token === '-i' || token === '--include') {
        result.flags.push('include-headers')
        i++
        continue
      }

      // Skip unknown flags with values
      if (token.startsWith('-')) {
        // Check if next token is a value (doesn't start with -)
        if (i + 1 < tokens.length && !tokens[i + 1].startsWith('-')) {
          i += 2
        } else {
          i++
        }
        continue
      }

      i++
    }

    // Determine method from data if not explicitly set
    if (result.data && result.method === 'GET') {
      result.method = 'POST'
    }

    // Validate
    if (!result.url) {
      result.error = 'No URL found in the command'
      return result
    }

    result.isValid = true
    return result
  } catch (e) {
    result.error = e instanceof Error ? e.message : 'Failed to parse cURL command'
    return result
  }
}

function tokenize(input: string): string[] {
  const tokens: string[] = []
  let current = ''
  let inQuote: string | null = null
  let escape = false

  for (let i = 0; i < input.length; i++) {
    const char = input[i]

    if (escape) {
      current += char
      escape = false
      continue
    }

    if (char === '\\') {
      escape = true
      continue
    }

    if (inQuote) {
      if (char === inQuote) {
        inQuote = null
      } else {
        current += char
      }
      continue
    }

    if (char === '"' || char === "'") {
      inQuote = char
      continue
    }

    if (char === ' ') {
      if (current) {
        tokens.push(current)
        current = ''
      }
      continue
    }

    current += char
  }

  if (current) {
    tokens.push(current)
  }

  return tokens
}

export function formatParsedCurl(parsed: ParsedCurl): string {
  const lines: string[] = []

  lines.push(`Method: ${parsed.method}`)
  lines.push(`URL: ${parsed.url}`)

  if (Object.keys(parsed.headers).length > 0) {
    lines.push('')
    lines.push('Headers:')
    Object.entries(parsed.headers).forEach(([key, value]) => {
      lines.push(`  ${key}: ${value}`)
    })
  }

  if (Object.keys(parsed.cookies).length > 0) {
    lines.push('')
    lines.push('Cookies:')
    Object.entries(parsed.cookies).forEach(([key, value]) => {
      lines.push(`  ${key}=${value}`)
    })
  }

  if (parsed.auth) {
    lines.push('')
    lines.push(`Authentication: ${parsed.auth.type}`)
    lines.push(`  Credentials: ${parsed.auth.credentials}`)
  }

  if (parsed.data) {
    lines.push('')
    lines.push(`Body (${parsed.dataType}):`)
    if (parsed.dataType === 'json') {
      try {
        const formatted = JSON.stringify(JSON.parse(parsed.data), null, 2)
        formatted.split('\n').forEach(line => lines.push(`  ${line}`))
      } catch {
        lines.push(`  ${parsed.data}`)
      }
    } else {
      lines.push(`  ${parsed.data}`)
    }
  }

  if (parsed.flags.length > 0) {
    lines.push('')
    lines.push(`Flags: ${parsed.flags.join(', ')}`)
  }

  return lines.join('\n')
}

export function generateCodeSnippet(parsed: ParsedCurl, language: 'javascript' | 'python' | 'php'): string {
  switch (language) {
    case 'javascript':
      return generateJavaScript(parsed)
    case 'python':
      return generatePython(parsed)
    case 'php':
      return generatePhp(parsed)
    default:
      return ''
  }
}

function generateJavaScript(parsed: ParsedCurl): string {
  const options: string[] = []

  options.push(`method: '${parsed.method}'`)

  if (Object.keys(parsed.headers).length > 0) {
    const headersStr = Object.entries(parsed.headers)
      .map(([k, v]) => `    '${k}': '${v}'`)
      .join(',\n')
    options.push(`headers: {\n${headersStr}\n  }`)
  }

  if (parsed.data) {
    if (parsed.dataType === 'json') {
      options.push(`body: JSON.stringify(${parsed.data})`)
    } else {
      options.push(`body: '${parsed.data.replace(/'/g, "\\'")}'`)
    }
  }

  return `fetch('${parsed.url}', {
  ${options.join(',\n  ')}
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`
}

function generatePython(parsed: ParsedCurl): string {
  const lines: string[] = ['import requests', '']

  const args: string[] = []

  if (Object.keys(parsed.headers).length > 0) {
    lines.push('headers = {')
    Object.entries(parsed.headers).forEach(([k, v]) => {
      lines.push(`    '${k}': '${v}',`)
    })
    lines.push('}')
    lines.push('')
    args.push('headers=headers')
  }

  if (parsed.data) {
    if (parsed.dataType === 'json') {
      lines.push(`data = ${parsed.data}`)
      args.push('json=data')
    } else {
      lines.push(`data = '${parsed.data}'`)
      args.push('data=data')
    }
    lines.push('')
  }

  if (parsed.auth) {
    const [user, pass] = parsed.auth.credentials.split(':')
    args.push(`auth=('${user}', '${pass || ''}')`)
  }

  const method = parsed.method.toLowerCase()
  const argsStr = args.length > 0 ? ', ' + args.join(', ') : ''

  lines.push(`response = requests.${method}('${parsed.url}'${argsStr})`)
  lines.push('print(response.json())')

  return lines.join('\n')
}

function generatePhp(parsed: ParsedCurl): string {
  const lines: string[] = ['<?php', '$ch = curl_init();', '']

  lines.push(`curl_setopt($ch, CURLOPT_URL, '${parsed.url}');`)
  lines.push('curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);')

  if (parsed.method !== 'GET') {
    lines.push(`curl_setopt($ch, CURLOPT_CUSTOMREQUEST, '${parsed.method}');`)
  }

  if (Object.keys(parsed.headers).length > 0) {
    lines.push('')
    lines.push('$headers = [')
    Object.entries(parsed.headers).forEach(([k, v]) => {
      lines.push(`    '${k}: ${v}',`)
    })
    lines.push('];')
    lines.push('curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);')
  }

  if (parsed.data) {
    lines.push('')
    lines.push(`curl_setopt($ch, CURLOPT_POSTFIELDS, '${parsed.data.replace(/'/g, "\\'")}');`)
  }

  if (parsed.auth) {
    lines.push('')
    lines.push(`curl_setopt($ch, CURLOPT_USERPWD, '${parsed.auth.credentials}');`)
  }

  lines.push('')
  lines.push('$response = curl_exec($ch);')
  lines.push('curl_close($ch);')
  lines.push('')
  lines.push('echo $response;')

  return lines.join('\n')
}
