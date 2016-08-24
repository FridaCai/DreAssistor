var path = require('path');
var webpack = require("webpack");

var widgetPath = '/app/src/ui/widget';
var toolPath = '/app/src';

module.exports = {
    entry: {
        app:['./app/src/app.js'],
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
            { 
                test: /\.css$/, 
                loader: 'style!css'
            },
        ],
    },
    devtool: 'source-map',
    plugins: [
        new webpack.ProvidePlugin({
            React: "react",
            ReactDOM: "react-dom",
        })
    ],
   
    cache: false,
    resolve: {
        alias: {
            Util: path.join(__dirname, toolPath, "/util.js"),
            Signal: path.join(__dirname, toolPath, "/signal.js"),
            Request: path.join(__dirname, toolPath, "/request.js"),
            CDropDown: path.join(__dirname, widgetPath, "/dropdown/index.js"),
            Button: path.join(__dirname, widgetPath, "/button/index.js"),
            ComboBox: path.join(__dirname, widgetPath, "/combobox/index.js"),
            XlsIExport: path.join(__dirname, widgetPath, "/excel/index.js"),
            RadioGroup: path.join(__dirname, widgetPath, "/radiogroup/index.js"),
            Input: path.join(__dirname, widgetPath, "/input/index.js"),
            Label: path.join(__dirname, widgetPath, "/label/index.js"),
            MessageBox: path.join(__dirname, widgetPath, "/message/index.js"),
            Table: path.join(__dirname, widgetPath, "/table/index.js"),
            AttachmentList: path.join(__dirname, widgetPath, "/attachmentlist/index.js"),

        }
    }
};


