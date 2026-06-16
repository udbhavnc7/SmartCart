'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Package, Sparkles, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/types'

export default function BundlesPage() {
  const [budget, setBudget] = useState(50000)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{
    possible: boolean
    matchType?: 'exact' | 'best-fit'
    products: Product[]
    total: number
    budget: number
  } | null>(null)

  const build = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await api.bundle(budget)
      setResult(res as typeof result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to build bundle')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pt-24 pb-16">
      <div className="text-center">
        <Badge className="mb-4">Smart Bundle Builder</Badge>
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">Build Your Perfect Bundle</h1>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Set your target budget and our engine finds the best product combination for you.
        </p>
      </div>

      <Card className="mx-auto mt-10 max-w-md">
        <CardContent className="p-6">
          <label className="text-sm font-medium text-muted-foreground">Target Budget (₹)</label>
          <Input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="mt-2 text-lg font-bold"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {[10000, 25000, 50000, 100000, 150000].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBudget(b)}
                className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                  budget === b ? 'bg-blue-600/30 text-blue-600 dark:text-blue-300' : 'bg-foreground/5 text-muted-foreground hover:bg-foreground/10'
                }`}
              >
                ₹{(b / 1000).toFixed(0)}k
              </button>
            ))}
          </div>
          <Button className="mt-6 w-full gap-2" onClick={build} disabled={loading || budget <= 0}>
            <Sparkles className="h-4 w-4" />
            {loading ? 'Building...' : 'Build Bundle'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <div className="mx-auto mt-6 flex max-w-md items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
          {result.possible && result.products?.length ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <CardTitle>Your Bundle</CardTitle>
                  <Badge variant={result.matchType === 'exact' ? 'success' : 'default'}>
                    {result.matchType === 'exact' ? 'Exact Match' : 'Best Under Budget'} — {formatPrice(result.total)}
                  </Badge>
                </div>
                <div className="mt-6 space-y-4">
                  {result.products.map((p) => (
                    <div key={p.id} className="flex items-center gap-4 rounded-xl bg-foreground/5 p-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{p.name}</p>
                        <p className="text-sm text-muted-foreground">{p.brand}</p>
                      </div>
                      <span className="font-bold text-foreground">{formatPrice(p.price)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-muted-foreground">Budget: {formatPrice(result.budget)}</span>
                  <span className="text-xl font-bold text-foreground">Total: {formatPrice(result.total)}</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="mx-auto h-12 w-12 text-muted-foreground/40" />
                <p className="mt-4 text-muted-foreground">No bundle found for ₹{budget.toLocaleString('en-IN')}. Try a higher budget.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  )
}
