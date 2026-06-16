'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Truck, Shield, Sparkles, Zap, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/products/product-card'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { Product } from '@/lib/types'

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([])

  useEffect(() => {
    api.getFeatured().then((d) => setFeatured(d.products)).catch(() => {})
  }, [])

  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center px-4 pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute top-20 right-0 h-[400px] w-[400px] rounded-full bg-violet-600/15 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[80px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-blue-600 backdrop-blur-sm dark:text-blue-300">
              <Sparkles className="h-4 w-4" /> AI-Powered Shopping Experience
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-8 text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl"
          >
            Shop smarter.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Deliver faster.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            Premium e-commerce with intelligent recommendations, optimized delivery networks,
            smart bundle building, and a seamless checkout experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="gap-2 text-base">
              <Link href="/shop">
                Explore Collection <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="text-base">
              <Link href="/bundles">Build a Bundle</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-8"
          >
            {[
              { value: '20K+', label: 'Products' },
              { value: '50K+', label: 'Happy Customers' },
              { value: '99.2%', label: 'Delivery Success' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold md:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/5 px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold md:text-4xl">Why SmartCart?</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-white/50">
            Every feature is powered by intelligent algorithms working behind the scenes.
          </p>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              { icon: Zap, title: 'Instant Search', desc: 'Find any product in milliseconds with our optimized catalog engine.' },
              { icon: Truck, title: 'Smart Delivery', desc: 'Optimized warehouse networks and shortest-route delivery planning.' },
              { icon: Package, title: 'Bundle Builder', desc: 'Set your budget and get perfectly matched product bundles instantly.' },
              { icon: Shield, title: 'Secure Checkout', desc: 'End-to-end encrypted payments with order tracking at every step.' },
              { icon: Sparkles, title: 'AI Assistant', desc: 'Personal shopping recommendations tailored to your preferences.' },
              { icon: ArrowRight, title: 'Flash Rankings', desc: 'Real-time trending and bestseller rankings updated live.' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-colors hover:border-white/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                  <f.icon className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-white/50">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="border-t border-white/5 px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold">Featured Collection</h2>
                <p className="mt-2 text-white/50">Handpicked premium products</p>
              </div>
              <Link href="/shop" className="text-sm text-blue-400 hover:text-blue-300">View all →</Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.slice(0, 4).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 to-violet-600/20 p-12 text-center backdrop-blur-xl">
          <h2 className="text-3xl font-bold">Ready to experience the future of shopping?</h2>
          <p className="mt-4 text-white/60">Join thousands of smart shoppers today.</p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/register">Create Free Account</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
