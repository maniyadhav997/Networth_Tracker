const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  itemDescription: String,  // Description of the item
  amount: Number,
  balance: Number,
  dueDate: Date,
  issueDate: { type: Date, default: Date.now },
  frequency: { type: String, enum: ['bi-weekly', 'monthly'], default: 'monthly' },  // Repayment frequency
  interestRate: { type: Number, default: 0 },  // Optional interest rate
  graceDays: { type: Number, default: 0 },  // Optional grace days
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  repayments: [{ amount: Number, date: Date }],
});

module.exports = mongoose.model('Loan', loanSchema);
