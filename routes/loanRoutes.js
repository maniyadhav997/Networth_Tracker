const express = require('express');
const auth = require('../middleware/authMiddleware');
const { createLoan, recordRepayment, getSummary, getAllLoans, getLoanSummary,getOverdueLoans } = require('../controllers/loanController');
const router = express.Router();

router.use(auth);
router.post('/', createLoan);
router.post('/repayment', recordRepayment);
router.get('/summary', getSummary);
router.get('/', getAllLoans);
router.get('/summary', getLoanSummary);
router.get('/overdue', getOverdueLoans);


module.exports = router;
