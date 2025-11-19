// transactions.js (route)
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// Add transaction
router.post('/', auth, async (req, res) => {
    const { amount, category, type, description, person } = req.body;
    try {
      const newTransaction = new Transaction({
        user: req.user.id,
        amount,
        category,
        type,
        description,
        person,
      });
      const transaction = await newTransaction.save();
      res.json(transaction);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  // Get all transactions
  router.get('/', auth, async (req, res) => {
    try {
      const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
      res.json(transactions);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
 // Delete transaction
router.delete('/:id', auth, async (req, res) => {
    try {
      const transaction = await Transaction.findById(req.params.id);
      if (!transaction || transaction.user.toString() !== req.user.id) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      await transaction.deleteOne(); // Use deleteOne instead of remove
      res.json({ message: 'Transaction removed' });
    } catch (err) {
      console.error(`Error deleting transaction for user ${req.user.id}:`, err.message);
      res.status(500).send('Server error');
    }
  });
  
  
  
  module.exports = router;
  

