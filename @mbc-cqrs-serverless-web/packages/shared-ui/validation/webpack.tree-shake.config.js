
const path = require('path');
module.exports = {
  mode: 'production',
  entry: './tree-shake-test.js',
  output: {
    filename: 'tree-shake-bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    usedExports: true,
    sideEffects: false,
  },
};
