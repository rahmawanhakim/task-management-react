const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const { search, status, priority, sortBy, order } = req.query;

        let query = 'SELECT * FROM tasks';
        const values = [];
        const conditions = [];

        if (search) {
            values.push(`%${search}%`);
            conditions.push(
                `(title ILIKE $${values.length} OR description ILIKE $${values.length})`
            );
        }

        if (status) {
            values.push(status);
            conditions.push(`status = $${values.length}`);
        }

        if (priority) {
            values.push(priority);
            conditions.push(`priority = $${values.length}`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const allowedSortColumns = [
            'id',
            'title',
            'status',
            'priority',
            'created_at',
            'updated_at'
        ];

        const sortColumn = allowedSortColumns.includes(sortBy)
            ? sortBy
            : 'created_at';

        const sortOrder = ['asc', 'desc'].includes(order?.toLowerCase())
            ? order.toLowerCase()
            : 'desc';

        query += ` ORDER BY ${sortColumn} ${sortOrder}`;

        const result = await pool.query(query, values);

        res.json({
            status: 'success',
            data: result.rows
        });
    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch tasks'
        });
    }
});

// Get task by ID
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE id = $1',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Task not found'
            });
        }

        res.json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch task'
        });
    }
});

// Create task
router.post('/', async (req, res) => {
    try {
        const {
            title,
            description,
            status = 'pending',
            priority = 'medium',
            due_date = null
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                status: 'error',
                message: 'Title is required'
            });
        }

        const result = await pool.query(
            `INSERT INTO tasks
                (title, description, status, priority, due_date)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [title.trim(), description || null, status, priority, due_date]
        );

        res.status(201).json({
            status: 'success',
            message: 'Task created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            status: 'error',
            message: 'Failed to create task'
        });
    }
});

// Update task
router.put('/:id', async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            priority,
            due_date
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                status: 'error',
                message: 'Title is required'
            });
        }

        const result = await pool.query(
            `UPDATE tasks
             SET title = $1,
                 description = $2,
                 status = $3,
                 priority = $4,
                 due_date = $5,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $6
             RETURNING *`,
            [
                title.trim(),
                description || null,
                status,
                priority,
                due_date || null,
                req.params.id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Task not found'
            });
        }

        res.json({
            status: 'success',
            message: 'Task updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            status: 'error',
            message: 'Failed to update task'
        });
    }
});

// Delete task
router.delete('/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 RETURNING *',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Task not found'
            });
        }

        res.json({
            status: 'success',
            message: 'Task deleted successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            status: 'error',
            message: 'Failed to delete task'
        });
    }
});



module.exports = router;