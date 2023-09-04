import { defineConfig } from 'vite'

// https://vitejs.dev/config/

// Library build
export default defineConfig({
  build: {
    lib: {
      entry: 'src/paltas-note.ts',
      formats: ['es'],
    },
    minify: false,
    // rollupOptions: {
    //   external: /^lit/,
    // },
  },
})

// Application build
// export default defineConfig({});
