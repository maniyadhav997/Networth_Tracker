const Loan = require('../models/Loan');
const moment = require('moment');
const Customer = require('../models/Customer');

exports.createLoan = async (req, res) => {
  const {
    customerId,
    itemDescription,
    amount,
    dueDate,
    frequency,
    interestRate,
    graceDays,
  } = req.body;

  try {
    const loan = await Loan.create({
      user: req.user._id, // Injected by auth middleware
      customerId,
      itemDescription,
      amount,
      balance: amount,
      dueDate,
      frequency,
      interestRate,
      graceDays,
    });

    res.status(201).json({ loan });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create loan', error });
  }
};


exports.getSummary = async (req, res) => {
  const customers = await Customer.find({ userId: req.user._id });
  const customerIds = customers.map(c => c._id);
  const loans = await Loan.find({ customerId: { $in: customerIds } });

  const totalLoaned = loans.reduce((sum, l) => sum + l.amount, 0);
  const totalCollected = loans.reduce((sum, l) => sum + (l.amount - l.balance), 0);
  const overdue = loans.filter(l => l.dueDate < new Date() && l.status !== 'paid')
    .reduce((sum, l) => sum + l.balance, 0);

  res.json({ totalLoaned, totalCollected, overdue });
};

exports.getAllLoans = async (req, res) => {
  try {
    // Fetch loans for the logged-in user
    const loans = await Loan.find({ user: req.user.id }).populate('customerId');

    // Filter loans by status (active loans are those with status 'pending' or 'overdue')
    const activeLoans = loans.filter(loan => loan.status !== 'paid');

    res.status(200).json(activeLoans);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch loans', error });
  }
};



exports.recordRepayment = async (req, res) => {
  const { loanId, amount } = req.body;

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Add repayment to the list
    const repayment = {
      amount,
      date: new Date()
    };
    loan.repayments.push(repayment);

    // Update balance
    loan.balance -= amount;
    if (loan.balance <= 0) {
      loan.balance = 0;
      loan.status = 'paid';
    } else {
      loan.status = 'pending';
    }

    await loan.save();

    res.status(200).json({ message: 'Repayment recorded', loan });
  } catch (error) {
    res.status(500).json({ message: 'Failed to record repayment', error });
  }
};

exports.getLoanSummary = async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user._id });
    const customerIds = customers.map(c => c._id);

    const loans = await Loan.find({ customerId: { $in: customerIds } });

    const totalLoaned = loans.reduce((sum, l) => sum + l.amount, 0);
    const totalCollected = loans.reduce((sum, l) => sum + (l.amount - l.balance), 0);
    const overdue = loans
      .filter(l => l.dueDate < new Date() && l.status !== 'paid')
      .reduce((sum, l) => sum + l.balance, 0);

    // Avg repayment time
    const repaidLoans = loans.filter(l => l.status === 'paid');
    const avgRepaymentTime = repaidLoans.length > 0
      ? (repaidLoans.reduce((sum, l) => {
          const first = new Date(l.createdAt);
          const last = new Date(l.repayments[l.repayments.length - 1].date);
          return sum + (last - first);
        }, 0) / repaidLoans.length) / (1000 * 60 * 60 * 24) // in days
      : 0;

    res.status(200).json({
      totalLoaned,
      totalCollected,
      overdue,
      avgRepaymentTime: avgRepaymentTime.toFixed(2) + ' days'
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get summary', error });
  }
};

exports.getOverdueLoans = async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user._id });
    const customerIds = customers.map(c => c._id);

    const overdueLoans = await Loan.find({
      customerId: { $in: customerIds },
      dueDate: { $lt: new Date() },
      status: { $ne: 'paid' }
    }).populate('customerId');

    res.status(200).json({ overdueLoans });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get overdue loans', error });
  }
};
