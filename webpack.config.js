const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
    entry: {
        app: ['./src/index.tsx']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[contenthash].bundle.js',
        publicPath: '/',
        sourceMapFilename: "map/[name].[contenthash]"
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        alias: {
            '@': resolve('src'),
            '@api': resolve('src/api'),
            '@components': resolve('src/components'),
            '@routers': resolve('src/routers'),
            '@views': resolve('src/views'),
            '@utils': resolve("src/utils"),
            '@models': resolve("src/models"),
            '@store': resolve("src/store")
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    "presets": ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"]
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    devServer: {
        static: './public',
        port: 8082, // 端口号
        //inline: true,
        hot: true,
        historyApiFallback: true,
        host: 'local-chat.baobte.com',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebPackPlugin({
            template: "./public/index.html",
            filename: 'index.html'
        }),
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            "React": "react",
        }),
        new CopyWebpackPlugin([{
            from: resolve("./public"),
            to: resolve("./dist"),//放到output文件夹下
            globOptions: {
                dot: true,
                gitignore: false,
                ignore: [ // 配置不用copy的文件
                    '**/index.html'
                ]
            }
        }])
    ],
    externals: {
        WebConfig: "WebConfig"
    },
    //productionSourceMap: false//不生成map文件
};