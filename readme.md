# React App Setup with Webpack and Babel

This guide will help you set up a SPA React project with Webpack and Babel from scratch.

## Steps

### 1. Initialize the Project
Initialize a new Node.js project by running the following command:

```bash
npm init -y
```
### 2. Install Dependencies
Install the necessary Dependencies to create a React App;
React, ReactDOM and <b>ReactRouterDom</b> (to configure the routing of the app)
```bash
npm install react react-dom react-router-dom
```
Install the development dependencies to transpile and run a React App correctly:
```bash
npm install --save-dev webpack webpack-cli webpack-dev-server @babel/core babel-loader @babel/preset-env @babel/preset-react html-webpack-plugin
```
### 3. Configure Babel
Create a .babelrc file in the root of your project
```babel
{ "presets": ["@babel/preset-env", "@babel/preset-react"] }
```

### 4. Configure Webpack
Create a webpack.config.js file in the root of your project
```webpack
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  }
};
```

### 5. Create Source Files
Create the necessary directories and files src/index.js, src/App.js, src/index.html

#### src/index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

#### src/index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

#### src/App.js
We add the <b>Router</b>, <b>Routes</b> and <b>Route</b> elements into the app.

```javascript
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const Home = () => <h1>Home Page</h1>;
const About = () => <h1>About Page</h1>;

const App = () => {
    return (
        <Router>
            <nav>
                <Link to="/">Home</Link> | <Link to="/about">About</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Router>
    );
};

export default App;
```

### 7. Add scripts to package.json
Update your package.json to include script for bulding and serving your app
```nodejs
"scripts": { "start": "webpack serve --mode development", "build": "webpack --mode production" }
```

### 8. Run your app
To start the development server
```nodejs
npm start
```
To create a production build
```nodejs
npm run build
```