const pool = require('./src/config/db');

const promote = async () => {
    try {
        await pool.query("UPDATE users SET role = 'admin' WHERE email = 'rdhane4@gmail.com'");
        console.log('Successfully promoted rdhane4@gmail.com to admin');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

promote();
