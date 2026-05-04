const http = require('http');
const net = require('net');

const server = http.createServer((req, res) => {
  let targetPort = 5173; // frontend default
  
  if (req.url.startsWith('/api')) {
    targetPort = 8000;
  } else if (req.url.startsWith('/intel')) {
    targetPort = 8080;
  }
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} -> port ${targetPort}`);
  
  const options = {
    hostname: '127.0.0.1',
    port: targetPort,
    path: req.url,
    method: req.method,
    headers: req.headers
  };
  
  const proxy = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  
  proxy.on('error', (err) => {
    console.error('Proxy error:', err.message);
    res.writeHead(502);
    res.end('Bad Gateway');
  });
  
  req.pipe(proxy);
});

server.listen(3000, () => {
  console.log('✅ Proxy server running on http://localhost:3000');
  console.log('   Routes: /api/* → :8000, /intel/* → :8080, else → :5173');
});
