import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Loader({ onComplete }) {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100 }
        return p + 5
      })
    }, 55)

    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onComplete, 400)
    }, 1600)

    return () => { clearInterval(interval); clearTimeout(timer) }
  }, [onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed inset-0 z-[999] bg-[#065280] flex flex-col items-center justify-center"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C9A227]/10 blur-[120px] rounded-full" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0A69AD]/30 blur-[80px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C9A227]/10 blur-[80px] rounded-full" />
          </div>

          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative mb-6 z-10"
          >
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
             <img src="/logo.png" alt="BK Success Consulting"
               className="h-16 w-auto object-contain p-1" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-10 z-10"
          >
            <p className="text-white font-black text-xl tracking-[0.2em] uppercase">BK SUCCESS CONSULTING</p>
            <p className="text-[#C9A227] text-xs tracking-[0.35em] uppercase mt-2 font-semibold">
              Votre succès, notre expertise
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative z-10 w-40"
          >
            <div className="h-0.5 bg-white/15 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#C9A227] rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}