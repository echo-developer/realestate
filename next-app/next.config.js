/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, 
  },
  generateBuildId: async () => 'my-build-id', 
  experimental: {
    serverActions: false,
  },
  output: 'export', 
  modularizeImports: {
    lodash: { transform: 'lodash/{{member}}' },
    'react-bootstrap': { transform: 'react-bootstrap/{{member}}' },
  }
};

module.exports = nextConfig;
