// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // keep for Docker standalone runtime
  output: 'standalone',

  // build hygiene
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', port: '', pathname: '/**' },
    ],
  },
};

export default nextConfig;
