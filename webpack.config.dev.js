module.exports = {
    entry: './src/Index.tsx',
    output: {
        filename: './dist/bundle.js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?.+)?$/,
                use : [ 
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'dist/'
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [ 
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                ]
            },
            {
                test: /\.tsx?$/,
                use: [
                    { loader: "ts-loader" },
                    { loader: "tslint-loader" }
                ]
            }
        ]
    }
};