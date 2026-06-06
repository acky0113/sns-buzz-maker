import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react'; // ← これがReactを動かすための必須パーツ！

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'], // 読み込むファイルを app.jsx に指定
            refresh: true,
        }),
        react(), // ← プラグインを有効化
    ],
});