import { Plugin, defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';
async function realGslsl(): Promise<Plugin> {
    const glsl = await import('vite-plugin-glsl');

    return glsl.default();
}
export default defineConfig({
    plugins: [
        /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
        // devtools(),
        solidPlugin(),
        realGslsl(),
    ],
    server: {
        port: 3000,
    },
    build: {
        target: 'esnext',
    },
});
