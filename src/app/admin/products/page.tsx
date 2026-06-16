'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/types'

export default function AdminProductsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', price: 0, category: '', brand: '', stock: 0, weight: 1, image: '' })

  useEffect(() => {
    if (user && user.role !== 'admin') { router.push('/'); return }
    api.getProducts().then((d) => setProducts(d.products))
  }, [user, router])

  const handleAdd = async () => {
    await api.addProduct({ ...form, image: form.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' })
    const d = await api.getProducts()
    setProducts(d.products)
    setShowForm(false)
    setForm({ name: '', description: '', price: 0, category: '', brand: '', stock: 0, weight: 1, image: '' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await api.deleteProduct(id)
    setProducts(products.filter((p) => p.id !== id))
  }

  if (!user || user.role !== 'admin') return null

  return (
    <div className="mx-auto max-w-6xl px-4 pt-24 pb-16">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
      </div>

      {showForm && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <CardTitle>Add New Product</CardTitle>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <Input placeholder="Price" type="number" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              <Input placeholder="Stock" type="number" value={form.stock || ''} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
              <Input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="sm:col-span-2" />
            </div>
            <Button className="mt-4" onClick={handleAdd}>Save Product</Button>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-left text-white/50">
              <th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Sales</th><th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4 font-mono text-xs text-white/50">{p.id}</td>
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4">{formatPrice(p.price)}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4">{p.sales}</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
