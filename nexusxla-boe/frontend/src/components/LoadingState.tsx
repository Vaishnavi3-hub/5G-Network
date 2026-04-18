import React from 'react'
import { motion } from 'framer-motion'

interface LoadingStateProps {
  currentStep: number
}

const MESSAGES = [
  'Analyzing use case...',
  'Mapping to network slice...',
  'Optimizing SLA...',
  'Finalizing configuration...',
]

export default function LoadingState({ currentStep }: LoadingStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Animated spinner */}
      <div className="flex justify-center">
        <div className="relative w-16 h-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 border-2 border-transparent border-t-purple-500 border-r-pink-500 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 border-2 border-transparent border-b-purple-400 border-l-pink-400 rounded-full"
          />
        </div>
      </div>

      {/* Progress messages with fade animation */}
      <div className="text-center">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 h-6"
        >
          {MESSAGES[Math.min(currentStep, MESSAGES.length - 1)]}
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-purple-500/10 rounded-full h-2 overflow-hidden">
        <motion.div
          animate={{
            width: `${((currentStep + 1) / MESSAGES.length) * 100}%`,
          }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
        />
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2">
        {MESSAGES.map((_, idx) => (
          <motion.div
            key={idx}
            animate={{
              scale: idx <= currentStep ? 1 : 0.7,
              backgroundColor: idx <= currentStep ? '#A855F7' : '#6B7280',
            }}
            className="w-2 h-2 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  )
}
