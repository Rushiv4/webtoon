const pool = require('../config/db');

const createPaymentRecord = async (userId, razorpayOrderId, razorpayPaymentId, planName, amount, currency = 'INR') => {
  const result = await pool.query(
    `INSERT INTO payments (user_id, razorpay_order_id, razorpay_payment_id, plan_name, amount, currency)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, razorpayOrderId, razorpayPaymentId, planName, amount, currency]
  );
  return result.rows[0];
};

const getPaymentsByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

const getAllPayments = async () => {
  const result = await pool.query(
    `SELECT p.*, u.email as user_email, u.username 
     FROM payments p 
     JOIN users u ON p.user_id = u.id 
     ORDER BY p.created_at DESC`
  );
  return result.rows;
};

module.exports = {
  createPaymentRecord,
  getPaymentsByUserId,
  getAllPayments,
};
