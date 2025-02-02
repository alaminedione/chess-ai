// import type { NextConfig } from "next";
//
// const nextConfig: NextConfig = {
//   /* config options here */
//   experimental.webpackMemoryOptimizations: true
// };
//
// export default nextConfig;

import { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  experimental: {
    webpackMemoryOptimizations: true,
  },
};

module.exports = nextConfig;
