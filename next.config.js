/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // if set to false component won't render twice
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;

