const webpack = require("webpack");
const path = require("path");
const NgAnnotatePlugin = require("ng-annotate-webpack-plugin");
const RemcalcPlugin = require("less-plugin-remcalc");

module.exports = {
    entry: path.join(__dirname, "tmp/js/index.js"),
    mode: "development",
    output: {
        path: path.join(__dirname, "dist/client/app"),
        filename: "bundle.js"
    },
    plugins: [
        new webpack.ProvidePlugin({
            _: "lodash",
            Chart: "chart.js/dist/Chart.min.js",
            moment: "moment"
        }),
        new NgAnnotatePlugin({
            add: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|assets)/,
                use: [
                    // {
                    //     loader: 'angular-template-url-loader',
                    //     options: { basePath: path.join(__dirname, "./client/app") }
                    // },
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"],
                            plugins: [require("@babel/plugin-syntax-dynamic-import").default]
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                loader: "raw-loader"
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "less-loader", // compiles Less to CSS
                        options: {
                            plugins: [
                                RemcalcPlugin
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]"
                    },
                },
            },
            {
                test: /\.svg$/,
                loader: "svg-inline-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS
                ]
            },
            {
                test: /\.xml$/,
                loader: path.resolve("loaders/translations.js")
            }
        ]
    },
    resolve: {
        alias: {
            angular: path.join(__dirname, "./node_modules/angular"),
            lodash: path.join(__dirname, "./node_modules/lodash"),
            "angular-translate": path.join(__dirname, "./node_modules/angular-translate"),
            Assets: path.resolve(__dirname, "client/assets/")
        },
        modules: ["node_modules", "client/app"]
    },
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    }
}
