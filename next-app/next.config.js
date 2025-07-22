/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Important for static export (disables Image Optimization)
  },
  generateBuildId: async () => 'my-build-id', // Optional, but helps cache-busting
  experimental: {
    serverActions: false, // Optional, depending on whether you use them
  },
  output: 'export', // Enables `next export` to static `out/` folder
};

module.exports = nextConfig;
