// User Routes
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { pool } = require('../config/database');

// Get user profile
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    
    try {
        const [rows] = await pool.query(
            'SELECT id, username, email, first_name, last_name, phone, location, user_type, profile_image, bio, created_at FROM users WHERE id = ?',
            [userId]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user profile
router.put('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName, phone, location, bio } = req.body;
    
    try {
        await pool.query(
            'UPDATE users SET first_name = ?, last_name = ?, phone = ?, location = ?, bio = ? WHERE id = ?',
            [firstName, lastName, phone, location, bio, userId]
        );
        
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Change password
router.post('/:userId/change-password', async (req, res) => {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    try {
        const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const validPassword = await bcrypt.compare(currentPassword, rows[0].password);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
        
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user statistics
router.get('/:userId/stats', async (req, res) => {
    const { userId } = req.params;
    
    try {
        const [scans] = await pool.query(
            'SELECT COUNT(*) as total_scans FROM scans WHERE user_id = ?',
            [userId]
        );
        
        const [diseases] = await pool.query(
            'SELECT COUNT(DISTINCT disease_name) as diseases_detected FROM detection_results dr JOIN scans s ON dr.scan_id = s.id WHERE s.user_id = ?',
            [userId]
        );
        
        res.json({
            total_scans: scans[0].total_scans,
            diseases_detected: diseases[0].diseases_detected
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
