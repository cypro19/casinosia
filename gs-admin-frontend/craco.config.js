module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // eslint-disable-next-line no-param-reassign
      webpackConfig.resolve.fallback = {
        buffer: require.resolve("buffer"),
      };
      return webpackConfig;
    },
  },
};
