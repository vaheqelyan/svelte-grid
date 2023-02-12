import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import pkg from './package.json'
import autoPreprocess from 'svelte-preprocess'
import typescript from '@rollup/plugin-typescript'

const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase())

const production = process.env.NODE_ENV !== 'development'

export default [
  {
    input: 'src/index.svelte',
    output: [
      { file: pkg.module, format: 'es' },
      { file: pkg.main, format: 'umd', name },
    ],
    plugins: [
      svelte({
        preprocess: autoPreprocess(),
      }),
      resolve(),
      commonjs(),
      typescript({ sourceMap: !production }),
    ],
  },
  {
    input: './src/utils/helper.js',
    output: [
      { file: 'build/helper/index.mjs', format: 'es' },
      { file: 'build/helper/index.js', format: 'umd', name: 'gridHelper' },
    ],
  },
]
