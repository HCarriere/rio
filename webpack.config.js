const path = require('path');

module.exports = {
    mode: 'development',
    entry: './game',
    output: {
        filename: 'scripts.js',
        path: path.resolve(__dirname, 'views/assets/js/dist'),
    }
}