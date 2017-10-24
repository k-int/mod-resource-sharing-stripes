const path = require('path');
const babelEs2015 = require('babel-preset-es2015');
const babelStage2 = require('babel-preset-stage-2');
const babelReact = require('babel-preset-react');

const babelConf = {
  presets: [
    babelEs2015,
    babelStage2,
    babelReact,
  ],
};

module.exports = [{
  entry: './app-resource-sharing/src/index.js',
  output: {
    path: path.resolve(__dirname, 'app-resource-sharing/dist'),
    filename: 'app-resource-sharing.js',
    library: 'appResourceSharing',
    libraryTarget: 'umd'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules(?!\/\@folio)/,
      use: {
        loader: 'babel-loader',
        options: babelConf,
      },
    },{
      test: /\.css$/,
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
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React'
    },
    lodash : {
      commonjs: "lodash",
      commonjs2: 'lodash',
      amd: "lodash",
      root: "_"
    }
  }
//},{
//  entry: './plugin-schema-forms/src/index.js',
//  output: {
//    path: path.resolve(__dirname, 'plugin-schema-forms/dist'),
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