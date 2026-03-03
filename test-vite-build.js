import { build } from 'vite';
import fs from 'fs';

fs.writeFileSync('test-input.js', 'console.log(process.env.GEMINI_API_KEY);');

build({
  root: process.cwd(),
  build: {
    lib: { entry: 'test-input.js', formats: ['es'] },
    outDir: 'dist-test',
    emptyOutDir: true,
  },
  define: {
    'process.env.GEMINI_API_KEY': undefined,
  }
}).then(() => {
  console.log("Output:");
  console.log(fs.readFileSync('dist-test/test-input.js', 'utf-8'));
});
