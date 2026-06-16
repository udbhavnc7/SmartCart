'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, Truck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import type { Order } from '@/lib/types'

const statusColors: Record<string, 'default' | 'success' | 'warning'> = {
  pending: 'warning',
  processing: 'default',
  shipped: 'default',
  delivered: 'success',
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (user) api.getOrders().then((d) => setOrders(d.orders))
  }, [user])

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-16">
        <Package className="h-16 w-16 text-white/20" />
        <p className="text-white/50">Sign in to view your orders</p>
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pt-24 pb-16">
      <h1 className="text-3xl font-bold">Your Orders</h1>
      <p className="mt-1 text-white/50">{orders.length} orders</p>

      {orders.length === 0 ? (
        <div className="py-20 text-center text-white/50">
          <p>No orders yet.</p>
          <Button asChild className="mt-4">
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{order.id}</p>
                  <p className="text-sm text-white/50">{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
                </div>
                <Badge variant={statusColors[order.status] ?? 'default'}>{order.status}</Badge>
              </div>
              <div className="mt-4 space-y-2">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-white/70">{item.name} × {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Truck className="h-4 w-4" />
                  <span className="font-mono">{order.trackingId}</span>
                </div>
                <span className="font-bold">{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
