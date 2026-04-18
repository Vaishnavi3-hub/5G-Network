import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface InputPanelProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  loading: boolean
  error: string | null
}

const SUGGESTION_CHIPS = [
  { label: 'Smart City IoT', example: '5,000 smart city air quality sensors, battery powered, hourly updates' },
  { label: 'Factory Automation', example: '300 robotic arms for precision welding, zero downtime required' },
  { label: 'Healthcare Monitoring', example: 'ICU patient monitoring for 50 beds, ECG must transmit continuously' },
]

export default function InputPanel({ value, onChange, onSubmit, loading, error }: InputPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col gap-6"
    >
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">Configure Slice</h2>
        <p className="text-gray-400 text-sm font-medium">Describe your enterprise use-case</p>
      </div>

      {/* Textarea */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Your Enterprise Request
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              onSubmit()
            }
          }}
          placeholder="e.g., 100 IoT sensors across city, 8 hours tracking"
          className="w-full h-40 px-4 py-3 rounded-xl glass focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:shadow-lg resize-none font-medium text-gray-100 placeholder-gray-500"
        />
      </div>

      {/* Suggestion Chips */}
      <div>
        <p className="text-xs text-gray-500 uppercase font-semibold mb-3 tracking-wide">Quick Examples</p>
        <div className="grid grid-cols-1 gap-2">
          {SUGGESTION_CHIPS.map((chip, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(chip.example)}
              className="px-4 py-2 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 text-left text-sm text-gray-300 hover:text-purple-200 font-medium transition-all"
            >
              {chip.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-medium"
        >
          {error}
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSubmit}
        disabled={loading || !value.trim()}
        className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${
          loading || !value.trim()
            ? 'bg-gray-600/40 cursor-not-allowed opacity-50'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer'
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 bg-white rounded-full animate-dots-bounce"></div>
            <div className="w-4 h-4 bg-white rounded-full animate-dots-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-4 h-4 bg-white rounded-full animate-dots-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        ) : (
          'Configure Slice'
        )}
      </motion.button>
    </motion.div>
  )
}
