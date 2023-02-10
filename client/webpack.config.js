const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HTMLInlineScriptPlugin = require('html-inline-script-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'index.ts'),
    mode: 'production',
    output: {
        filename: 'js/bundle.js',
        path: path.resolve(__dirname, '..', 'public')
    },
    resolve: {
        extensions: ['.ts', '.glsl']
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader"
            },
            {
                test: /\.glsl?$/,
                use: path.resolve(__dirname, 'loaders', 'glsl')
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'index2.html'),
            inject: 'body'
        }),
        new HTMLInlineScriptPlugin({
            scriptMatchPattern: [/bundle\.js/]
        })
    ]
};