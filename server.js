const net = require('net');

const server = net.createServer();

const PORT = 8080;
const HOST = '20.192.170.8';

// clients is an array of sockets
const clients = [];

server.on('connection', (socket) => {
  const clientId = clients.length + 1;

  // broadcast the message to all clients when a new client joins
  clients.map((client) =>
    client.socket.write(`> User ${clientId} has joined the chat.`)
  );

  socket.write(`id - ${clientId}`);

  socket.on('data', (data) => {
    // broadcast the message to all clients
    const dataString = data.toString('utf-8');

    const id = dataString.substring(0, dataString.indexOf(' - '));

    const message = dataString.substring(dataString.indexOf(' - ') + 2);

    clients.map((client) => client.socket.write(`> User ${id} - ${message}`));
  });

  // broadcast the message to all clients when a client leaves
  socket.on('end', () => {
    clients.map((client) =>
      client.socket.write(`> User ${clientId} has left the chat.`)
    );
  });

  clients.push({ id: clientId.toString, socket });
});

server.listen(PORT, HOST, () => {
  console.log('Opened server on', server.address());
});
