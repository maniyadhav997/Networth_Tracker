const Customer = require('../models/Customer');

exports.createCustomer = async (req, res) => {
  try {
    const customer = new Customer({ ...req.body, userId: req.user.id });
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add customer' });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user.id });
    res.json(customers);
  } catch {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch {
    res.status(400).json({ error: 'Failed to update customer' });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const result = await Customer.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!result) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
};
