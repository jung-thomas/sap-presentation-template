import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    include: ['tests/**/*.test.ts', 'scripts/**/*.test.ts', 'theme/**/*.test.ts'],
    environment: 'happy-dom',
    coverage: { provider: 'v8', reporter: ['text', 'html'] }
  }
})
