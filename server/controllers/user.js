const db = require('../config/db');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    const { household_name, firstname, lastname, email, phone_number, password, role = 3 } = req.body;

    try {
        // Check if email exists
        const checkEmailInSQL = 'SELECT id FROM houseinv.users WHERE email = ?';

        db.query(checkEmailInSQL, [email], async (err, existing) => {
            if (err) {
                console.error("Error checking existing user:", err);
                return res.status(500).json({ error: "Database error" });
            }

            if (existing.length > 0) {
                return res.status(409).json({ error: "Email already exists" });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            const sql = `INSERT INTO houseinv.users (household_name, firstname, lastname, email, phone_number, password, role)
                VALUES (?, ?, ?, ?, ?, ?, ?)`;

            const params = [ household_name, firstname, lastname, email, phone_number, hashedPassword, role ];

            db.query(sql, params, (err, result) => {
                if(err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).json({ error: "Error creating user" });
                }
                res.status(201).json({
                    message: 'User created successfully',
                    userId: result.insertId
                });
            })
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const loginUser = (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    };

    const sql = 'SELECT * FROM houseinv.users WHERE email = ? AND is_deleted = 0';

    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error("Error during login:", err);
            return res.status(500).json({ error: "Server error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "User not found or deleted" });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }

        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role
            }
        })
    })
}

const getAllUsers = (req, res) => {
    const sql = 'SELECT * FROM houseinv.users';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving data');
            return;
        }
        console.log('Data retrieved:', results); 
        res.json(results); 
    });
}

const getAllActiveUsers = (req, res) => {
    const sql = 'SELECT * FROM houseinv.users WHERE is_deleted = 0';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving data');
            return;
        }
        // console.log('Data retrieved:', results); 
        res.json(results); 
    });
}

const getAnActiveUser = (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT * FROM houseinv.users WHERE id = ? AND is_deleted = 0';

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error retrieving user');
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Active user not found' });
        }
        // console.log('Data retrieved:', results); 
        res.json(results);
    });
};

const getAllDeletedUsers = (req, res) => {
    const sql = 'SELECT * FROM houseinv.users WHERE is_deleted = 1';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving data');
            return;
        }
        // console.log('Data retrieved:', results); 
        res.json(results); 
    });
}

const softDeleteUser = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    const sql = 'UPDATE houseinv.users SET is_deleted = 1 WHERE Id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error soft deleting user:", err);
            return res.status(500).json({ error: "Error deleting user" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User soft deleted successfully" });
    });
}

module.exports = { getAllUsers, getAllActiveUsers, getAllDeletedUsers, getAnActiveUser, createUser, softDeleteUser, loginUser };