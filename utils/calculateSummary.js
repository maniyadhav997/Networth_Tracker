const Loan = require('../models/Loan');
const Customer = require('../models/Customer');

const calculateSummary = async (userId) => {
  const customers = await Customer.find({ userId });
  const customerIds = customers.map(customer => customer._id);
  
  const loans = await Loan.find({ customerId: { $in: customerIds } });

  let totalLoaned = 0;
  let totalCollected = 0;
  let overdueAmount = 0;
  let totalRepaymentTime = 0;
  let repaymentCount = 0;

  loans.forEach(loan => {
    totalLoaned += loan.amount;
    totalCollected += loan.amount - loan.balance;

    // Check if overdue
    if (loan.dueDate < new Date() && loan.status !== 'paid') {
      overdueAmount += loan.balance;
      loan.status = 'overdue'; // optional auto-tagging
      loan.save(); // auto-update
    }

    // Calculate average repayment time
    loan.repayments.forEach(repayment => {
      const diff = new Date(repayment.date) - new Date(loan.createdAt);
      totalRepaymentTime += diff;
      repaymentCount += 1;
    });
  });

  const avgRepaymentTimeDays = repaymentCount > 0
    ? Math.round(totalRepaymentTime / repaymentCount / (1000 * 60 * 60 * 24))
    : 0;

  return {
    totalLoaned,
    totalCollected,
    overdueAmount,
    avgRepaymentTimeDays
  };
};

module.exports = calculateSummary;
