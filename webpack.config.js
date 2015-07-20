var webpack = require('webpack');

module.exports = {
  entry: "./server.js",
  output: {
    filename: "public/bundle.js"
  },
  module: {
    loaders: [
      { test: /\.js$/, 
      	exclude: /node_modules/, 
      	loader: 'babel-loader'
     	}
    ]
  },
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ["node_modules"]
  },
  exclude: {
    extensions: ['.json']
  }
};