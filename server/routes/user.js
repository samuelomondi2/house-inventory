const express = require('express');

const { getAllUsers, getAllActiveUsers, getAllDeletedUsers, getAnActiveUser, createUser, softDeleteUser, loginUser } = require('../controllers/user');

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
router.post('/auth/register', createUser);
router.post('/auth/login', loginUser);

// ========================
// USER PATCH ROUTES
// ========================
router.patch('/user/:id/delete', softDeleteUser);

module.exports = router; 