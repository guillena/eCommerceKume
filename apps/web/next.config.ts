import type { NextConfig } from 'next';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const apiHostname = new URL(apiUrl).hostname;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Dev: localhost
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      // Prod: backend URL from env
      {
        protocol: 'https',
        hostname: apiHostname,
        pathname: '/**',
      },
      // Fallback hardcoded for safety
      {
        protocol: 'https',
        hostname: 'libreriabe-production.up.railway.app',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
