import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sentiment-server.duckdns.org',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
