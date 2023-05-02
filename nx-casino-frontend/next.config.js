/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    appDir: true,
    fontLoaders: [
      { loader: "next/font/google", options: { subsets: ["latin"] } },
    ],
  },
  webpack: (config, options) => {
    if (Array.isArray(config.externals)) {
      config.externals.push({
        "aws-sdk": "commonjs aws-sdk",
        "pg-hstore": "commonjs pg-hstore",
        pg: "commonjs pg",
      });
    }
    return config;
  },
};

module.exports = nextConfig;
