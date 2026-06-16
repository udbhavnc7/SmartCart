'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Truck, Network, Package, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'

const LOCATIONS = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata']

export default function LogisticsPage() {
  const [networkMethod, setNetworkMethod] = useState<'prim' | 'kruskal'>('prim')
  const [networkResult, setNetworkResult] = useState<{ edges: { from: string; to: string; weight: number }[]; totalCost: number; steps: string[] } | null>(null)
  const [from, setFrom] = useState('Mumbai')
  const [to, setTo] = useState('Chennai')
  const [routeResult, setRouteResult] = useState<{ distance: number; path: string[] } | null>(null)
  const [capacity, setCapacity] = useState(50)
  const [packResult, setPackResult] = useState<{ selected: { name: string; weight: number; profit: number }[]; maxProfit: number; usedWeight: number; utilization: number } | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  const run = async (key: string, fn: () => Promise<void>) => {
    setLoading(key)
    setError('')
    try {
      await fn()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-24 pb-16">
      <h1 className="text-3xl font-bold text-foreground">Logistics Center</h1>
      <p className="mt-2 text-muted-foreground">Warehouse networks, delivery routes, and smart packing</p>

      {error && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Network className="h-6 w-6 text-blue-500" />
              <CardTitle>Warehouse Network Planner</CardTitle>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Optimize connections between 5 warehouse hubs</p>
            <div className="mt-4 flex gap-2">
              <Button variant={networkMethod === 'prim' ? 'default' : 'secondary'} size="sm" type="button" onClick={() => setNetworkMethod('prim')}>Strategy A</Button>
              <Button variant={networkMethod === 'kruskal' ? 'default' : 'secondary'} size="sm" type="button" onClick={() => setNetworkMethod('kruskal')}>Strategy B</Button>
            </div>
            <Button
              className="mt-4 w-full"
              type="button"
              disabled={loading === 'network'}
              onClick={() => run('network', async () => {
                const res = await api.warehouseNetwork(networkMethod)
                setNetworkResult(res as typeof networkResult)
              })}
            >
              {loading === 'network' ? 'Optimizing...' : 'Optimize Network'}
            </Button>
            {networkResult && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-2">
                <Badge variant="success">Total Cost: ₹{networkResult.totalCost.toLocaleString('en-IN')}</Badge>
                {networkResult.edges.map((e) => (
                  <div key={`${e.from}-${e.to}`} className="rounded-lg bg-foreground/5 px-3 py-2 text-sm text-foreground">
                    {e.from} ↔ {e.to} <span className="text-muted-foreground">({e.weight} km)</span>
                  </div>
                ))}
              </motion.div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Truck className="h-6 w-6 text-violet-500" />
              <CardTitle>Delivery Route Optimizer</CardTitle>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Find the shortest delivery path between hubs</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">From</label>
                <select value={from} onChange={(e) => setFrom(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground">
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">To</label>
                <select value={to} onChange={(e) => setTo(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground">
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <Button
              className="mt-4 w-full"
              type="button"
              disabled={loading === 'route'}
              onClick={() => run('route', async () => {
                const res = await api.deliveryRoute(from, to)
                setRouteResult(res as typeof routeResult)
              })}
            >
              {loading === 'route' ? 'Finding route...' : 'Find Route'}
            </Button>
            {routeResult && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                <Badge>Distance: {routeResult.distance} km</Badge>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {routeResult.path.map((loc, i) => (
                    <span key={i} className="flex items-center gap-2">
                      <span className="rounded-lg bg-foreground/10 px-3 py-1.5 text-sm font-medium text-foreground">{loc}</span>
                      {i < routeResult.path.length - 1 && <span className="text-muted-foreground">→</span>}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-emerald-500" />
              <CardTitle>Smart Delivery Packing</CardTitle>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Maximize delivery value within vehicle weight capacity</p>
            <div className="mt-4 flex items-center gap-4">
              <label className="text-sm text-muted-foreground">Vehicle Capacity (kg):</label>
              <input type="range" min={10} max={100} value={capacity} onChange={(e) => setCapacity(Number(e.target.value))}
                className="flex-1 accent-blue-500" />
              <span className="font-bold text-foreground">{capacity} kg</span>
            </div>
            <Button
              className="mt-4"
              type="button"
              disabled={loading === 'pack'}
              onClick={() => run('pack', async () => {
                const res = await api.packing(capacity)
                setPackResult(res as typeof packResult)
              })}
            >
              {loading === 'pack' ? 'Optimizing...' : 'Optimize Packing'}
            </Button>
            {packResult && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
                <div className="flex gap-4">
                  <Badge variant="success">Profit: ₹{packResult.maxProfit.toLocaleString('en-IN')}</Badge>
                  <Badge>Weight: {packResult.usedWeight}/{capacity} kg ({packResult.utilization}%)</Badge>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {packResult.selected.map((item) => (
                    <div key={item.name} className="rounded-lg bg-foreground/5 px-4 py-3 text-sm text-foreground">
                      <span className="font-medium">{item.name}</span>
                      <span className="ml-2 text-muted-foreground">{item.weight}kg · ₹{item.profit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
