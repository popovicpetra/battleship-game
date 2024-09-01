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
let players=[null,null];
let playersReady=[false,false]
io.on('connection', (socket) => {
  
  let count=-1;
  for(let i=0;i<=1;i++){
    if(players[i]==null){
      count=i;
      players[i]=i;
      break;
    }
  }

  
  if(count==-1){
    return;
  }

  if(count==1){
    socket.emit('turn', false);
    socket.broadcast.emit('turn',true)
  }

  socket.on('disconnect',()=>{
    players[count]=null;
    playersReady[count]=false;
  })
  
  socket.on('check-players',()=>{
    let connections=[false,false];
    for(let i =0; i<2;i++){
      if(players[i]!==null){
        connections[i]=true;
      }
    }
    io.sockets.emit('check-players-reply',connections)
   //console.log(connections)
  })

  socket.on('ready',()=>{
    
    playersReady[count]=true;
    
    io.sockets.emit('ready-reply',playersReady)
    console.log(playersReady);
  })

  socket.on('fire', fieldId=>{
    socket.broadcast.emit('fire',fieldId)
  })

  socket.on('fire-reply', hit=>{
    console.log(hit)
    socket.broadcast.emit('fire-reply', hit)
  })
  
});




