var path = require('path');
var webpack = require("webpack");

var widgetPath = '/app/src/ui/widget';
var toolPath = '/app/src';
var configPath = '/app/src/config';


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
        root: path.resolve('./app/src'),
        alias: {
            Util: path.join(__dirname, toolPath, "/util.js"),
            Signal: path.join(__dirname, toolPath, "/signal.js"),
            Request: path.join(__dirname, toolPath, "/request.js"),
            TmpUtil: path.join(__dirname, toolPath, "/util.tmp.js"),
            Button: path.join(__dirname, widgetPath, "/button/index.js"),
            Checkbox: path.join(__dirname, widgetPath, "/checkbox/index.js"),
            Group: path.join(__dirname, widgetPath, "/group/index.js"),
            ComboBox: path.join(__dirname, widgetPath, "/combobox/index.js"),
            Time: path.join(__dirname, widgetPath, "/time/index.js"),
            XlsIExport: path.join(__dirname, widgetPath, "/excel/index.js"),
            RadioGroup: path.join(__dirname, widgetPath, "/radiogroup/index.js"),
            Input: path.join(__dirname, widgetPath, "/input/index.js"),
            Label: path.join(__dirname, widgetPath, "/label/index.js"),
            MessageBox: path.join(__dirname, widgetPath, "/message/index.js"),
            Table: path.join(__dirname, widgetPath, "/table/index.js"),
            AttachmentList: path.join(__dirname, widgetPath, "/attachmentlist/index.js"),
            Tree: path.join(__dirname, widgetPath, "/tree/index.js"),
            Pagination: path.join(__dirname, widgetPath, "/pagination/index.js"),
            Loading: path.join(__dirname, widgetPath, "/loading/index.js"),
            CurveComponent: path.join(__dirname, widgetPath, "/curve/index.js"),
            LoadingMask: path.join(__dirname, widgetPath, "/loadingmask/index.js"),
            TextArea: path.join(__dirname, widgetPath, "/textarea/index.js"),
            ColorPicker: path.join(__dirname, widgetPath, "/colorpicker/index.js"),
            ContextMenu: path.join(__dirname, widgetPath, "/contextmenu/index.js"),
            ProjectTemplate: path.join(__dirname, configPath, "/template_project.json"),
            TaskTemplate: path.join(__dirname, configPath, "/template_task.json"),
            CurveTemplate: path.join(__dirname, configPath, "/template_curve.json"),
            DropDownOptions: path.join(__dirname, configPath, "/dropdown.json")
        }
    }
};


