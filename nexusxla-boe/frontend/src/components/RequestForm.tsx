import React, { useState } from 'react'

type Props = {
  onResult: (r: any) => void
  setLoading: (v: boolean) => void
}

export default function RequestForm({ onResult, setLoading }: Props) {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const templates = [
    "100 rain sensors across city, daily tracking",
    "Factory automation with robotic arms, low latency",
    "Healthcare monitoring devices, high reliability"
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    onResult(null)

    if (!input.trim()) {
      setError('Enter a valid use case')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/configure-slice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enterprise_input: input })
      })

      const data = await res.json()
      onResult(data)
    } catch (err: any) {
      setError('Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <label className="label">Describe your enterprise use-case</label>

      <textarea
        className="textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        placeholder="e.g. Smart city IoT deployment..."
      />

      <div className="chips">
        {templates.map((t, i) => (
          <button
            key={i}
            type="button"
            className="chip"
            onClick={() => setInput(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="actions">
        <button className="btn" type="submit" disabled={!input.trim()}>
          ⚡ Configure Slice
        </button>
      </div>

      {error && <div className="error">{error}</div>}
    </form>
  )
}