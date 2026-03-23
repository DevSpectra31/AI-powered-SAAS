import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  experimental: {
    proxyClientMaxBodySize: 1000048576, // 1MB in bytes
  },
}
 
export default nextConfig