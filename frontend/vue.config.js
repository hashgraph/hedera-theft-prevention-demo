module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    port: process.env.VUE_APP_PORT,
    proxy: {
      '/poa': {
        target: process.env.VUE_APP_POA_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/poa': '/v1'
        }
      },
      '/inventory': {
        target: process.env.VUE_APP_SOR_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/inventory': ''
        }
      },
    }
  }
}
