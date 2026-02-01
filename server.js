import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// API proxy for development - adjust this to your backend URL
const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';
console.log(`Proxying API requests to: ${API_URL}`);

// Proxy API requests
app.use('/api', createProxyMiddleware({
  target: API_URL,
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
}));

// Proxy WebSocket connections
app.use('/socket.io', createProxyMiddleware({
  target: API_URL,
  changeOrigin: true,
  ws: true,
}));

// For all other routes, serve the SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: ${API_URL}`);
});