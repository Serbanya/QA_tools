import { Link } from 'react-router-dom'
import { FileJson, FileCode, Table, ArrowRight, Zap, Shield, Cloud, UserPlus, Terminal, Type, GitCompareArrows, Binary } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { AdBanner } from '../components/layout/AdBanner'

const tools = [
  {
    path: '/json',
    title: 'JSON Formatter',
    description: 'Format, validate, and minify JSON with syntax highlighting',
    icon: FileJson,
    color: 'from-amber-500 to-orange-500',
  },
  {
    path: '/xml',
    title: 'XML Formatter',
    description: 'Pretty print and validate XML documents with proper indentation',
    icon: FileCode,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    path: '/csv',
    title: 'CSV Editor',
    description: 'Create, edit, and export CSV files with a powerful table editor',
    icon: Table,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    path: '/testdata',
    title: 'Test Data Generator',
    description: 'Generate names, emails, addresses, postcodes, and valid IBANs',
    icon: UserPlus,
    color: 'from-purple-500 to-pink-500',
  },
  {
    path: '/curl',
    title: 'cURL Parser',
    description: 'Parse cURL commands and convert to JavaScript, Python, PHP code',
    icon: Terminal,
    color: 'from-cyan-500 to-blue-500',
  },
  {
    path: '/characters',
    title: 'Character Counter',
    description: 'Count characters, words, sentences, and analyze text statistics',
    icon: Type,
    color: 'from-rose-500 to-red-500',
  },
  {
    path: '/diff',
    title: 'Code Compare',
    description: 'Compare two texts side-by-side with highlighted differences, like Meld',
    icon: GitCompareArrows,
    color: 'from-lime-500 to-green-500',
  },
  {
    path: '/base64',
    title: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64, decode to files with preview and download',
    icon: Binary,
    color: 'from-orange-500 to-amber-500',
  },
]

const features = [
  {
    icon: Zap,
    title: 'Fast & Efficient',
    description: 'All processing happens in your browser - instant results',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data never leaves your device - 100% secure',
  },
  {
    icon: Cloud,
    title: 'No Sign-up',
    description: 'Use all tools immediately - no registration required',
  },
]

export function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-6">
          Developer Tools for{' '}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            QA Engineers
          </span>
        </h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
          Format JSON, XML, edit CSV files - all in your browser. Fast, secure, and free.
        </p>
      </section>

      <AdBanner slot="home-top" format="horizontal" className="mb-12 mx-auto max-w-3xl" />

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {tools.map(({ path, title, description, icon: Icon, color }) => (
          <Link key={path} to={path}>
            <Card className="h-full hover:shadow-[var(--shadow-md)] transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  {title}
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-[var(--text-secondary)]">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-8">
          Why Choose QA Tools?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
              <p className="text-[var(--text-secondary)]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <AdBanner slot="home-bottom" format="horizontal" className="mx-auto max-w-3xl" />
    </div>
  )
}
