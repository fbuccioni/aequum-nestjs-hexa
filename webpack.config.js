/**
 * Webpack config for production build
 */
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (opts, webpack) => {
  return {
    devtool: 'source-map',
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
            keep_fnames: true,
            sourceMap: true,
            // compress: true
          },
        }),
      ],
    },
    output: {
      ...opts.output,
      library: {
        type: 'commonjs2',
      }
    }
  }
};
