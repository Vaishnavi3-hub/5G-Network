import React from 'react'
import { motion } from 'framer-motion'

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-b border-purple-500/10 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 mb-2">
            NexusXLA
          </h1>
          <p className="text-gray-400 text-base font-medium tracking-wide">
            Business Outcome Engine — Outcome-indexed 5G slice configurator
          </p>
        </div>
      </div>
    </motion.header>
  )
}
