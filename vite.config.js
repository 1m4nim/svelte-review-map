import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  base: '/svelte-review-map/',
  plugins: [
    svelte({
      compilerOptions: {
        compatibility: {
          componentApi: 4, 
        },
      },
    }),
  ],
})
