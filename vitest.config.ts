import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Tell Vue not to warn about unregistered ui5-* custom elements —
          // they are real browser custom elements registered at runtime by
          // @ui5/webcomponents but unavailable in the happy-dom test env.
          isCustomElement: (tag: string) => tag.startsWith('ui5-')
        }
      }
    })
  ],
  test: {
    include: ['tests/**/*.test.ts', 'scripts/**/*.test.ts', 'theme/**/*.test.ts'],
    environment: 'happy-dom',
    coverage: { provider: 'v8', reporter: ['text', 'html'] }
  }
})
