import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/jovanfidello',
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: {
      host: '20.5.250.178',
      protocol: 'wss', // Ensure it uses WebSocket Secure (wss)
    },
  },
})
