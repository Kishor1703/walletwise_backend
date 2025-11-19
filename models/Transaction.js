const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String },
  type: { type: String, enum: ['income', 'expense', 'lending', 'returning'], required: true },
  description: { type: String },
  person: { type: String, required: true },
  settled: { type: Boolean, default: false }, // For lending/returning
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
