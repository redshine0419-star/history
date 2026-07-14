/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/ads.txt', destination: '/api/ads-txt' },
    ]
  },
}

export default nextConfig
