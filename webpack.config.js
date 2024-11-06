const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx", // Update entry point to TypeScript file
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, // Support TypeScript and TSX
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/, // Voor CSS-bestanden
        use: [
          "style-loader", // Voegt CSS toe aan de DOM
          "css-loader"    // Laadt CSS-bestanden
        ]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"] // Resolve these extensions
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ],
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 9001
  }
};
