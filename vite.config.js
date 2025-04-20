import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  alias: {
    '@': '/src', // Alias para la carpeta src
  },
})
