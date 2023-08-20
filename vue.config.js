module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '^': {
        target: 'http://localhost:8080/',
        ws: true,
        changeOrigin: true
      },
    }
  }
}
