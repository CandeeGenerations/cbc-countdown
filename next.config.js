/* eslint-disable no-undef */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  turbopack: {
    root: __dirname,
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
}

module.exports = nextConfig
