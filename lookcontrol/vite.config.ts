import { defineConfig, loadEnv } from 'vite';
import type { ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carga todas las vars de entorno
  const env = loadEnv(mode, process.cwd(), '');
  Object.entries(env).forEach(([key, value]) => {
    process.env[key] ??= value;
  });

  const useApiRoute = (route: string, fileName: string) => ({
    name: `lookcontrol-${route.replace(/\W/g, '-')}`,
    configureServer(server: ViteDevServer) {
      server.middlewares.use(route, async (req: IncomingMessage, res: ServerResponse) => {
        const chunks: Buffer[] = [];

        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', async () => {
          const rawBody = Buffer.concat(chunks).toString('utf8');
          const body = rawBody ? JSON.parse(rawBody) : {};
          const apiPath = new URL(`./api/${fileName}`, import.meta.url).pathname;
          const { default: handler } = await import(apiPath);

          await handler(
            { method: req.method, body },
            {
              status(code: number) {
                res.statusCode = code;
                return this;
              },
              json(payload: unknown) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(payload));
              },
            },
          );
        });
      });
    },
  });

  return {
    plugins: [
      react(),
      useApiRoute('/api/contact', 'contact.js'),
      useApiRoute('/api/password-reset-request', 'password-reset-request.js'),
      useApiRoute('/api/password-reset-confirm', 'password-reset-confirm.js'),
    ],
    server: {
      proxy: {
        // Cambiamos el endpoint local a /api/grok
        '/api/groq': {
          target: 'https://api.groq.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/groq/, '/openai/v1/chat/completions'),
          configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
          proxyReq.setHeader('Authorization', `Bearer ${env.GROQ_API_KEY}`);
    });
  },
},
      },
    },
  };
});
