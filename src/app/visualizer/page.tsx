'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'

const ALGORITHMS = [
  { id: 'binary-search', name: 'Instant Lookup', complexity: 'O(log n)', desc: 'Fast product ID search in sorted catalogs' },
  { id: 'merge-sort', name: 'Stable Ranking', complexity: 'O(n log n)', desc: 'Sort products by price, rating, or popularity' },
  { id: 'quick-sort', name: 'Flash Ranking', complexity: 'O(n log n) avg', desc: 'Real-time trending and bestseller rankings' },
  { id: 'prim', name: 'Network Planner A', complexity: 'O(E log V)', desc: 'Minimum-cost warehouse network (Prim)' },
  { id: 'kruskal', name: 'Network Planner B', complexity: 'O(E log E)', desc: 'Alternative MST approach (Kruskal)' },
  { id: 'floyd-warshall', name: 'Route Matrix', complexity: 'O(V³)', desc: 'All-pairs shortest delivery paths' },
  { id: 'knapsack', name: 'Smart Packing', complexity: 'O(n × W)', desc: 'Optimal delivery load selection' },
  { id: 'subset-sum', name: 'Bundle Matcher', complexity: 'O(n × target)', desc: 'Exact budget bundle matching' },
]

export default function VisualizerPage() {
  const [selected, setSelected] = useState('binary-search')
  const [input, setInput] = useState('38,12,45,7,23,56,34,19')
  const [target, setTarget] = useState('34')
  const [capacity, setCapacity] = useState('50')
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)

  const randomize = () => {
    const arr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10)
    setInput(arr.join(','))
    setTarget(String(arr[Math.floor(Math.random() * arr.length)]))
  }

  const run = async () => {
    setLoading(true)
    try {
      const array = input.split(',').map(Number)
      let body: Record<string, unknown> = {}
      switch (selected) {
        case 'binary-search':
          body = { array, target }
          break
        case 'merge-sort':
        case 'quick-sort':
          body = { array }
          break
        case 'knapsack':
          body = { weights: array.slice(0, 5), values: array.slice(0, 5).map((n) => n * 2), capacity: Number(capacity) }
          break
        case 'subset-sum':
          body = { array, target: Number(target) }
          break
        default:
          body = {}
      }
      const res = await api.visualize(selected, body)
      setResult(res)
    } catch {
      setResult({ error: 'Visualization failed' })
    } finally {
      setLoading(false)
    }
  }

  const algo = ALGORITHMS.find((a) => a.id === selected)!

  return (
    <div className="mx-auto max-w-6xl px-4 pt-24 pb-16">
      <h1 className="text-3xl font-bold">Algorithm Insights</h1>
      <p className="mt-2 text-white/50">See how SmartCart&apos;s intelligence engine works under the hood</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {ALGORITHMS.map((a) => (
          <button key={a.id} onClick={() => { setSelected(a.id); setResult(null) }}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              selected === a.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}>
            {a.name}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <CardTitle>{algo.name}</CardTitle>
              <Badge>{algo.complexity}</Badge>
            </div>
            <p className="mt-2 text-sm text-white/50">{algo.desc}</p>

            {!['prim', 'kruskal', 'floyd-warshall'].includes(selected) && (
              <div className="mt-6 space-y-3">
                <div>
                  <label className="text-xs text-white/50">Input Array (comma-separated)</label>
                  <Input value={input} onChange={(e) => setInput(e.target.value)} className="mt-1 font-mono" />
                </div>
                {['binary-search', 'subset-sum'].includes(selected) && (
                  <div>
                    <label className="text-xs text-white/50">Target</label>
                    <Input value={target} onChange={(e) => setTarget(e.target.value)} className="mt-1 font-mono" />
                  </div>
                )}
                {selected === 'knapsack' && (
                  <div>
                    <label className="text-xs text-white/50">Capacity</label>
                    <Input value={capacity} onChange={(e) => setCapacity(e.target.value)} className="mt-1 font-mono" />
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <Button onClick={run} disabled={loading} className="gap-2">
                <Play className="h-4 w-4" /> {loading ? 'Running...' : 'Run'}
              </Button>
              <Button variant="secondary" onClick={randomize} className="gap-2">
                <Shuffle className="h-4 w-4" /> Random
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <CardTitle>Output</CardTitle>
            {result ? (
              <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mt-4 max-h-96 overflow-auto rounded-xl bg-black/40 p-4 text-xs leading-relaxed text-emerald-300 font-mono">
                {JSON.stringify(result, null, 2)}
              </motion.pre>
            ) : (
              <p className="mt-8 text-center text-white/30">Run an algorithm to see results</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
