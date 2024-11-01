/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: ['utfs.io', 'uploadthing.com', 'lh3.googleusercontent.com'],
  },
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig
