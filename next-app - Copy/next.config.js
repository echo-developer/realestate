module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  generateBuildId: async () => 'my-build-id',
  experimental: {
    serverActions: false
  }
};
