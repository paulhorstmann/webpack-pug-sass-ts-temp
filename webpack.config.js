const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const getAllPugFiles = function (dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            arrayOfFiles = getAllPugFiles(dirPath + '/' + file, arrayOfFiles);
        } else {
            if (file.match(/\.pug$/) && file[0] !== '_') {
                arrayOfFiles.push(
                    path
                        .join(dirPath, '/', file)
                        .replaceAll('\\', '/')
                        .replaceAll('src/', '')
                        .replace('.pug', '')
                );
            }
        }
    });

    return arrayOfFiles;
};

const pugFiles = getAllPugFiles('./src');

const multiplePugPlugins = pugFiles.map((name) => {
    return new HtmlWebpackPlugin({
        template: `./src/${name}.pug`,
        filename: `${name}.html`,
        chunks: ['bundel', name],
    });
});

const targetTsFileToPug = () => {
    let res = new Object();
    res.bundel = path.resolve(__dirname, 'src/global.ts');

    pugFiles.forEach((file) => {
        res[file] = path.resolve(__dirname, 'src/' + file + '.ts');
    });
    return res;
};

module.exports = {
    mode: 'development',
    entry: targetTsFileToPug,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true,
        assetModuleFilename: '[name][ext]',
    },
    devtool: 'source-map',
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        port: 80,
        watchFiles: ['src/**/*.pug'],
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.sass$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.pug$/,
                use: [
                    {
                        loader: 'pug-loader',
                    },
                ],
            },
            {
                test: /\.(png|svg|jpg|jepg)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [].concat(multiplePugPlugins),
};
