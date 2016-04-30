var path = require('path');

module.exports = {
    entry: {
        main:['./app/src/main.js']
    },
    output: {
        path: './app/tmp',
        filename: '[name].bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/, // A regexp to test the require path. accepts either js or jsx
                exclude: /node_modules/,
                loaders: ['babel-loader'],
            },
            {
              test: /\.less$/,
              loader: 'style!css!less',
            },
        ],
    },
    devtool: 'source-map',
    plugins: [],
};
