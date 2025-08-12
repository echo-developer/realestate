/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Important for static export (disables Image Optimization)
  },
  generateBuildId: async () => 'my-build-id', // Optional, but helps cache-busting
  experimental: {
    serverActions: false,
  },
  output: 'export', // 👈 this enables static export to `out/` folder
};

module.exports = nextConfig;
