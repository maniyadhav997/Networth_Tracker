const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  trustScore: { type: Number, min: 0, max: 10, required: true },
  creditLimit: { type: Number, required: true }
});

module.exports = mongoose.model('Customer', customerSchema);
