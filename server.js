const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let documentContent = '';
let documentTitle = 'Untitled Document';
let users = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', (username) => {
    users[socket.id] = username;
    socket.emit('load', { content: documentContent, title: documentTitle });
    io.emit('active-users', Object.values(users));
    socket.broadcast.emit('user-joined', username);
  });

  socket.on('edit-document', ({ content, username }) => {
    documentContent = content;
    socket.broadcast.emit('update-document', { content, username });
  });

  socket.on('edit-title', (title) => {
    documentTitle = title;
    socket.broadcast.emit('update-title', title);
  });

  socket.on('typing', (username) => {
    socket.broadcast.emit('show-typing', username);
  });

  socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    io.emit('active-users', Object.values(users));
    socket.broadcast.emit('user-left', username);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
