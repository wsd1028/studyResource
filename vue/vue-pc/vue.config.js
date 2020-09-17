module.exports = {
  // publicPath: process.env.NODE_ENV === 'production' ? '/carp-web/' : '/',
  // publicPath: '/carp-web',
  lintOnSave: true,

  productionSourceMap: false,

  devServer: {
    port: 99,
    open: true,
    proxy: {
      '/carp/device': {
        target: 'http://192.168.31.6:9201/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/carp': ''
        }
      },
      '/carp/business': {
        target: 'http://192.168.31.8:9101/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/carp': ''
        }
      },
      '/carp': {
        target: 'http://192.168.31.133/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/carp': ''
        }
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: []
    }
  },

  configureWebpack: config => {
    config.entry.app = ['@babel/polyfill', './src/main.js']
  }
}
