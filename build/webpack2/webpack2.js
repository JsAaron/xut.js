// var path = require('path');
import webpack from "webpack";
import path from "path"


webpack({
  entry: "./src/lib/index.js",
  output: {
    filename: "bundle.js", // string
    path: path.resolve(__dirname, "dist"), // string
    publicPath: "/", // string
    library: "Aaron", // string,
    libraryTarget: "commonjs2" // universal module definition
  },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: "babel-loader",
        options: {
          presets: ["es2015"]
        }
      }],
      exclude: /node_modules/
    }]
  }


}, (err, stats) => {
  if (err || stats.hasErrors()) {
    // Handle errors here
  }
  // Done processing
});
