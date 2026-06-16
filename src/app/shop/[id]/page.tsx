'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Star, ShoppingBag, Heart, Truck, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import type { Product } from '@/lib/types'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)
  const { user } = useAuth()
  const { addItem } = useCart()

  useEffect(() => {
    if (id) api.getProduct(id).then(setProduct).catch(() => setProduct(null))
  }, [id])

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="animate-pulse text-white/50">Loading product...</div>
      </div>
    )
  }

  const handleAdd = async () => {
    if (!user) { router.push('/login'); return }
    setAdding(true)
    try { await addItem(product.id, qty) } finally { setAdding(false) }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-24 pb-16">
      <Link href="/shop" className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to Shop
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <Image src={product.image} alt={product.name} fill className="object-cover" priority />
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm text-white/50">
            <span>{product.brand}</span><span>·</span><span>{product.category}</span>
            <Badge className="ml-2">{product.id}</Badge>
          </div>
          <h1 className="mt-3 text-3xl font-bold">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{product.rating}</span>
            </div>
            <span className="text-white/40">|</span>
            <span className="text-sm text-white/50">{product.sales} sold</span>
            <span className="text-white/40">|</span>
            <span className="text-sm text-white/50">{product.stock} in stock</span>
          </div>

          <p className="mt-6 text-3xl font-bold">{formatPrice(product.price)}</p>
          <p className="mt-4 leading-relaxed text-white/60">{product.description}</p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-xl border border-white/10">
              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 text-lg hover:bg-foreground/5">−</button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <button type="button" onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-4 py-2 text-lg hover:bg-foreground/5">+</button>
            </div>
            <Button size="lg" className="flex-1 gap-2" onClick={handleAdd} disabled={adding}>
              <ShoppingBag className="h-5 w-5" />
              {adding ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button variant="secondary" size="icon" className="h-12 w-12" onClick={async () => {
              if (!user) { router.push('/login'); return }
              await api.addToWishlist(product.id)
            }}>
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
              <Truck className="h-5 w-5 text-blue-400" />
              <div><p className="text-sm font-medium">Free Delivery</p><p className="text-xs text-white/50">On orders above ₹5,000</p></div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
              <Shield className="h-5 w-5 text-emerald-400" />
              <div><p className="text-sm font-medium">2 Year Warranty</p><p className="text-xs text-white/50">Official brand warranty</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
