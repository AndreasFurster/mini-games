const { group } = require('console');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "https://mini-games.andreasfurster.nl",
    methods: ["GET", "POST"]
  }
});

// TODO: Store in DB?
const connectionInfo = {}
const roomInfo = {}

// New websocket connection
io.on('connection', (socket) => {
  console.log('a user connected');

  connectionInfo[socket.id] = {}
  
  socket.on('room/join', roomId => {
    // Leave current room
    const currentRoomId = connectionInfo[socket.id].roomId
    if(currentRoomId)
    {
      socket.leave(currentRoomId)
      roomInfo[currentRoomId].userCount -= 1

      if(roomInfo[currentRoomId].userCount < 1) {
        delete roomInfo[currentRoomId]
        console.log(`Deleted empty room ${currentRoomId}`);
      }
    }
   
    // Join/create new one
    socket.join(roomId)

    connectionInfo[socket.id].roomId = roomId
    
    if(!roomInfo[roomId]) {
      roomInfo[roomId] = {
        userCount: 0
      }
    }

    roomInfo[roomId].userCount += 1
    roomInfo[roomId].lastJoined = socket.id

    console.log(`User joined room ${roomId}`);

    // Transmit new info to entire group 
    socket.to(roomId).emit('room/info', roomInfo[roomId])
  })

  // User changes info about group
  socket.on('room/info', info => {
    const roomId = connectionInfo[socket.id].roomId
    if(roomId) {
      Object.assign(roomInfo[roomId], info)
      socket.broadcast.to(roomId).emit('room/info', info)
    }      
  })

   // User requests info about group
   socket.on('room/info/get', () => {
    const roomId = connectionInfo[socket.id].roomId
    if(roomId) {
      socket.emit('room/info', roomInfo[roomId])
    }
    else {
      socket.emit('room/error', 'notInRoom')
    }
  })

  // User transmitting data to all members of room
  socket.on('room/data', data => {
    const roomId = connectionInfo[socket.id].roomId
    data.info = roomInfo[roomId]

    if(roomId && data.alsoSendToMe) {
      socket.to(roomId).emit('room/data', data);
    }
    else if(roomId) {
      socket.broadcast.to(roomId).emit('room/data', data);
    }
    else {
      socket.emit('room/error', 'notInRoom')
    }
  });

  // User disconnected
  socket.on('disconnect', () => {
    const roomId = connectionInfo[socket.id].roomId
    
    if(roomId) {
      roomInfo[roomId].userCount -= 1

      if(roomInfo[roomId].userCount < 1) {
        delete roomInfo[roomId]
        console.log(`Deleted empty room ${roomId}`);
      }
    }

    delete connectionInfo[socket.id];
    console.log('user disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('<h1>What are you doing here? Pls just go back.</h1>');
});

const port = process.env.PORT|| 3000
server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});