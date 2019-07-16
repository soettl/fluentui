const path = require('path');
const resources = require('../../scripts/webpack/webpack-resources');

const BUNDLE_NAME = 'lists';
const IS_PRODUCTION = true;

module.exports = resources.createServeConfig({
  entry: './src/demo/index.tsx',

  output: {
    filename: 'demo-app.js'
  },

  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },

  resolve: {
    alias: {
      '@uifabric/lists/src': path.join(__dirname, 'src'),
      '@uifabric/lists/lib': path.join(__dirname, 'lib'),
      '@uifabric/lists': path.join(__dirname, 'lib'),
      'Props.ts.js': 'Props',
      'Example.tsx.js': 'Example'
    }
  }
});
