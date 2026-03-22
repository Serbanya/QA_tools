export interface FormatResult {
  success: boolean
  formatted: string
  error?: string
}

export function formatXml(input: string, indent: string = '  '): FormatResult {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(input, 'text/xml')

    const errorNode = doc.querySelector('parsererror')
    if (errorNode) {
      return {
        success: false,
        formatted: input,
        error: errorNode.textContent || 'Invalid XML',
      }
    }

    const formatted = formatNode(doc.documentElement, 0, indent)
    const declaration = input.trim().startsWith('<?xml')
      ? input.match(/<\?xml[^?]*\?>/)?.[0] + '\n'
      : ''

    return { success: true, formatted: declaration + formatted }
  } catch (e) {
    return {
      success: false,
      formatted: input,
      error: e instanceof Error ? e.message : 'Invalid XML',
    }
  }
}

function formatNode(node: Element, level: number, indent: string): string {
  const currentIndent = indent.repeat(level)
  const nextIndent = indent.repeat(level + 1)

  const tagName = node.tagName
  const attrs = Array.from(node.attributes)
    .map((attr) => `${attr.name}="${attr.value}"`)
    .join(' ')

  const attrStr = attrs ? ' ' + attrs : ''

  const children = Array.from(node.childNodes)
  const elementChildren = children.filter(
    (child) => child.nodeType === Node.ELEMENT_NODE
  ) as Element[]
  const textContent = children
    .filter((child) => child.nodeType === Node.TEXT_NODE)
    .map((child) => child.textContent?.trim())
    .filter(Boolean)
    .join('')

  if (elementChildren.length === 0 && textContent) {
    return `${currentIndent}<${tagName}${attrStr}>${textContent}</${tagName}>`
  }

  if (elementChildren.length === 0 && !textContent) {
    return `${currentIndent}<${tagName}${attrStr} />`
  }

  const childrenFormatted = elementChildren
    .map((child) => formatNode(child, level + 1, indent))
    .join('\n')

  if (textContent) {
    return `${currentIndent}<${tagName}${attrStr}>\n${nextIndent}${textContent}\n${childrenFormatted}\n${currentIndent}</${tagName}>`
  }

  return `${currentIndent}<${tagName}${attrStr}>\n${childrenFormatted}\n${currentIndent}</${tagName}>`
}

export function minifyXml(input: string): FormatResult {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(input, 'text/xml')

    const errorNode = doc.querySelector('parsererror')
    if (errorNode) {
      return {
        success: false,
        formatted: input,
        error: errorNode.textContent || 'Invalid XML',
      }
    }

    const serializer = new XMLSerializer()
    const formatted = serializer
      .serializeToString(doc)
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .trim()

    return { success: true, formatted }
  } catch (e) {
    return {
      success: false,
      formatted: input,
      error: e instanceof Error ? e.message : 'Invalid XML',
    }
  }
}

export function validateXml(input: string): { valid: boolean; error?: string } {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(input, 'text/xml')
    const errorNode = doc.querySelector('parsererror')

    if (errorNode) {
      return { valid: false, error: errorNode.textContent || 'Invalid XML' }
    }

    return { valid: true }
  } catch (e) {
    return {
      valid: false,
      error: e instanceof Error ? e.message : 'Invalid XML',
    }
  }
}

export function highlightXml(xml: string): string {
  const escapeHtml = (str: string) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const lines = xml.split('\n')

  return lines.map(line => {
    // Process XML declaration <?xml ... ?>
    if (line.trim().startsWith('<?xml')) {
      return `<span class="syntax-tag">${escapeHtml(line)}</span>`
    }

    let result = ''
    let i = 0

    while (i < line.length) {
      // Check for tag start
      if (line[i] === '<') {
        const tagEnd = line.indexOf('>', i)
        if (tagEnd !== -1) {
          const fullTag = line.slice(i, tagEnd + 1)
          result += highlightTag(fullTag)
          i = tagEnd + 1
        } else {
          result += escapeHtml(line[i])
          i++
        }
      } else {
        // Text content between tags
        const nextTag = line.indexOf('<', i)
        if (nextTag !== -1) {
          const text = line.slice(i, nextTag)
          result += `<span class="syntax-string">${escapeHtml(text)}</span>`
          i = nextTag
        } else {
          const text = line.slice(i)
          if (text.trim()) {
            result += `<span class="syntax-string">${escapeHtml(text)}</span>`
          } else {
            result += escapeHtml(text)
          }
          break
        }
      }
    }

    return result
  }).join('\n')
}

function highlightTag(tag: string): string {
  const escapeHtml = (str: string) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Self-closing or closing tag without attributes
  const simpleTagMatch = tag.match(/^<(\/?)([\w:-]+)\s*(\/?)>$/)
  if (simpleTagMatch) {
    const [, slash, tagName, selfClose] = simpleTagMatch
    return `&lt;${slash}<span class="syntax-tag">${tagName}</span>${selfClose}&gt;`
  }

  // Tag with attributes
  const tagWithAttrsMatch = tag.match(/^<(\/?)([\w:-]+)(.*)>$/)
  if (tagWithAttrsMatch) {
    const [, slash, tagName, rest] = tagWithAttrsMatch

    // Parse attributes
    let attrsHtml = ''
    const attrRegex = /([\w:-]+)=("[^"]*"|'[^']*')/g
    let lastIndex = 0
    let match

    while ((match = attrRegex.exec(rest)) !== null) {
      // Add any whitespace before this attribute
      if (match.index > lastIndex) {
        attrsHtml += escapeHtml(rest.slice(lastIndex, match.index))
      }

      const [, attrName, attrValue] = match
      attrsHtml += `<span class="syntax-attr">${attrName}</span>=<span class="syntax-value">${escapeHtml(attrValue)}</span>`
      lastIndex = match.index + match[0].length
    }

    // Add remaining content (like /> or just spaces)
    if (lastIndex < rest.length) {
      attrsHtml += escapeHtml(rest.slice(lastIndex))
    }

    return `&lt;${slash}<span class="syntax-tag">${tagName}</span>${attrsHtml}&gt;`
  }

  // Fallback
  return escapeHtml(tag)
}
