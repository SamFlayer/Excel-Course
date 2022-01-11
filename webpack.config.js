const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin'); // генерация html файла
const CopyPlugin = require("copy-webpack-plugin"); // копирование чего-либо (в нашем случае - картинок)

module.exports = {
  context: path.resolve(__dirname, 'src'), // контекст вебпака - все действия происходят в папке /src
  entry: {
    main: './index.js' // точка входа
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // папка, в которую будет попадать сгенерированный проект
    filename: '[name].bundle.js'
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
  ]
}