// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

// module.exports = nextConfig;
// next.config.js or next.config.cjs

const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Add Webpack alias
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },

  // ✅ Fix for large body size in API (App Router)
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb', // Adjust as needed: 10mb, 50mb etc.
    },
  },

  // ✅ Updated image config (no more deprecation warning)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'castingprofile.s3.eu-north-1.amazonaws.com',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;