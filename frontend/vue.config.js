module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    proxy: {
      '/poa': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/poa': '/v1'
        }
      },
      '/inventory': {
        target: 'http://localhost:3128',
        changeOrigin: true,
        pathRewrite: {
          '^/inventory': ''
        }
      },
    }
  }
}
