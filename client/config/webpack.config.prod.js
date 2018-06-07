'use strict';

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const paths = require('./paths');

process.env.NODE_ENV = 'production';

const publicPath = paths.servedPath;
const shouldUseRelativeAssetPaths = publicPath === './';

const cssFilename = 'static/[name]/[name].[hash:8].css';

module.exports = {
  bail: true,
  devtool: false,
  entry: paths.appEntry.appIndexJS,
  output: {
    path: paths.appBuild,
    filename: 'static/[name]/[name].[hash:8].js',
    chunkFilename: 'static/[name]/[name].[chunkhash:8].chunk.js',
    publicPath: publicPath
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]'
            }
          },
          {
            test: /\.(js|jsx|mjs)$/,
            loader: require.resolve('babel-loader'),
            options: {
              compact: true
            }
          },
          {
            test: /\.css$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  minimize: true,
                  sourceMap: false,
                  modules: true
                }
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-import'),
                    require('postcss-preset-env')({
                      browsers: ['ie >= 11', 'last 4 version']
                    }),
                    require('postcss-nested'),
                    require('postcss-flexbugs-fixes')
                  ]
                }
              }
            ],
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appEntry.appHtml
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};
