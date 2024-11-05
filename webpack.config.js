const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

//const mode = process.env.NODE_ENV || 'development';
const mode = 'production';
const prod = mode === 'production';

module.exports = {
    output: {
        path: path.resolve(__dirname, "www/webpack/"),
        filename: "main.js",
        library: {
            name: 'cap',
            type: 'var',
        }
    },
    entry: {
        'build/bundle': ['./src/main.js', "./src/index.js"]
    },
    resolve: {
        extensions: ['.mjs', '.js', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main'],
        conditionNames: ['svelte', 'browser']
    },
    module: {
        rules: [
            {
                test: /\.svelte$/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        compilerOptions: {
                            dev: !prod
                        },
                        emitCss: prod,
                        hotReload: !prod
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },
    mode,
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ],
    devtool: prod ? false : 'source-map',
    devServer: {
        hot: true,
        static: {
            directory: path.join(__dirname, 'public'),
        }
    }
};
