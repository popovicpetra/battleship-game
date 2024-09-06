const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require('path');

app.use(cors());

const server = http.createServer(app);
app.use(express.static(path.join(__dirname, '../build')));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
   
  },
});

server.listen(5000, () => {
  console.log('Server listening on port 5000');
});

const rooms = {};

io.on('connection', (socket) => {
  let victory= false;
  let start = false;
  socket.on('join-room',roomName=>{
    console.log('Client joining room:', roomName);
      if(!(roomName in rooms)){
        rooms[roomName] = { players: [socket.id], playersReady: [false, false] };
        socket.data.roomName = roomName;
        socket.join(roomName);
      }else if (rooms[roomName].players.length === 1) {
        rooms[roomName].players.push(socket.id);
        socket.data.roomName = roomName;
        socket.join(roomName);
      }else if(rooms[roomName].players.length === 2){
        socket.emit('room-full');
      }
      console.log(rooms);

      start= true;

      let connections=[false,false]
      if(rooms[roomName].players.length === 1){
        connections=[true,false];
      }else if(rooms[roomName].players.length === 2){
        connections=[true,true]; 
      }
      io.to(roomName).emit('check-players-reply',connections);

      if(rooms[roomName].players.length === 2){
        const player1Id = rooms[roomName].players[0];
        const player2Id = rooms[roomName].players[1];

        io.to(player1Id).emit('turn', true);
        io.to(player2Id).emit('turn', false);
      }
    })

  

    socket.on('disconnect',()=>{
      const roomName = socket.data.roomName;
       if (victory) {
      // Ako je već emitovana pobeda, ne emituje 'end'
      console.log(`Pobeda već emitovana u sobi ${roomName}.`);
      return;
      }
      //io.to(roomName).emit('end');
     // io.socketsLeave(roomName);
      io.in(roomName).disconnectSockets(true);
      delete rooms[roomName];
      console.log(rooms);
    })
  

  socket.on('ready',(roomName)=>{
     if(!start || rooms[roomName].players.length !== 2){
       socket.emit('not-ready');
       return;
     }
    const room = rooms[roomName];
    const playerIndex = room.players.indexOf(socket.id);
    
    if (playerIndex !== -1) { //za svaki slucaj
      room.playersReady[playerIndex] = true;
      io.to(roomName).emit('ready-reply', room.playersReady);
    }
  })

  socket.on('fire', (fieldId, roomName)=>{
    socket.to(roomName).emit('fire', fieldId);
  })

  socket.on('fire-reply', (hit, roomName)=>{
   
    socket.to(roomName).emit('fire-reply', hit);
  })

  socket.on('victory',roomName=>{
    victory= true;
    socket.to(roomName).emit('victory');
    //io.socketsLeave(roomName);
    io.in(roomName).disconnectSockets(true);
    delete rooms[roomName];
    console.log(rooms)
  })
  
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});





