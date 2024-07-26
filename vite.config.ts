import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [],
    base: '/PIKOlang/',
    build: {
        lib: {
            entry: 'src/main.ts',
            formats: ['es'],
        }
    }
});
