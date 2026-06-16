'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import type { Product } from '@/lib/types'

export default function CheckoutPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [placing, setPlacing] = useState(false)
  const [done, setDone] = useState(false)
  const [trackingId, setTrackingId] = useState('')

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    api.getCart().then((d) => { setItems(d.items); setTotal(d.total) })
  }, [user, router])

  const placeOrder = async () => {
    setPlacing(true)
    try {
      const order = await api.checkout()
      setTrackingId(order.trackingId)
      setDone(true)
    } catch {
      alert('Checkout failed. Some items may be out of stock.')
    } finally {
      setPlacing(false)
    }
  }

  if (done) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 pt-16 text-center">
        <CheckCircle className="h-20 w-20 text-emerald-400" />
        <h1 className="text-3xl font-bold">Order Placed!</h1>
        <p className="text-white/60">Tracking ID: <span className="font-mono text-blue-300">{trackingId}</span></p>
        <div className="flex gap-4">
          <Button onClick={() => router.push('/orders')}>View Orders</Button>
          <Button variant="secondary" onClick={() => router.push('/shop')}>Continue Shopping</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pt-24 pb-16">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-semibold">Shipping Details</h2>
            <div className="mt-4 space-y-3">
              <Input placeholder="Full Name" defaultValue={user?.name} />
              <Input placeholder="Email" defaultValue={user?.email} type="email" />
              <Input placeholder="Phone Number" defaultValue="+91 98765 43210" />
              <Input placeholder="Address" defaultValue="123 MG Road, Bangalore" />
              <Input placeholder="PIN Code" defaultValue="560001" />
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-semibold">Payment</h2>
            <div className="mt-4 space-y-3">
              <Input placeholder="Card Number" defaultValue="4242 4242 4242 4242" />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="MM/YY" defaultValue="12/28" />
                <Input placeholder="CVV" defaultValue="123" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-semibold">Order Summary</h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-white/70">{item.name} × {item.quantity}</span>
                  <span>{formatPrice(item.price * (item.quantity ?? 1))}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="flex justify-between text-sm"><span className="text-white/50">Shipping</span><span className="text-emerald-400">Free</span></div>
              <div className="mt-2 flex justify-between text-lg font-bold">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>
            <Button size="lg" className="mt-6 w-full gap-2" onClick={placeOrder} disabled={placing || !items.length}>
              <Package className="h-5 w-5" />
              {placing ? 'Processing...' : `Pay ${formatPrice(total)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
