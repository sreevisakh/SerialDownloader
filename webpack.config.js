var webpack = require('webpack');
module.exports = {
    devtool: 'source-map',
    entry: './src/client/app.js',
    output: {
        filename: "bundle.js",
        publicPath: "/"
    },
    devServer: {
        inline: true,
        contentBase: './lib/client'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /(node_modules)/,
            loader: 'babel',
            query: {
                presets: ['react', 'es2015'],
                plugins: ["transform-regenerator", "transform-function-bind", "react-hot-loader/babel"]
            }
        }]
    }
};