const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config();

module.exports = {
  entry: './src/client/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/[name].[contenthash].js',
    chunkFilename: 'js/[name].[contenthash].chunk.js',
    publicPath: '/',
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: false,
    crossOriginLoading: 'anonymous'
  },
  stats: {
    errorDetails: true
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      'react-icons/fa': false
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8kb - inline smaller images as data URLs
          }
        }
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 20000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // Get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/]([^\\/]+)([\\/]|$)/)[1];
            // Create a nice name for common packages like react, react-dom
            return `npm.${packageName.replace('@', '')}`;
          },
          priority: 20
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    },
    runtimeChunk: 'single'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/template.html',
      filename: 'index.html',  // Output to public directory
      publicPath: '/',
      scriptLoading: 'defer',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      }
    }),
    // Define environment variables for the client
    new webpack.DefinePlugin({
      // Don't redefine NODE_ENV as webpack sets it automatically based on mode
      'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || 'https://e-commerce-backend-iahp.onrender.com')
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/',
      serveIndex: true,
      watch: true,
    },
    port: 3001,
    open: true,
    hot: true,
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [
        { from: /./, to: '/index.html' }
      ]
    },
    devMiddleware: {
      publicPath: '/',
      writeToDisk: true,
      stats: {
        errorDetails: true
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      'Content-Security-Policy': "default-src 'self'; connect-src 'self' http://localhost:4000 https://e-commerce-backend-iahp.onrender.com; img-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com"
    },
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:4000',
        secure: false,
        changeOrigin: true
      }
    ]
  }
};
