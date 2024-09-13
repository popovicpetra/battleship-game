const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const SignedModel = require('./Signed');

const app = express();
app.use(express.json());
app.use(cors());

//const signedInUsers = [];

//mongoose.connect('mongodb+srv://emilijasimic2002:emaema@cluster0.4yvw1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
mongoose
  .connect(
    'mongodb+srv://emilijasimic2002:emaema@cluster0.4yvw1.mongodb.net/Login?retryWrites=true&w=majority'
  )
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

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

  // signedInUsers.forEach((element) => {
  //   if (element.user == user) {
  //     console.log('korisnik je vec ulogovan');
  //     res.send('Ovaj korisnik je vec ulogovan');
  //     logged = true;
  //   }
  // });

  SignedModel.findOne({ user, password })
    .then((signed) => {
      if (signed) {
        res.json(signed); // User found, credentials are correct
        //signedInUsers.push({ user, password });
      } else {
        res.status(401).json({ message: 'Invalid credentials' }); // User not found
      }
    })
    .catch((err) => res.status(500).json(err));
});

app.listen(3001, () => {
  console.log('server is running');
});
