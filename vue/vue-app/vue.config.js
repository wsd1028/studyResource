module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/carp-app/' : '/',
  productionSourceMap: false,
  lintOnSave: true,
  configureWebpack: {
    devServer: {
      port: 8855,
      proxy: {
        '/device': {
          target: 'http://192.168.31.6:9201',
          ws: true,
          changeOrigin: true,
          pathRewrite: {
            '^/carp': ''
          }
        },
        '/business': {
          target: 'http://192.168.31.8:9101',
          ws: true,
          changeOrigin: true,
          pathRewrite: {
            '^/carp': ''
          }
        },
        '/carp': {
          target: 'http://192.168.31.133:80',
          ws: true,
          changeOrigin: true,
          pathRewrite: {
            '^/carp': ''
          }
        }
      }
    }
  }
}
