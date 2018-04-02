import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/vue-model-x.js',
      format: 'cjs',
      sourcemap: 'inline'
    },
    {
      file: 'dist/vue-model-x.esm.js',
      format: 'es',
      sourcemap: 'inline'
    }
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ],
  external: ['vue']
};
