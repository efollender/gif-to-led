var webpack = require('webpack');

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "public/bundle.js"
  },
  module: {
    loaders: [
      { test: /\.js$/, 
      	exclude: /node_modules/, 
      	loader: 'babel-loader'
     	},
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader?paths=node_modules/foundation/stylus'
      },
      { test: /\.css$/, loader: 'css-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.png$/, loader: "url-loader?limit=100000" },
      { test: /\.jpg$/, loader: "file-loader" }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.styl'],
    modulesDirectories: ["node_modules"]
  },
  exclude: {
    extensions: ['.json']
  }
};