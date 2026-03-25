const pool = require('../config/db');

const createPaymentRecord = async (userId, razorpayOrderId, razorpayPaymentId, planName, amount, currency = 'INR') => {
  const result = await pool.query(
    `INSERT INTO payment_history (user_id, razorpay_order_id, razorpay_payment_id, plan_name, amount, currency)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, razorpayOrderId, razorpayPaymentId, planName, amount, currency]
  );
  return result.rows[0];
};

const getPaymentsByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM payment_history WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

module.exports = {
  createPaymentRecord,
  getPaymentsByUserId,
};
