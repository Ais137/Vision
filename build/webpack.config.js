import { resolve } from 'path';
import { fileURLToPath } from 'url';

export default {
    entry: './src/vision.js',
    output: {
        path: resolve(fileURLToPath(import.meta.url), '../../dist'),
        filename: 'vision-webpack.js',
        library: 'vision',
    },
    mode: "development",
};