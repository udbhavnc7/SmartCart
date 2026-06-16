'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import type { Product } from '@/lib/types'

export default function WishlistPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    if (user) api.getWishlist().then((d) => setProducts(d.products))
  }, [user])

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-16">
        <Heart className="h-16 w-16 text-white/20" />
        <p className="text-white/50">Sign in to view your wishlist</p>
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-24 pb-16">
      <h1 className="text-3xl font-bold">Wishlist</h1>
      <p className="mt-1 text-white/50">{products.length} saved items</p>

      {products.length === 0 ? (
        <div className="py-20 text-center text-white/50">No items in your wishlist yet.</div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                <Image src={p.image} alt={p.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <Link href={`/shop/${p.id}`} className="font-semibold hover:text-blue-300">{p.name}</Link>
                <p className="text-sm text-white/50">{p.brand}</p>
                <p className="mt-1 font-bold">{formatPrice(p.price)}</p>
              </div>
              <button onClick={async () => { await api.removeFromWishlist(p.id); setProducts(products.filter((x) => x.id !== p.id)) }}
                className="self-start p-2 text-red-400 hover:text-red-300">
                <Heart className="h-4 w-4 fill-current" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
