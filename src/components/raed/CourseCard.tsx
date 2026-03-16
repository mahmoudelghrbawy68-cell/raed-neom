/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * بطاقة الدورة التعليمية - Course Card Component
 * ═══════════════════════════════════════════════════════════════════════════════
 */

'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, Clock, Star, Play } from 'lucide-react'

interface CourseCardProps {
  title: string
  price: string
  description?: string
  duration?: string
  rating?: number
  lessons?: number
  image?: string
  onBuy?: () => void
}

export const CourseCard = ({ 
  title, 
  price, 
  description,
  duration = '10 ساعات',
  rating = 4.9,
  lessons = 25,
  onBuy
}: CourseCardProps) => {
  const isFree = price.includes('مجاني') || price.includes('FREE') || price === '0';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-cyan-500/30 shadow-xl shadow-cyan-500/10 backdrop-blur-xl"
    >
      {/* Header with gradient */}
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-l from-cyan-500 via-purple-500 to-pink-500" />
      
      {/* Free badge */}
      {isFree && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
          🎁 مجاني
        </div>
      )}
      
      <div className="p-5">
        {/* Title & Price */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-white flex-1">{title}</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-bold shadow-lg ${
            isFree 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
          }`}>
            {price}
          </div>
        </div>
        
        {/* Description */}
        {description && (
          <p className="text-slate-400 text-sm mb-4 line-clamp-2">{description}</p>
        )}
        
        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4 fill-yellow-400" />
            <span>{rating}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Play className="w-4 h-4" />
            <span>{lessons} درس</span>
          </div>
        </div>
        
        {/* Buy Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBuy}
          className={`w-full py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all ${
            isFree 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-green-500/30' 
              : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-cyan-500/30'
          }`}
        >
          {isFree ? (
            <>
              <Play className="w-5 h-5" />
              <span>ابدأ التعلم مجاناً</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              <span>اشترِ الآن</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

// بطاقة منتج مدمجة مع المحادثة
export const InlineProductCard = ({ 
  title, 
  price, 
  description,
  onBuy 
}: CourseCardProps) => {
  const isFree = price.includes('مجاني') || price.includes('FREE') || price === '0';
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`my-3 p-4 rounded-xl backdrop-blur-sm border ${
        isFree 
          ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30' 
          : 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30'
      }`}
    >
      {isFree && (
        <span className="inline-block mb-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
          🎁 مجاني
        </span>
      )}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-bold text-white">{title}</h4>
          {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
        </div>
        <div className="flex items-center gap-3">
          <span className={`font-bold ${isFree ? 'text-green-400' : 'text-cyan-400'}`}>{price}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBuy}
            className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
              isFree 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : 'bg-gradient-to-r from-cyan-500 to-purple-600'
            }`}
          >
            {isFree ? 'ابدأ مجاناً' : 'شراء'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default CourseCard
