import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    build: {
        target: 'esnext'
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, './src/'),
            '@common': path.resolve(__dirname, './src/common/'),
            '@features': path.resolve(__dirname, './src/features/'),
            '@services': path.resolve(__dirname, './src/services/'),
            // '@utils': path.resolve(__dirname, './src/common/utils/'),
            '@components': path.resolve(__dirname, './src/common/components/'),
            '@interfaces': path.resolve(__dirname, './src/common/interfaces/'),
            // '@context': path.resolve(__dirname, './src/context/'),
            '@store': path.resolve(__dirname, './src/store/'),
            '@__generated__': path.resolve(__dirname, './src/__generated/')
        }
    },
    server: {
        open: true,
        port: 3000
    }
});
