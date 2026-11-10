require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./db');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'Task Management API is running'
    });
});

app.get('/api/health/db', async (req, res) => {
    try {
        const result = await pool.query('SELECT 1 AS connected');

        res.json({
            status: 'success',
            message: 'PostgreSQL connection successful',
            database: result.rows[0].connected === 1
        });

    } catch (error) {
        console.error('Database connection error:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Database connection failed'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});