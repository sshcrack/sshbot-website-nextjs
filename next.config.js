const Dotenv = require("dotenv-webpack");

module.exports = {
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