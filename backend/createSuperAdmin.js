const bcrypt = require('bcryptjs');
const pool = require('./src/config/db');

const createAdmin = async () => {
    try {
        const username = 'superadmin';
        const email = 'superadmin@example.com';
        const password = 'adminpassword123';
        
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        
        // Check if exists
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length > 0) {
            // Update existing
            await pool.query(
                "UPDATE users SET password_hash = $1, role = 'admin' WHERE email = $2",
                [password_hash, email]
            );
            console.log('Admin account updated.');
        } else {
            // Insert
            await pool.query(
                "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, 'admin')",
                [username, email, password_hash]
            );
            console.log('Admin account created.');
        }

        console.log('\n--- Admin Credentials ---');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('-------------------------\n');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

createAdmin();
