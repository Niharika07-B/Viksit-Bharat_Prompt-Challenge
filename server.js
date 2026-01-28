// Simple HTTP Server for Viksit Vaani – SwarVyapaar
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8888;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
    let pathname = url.parse(req.url).pathname;
    
    // Default to index.html
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';
    
    // Security check - prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache'
            });
            res.end(data);
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Viksit Vaani – SwarVyapaar server running at:`);
    console.log(`📱 Local: http://localhost:${PORT}`);
    console.log(`🌐 Network: http://192.168.1.x:${PORT} (replace x with your IP)`);
    console.log(`\n🎯 Features available:`);
    console.log(`   🌐 Global Language Selector (7 languages)`);
    console.log(`   🎤 Unified Voice System (Speech + TTS)`);
    console.log(`   📱 Mobile Responsive Design`);
    console.log(`   🇮🇳 Republic Day Theme`);
    console.log(`\n⚡ Press Ctrl+C to stop the server`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});