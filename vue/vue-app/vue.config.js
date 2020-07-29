module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/carp-app/' : '/',
  configureWebpack: {
    devServer: {
      port: 8855,
      proxy: {
        '/business': {
          target: 'http://192.168.31.8:9101',
          ws: true,
          changeOrigin: true,
          pathRewrite: {
            '^/carp': ''
          }
        },
        '/device': {
          target: 'http://192.168.31.119:9201',
          ws: true,
          changeOrigin: true,
          pathRewrite: {
            '^/carp': ''
          }
        },
        '/carp': {
          target: 'http://192.168.31.118:80',
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
