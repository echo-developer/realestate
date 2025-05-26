module.exports = {
  output: '',
  images: {
    unoptimized: true,
  },
  generateBuildId: async () => 'my-build-id',
  experimental: {
    serverActions: false
  }
};