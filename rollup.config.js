import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import peerDeps from 'rollup-plugin-peer-deps-external';

export default {
  external: ['react'],
  input: 'src/index.jsx',
  output: [
    {
      format: 'es',
      file: 'dist/index.modern.js',
    },
    {
      format: 'cjs',
      file: 'dist/index.cjs',
    },
  ],
  plugins: [
    peerDeps(),
    babel({presets: ['@babel/preset-react']}),
    resolve(),
  ]
}