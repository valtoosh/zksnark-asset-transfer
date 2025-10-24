const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Test server works!\n');
});

server.listen(5000, () => {
  console.log('Test server running on port 5000');
});

// Keep process alive
setInterval(() => {
  console.log('Still alive...');
}, 5000);
