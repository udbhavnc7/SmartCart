'use client'

import { AuthProvider } from '@/lib/auth-context'
import { CartProvider } from '@/lib/cart-context'
import { ThemeProvider } from '@/lib/theme-context'
import { AIAssistant } from '@/components/ai-assistant'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          {children}
          <AIAssistant />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
