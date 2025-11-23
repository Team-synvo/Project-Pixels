
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;
const VISITS_FILE = path.join(__dirname, 'visits.json');

// Initialize visits counter
let visitorCount = 0;

// Load existing visitor count from file
function loadVisitorCount() {
  try {
    if (fs.existsSync(VISITS_FILE)) {
      const data = fs.readFileSync(VISITS_FILE, 'utf8');
      const parsed = JSON.parse(data);
      visitorCount = parsed.total || 0;
      console.log(`📊 Loaded visitor count: ${visitorCount}`);
    }
  } catch (error) {
    console.error('Error loading visitor count:', error);
    visitorCount = 0;
  }
}

// Save visitor count to file
function saveVisitorCount() {
  try {
    fs.writeFileSync(VISITS_FILE, JSON.stringify({ total: visitorCount }), 'utf8');
  } catch (error) {
    console.error('Error saving visitor count:', error);
  }
}

// Initialize on startup
loadVisitorCount();

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // API endpoint to increment visitor count
  if (req.method === 'POST' && req.url === '/api/visit') {
    visitorCount++;
    saveVisitorCount();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, total: visitorCount }));
    return;
  }

  // API endpoint to get current visitor count
  if (req.method === 'GET' && req.url === '/api/visits') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ total: visitorCount }));
    return;
  }

  // Serve static files
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);
  
  const extname = path.extname(filePath);
  const contentType = mimeTypes[extname] || 'text/plain';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + err.code, 'utf-8');
      }
    } else {
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✨ JBAFF server running at http://0.0.0.0:${PORT}/`);
  console.log(`📖 Open your browser to view the site`);
});
