import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/ADS-Web-Final-Project--MinsuFacultyWorkloadClassScheduler--BACKEND',
        changeOrigin: true,
      },
    },
  },
})