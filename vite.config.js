import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'

// 引用path
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias:{
            "~":path.resolve(__dirname,"src")
        }
    },
// 开发环境跨域
    server:{
        proxy:{
          '/api': {
            target: 'http://ceshi13.dishait.cn',
            // target: 'http://sceshi14.dishait.cn',
            secure: false,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          },
        }
      },

    plugins: [vue(),
            WindiCSS(),            
],
})
