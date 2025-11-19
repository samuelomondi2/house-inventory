const express = require('express');

const { getAllUsers, getAllActiveUsers, getAllDeletedUsers, getAnActiveUser, createUser, softDeleteUser } = require('../controllers/user');

const router = express.Router();

// ========================
// USER FETCH ROUTES
// ========================
router.get('/users', getAllUsers);                   
router.get('/users/active', getAllActiveUsers);       
router.get('/users/deleted', getAllDeletedUsers);     
router.get('/user/active/:id', getAnActiveUser);      

// ========================
// USER POST ROUTES
// ========================
router.post('/user', createUser);

// ========================
// USER PATCH ROUTES
// ========================
router.patch('/user/:id/delete', softDeleteUser);

module.exports = router; 