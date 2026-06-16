import type { NextConfig } from 'next'

const API_PORT = process.env.API_PORT ?? '4001'

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:${API_PORT}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
