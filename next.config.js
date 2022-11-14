/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: process.env.BASE_PATH || undefined,
  assetPrefix: process.env.ASSET_PREFIX || undefined,
  images: { unoptimized: true },
};
