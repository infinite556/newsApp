import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],
    server: {
      proxy: {
        "/api/news": {
          target: "https://newsdata.io",
          changeOrigin: true,
          rewrite: (path) => {
            const url = new URL(path, "http://localhost");
            url.pathname = "/api/1/latest";
            if (env.NEWSDATA_API_KEY) {
              url.searchParams.set("apikey", env.NEWSDATA_API_KEY);
            }
            return `${url.pathname}${url.search}`;
          },
        },
      },
    },
  };
});
