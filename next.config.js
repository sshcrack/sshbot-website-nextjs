const Dotenv = require('dotenv-webpack');
const withPlugins = require('next-compose-plugins');
const withImg = require('next-img');

const nextConfig = {
  generateEtags: true,
  compress: true,
  poweredByHeader: false,
  webpack: (config, { isServer }) => {
    // Add the new plugin to the existing webpack plugins
    config.plugins.push(new Dotenv({}));

    // Use SVGs as Components
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ['@svgr/webpack'],
    });

    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};

module.exports = withPlugins([withImg], nextConfig);
