import { useState, useCallback } from 'react'
import { Copy, Download, Trash2, CheckCircle, Upload, FileDown, FileUp } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { AdBanner } from '../components/layout/AdBanner'
import { copyToClipboard } from '../utils/fileDownload'

function base64ToBytes(base64: string): Uint8Array {
  const cleaned = base64.replace(/\s/g, '')
  const binary = atob(cleaned)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function detectMimeType(bytes: Uint8Array): { mime: string; ext: string } {
  const hex = Array.from(bytes.slice(0, 16))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  if (hex.startsWith('89504e47')) return { mime: 'image/png', ext: 'png' }
  if (hex.startsWith('ffd8ff')) return { mime: 'image/jpeg', ext: 'jpg' }
  if (hex.startsWith('47494638')) return { mime: 'image/gif', ext: 'gif' }
  if (hex.startsWith('52494646') && hex.slice(16, 24) === '57454250') return { mime: 'image/webp', ext: 'webp' }
  if (hex.startsWith('25504446')) return { mime: 'application/pdf', ext: 'pdf' }
  if (hex.startsWith('504b0304')) return { mime: 'application/zip', ext: 'zip' }
  if (hex.startsWith('1f8b')) return { mime: 'application/gzip', ext: 'gz' }
  if (hex.startsWith('424d')) return { mime: 'image/bmp', ext: 'bmp' }
  if (hex.startsWith('00000020') || hex.startsWith('0000001c') || hex.startsWith('00000018'))
    return { mime: 'video/mp4', ext: 'mp4' }
  if (hex.startsWith('494433') || hex.startsWith('fffb') || hex.startsWith('fff3'))
    return { mime: 'audio/mpeg', ext: 'mp3' }
  if (hex.startsWith('4f676753')) return { mime: 'audio/ogg', ext: 'ogg' }
  if (hex.startsWith('52494646') && hex.slice(16, 24) === '57415645') return { mime: 'audio/wav', ext: 'wav' }
  if (hex.startsWith('3c3f786d6c')) return { mime: 'application/xml', ext: 'xml' }
  if (hex.startsWith('3c21444f43') || hex.startsWith('3c68746d6c') || hex.startsWith('3c21646f63'))
    return { mime: 'text/html', ext: 'html' }
  if (hex.startsWith('7b')) return { mime: 'application/json', ext: 'json' }

  // Check if it's likely text (printable ASCII/UTF-8)
  const textChars = bytes.slice(0, Math.min(512, bytes.length))
  let isText = true
  for (const b of textChars) {
    if (b < 0x09 || (b > 0x0d && b < 0x20 && b !== 0x1b)) {
      isText = false
      break
    }
  }
  if (isText) return { mime: 'text/plain', ext: 'txt' }

  return { mime: 'application/octet-stream', ext: 'bin' }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function stripDataUri(input: string): string {
  const match = input.match(/^data:[^;]*;base64,(.*)$/s)
  return match ? match[1] : input
}

type Mode = 'encode' | 'decode'
type InputType = 'text' | 'file'

export function Base64Tool() {
  const [mode, setMode] = useState<Mode>('decode')
  const [inputType, setInputType] = useState<InputType>('text')
  const [textInput, setTextInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [decodedInfo, setDecodedInfo] = useState<{ mime: string; ext: string; size: number } | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const reset = useCallback(() => {
    setTextInput('')
    setOutput('')
    setError(null)
    setFileName(null)
    setDecodedInfo(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
  }, [previewUrl])

  const handleEncode = useCallback((text: string) => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(text)))
      setOutput(encoded)
      setError(null)
      setDecodedInfo(null)
      setPreviewUrl(null)
    } catch {
      setError('Failed to encode text to Base64')
      setOutput('')
    }
  }, [])

  const handleDecode = useCallback((input: string) => {
    try {
      const cleaned = stripDataUri(input).replace(/\s/g, '')
      const bytes = base64ToBytes(cleaned)
      const detected = detectMimeType(bytes)
      setDecodedInfo({ mime: detected.mime, ext: detected.ext, size: bytes.length })

      // Try to display as text
      if (detected.mime.startsWith('text/') || detected.mime === 'application/json' || detected.mime === 'application/xml') {
        const decoder = new TextDecoder('utf-8', { fatal: true })
        try {
          setOutput(decoder.decode(bytes))
        } catch {
          setOutput(`[Binary file: ${detected.mime}, ${formatFileSize(bytes.length)}]`)
        }
      } else {
        setOutput(`[Binary file: ${detected.mime}, ${formatFileSize(bytes.length)}]`)
      }

      // Preview for images
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      if (detected.mime.startsWith('image/')) {
        const blob = new Blob([bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)], { type: detected.mime })
        setPreviewUrl(URL.createObjectURL(blob))
      } else {
        setPreviewUrl(null)
      }

      setError(null)
    } catch {
      setError('Invalid Base64 string')
      setOutput('')
      setDecodedInfo(null)
      setPreviewUrl(null)
    }
  }, [previewUrl])

  const handleProcess = useCallback(() => {
    if (mode === 'encode') {
      handleEncode(textInput)
    } else {
      handleDecode(textInput)
    }
  }, [mode, textInput, handleEncode, handleDecode])

  const handleFileUpload = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      setFileName(file.name)
      const reader = new FileReader()

      if (mode === 'encode') {
        reader.onload = (ev) => {
          const result = ev.target?.result as string
          const base64 = result.split(',')[1] || ''
          setTextInput(base64)
          setOutput(base64)
          setError(null)
          setDecodedInfo(null)
          setPreviewUrl(null)
        }
        reader.readAsDataURL(file)
      } else {
        reader.onload = (ev) => {
          const text = ev.target?.result as string
          setTextInput(text)
          handleDecode(text)
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }, [mode, handleDecode])

  const handleDownloadDecoded = useCallback(() => {
    try {
      const cleaned = stripDataUri(textInput).replace(/\s/g, '')
      const bytes = base64ToBytes(cleaned)
      const detected = detectMimeType(bytes)
      const blob = new Blob([bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)], { type: detected.mime })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName ? fileName.replace(/\.[^.]+$/, '') + '.' + detected.ext : `decoded.${detected.ext}`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Failed to decode and download file')
    }
  }, [textInput, fileName])

  const handleCopy = useCallback(async () => {
    await copyToClipboard(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Base64 Encoder / Decoder</h1>
        <p className="text-[var(--text-secondary)]">
          Encode and decode Base64 strings. Decode Base64 to files (images, PDF, ZIP, etc.) and download them.
        </p>
      </div>

      <AdBanner slot="base64-top" format="horizontal" className="mb-6 mx-auto max-w-3xl" />

      {/* Mode & Controls */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Mode toggle */}
            <div className="flex rounded-lg overflow-hidden border border-[var(--border-primary)]">
              <button
                onClick={() => { setMode('encode'); reset() }}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                  mode === 'encode'
                    ? 'bg-primary text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => { setMode('decode'); reset() }}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                  mode === 'decode'
                    ? 'bg-primary text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                Decode
              </button>
            </div>

            {/* Input type toggle */}
            <div className="flex rounded-lg overflow-hidden border border-[var(--border-primary)]">
              <button
                onClick={() => { setInputType('text'); reset() }}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  inputType === 'text'
                    ? 'bg-primary text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                Text Input
              </button>
              <button
                onClick={() => { setInputType('file'); reset() }}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  inputType === 'file'
                    ? 'bg-primary text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                File Input
              </button>
            </div>

            <Button onClick={handleProcess} disabled={!textInput && inputType === 'text'}>
              {mode === 'encode' ? 'Encode' : 'Decode'}
            </Button>

            <Button variant="ghost" onClick={reset}>
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Input */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
            <span className="font-semibold text-[var(--text-primary)]">
              {mode === 'encode' ? 'Text / File to Encode' : 'Base64 to Decode'}
            </span>
            {inputType === 'file' && (
              <Button variant="ghost" size="sm" onClick={handleFileUpload}>
                <Upload className="w-4 h-4 mr-1" />
                {mode === 'encode' ? 'Upload File' : 'Load Base64 File'}
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {inputType === 'text' ? (
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={
                  mode === 'encode'
                    ? 'Enter text to encode to Base64...'
                    : 'Paste Base64 string here (data:... URIs also supported)...'
                }
                className="w-full h-72 p-4 bg-transparent text-[var(--text-primary)] font-mono text-sm resize-none focus:outline-none border-t border-[var(--border-primary)]"
                spellCheck={false}
              />
            ) : (
              <div className="h-72 flex flex-col items-center justify-center border-t border-[var(--border-primary)] text-[var(--text-secondary)]">
                {fileName ? (
                  <div className="text-center">
                    <FileUp className="w-10 h-10 mx-auto mb-3 text-primary" />
                    <p className="font-medium text-[var(--text-primary)]">{fileName}</p>
                    <p className="text-sm mt-1">{formatFileSize(textInput.length)} (Base64)</p>
                  </div>
                ) : (
                  <button
                    onClick={handleFileUpload}
                    className="flex flex-col items-center gap-3 hover:text-primary transition-colors cursor-pointer"
                  >
                    <Upload className="w-10 h-10" />
                    <span className="text-sm">Click to select a file</span>
                  </button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
            <span className="font-semibold text-[var(--text-primary)]">
              {mode === 'encode' ? 'Base64 Output' : 'Decoded Output'}
            </span>
            <div className="flex gap-1">
              {output && (
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <CheckCircle className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              )}
              {mode === 'decode' && textInput && (
                <Button variant="ghost" size="sm" onClick={handleDownloadDecoded}>
                  <Download className="w-4 h-4 mr-1" />
                  Download File
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {error ? (
              <div className="h-72 flex items-center justify-center border-t border-[var(--border-primary)] text-red-500 px-4">
                <p>{error}</p>
              </div>
            ) : output ? (
              <div className="border-t border-[var(--border-primary)]">
                <pre className="h-72 p-4 overflow-auto text-[var(--text-primary)] font-mono text-sm whitespace-pre-wrap break-all">
                  {output}
                </pre>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center border-t border-[var(--border-primary)] text-[var(--text-secondary)]">
                <p className="text-sm">Result will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* File info & preview */}
      {decodedInfo && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">Type</span>
                <p className="font-medium text-[var(--text-primary)]">{decodedInfo.mime}</p>
              </div>
              <div>
                <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">Extension</span>
                <p className="font-medium text-[var(--text-primary)]">.{decodedInfo.ext}</p>
              </div>
              <div>
                <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">Size</span>
                <p className="font-medium text-[var(--text-primary)]">{formatFileSize(decodedInfo.size)}</p>
              </div>
              <div className="ml-auto">
                <Button onClick={handleDownloadDecoded}>
                  <FileDown className="w-4 h-4 mr-2" />
                  Download as .{decodedInfo.ext}
                </Button>
              </div>
            </div>

            {/* Image preview */}
            {previewUrl && (
              <div className="mt-4 pt-4 border-t border-[var(--border-primary)]">
                <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-2">Preview</p>
                <img
                  src={previewUrl}
                  alt="Decoded preview"
                  className="max-h-64 rounded-lg border border-[var(--border-primary)]"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <AdBanner slot="base64-bottom" format="horizontal" className="mx-auto max-w-3xl" />
    </div>
  )
}
