import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/widget.ts'),
            name: 'APIVerseWidget',
            fileName: (format) => `apiverse-widget.js`,
            formats: ['umd']
        },
        outDir: 'dist',
        sourcemap: true
    }
});
