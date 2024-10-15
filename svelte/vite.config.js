import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [sveltekit()],
    resolve: {
        alias: {
            // This is if you're experiencing issues with importing CSS files
            '@': '/src',
        }
    },
    css: {
        preprocessorOptions: {
            css: {
                additionalData: `@import "beer-css/dist/cdn/beer.min.css";`
            }
        }
    }
});
