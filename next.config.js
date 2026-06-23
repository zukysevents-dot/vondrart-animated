const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  output: "export",
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  turbopack: {
    root: __dirname
  },
  images: {
    unoptimized: true
  }
};

module.exports = withSentryConfig(nextConfig, {
  org: 'patrik-o6',
  project: 'vondrart-studio',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
});
