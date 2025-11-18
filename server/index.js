const express = require('express');
const db = require('./database/db');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());

const PORT = 3500;

// GET users
app.get('/api/users', (req, res) => {
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

// Add users
app.post('/api/users', async (req, res) => {
    try {
        const { household_name, firstname, lastname, email, phone_number, password, role = 3 } = req.body;
        const hashed = await bcrypt.hash(password, 10);

        const sql = `INSERT INTO houseinv.users (household_name, firstname, lastname, email, phone_number, password, role)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const params = [ household_name, firstname, lastname, email, phone_number, hashed, role ];

        db.query(sql, params, ( err,results ) => {
            if(err) {
                console.error("Error inserting data:", err);
                return res.status(500).json({ error: "Error inserting data" });
            }
            return res.status(201).json({ message: "Data posted successfully" });
        })
       
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});