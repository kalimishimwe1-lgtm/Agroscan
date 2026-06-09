// Disease Routes
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Get all diseases
router.get('/', async (req, res) => {
    const { cropId, riskLevel } = req.query;
    
    try {
        let query = 'SELECT * FROM diseases WHERE 1=1';
        let params = [];
        
        if (cropId) {
            query += ' AND crop_id = ?';
            params.push(cropId);
        }
        
        if (riskLevel) {
            query += ' AND risk_level = ?';
            params.push(riskLevel);
        }
        
        const [diseases] = await pool.query(query, params);
        res.json(diseases);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get disease by ID
router.get('/:diseaseId', async (req, res) => {
    const { diseaseId } = req.params;
    
    try {
        const [rows] = await pool.query(
            `SELECT d.*, c.crop_name 
             FROM diseases d 
             JOIN crops c ON d.crop_id = c.id 
             WHERE d.id = ?`,
            [diseaseId]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Disease not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search diseases by name
router.get('/search/:query', async (req, res) => {
    const { query } = req.params;
    
    try {
        const [diseases] = await pool.query(
            `SELECT d.*, c.crop_name 
             FROM diseases d 
             JOIN crops c ON d.crop_id = c.id 
             WHERE d.disease_name LIKE ? OR d.scientific_name LIKE ?`,
            [`%${query}%`, `%${query}%`]
        );
        
        res.json(diseases);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get diseases for a crop
router.get('/crop/:cropId', async (req, res) => {
    const { cropId } = req.params;
    
    try {
        const [diseases] = await pool.query(
            'SELECT * FROM diseases WHERE crop_id = ? ORDER BY risk_level DESC',
            [cropId]
        );
        
        res.json(diseases);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get disease statistics
router.get('/stats/overview', async (req, res) => {
    try {
        const [totalDiseases] = await pool.query('SELECT COUNT(*) as count FROM diseases');
        const [highRisk] = await pool.query('SELECT COUNT(*) as count FROM diseases WHERE risk_level = "high"');
        const [mediumRisk] = await pool.query('SELECT COUNT(*) as count FROM diseases WHERE risk_level = "medium"');
        const [lowRisk] = await pool.query('SELECT COUNT(*) as count FROM diseases WHERE risk_level = "low"');
        
        res.json({
            total_diseases: totalDiseases[0].count,
            high_risk: highRisk[0].count,
            medium_risk: mediumRisk[0].count,
            low_risk: lowRisk[0].count
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
