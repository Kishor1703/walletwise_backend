const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  amount: { type: String, required: true }, // 🔐 encrypted
  // category: { type: String },               // 🔐 encrypted
  type: { type: String, required: true },   // 🔐 encrypted
  description: { type: String },             // 🔐 encrypted
  person: { type: String, required: true },  // 🔐 encrypted

  settled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

/* 🔐 Encrypt BEFORE saving to DB */

/* 🔓 Decrypt AFTER fetching from DB */
transactionSchema.methods.toJSON = function () {
  const obj = this.toObject();

  obj.amount = Number(obj.amount);

  return obj;
};

module.exports = mongoose.model('Transaction', transactionSchema);
