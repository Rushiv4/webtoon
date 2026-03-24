const axios = require('axios');

async function testFavorite() {
    const baseURL = 'http://localhost:5000/api';
    const testEmail = `test_${Date.now()}@example.com`;
    const testPass = 'password123';
    
    try {
        console.log('Registering new test user...');
        const uniqueName = `testuser_${Date.now()}`;
        const regRes = await axios.post(`${baseURL}/auth/register`, {
            username: uniqueName,
            email: testEmail,
            password: testPass
        });
        const token = regRes.data.token;
        console.log('Registration successful, token received.');

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const testId = '32d76d19-8a05-4db0-9fc2-e0b0648fe9d0'; // Solo Leveling
        const testTitle = 'Solo Leveling (Test)';
        const testCover = 'test-cover.jpg';

        console.log(`Checking if ${testId} is favorite...`);
        const checkRes = await axios.get(`${baseURL}/users/favorites/external/check/${testId}`, config);
        console.log('Initial check:', checkRes.data);

        console.log('Toggling favorite...');
        const toggleRes = await axios.post(`${baseURL}/users/favorites/external`, {
            externalId: testId,
            title: testTitle,
            coverUrl: testCover
        }, config);
        console.log('Toggle response:', toggleRes.data);

        console.log('Checking again...');
        const checkRes2 = await axios.get(`${baseURL}/users/favorites/external/check/${testId}`, config);
        console.log('Second check:', checkRes2.data);

        console.log('Getting all external favorites...');
        const favsRes = await axios.get(`${baseURL}/users/favorites/external`, config);
        console.log('All favorites:', favsRes.data.map(f => f.external_id));

    } catch (error) {
        console.error('Test failed:', error.response?.data || error.message);
    }
}

testFavorite();
