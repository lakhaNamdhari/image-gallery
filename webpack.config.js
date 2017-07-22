
module.exports = {
	entry: './app/scripts/main.js',
	output: {
		filename: 'index.js',
    path: __dirname
	},
  devServer: {
    inline: true,
    port: 9123
  },
	module: {
		loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      { 
        test: /\.css$/,
        loader: "style-loader!css-loader" 
      }
    ]
	}
};