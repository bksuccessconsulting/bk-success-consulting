import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft } from 'lucide-react'

// Visionneuse plein écran réutilisable : montre une image en entier
// (object-contain), navigable si plusieurs images sont fournies.
export default function Lightbox({ images, index, onClose, onNav }) {
  if (index === null || index === undefined) return null
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <X size={20} />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onNav(-1) }}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNav(1) }}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft size={22} className="rotate-180" />
            </button>
          </>
        )}

        <motion.img
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={(e) => e.stopPropagation()}
          src={images[index]}
          alt=""
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
        />

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-xs font-bold bg-black/40 px-3 py-1 rounded-full">
            {index + 1} / {images.length}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
