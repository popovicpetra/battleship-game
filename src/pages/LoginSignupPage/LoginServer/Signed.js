const mongoose = require('mongoose');

const SignedSchema = new mongoose.Schema({
  user: String,
  email: String,
  password: String,
});

const SignedModel = mongoose.model('signed', SignedSchema);
module.exports = SignedModel;
