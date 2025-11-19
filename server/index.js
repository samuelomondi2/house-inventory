require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/user');

const app = express();
const port = process.env.PORT 

app.use(express.json());

app.use('/api', userRoutes);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});