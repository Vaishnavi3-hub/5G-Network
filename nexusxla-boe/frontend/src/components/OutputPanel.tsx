import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SliceCard from './SliceCard'

interface OutputPanelProps {
  result: any
  index?: number
}

const STATUS_COLOR = {
  APPROVED: 'bg-green-500/15 border-green-500/40 text-green-300 font-bold',
  REJECTED: 'bg-red-500/15 border-red-500/40 text-red-300 font-bold',
}

export default function OutputPanel({ result, index = 0 }: OutputPanelProps) {
  if (!result) return null

  const slice = result.slice_parameters || {}
  const commercial = result.commercial || {}

  const statusClass = STATUS_COLOR[result.status as keyof typeof STATUS_COLOR] || STATUS_COLOR.APPROVED

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto pr-2"
      style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(168, 85, 247, 0.3) transparent' }}
    >
      {/* Status Badge */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`inline-block px-4 py-2 rounded-full font-bold text-sm border ${statusClass}`}
      >
        ✓ {result.status}
      </motion.div>

      {/* SLA Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all"
      >
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-3">Configuration Summary</h3>
        <p className="text-gray-300 font-mono text-sm leading-relaxed">{result.sla_summary}</p>
      </motion.div>

      {/* Network Profile Section */}
      <SliceCard
        icon="🔗"
        title="Network Profile"
        items={[
          { label: 'Slice Type', value: slice.slice_type || '—' },
          { label: 'Latency', value: `${slice.max_latency_ms || '—'} ms` },
          { label: 'Throughput', value: `${slice.min_throughput_mbps || '—'} Mbps` },
        ]}
        index={index}
      />

      {/* Deployment Section */}
      <SliceCard
        icon="🚀"
        title="Deployment"
        items={[
          { label: 'Endpoints', value: slice.num_endpoints || '—' },
          { label: 'Priority', value: `Class ${slice.priority_class || '—'}` },
          { label: 'Region', value: result.industry?.toUpperCase() || 'GLOBAL' },
        ]}
        index={index + 1}
      />

      {/* SLA & Commercial Section */}
      <SliceCard
        icon="💰"
        title="SLA & Commercial"
        items={[
          { label: 'Reliability', value: `${slice.reliability_percent || '—'}%` },
          { label: 'SLA Tier', value: commercial.sla_tier?.toUpperCase() || '—' },
          { label: 'Monthly Cost', value: `₹${((commercial.monthly_cost_inr?.toLocaleString?.() ?? commercial.monthly_cost_inr) || '—')}` },
        ]}
        index={index + 2}
      />

      {/* Warnings Section */}
      {result.warnings && result.warnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-amber-500/5 rounded-xl p-6 border border-amber-500/20 hover:border-amber-500/40 transition-all"
        >
          <h3 className="text-lg font-bold text-amber-300 mb-3 flex items-center gap-2">
            ⚠️ Warnings
          </h3>
          <ul className="space-y-2">
            {result.warnings.map((warning: string, idx: number) => (
              <li key={idx} className="text-sm text-amber-200/80 flex items-start gap-2">
                <span>•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Reasoning Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all"
      >
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-3">Reasoning</h3>
        <p className="text-gray-300 text-sm leading-relaxed font-medium">{result.reasoning}</p>
      </motion.div>


    </motion.div>
  )
}
