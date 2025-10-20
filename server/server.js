import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
app.get('/', (_req, res) => res.send('Signaling server up'));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET','POST'] }
});

const rooms = new Map(); // roomId -> Set(socketId)

io.on('connection', (socket) => {
  // join room
  socket.on('join-room', ({ roomId, name }) => {
    socket.data.name = name || 'Guest';
    socket.join(roomId);

    if (!rooms.has(roomId)) rooms.set(roomId, new Set());
    rooms.get(roomId).add(socket.id);

    // inform existing users about the new user
    socket.to(roomId).emit('user-joined', { socketId: socket.id, name: socket.data.name });

    // send current participants to the new user
    const peers = [...rooms.get(roomId)].filter(id => id !== socket.id);
    io.to(socket.id).emit('participants', peers.map(id => ({ socketId: id })));

    socket.data.roomId = roomId;
  });

  // sdp/ice signaling
  socket.on('offer', ({ to, sdp }) => io.to(to).emit('offer', { from: socket.id, sdp }));
  socket.on('answer', ({ to, sdp }) => io.to(to).emit('answer', { from: socket.id, sdp }));
  socket.on('ice-candidate', ({ to, candidate }) => io.to(to).emit('ice-candidate', { from: socket.id, candidate }));

  // chat
  socket.on('chat-message', ({ roomId, text }) => {
    socket.to(roomId).emit('chat-message', { from: from || socket.data.name, text, at: Date.now() });
  });

  // leave / disconnect
  const leave = () => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    socket.leave(roomId);
    socket.to(roomId).emit('user-left', { socketId: socket.id });
    if (rooms.has(roomId)) {
      rooms.get(roomId).delete(socket.id);
      if (rooms.get(roomId).size === 0) rooms.delete(roomId);
    }
    socket.data.roomId = null;
  };

  socket.on('leave-room', leave);
  socket.on('disconnect', leave);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('Signaling listening on', PORT));
