import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },

      "/websocket":{
        // target: "ws://user-center:8081", //这里是后台ws访问地址
        target: "ws://localhost:8081", //这里是后台ws访问地址
        changeOrigin: true, //允许跨域设置
        ws: true, //websocket代理设置
        rewrite: (path)=> path.replace(/~\/websocket/,""), //拦截路径去除
      },
    }
  },

  plugins: [vue()],
})

