const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const aiCallRoutes = require('./routes/aiCallRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/ai-call', aiCallRoutes);

app.get('/', (req, res) => {
    res.send('DBMS Quora API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
