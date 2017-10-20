const path = require('path');
const babelEs2015 = require('babel-preset-es2015');
const babelReact = require('babel-preset-react');
const babelEnv = require('babel-preset-env');

const browserSupport = [
  'last 3 version',
  'ie >= 11',
];

const babelConf = {
  presets: [
    babelEs2015,
    [babelEnv, {
      targets: {
        browsers: browserSupport,
      },
    }],
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
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: babelConf,
      },
    }]
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React'
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