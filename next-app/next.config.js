module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  generateBuildId: async () => 'my-build-id',
  experimental: {
    server: false,
    serverActions: false
  }
};
