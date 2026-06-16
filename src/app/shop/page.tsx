'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { SlidersHorizontal, RefreshCw, AlertCircle } from 'lucide-react'
import { ProductCard } from '@/components/products/product-card'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import type { Product } from '@/lib/types'

const categories = ['all', 'Phones', 'Laptops', 'Audio', 'Wearables', 'Gaming', 'Footwear', 'Home', 'Cameras', 'Accessories', 'Apparel', 'Electronics', 'Tablets']
const sortOptions = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'trending', label: 'Trending' },
  { value: 'bestseller', label: 'Best Sellers' },
]

function ShopContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('popularity')
  const [showFilters, setShowFilters] = useState(false)
  const search = searchParams.get('search') ?? ''

  const load = () => {
    setLoading(true)
    setError('')
    const params: Record<string, string> = { sort }
    if (category !== 'all') params.category = category
    if (search) params.search = search
    api.getProducts(params)
      .then((d) => setProducts(d.products))
      .catch((e) => {
        setProducts([])
        setError(e instanceof Error ? e.message : 'Failed to load products')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [category, sort, search])

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-16">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{search ? `Results for "${search}"` : 'Shop'}</h1>
          <p className="mt-1 text-muted-foreground">{loading ? 'Loading...' : `${products.length} products`}</p>
        </div>
        <Button variant="secondary" size="sm" className="gap-2 md:hidden" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </Button>
      </div>

      {error && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-600 dark:text-red-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="flex-1 text-sm">{error}</p>
          <Button size="sm" variant="secondary" onClick={load} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Retry
          </Button>
        </div>
      )}

      <div className="mt-8 flex gap-8">
        <aside className={`${showFilters ? 'block' : 'hidden'} w-full shrink-0 md:block md:w-56`}>
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground">Category</h3>
              <div className="mt-3 flex flex-wrap gap-2 md:flex-col md:gap-1">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      category === c ? 'bg-blue-600/20 text-blue-600 dark:text-blue-300' : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
                    }`}
                  >
                    {c === 'all' ? 'All Products' : c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground">Sort By</h3>
              <div className="mt-3 space-y-1">
                {sortOptions.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setSort(o.value)}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      sort === o.value ? 'bg-blue-600/20 text-blue-600 dark:text-blue-300' : 'text-muted-foreground hover:bg-foreground/5'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-foreground/5" />
              ))}
            </div>
          ) : products.length === 0 && !error ? (
            <div className="py-20 text-center text-muted-foreground">No products found. Try adjusting your filters.</div>
          ) : (
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center pt-16 text-muted-foreground">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  )
}
