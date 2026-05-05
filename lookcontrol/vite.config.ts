import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carga todas las vars de entorno
  const env = loadEnv(mode, process.cwd(), '');
  Object.entries(env).forEach(([key, value]) => {
    process.env[key] ??= value;
  });

  return {
    plugins: [
      react(),
      {
        name: 'lookcontrol-contact-api',
        configureServer(server) {
          server.middlewares.use('/api/contact', async (req, res) => {
            const chunks: Buffer[] = [];

            req.on('data', (chunk: Buffer) => chunks.push(chunk));
            req.on('end', async () => {
              const rawBody = Buffer.concat(chunks).toString('utf8');
              const body = rawBody ? JSON.parse(rawBody) : {};
              const contactApiPath = new URL('./api/contact.js', import.meta.url).pathname;
              const { default: handler } = await import(contactApiPath);

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
      },
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
