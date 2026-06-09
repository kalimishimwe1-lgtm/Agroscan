// Scan Routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { pool } = require('../config/database');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files allowed'));
    }
});

// Upload and analyze crop image
router.post('/upload', upload.single('image'), async (req, res) => {
    const { userId, cropId, notes } = req.body;
    
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        // Insert scan record
        const [result] = await pool.query(
            'INSERT INTO scans (user_id, crop_id, image_path, upload_notes, status) VALUES (?, ?, ?, ?, ?)',
            [userId, cropId, req.file.path, notes, 'pending']
        );
        
        res.status(201).json({
            message: 'Image uploaded successfully',
            scanId: result.insertId,
            imagePath: req.file.path
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get scan history
router.get('/history/:userId', async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    try {
        const [scans] = await pool.query(
            `SELECT s.*, c.crop_name 
             FROM scans s 
             JOIN crops c ON s.crop_id = c.id 
             WHERE s.user_id = ? 
             ORDER BY s.scan_date DESC 
             LIMIT ? OFFSET ?`,
            [userId, parseInt(limit), offset]
        );
        
        const [countResult] = await pool.query(
            'SELECT COUNT(*) as total FROM scans WHERE user_id = ?',
            [userId]
        );
        
        res.json({
            scans,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: countResult[0].total,
                pages: Math.ceil(countResult[0].total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get scan details
router.get('/:scanId', async (req, res) => {
    const { scanId } = req.params;
    
    try {
        const [scan] = await pool.query(
            `SELECT s.*, c.crop_name 
             FROM scans s 
             JOIN crops c ON s.crop_id = c.id 
             WHERE s.id = ?`,
            [scanId]
        );
        
        if (scan.length === 0) {
            return res.status(404).json({ error: 'Scan not found' });
        }
        
        const [results] = await pool.query(
            'SELECT * FROM detection_results WHERE scan_id = ?',
            [scanId]
        );
        
        res.json({
            scan: scan[0],
            detections: results
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete scan
router.delete('/:scanId', async (req, res) => {
    const { scanId } = req.params;
    
    try {
        await pool.query('DELETE FROM scans WHERE id = ?', [scanId]);
        res.json({ message: 'Scan deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
