const Dotenv = require('dotenv-webpack');
const withPlugins = require('next-compose-plugins');
const withImg = require('next-img');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const nextConfig = {
  generateEtags: true,
  compress: true,
  poweredByHeader: false,
  webpack: (config, { isServer }) => {
    // Add the new plugin to the existing webpack plugins
    config.plugins.push(new Dotenv({}));

    if (process.env.ANALYZE)
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        })
      );

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
