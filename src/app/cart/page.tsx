'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import type { Product } from '@/lib/types'

export default function CartPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const load = () => {
    if (!user) { setLoading(false); return }
    api.getCart().then((d) => { setItems(d.items); setTotal(d.total) }).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [user])

  const remove = async (id: string) => {
    await api.removeFromCart(id)
    load()
  }

  const updateQty = async (id: string, qty: number) => {
    if (qty < 1) return remove(id)
    await api.updateCartItem(id, qty)
    load()
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-16">
        <ShoppingBag className="h-16 w-16 text-white/20" />
        <p className="text-white/50">Sign in to view your cart</p>
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center pt-16 text-white/50">Loading cart...</div>

  if (!items.length) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-16">
        <ShoppingBag className="h-16 w-16 text-white/20" />
        <p className="text-white/50">Your cart is empty</p>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pt-24 pb-16">
      <h1 className="text-3xl font-bold">Your Cart</h1>
      <p className="mt-1 text-white/50">{items.length} items</p>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <Link href={`/shop/${item.id}`} className="font-semibold hover:text-blue-300">{item.name}</Link>
                <p className="text-sm text-white/50">{item.brand}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center rounded-lg border border-white/10">
                  <button type="button" onClick={() => updateQty(item.id, (item.quantity ?? 1) - 1)} className="px-3 py-1 hover:bg-foreground/5">−</button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button type="button" onClick={() => updateQty(item.id, (item.quantity ?? 1) + 1)} className="px-3 py-1 hover:bg-foreground/5">+</button>
                </div>
                <span className="font-bold">{formatPrice(item.price * (item.quantity ?? 1))}</span>
              </div>
            </div>
            <button type="button" onClick={() => remove(item.id)} className="self-start p-2 text-foreground/40 hover:text-red-400">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between text-lg">
          <span className="text-white/70">Subtotal</span>
          <span className="text-2xl font-bold">{formatPrice(total)}</span>
        </div>
        <p className="mt-1 text-sm text-white/40">Shipping calculated at checkout</p>
        <Button asChild size="lg" className="mt-6 w-full gap-2">
          <Link href="/checkout">
            Proceed to Checkout <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
