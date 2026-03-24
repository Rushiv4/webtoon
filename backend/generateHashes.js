const bcrypt = require('bcryptjs');

const generateHashes = async () => {
    const adminHash = await bcrypt.hash('adminpassword', 10);
    const userHash = await bcrypt.hash('userpassword', 10);
    console.log('Admin Hash:', adminHash);
    console.log('User Hash:', userHash);
};

generateHashes();
