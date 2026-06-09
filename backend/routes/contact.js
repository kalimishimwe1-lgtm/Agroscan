// Contact Routes
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Submit contact form
router.post('/submit', async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    try {
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        const [result] = await pool.query(
            'INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject, message]
        );
        
        res.status(201).json({
            message: 'Message sent successfully',
            submissionId: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all contact submissions (admin only)
router.get('/submissions', async (req, res) => {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;
    
    try {
        let query = 'SELECT * FROM contact_submissions';
        let params = [];
        
        if (status) {
            query += ' WHERE status = ?';
            params.push(status);
        }
        
        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);
        
        const [submissions] = await pool.query(query, params);
        
        res.json({
            submissions,
            pagination: { page, limit }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark submission as read
router.put('/:submissionId/read', async (req, res) => {
    const { submissionId } = req.params;
    
    try {
        await pool.query(
            'UPDATE contact_submissions SET status = ? WHERE id = ?',
            ['read', submissionId]
        );
        
        res.json({ message: 'Submission marked as read' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add response to submission
router.put('/:submissionId/respond', async (req, res) => {
    const { submissionId } = req.params;
    const { response } = req.body;
    
    try {
        await pool.query(
            'UPDATE contact_submissions SET status = ?, response = ? WHERE id = ?',
            ['responded', response, submissionId]
        );
        
        res.json({ message: 'Response added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
