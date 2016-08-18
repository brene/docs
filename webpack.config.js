const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: './src',
    tachyons: 'tachyons',
  },
  output: {
    filename: '[name].[hash].js',
    publicPath: '/',
  },
  module: {
    preLoaders: [{
      test: /\.ts(x?)$/,
      loader: 'tslint',
      exclude: /node_modules/,
    }],
    loaders: [{
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      loader: 'ts',
    }, {
      test: /module\.css/,
      loader: 'style!css?modules',
    }, {
      test: /\.css/,
      exclude: /module\.css/,
      loader: 'style!css',
    }, {
      test: /\.json/,
      loader: 'json',
    }, {
      test: /\.md/,
      loader: 'raw',
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
    }),
    new HtmlWebpackPlugin({
      favicon: 'static/favicon.png',
      template: 'src/index.html',
    }),
  ],
  resolve: {
    extensions: ['', '.js', '.ts', '.tsx'],
  },
}
