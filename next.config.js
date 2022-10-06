/** @type {import('next').NextConfig} */
// jshint esversion: 6

const withPWA = require("next-pwa")({
  dest: "public",
});
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withPWA(nextConfig);
