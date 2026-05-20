import { serveStatic } from 'hono/bun';
import app from './app';

app.get("/assets/*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

const server = Bun.serve({
  fetch: app.fetch,
});

console.log(`Server running on port: ${server.port}`);
