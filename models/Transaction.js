const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encryption');

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
transactionSchema.pre('save', function (next) {
  if (!this.isModified()) {
    return next();
  }

  if (this.isModified('amount')) {
    this.amount = encrypt(this.amount.toString());
  }

  // if (this.isModified('category') && this.category) {
  //   this.category = encrypt(this.category);
  // }

  if (this.isModified('type')) {
    this.type = encrypt(this.type);
  }

  if (this.isModified('description') && this.description) {
    this.description = encrypt(this.description);
  }

  if (this.isModified('person')) {
    this.person = encrypt(this.person);
  }

  next();
});

/* 🔓 Decrypt AFTER fetching from DB */
transactionSchema.methods.toJSON = function () {
  const obj = this.toObject();

  obj.amount = Number(decrypt(obj.amount));
  // obj.category = obj.category ? decrypt(obj.category) : obj.category;
  obj.type = decrypt(obj.type);
  obj.description = obj.description ? decrypt(obj.description) : obj.description;
  obj.person = decrypt(obj.person);

  return obj;
};

module.exports = mongoose.model('Transaction', transactionSchema);
