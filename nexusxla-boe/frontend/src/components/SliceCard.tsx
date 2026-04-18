import React from 'react'
import { motion } from 'framer-motion'

interface SliceCardProps {
  icon: React.ReactNode
  title: string
  items: Array<{ label: string; value: string | number }>
  index: number
}

export default function SliceCard({ icon, title, items, index }: SliceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(168, 85, 247, 0.15)' }}
      className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 hover:bg-purple-500/10 transition-all cursor-default"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">{icon}</div>
        <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">{title}</h3>
      </div>

      {/* Items Grid */}
      <div className="space-y-4">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + idx * 0.05 }}
            className="flex justify-between items-center pb-4 border-b border-purple-500/10 last:border-0"
          >
            <span className="text-sm text-gray-400 font-medium">{item.label}</span>
            <span className="text-sm font-bold text-gray-200">{item.value}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
