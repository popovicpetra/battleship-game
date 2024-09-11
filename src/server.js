const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

//Database
const mongoose = require('mongoose');
const cors = require('cors');
const SignedModel = require('../src/pages/LoginSignupPage/LoginServer/Signed');
app.use(express.json());

app.use(cors());

const server = http.createServer(app);
app.use(express.static(path.join(__dirname, '../build')));

//Database connection
mongoose
  .connect(
    'mongodb+srv://emilijasimic2002:emaema@cluster0.4yvw1.mongodb.net/Login?retryWrites=true&w=majority'
  )
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

server.listen(5000, () => {
  console.log('Server listening on port 5000');
});

const rooms = {};

io.on('connection', (socket) => {
  // let victory = false;
  let start = false;
  socket.on('join-room', (roomName) => {
    console.log('Client joining room:', roomName);
    if (!(roomName in rooms)) {
      rooms[roomName] = { players: [socket.id], playersReady: [false, false] };
      socket.data.roomName = roomName;
      socket.join(roomName);
      io.to(roomName).emit('joined-room');
    } else if (rooms[roomName].players.length === 1) {
      rooms[roomName].players.push(socket.id);
      socket.data.roomName = roomName;
      socket.join(roomName);
      io.to(roomName).emit('joined-room');
    } else if (rooms[roomName].players.length === 2) {
      socket.emit('room-full');
    }
    console.log(rooms);

    start = true;

    let connections = [false, false];
    if (rooms[roomName].players.length === 1) {
      connections = [true, false];
    } else if (rooms[roomName].players.length === 2) {
      connections = [true, true];
    }
    io.to(roomName).emit('check-players-reply', connections);

    if (rooms[roomName].players.length === 2) {
      const player1Id = rooms[roomName].players[0];
      const player2Id = rooms[roomName].players[1];

      io.to(player1Id).emit('turn', true);
      io.to(player2Id).emit('turn', false);
    }
  });

  socket.on('disconnect', () => {
    const roomName = socket.data.roomName;
    // if (victory) {
    //   // Ako je već emitovana pobeda, ne emituje 'end'
    //   console.log(`Pobeda već emitovana u sobi ${roomName}.`);
    //   return;
    // }
    //io.to(roomName).emit('end');
    // io.socketsLeave(roomName);
    io.in(roomName).disconnectSockets(true);
    delete rooms[roomName];
    console.log(rooms);
  });

  socket.on('ready', (roomName) => {
    if (!start || rooms[roomName].players.length !== 2) {
      socket.emit('not-ready');
      return;
    }
    const room = rooms[roomName];
    const playerIndex = room.players.indexOf(socket.id);

    if (playerIndex !== -1) {
      //za svaki slucaj
      room.playersReady[playerIndex] = true;
      io.to(roomName).emit('ready-reply', room.playersReady);
    }
  });

  socket.on('fire', (fieldId, roomName) => {
    socket.to(roomName).emit('fire', fieldId);
  });

  socket.on('fire-reply', (hit, roomName) => {
    socket.to(roomName).emit('fire-reply', hit);
  });

  socket.on('victory', (roomName) => {
    // victory = true;
    socket.to(roomName).emit('victory');
    //io.socketsLeave(roomName);
    //io.in(roomName).disconnectSockets(true);
    delete rooms[roomName];
    console.log(rooms);
  });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

//Database manipulating
app.post('/register', (req, res) => {
  const { user, _ } = req.body;

  SignedModel.findOne({ user }).then((signed) => {
    if (signed) {
      res.send('Korisnicko ime zauzeto');
    } else {
      SignedModel.create(req.body)
        .then((signed) => res.json(signed))
        .catch((err) => res.json(err));
    }
  });
});

app.post('/login', (req, res) => {
  const { user, password } = req.body;

  SignedModel.findOne({ user, password })
    .then((signed) => {
      if (signed) {
        res.json(signed); // User found, credentials are correct
      } else {
        res.status(401).json({ message: 'Invalid credentials' }); // User not found
      }
    })
    .catch((err) => res.status(500).json(err));
});

// app.listen(3000, () => {
//   console.log('server is running');
// });
