import * as fs from 'fs';
import * as path from 'path';

import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

const env = process.env.NODE_ENV;
const package_json = JSON.parse(
  fs.readFileSync(path.resolve(path.join(__dirname, 'package.json')), 'utf8')
);

const SharedConfig = {
  name: package_json.name,
  minify: env === 'production',
  dts: false,
  clean: false,
  sourcemap: true,
  outDir: path.resolve(path.join(__dirname, 'assets/js')),
  entry: ['src/front-end/main.ts'],
  format: 'cjs',
  // format: 'esm',
} as Options;

export default defineConfig(Object.assign({}, SharedConfig));
