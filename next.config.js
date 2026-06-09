/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite cargar fotos de cualquier servidor seguro para tus novios
      },
    ],
  },
};

module.exports = nextConfig;