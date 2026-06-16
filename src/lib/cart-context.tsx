'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { api } from './api'
import { useAuth } from './auth-context'

interface CartContextType {
  count: number
  total: number
  refresh: () => Promise<void>
  addItem: (productId: string, qty?: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
}

const CartContext = createContext<CartContextType>({
  count: 0,
  total: 0,
  refresh: async () => {},
  addItem: async () => {},
  removeItem: async () => {},
})

function CartProviderInner({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [count, setCount] = useState(0)
  const [total, setTotal] = useState(0)

  const refresh = useCallback(async () => {
    if (!user) { setCount(0); setTotal(0); return }
    try {
      const data = await api.getCart()
      setCount(data.count)
      setTotal(data.total)
    } catch {
      setCount(0)
      setTotal(0)
    }
  }, [user])

  useEffect(() => { refresh() }, [refresh])

  const addItem = useCallback(async (productId: string, qty = 1) => {
    await api.addToCart(productId, qty)
    await refresh()
  }, [refresh])

  const removeItem = useCallback(async (productId: string) => {
    await api.removeFromCart(productId)
    await refresh()
  }, [refresh])

  return (
    <CartContext.Provider value={{ count, total, refresh, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  )
}

export function CartProvider({ children }: { children: ReactNode }) {
  return <CartProviderInner>{children}</CartProviderInner>
}

export function useCart() {
  return useContext(CartContext)
}
