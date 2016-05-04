var path = require('path');

module.exports = {
    entry: {
        app:['./app/src/app.js']
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

            {
              test: /\.scss$/,
              loader: 'style!css!sass',
            },
        ],
    },
    devtool: 'source-map',
    plugins: [],
};
