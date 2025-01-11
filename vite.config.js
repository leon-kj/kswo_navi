import mkcert from 'vite-plugin-mkcert'

export default {
  build: {
    sourcemap: true,
  },
  server: {
    host: true,
    https: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8174',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [mkcert()]
}
