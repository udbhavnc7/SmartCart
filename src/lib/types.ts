export interface User {
  id: string
  email: string
  name: string
  role: 'customer' | 'admin'
  avatar?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  brand: string
  rating: number
  popularity: number
  sales: number
  stock: number
  weight: number
  image: string
  featured: boolean
  quantity?: number
}

export interface Order {
  id: string
  userId: string
  items: { productId: string; name: string; price: number; quantity: number }[]
  total: number
  status: string
  createdAt: string
  trackingId: string
}
