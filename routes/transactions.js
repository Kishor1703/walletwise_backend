// transactions.js (route)
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// Add transaction
router.post('/', auth, async (req, res) => {
  const { amount, type, description, person } = req.body;
  const normalizedAmount = Number(amount);
  const normalizedType = typeof type === 'string' ? type.trim() : '';
  const normalizedDescription = typeof description === 'string' ? description.trim() : '';
  const normalizedPerson = typeof person === 'string' ? person.trim() : '';

  if (amount === undefined || amount === null || amount === '' || Number.isNaN(normalizedAmount) || normalizedAmount <= 0) {
    return res.status(400).json({ message: 'Amount is required' });
  }

  if (!normalizedType) {
    return res.status(400).json({ message: 'Type is required' });
  }

  if (!normalizedPerson) {
    return res.status(400).json({ message: 'Person is required' });
  }

  try {
    const newTransaction = new Transaction({
      user: req.user.id,
      amount: normalizedAmount.toString(),
      type: normalizedType,
      description: normalizedDescription || undefined,
      person: normalizedPerson,
    });

    const transaction = await newTransaction.save();
    res.json(transaction);
  } catch (err) {
    console.error('Error creating transaction:', err);
    res.status(500).json({
      message: 'Failed to add transaction',
      error: err.message,
    });
  }
});
  
  // Get all transactions
  router.get('/', auth, async (req, res) => {
    try {
      const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
      res.json(transactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      res.status(500).json({ message: 'Failed to fetch transactions', error: err.message });
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
      console.error(`Error deleting transaction for user ${req.user.id}:`, err);
      res.status(500).json({ message: 'Failed to delete transaction', error: err.message });
    }
  });
  
  
  
  module.exports = router;
  

