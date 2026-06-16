'use client'

import Link from 'next/link'
import { User, Package, Heart, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-16">
        <User className="h-16 w-16 text-white/20" />
        <p className="text-white/50">Sign in to view your profile</p>
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pt-24 pb-16">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-2xl font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
        <p className="text-white/50">{user.email}</p>
        {user.role === 'admin' && (
          <span className="mt-2 inline-block rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-300">Admin</span>
        )}
      </div>

      <div className="mt-6 space-y-2">
        {[
          { href: '/orders', icon: Package, label: 'My Orders' },
          { href: '/wishlist', icon: Heart, label: 'Wishlist' },
          ...(user.role === 'admin' ? [{ href: '/admin', icon: Settings, label: 'Admin Dashboard' }] : []),
        ].map((item) => (
          <Link key={item.href} href={item.href}
            className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-white/20">
            <item.icon className="h-5 w-5 text-white/50" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
        <button
          onClick={() => { logout(); router.push('/') }}
          className="flex w-full items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 text-red-400 transition-colors hover:border-red-500/20"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
