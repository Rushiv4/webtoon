const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { protect, admin } = require('../middleware/authMiddleware');
const { createPaymentRecord, getPaymentsByUserId, getAllPayments } = require('../models/paymentModel');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order
router.post('/create-order', async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;

  try {
    console.log('Creating Razorpay order with amount:', amount);
    const options = {
      amount: parseInt(Math.round(amount * 100), 10), // Amount in lowest denomination
      currency,
      receipt,
    };
    console.log('Razorpay Options:', options);

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ message: 'Error creating Razorpay order', error });
  }
});

// Verify payment and record history
router.post('/verify', protect, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan_name, amount } = req.body;

  const sign = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest('hex');

  if (razorpay_signature === expectedSign) {
    try {
      // Save payment record to database
      const record = await createPaymentRecord(
        req.user.id,
        razorpay_order_id,
        razorpay_payment_id,
        plan_name || 'Premium',
        amount || 0,
        'INR'
      );
      res.json({ message: 'Payment verified successfully', success: true, payment: record });
    } catch (dbError) {
      console.error('DB Error saving payment:', dbError);
      // Payment was verified but DB save failed — still return success to user
      res.json({ message: 'Payment verified, but history save failed', success: true });
    }
  } else {
    res.status(400).json({ message: 'Invalid payment signature', success: false });
  }
});

// Get payment history for logged-in user
router.get('/history', protect, async (req, res) => {
  try {
    const payments = await getPaymentsByUserId(req.user.id);
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Error fetching payment history' });
  }
});

// Admin: Get all payment history
router.get('/report', protect, admin, async (req, res) => {
  try {
    const payments = await getAllPayments();
    res.json(payments);
  } catch (error) {
    console.error('Error fetching comprehensive payment report:', error);
    res.status(500).json({ message: 'Error fetching payment report' });
  }
});

module.exports = router;
