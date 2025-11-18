const { Router } = require('express');
const db = require('../config/db');

const router = Router();

router.get('/users', (req, res) => {
    const sql = 'SELECT * FROM houseinv.users';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving data');
            return;
        }
        // console.log('Data retrieved:', results);
        res.json(results); 
    });
});

// router.post('/user', (req, res) => {

// });

// router.put()

// router.delete()

module.exports = router; 