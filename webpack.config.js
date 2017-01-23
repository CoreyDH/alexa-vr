module.exports = {
  entry: "./app/app.js",
  output: {
    filename: "public/assets/js/bundle.js"
  },
  module: {
    noParse: [
      /node_modules\/aframe\/dist\/aframe.js/,
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  devtool: '#eval-source-map'
}
