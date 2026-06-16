const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api'

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('smartcart_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const url = `${API_URL}${path}`
  let res: Response
  try {
    res = await fetch(url, { ...options, headers })
  } catch {
    throw new Error('Cannot reach server. Make sure the API is running (npm run dev in /api).')
  }

  const text = await res.text()
  let data: Record<string, unknown>
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    throw new Error(
      res.ok
        ? 'Invalid server response'
        : `Server error (${res.status}). API may be offline or on the wrong port.`,
    )
  }

  if (!res.ok) throw new Error((data.error as string) ?? `Request failed (${res.status})`)
  return data as T
}

export const api = {
  health: () => request<{ status: string; service: string }>('/health'),

  register: (body: { email: string; password: string; name: string }) =>
    request<{ token: string; user: import('./types').User }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<{ token: string; user: import('./types').User }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  googleLogin: (body: { email: string; name: string; avatar?: string }) =>
    request<{ token: string; user: import('./types').User }>('/auth/google', { method: 'POST', body: JSON.stringify(body) }),

  me: () => request<import('./types').User>('/auth/me'),

  getProducts: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<{ products: import('./types').Product[]; total: number }>(`/products${qs}`)
  },

  getFeatured: () => request<{ products: import('./types').Product[] }>('/products/featured'),

  getProduct: (id: string) => request<import('./types').Product>(`/products/${id}`),

  searchProduct: (q: string) =>
    request<{ found: boolean; product?: import('./types').Product; products?: import('./types').Product[] }>(
      `/products/search/${encodeURIComponent(q)}`,
    ),

  addProduct: (body: Partial<import('./types').Product>) =>
    request<import('./types').Product>('/products', { method: 'POST', body: JSON.stringify(body) }),

  updateProduct: (id: string, body: Partial<import('./types').Product>) =>
    request<import('./types').Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  deleteProduct: (id: string) => request<{ success: boolean }>(`/products/${id}`, { method: 'DELETE' }),

  getCart: () => request<{ items: import('./types').Product[]; total: number; count: number }>('/cart'),

  addToCart: (productId: string, quantity = 1) =>
    request('/cart/items', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),

  updateCartItem: (productId: string, quantity: number) =>
    request(`/cart/items/${productId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),

  removeFromCart: (productId: string) => request(`/cart/items/${productId}`, { method: 'DELETE' }),

  clearCart: () => request('/cart', { method: 'DELETE' }),

  getWishlist: () => request<{ products: import('./types').Product[] }>('/wishlist'),

  addToWishlist: (productId: string) => request(`/wishlist/${productId}`, { method: 'POST' }),

  removeFromWishlist: (productId: string) => request(`/wishlist/${productId}`, { method: 'DELETE' }),

  getOrders: () => request<{ orders: import('./types').Order[] }>('/orders'),

  checkout: () => request<import('./types').Order>('/orders', { method: 'POST' }),

  getAnalytics: () => request<Record<string, unknown>>('/admin/analytics'),

  assistant: (message: string) =>
    request<{ reply: string; suggestions?: import('./types').Product[] }>('/assistant', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  warehouseNetwork: (method: 'prim' | 'kruskal') =>
    request('/logistics/warehouse-network', { method: 'POST', body: JSON.stringify({ method }) }),

  deliveryRoute: (from: string, to: string) =>
    request('/logistics/delivery-routes', { method: 'POST', body: JSON.stringify({ from, to }) }),

  packing: (capacity: number) =>
    request('/logistics/packing', { method: 'POST', body: JSON.stringify({ capacity }) }),

  bundle: (budget: number) =>
    request('/logistics/bundle', { method: 'POST', body: JSON.stringify({ budget }) }),

  visualize: (algo: string, body?: Record<string, unknown>) =>
    request<Record<string, unknown>>(`/visualizer/${algo}`, { method: 'POST', body: JSON.stringify(body ?? {}) }),
}
