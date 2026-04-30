const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname + '/.env' }); // load process.env.JWT_SECRET

async function testComment() {
    try {
        console.log('Generating temporary JWT token using secret:', process.env.JWT_SECRET ? 'Found' : 'Missing');
        const token = jwt.sign({ id: 6, username: 'mayur' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
        
        console.log('Sending POST request...');
        const res = await axios.post('http://localhost:5000/api/questions/1/comments', 
            { content: 'Test comment from script' },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Success:', res.data);
    } catch (err) {
        console.error('Failure:', err.response ? err.response.status : err.message);
        console.error('Data:', err.response ? err.response.data : '');
    }
}

testComment();
