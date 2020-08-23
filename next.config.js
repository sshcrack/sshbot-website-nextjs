const Dotenv = require("dotenv-webpack");
const withPlugins = require('next-compose-plugins');
const withImg = require("next-img");
const helmet = require("helmet");

const nextConfig = {
  generateEtags: true,
  compress: true,
  poweredByHeader: false,
  webpack: (config) => {
    // Add the new plugin to the existing webpack plugins
    config.plugins.push(new Dotenv({
      silent: true
    }));

    // Use SVGs as Components
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ['@svgr/webpack'],
    });

    return config;
  }
};

module.exports = withPlugins([
  withImg
], nextConfig);