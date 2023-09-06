import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/

// Library build
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PaltaNote',
      fileName: format => `palta-note.${format}.js`,
    },
    minify: false,
    rollupOptions: {
      external: [],
      plugins: [dts()],
    },
    // rollupOptions: {
    //   external: /^lit/,
    // },
  },
})

// Application build
// export default defineConfig({});
