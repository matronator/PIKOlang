import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [],
    base: '/PIKOlang/',
    build: {
        lib: {
            entry: resolve(__dirname, 'lib/main.ts'),
            formats: ['es']
        },
    }
});
