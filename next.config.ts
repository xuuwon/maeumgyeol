import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sentiment-server.duckdns.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
