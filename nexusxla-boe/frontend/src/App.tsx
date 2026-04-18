import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import InputPanel from './components/InputPanel'
import OutputPanel from './components/OutputPanel'
import LoadingState from './components/LoadingState'

export default function App() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const outputRef = useRef<HTMLDivElement>(null)

  // Handle loading state animation
  useEffect(() => {
    if (!loading) {
      setStep(0)
      return
    }

    let i = 0
    const interval = setInterval(() => {
      if (i < 3) {
        setStep(i)
        i++
      } else {
        clearInterval(interval)
      }
    }, 1200)

    return () => clearInterval(interval)
  }, [loading])

  // Auto-scroll to results
  useEffect(() => {
    if (result && outputRef.current) {
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 500)
    }
  }, [result])

  // Handle form submission
  const handleSubmit = async () => {
    if (!input.trim()) {
      setError('Please enter your enterprise request')
      return
    }

    setError(null)
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/configure-slice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enterprise_input: input }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || response.statusText)
      }

      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Request failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* LEFT PANEL - INPUT (40%) - Sticky */}
          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <InputPanel
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
            />
          </div>

          {/* RIGHT PANEL - OUTPUT (60%) */}
          <div ref={outputRef} className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {loading ? (
                <LoadingState currentStep={step} />
              ) : result ? (
                <OutputPanel result={result} />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-12 text-center hover:border-purple-500/40 transition-all"
                >
                  <div className="text-6xl mb-4">✨</div>
                  <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-2">Ready to Configure</h3>
                  <p className="text-gray-400 font-medium">
                    Submit your enterprise request to get started with NexusXLA
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}