const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

/** /

// Use the below once we can upgrade core to 2.9.0
const { options: babelConf }= require('stripes-core/webpack/babel-loader-rule.js');

/*/
const babelConf = {
  presets: [
    [require.resolve('babel-preset-env'), { modules: false }],
    [require.resolve('babel-preset-stage-2')],
    [require.resolve('babel-preset-react')],
  ],
};
/**/

module.exports = [{
  entry: './app-resource-sharing/src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist/app-resource-sharing'),
    filename: 'app-resource-sharing.min.js',
    library: 'appResourceSharing',
    libraryTarget: 'umd'
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'app-resource-sharing/package.json' }
    ]),
    new ExtractTextWebpackPlugin("styles.css"),
//    new webpack.optimize.UglifyJsPlugin({
//      minimize: true,
//      include: /\.js$/,
//    })
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules(?!\/\@folio)/,
      use: {
        loader: 'babel-loader',
        options: babelConf,
      },
    },{
      test: /bootstrap\.css$/,
      use: [
        {
          loader: 'style-loader'
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: function () {
              return [
                require('postcss-import'),
                require('postcss-url'),
                require("autoprefixer"),
                require("postcss-custom-properties"),
                require("postcss-calc"),
                require("postcss-nesting"),
                require("postcss-custom-media"),
                require("postcss-media-minmax"),
                require("postcss-color-function"),
                require('postcss-prefixwrap')('.kint')
              ];
            }
          }
        }
      ]
    },{
      test: /\.css$/,
      exclude: /bootstrap\.css$/,
      use: [
        {
          loader: 'style-loader'
        },
        {
          loader: 'css-loader?modules&localIdentName=[local]---[hash:base64:5]'
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: function () {
              return [
                require('postcss-import'),
                require('postcss-url'),
                require("autoprefixer"),
                require("postcss-custom-properties"),
                require("postcss-calc"),
                require("postcss-nesting"),
                require("postcss-custom-media"),
                require("postcss-media-minmax"),
                require("postcss-color-function")
              ];
            }
          }
        }
      ]
    }]
  },
  externals: {
    'react': {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React'
    },
    'lodash': {
      commonjs: "lodash",
      commonjs2: 'lodash',
      amd: "lodash",
      root: "_"
    },
//    'query-string': {
//      commonjs: "query-string",
//      commonjs2: 'query-string',
//      amd: "query-string"
//    },
//    'react-router-dom': {
//      commonjs: "react-router-dom",
//      commonjs2: 'react-router-dom',
//      amd: "react-router-dom"
//    },
//    'prop-types': {
//      commonjs: "prop-types",
//      commonjs2: 'prop-types',
//      amd: "prop-types"
//    }
  }
//},{
//  entry: './plugin-schema-forms/src/index.js',
//  output: {
//    path: path.resolve(__dirname, 'dist/plugin-schema-forms'),
//    filename: 'plugin-schema-forms.js',
//    library: 'pluginSchemaForm',
//    libraryTarget: 'umd'
//  },
//  module: {
//    rules: [{
//      test: /\.js$/,
//      exclude: /node_modules/,
//      use: {
//        loader: 'babel-loader',
//        options: babelConf,
//      },
//    }]
//  },
//  externals: {
//    react: {
//      commonjs: 'react',
//      commonjs2: 'react',
//      amd: 'react',
//      root: 'React'
//    }
//  }
}];