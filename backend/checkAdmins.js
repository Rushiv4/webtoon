const pool = require('./src/config/db');

const checkAdmins = async () => {
    try {
        const { rows } = await pool.query("SELECT username, email, role FROM users");
        console.log('All users:');
        console.table(rows);
        const admins = rows.filter(r => r.role === 'admin');
        if (admins.length > 0) {
            console.log('\nAdmin Users:');
            console.table(admins);
        } else {
            console.log('\nNo admin users found in the database. You will need to promote one.');
        }
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

checkAdmins();
