var path = require('path'),
  webpack = require('webpack'),
  optimist = require('optimist');

var argv = optimist
  .alias('env', 'environment')
  .default('env', 'development')
  .argv;

var env = argv.env;

module.exports = {

  devServer: {
    historyApiFallback: true,
    hot: true
  },

  entry: env == 'development'? [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src/index'
  ]: [
    './src/index'
  ],

  output: {
    path: path.resolve('./'),
    filename: 'index.js',
    publicPath: '/'
  },

  plugins: env == 'development'? [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]: [],

  resolve: {
    extensions: ['', '.js', '.jsx'],
    fallback: path.join(__dirname, 'node_modules')
  },

  resolveLoader: {
    fallback: path.join(__dirname, 'node_modules')
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel?stage=0']
      }
    ]
  }

};
