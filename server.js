const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 10000; // Changed to match the port in your screenshot

// Define MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// Helper function to serve a file
const serveFile = (filePath, res) => {
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      console.error(`Error reading file ${filePath}:`, error);

      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end(`File not found: ${filePath}`);
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      console.log(`Successfully served: ${filePath}`);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
};

const server = http.createServer((req, res) => {
  console.log(`Request URL: ${req.url}`);

  // Special handling for dist directory requests
  if (req.url.startsWith('/dist/')) {
    const distFilePath = path.join(__dirname, 'public', req.url);
    console.log(`Serving dist file: ${distFilePath}`);
    serveFile(distFilePath, res);
    return;
  }

  // Get the file path from the URL
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

  // If the path doesn't have an extension, serve index.html for client-side routing
  if (!path.extname(filePath)) {
    filePath = path.join(__dirname, 'public', 'index.html');
  }

  // Serve the file
  serveFile(filePath, res);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});
