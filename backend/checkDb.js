const pool = require('./src/config/db');

const checkUsers = async () => {
    try {
        const [rows] = await pool.execute('SELECT username, email, password_hash FROM users');
        console.log('Current Users in DB:');
        console.table(rows);
        process.exit(0);
    } catch (err) {
        console.error('Error checking users:', err);
        process.exit(1);
    }
};

checkUsers();
