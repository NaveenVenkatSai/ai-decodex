/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'mysql2']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
    }
    return config;
  }
};

module.exports = nextConfig;
