import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    server: {
        host: '127.0.0.1',

        fs: {
            allow: ['D:/laragon/www/inthekostmadiun'],
        },
    },

    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.jsx',
            ],
            ssr: 'resources/js/ssr.jsx',

            refresh: true,

            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                    optimizedFallbacks: false,
                }),
            ],
        }),

        inertia(),

        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),

        tailwindcss(),

        wayfinder({
            formVariants: true,
        }),
    ],
});