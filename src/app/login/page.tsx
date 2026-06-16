'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const { login, googleLogin } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('demo@smartcart.ai')
  const [password, setPassword] = useState('user123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      router.push('/shop')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-white/50">Sign in to your SmartCart account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-[#030308] px-2 text-white/40">or</span></div>
        </div>

        <Button variant="secondary" className="w-full" onClick={async () => { await googleLogin(); router.push('/shop') }}>
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-white/50">
          Don&apos;t have an account? <Link href="/register" className="text-blue-400 hover:underline">Sign up</Link>
        </p>
        <p className="mt-2 text-center text-xs text-white/30">
          Demo: demo@smartcart.ai / user123 · Admin: admin@smartcart.ai / admin123
        </p>
      </div>
    </div>
  )
}
