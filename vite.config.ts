import { defineConfig } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Icons from 'unplugin-icons/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    Icons({ compiler: 'jsx', jsx: 'react', scale: 1 }),
    viteReact(),
  ],
})

export default config
