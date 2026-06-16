'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { Package, Users, DollarSign, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    if (user && user.role !== 'admin') { router.push('/'); return }
    if (user?.role === 'admin') api.getAnalytics().then(setData).catch(() => {})
  }, [user, router])

  if (!user || user.role !== 'admin') {
    return <div className="flex min-h-screen items-center justify-center pt-16 text-white/50">Admin access required</div>
  }

  if (!data) return <div className="flex min-h-screen items-center justify-center pt-16 text-white/50">Loading analytics...</div>

  const monthlySales = data.monthlySales as { month: string; revenue: number; orders: number }[]
  const categoryBreakdown = data.categoryBreakdown as { category: string; sales: number }[]
  const topProducts = data.topProducts as { name: string; sales: number; price: number }[]
  const lowStock = data.lowStock as { name: string; stock: number }[]
  const customerGrowth = data.customerGrowth as { month: string; customers: number }[]

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-white/50">Sales, inventory, and customer analytics</p>
        </div>
        <Button asChild>
          <Link href="/admin/products">Manage Products</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: DollarSign, label: 'Revenue', value: formatPrice(data.revenue as number), color: 'text-emerald-400' },
          { icon: Package, label: 'Orders', value: String(data.totalOrders), color: 'text-blue-400' },
          { icon: Package, label: 'Products', value: String(data.totalProducts), color: 'text-violet-400' },
          { icon: Users, label: 'Customers', value: String(data.totalCustomers), color: 'text-cyan-400' },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ${kpi.color}`}>
                <kpi.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-white/50">{kpi.label}</p>
                <p className="text-2xl font-bold">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <CardTitle>Monthly Revenue</CardTitle>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <CardTitle>Customer Growth</CardTitle>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={customerGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                  <Line type="monotone" dataKey="customers" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <CardTitle>Top Products</CardTitle>
            <div className="mt-4 space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-sm font-bold text-blue-300">{i + 1}</span>
                    <span className="text-sm font-medium">{p.name}</span>
                  </div>
                  <span className="text-sm text-white/50">{p.sales} sold</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" /> Low Stock Alerts
            </CardTitle>
            <div className="mt-4 space-y-3">
              {lowStock.length === 0 ? (
                <p className="text-sm text-white/50">All products well stocked</p>
              ) : lowStock.map((p) => (
                <div key={p.name} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <span className="text-sm">{p.name}</span>
                  <Badge variant="warning">{p.stock} left</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
