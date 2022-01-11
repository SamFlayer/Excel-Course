const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin'); // генерация html файла
const CopyPlugin = require("copy-webpack-plugin"); // копирование чего-либо (в нашем случае - картинок)
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // создание css файла для каждого файла js
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // очистка папки dist от старых файлов сборки

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production'

  const filename = ext => isProd ? `[name].[contenthash].bundle.${ext}` : `[name].bundle.${ext}`

  return {
    context: path.resolve(__dirname, 'src'), // контекст вебпака - все действия происходят в папке /src
    entry: {
      main: [ 
        'core-js/stable',
        'regenerator-runtime/runtime',  // точка входа
        './index.js'
      ], 
    },
    output: {
      path: path.resolve(__dirname, 'dist'), // папка, в которую будет попадать сгенерированный проект
      filename: filename('js')
    },
    resolve: {
      extensions: ['.js'], // позволяет писать короткий путь (/path/jsFile вместо /path/jsFile.js)
      alias: { 
        '@': path.resolve(__dirname, 'src'),                // '../../path/file' -> '@/path/file' - перенаправляем на нужную папку
        '@core': path.resolve(__dirname, 'src', 'core')     // удобно для обращения к папке без всяких точек :)
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html'
      }),
      new CopyPlugin({
        patterns: [
          { from: path.resolve(__dirname, 'src', './favicon/'), to: path.resolve(__dirname, 'dist/assets') }, // кладем все из папки favicon в dist/assets
        ],
      }),
      new MiniCssExtractPlugin({
        filename: filename('css')
      }),
      new CleanWebpackPlugin()
    ],
    devtool: isProd ? false : 'source-map',
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Загрузчик файлов css
            MiniCssExtractPlugin.loader,
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
      ],
    },
  }
}