import typescript from 'rollup-plugin-ts';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import bundleSize from 'rollup-plugin-bundle-size';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const prod = !process.env.ROLLUP_WATCH;

const builds = [
  {
    input: './src/index.ts',
    output: [
      prod && {
        file: 'dist/index.min.js',
        format: 'esm',
        sourcemap: prod,
        exports: 'named',
        plugins: [terser()],
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: prod,
        exports: 'named',
      },
    ],
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(
          prod ? 'production' : 'development'
        ),
        preventAssignment: true,
      }),
      resolve({ browser: true, exportConditions: prod ? [] : ['development'] }),
      commonjs(),
      typescript({ browserslist: false }),
      prod && bundleSize(),
    ],
  },
];

if (prod) {
  builds.push({
    input: './src/felte-form.ts',
    output: [
      {
        file: 'dist/felte-form.min.js',
        format: 'esm',
        sourcemap: prod,
        exports: 'named',
        plugins: [terser()],
      },
      {
        file: 'dist/felte-form.js',
        format: 'esm',
        sourcemap: prod,
        exports: 'named',
      },
    ],
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(
          prod ? 'production' : 'development'
        ),
        preventAssignment: true,
      }),
      resolve({ browser: true, exportConditions: prod ? [] : ['development'] }),
      commonjs(),
      typescript({ browserslist: false }),
      prod && bundleSize(),
    ],
  });

  builds.push({
    input: './src/felte-field.ts',
    output: [
      {
        file: 'dist/felte-field.min.js',
        format: 'esm',
        sourcemap: prod,
        exports: 'named',
        plugins: [terser()],
      },
      {
        file: 'dist/felte-field.js',
        format: 'esm',
        sourcemap: prod,
        exports: 'named',
      },
    ],
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(
          prod ? 'production' : 'development'
        ),
        preventAssignment: true,
      }),
      resolve({ browser: true, exportConditions: prod ? [] : ['development'] }),
      commonjs(),
      typescript({ browserslist: false }),
      prod && bundleSize(),
    ],
  });
}

export default builds;
