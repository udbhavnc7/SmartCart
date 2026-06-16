'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, ShoppingBag, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import { api } from '@/lib/api'

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const router = useRouter()
  const { user } = useAuth()
  const { addItem } = useCart()
  const [adding, setAdding] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { router.push('/login'); return }
    setAdding(true)
    try {
      await addItem(product.id)
    } finally {
      setAdding(false)
    }
  }

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { router.push('/login'); return }
    if (wishlisted) await api.removeFromWishlist(product.id)
    else await api.addToWishlist(product.id)
    setWishlisted(!wishlisted)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card backdrop-blur-xl transition-all duration-300 hover:border-foreground/20 hover:shadow-2xl hover:shadow-blue-500/10"
    >
      <Link href={`/shop/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-foreground/5 to-transparent">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          {product.featured && <Badge className="absolute left-3 top-3">Featured</Badge>}
          {product.stock < 30 && <Badge variant="warning" className="absolute right-3 top-3">Low Stock</Badge>}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-foreground/50">
          <span>{product.brand}</span>
          <span>·</span>
          <span>{product.category}</span>
        </div>
        <Link href={`/shop/${product.id}`}>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-blue-500 dark:group-hover:text-blue-300">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs text-foreground/70">{product.rating}</span>
          <span className="text-xs text-foreground/40">({product.sales} sold)</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleWishlist} type="button">
              <Heart className={`h-4 w-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button size="sm" className="h-8 gap-1 px-3" onClick={handleAddToCart} disabled={adding} type="button">
              <ShoppingBag className="h-3.5 w-3.5" />
              {adding ? '...' : 'Add'}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
