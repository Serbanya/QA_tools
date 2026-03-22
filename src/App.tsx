import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { JsonTool } from './pages/JsonTool'
import { XmlTool } from './pages/XmlTool'
import { CsvTool } from './pages/CsvTool'
import { TestDataTool } from './pages/TestDataTool'
import { CurlTool } from './pages/CurlTool'
import { CharacterCounter } from './pages/CharacterCounter'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { TermsOfService } from './pages/TermsOfService'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/json" element={<JsonTool />} />
        <Route path="/xml" element={<XmlTool />} />
        <Route path="/csv" element={<CsvTool />} />
        <Route path="/testdata" element={<TestDataTool />} />
        <Route path="/curl" element={<CurlTool />} />
        <Route path="/characters" element={<CharacterCounter />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
      </Routes>
    </Layout>
  )
}

export default App
