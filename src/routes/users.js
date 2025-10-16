const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile
} = require('../controllers/userController');
const { protect, authorize, resourceOwnerOrAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Public routes for authenticated users
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Admin only routes
router.get('/', authorize('admin'), getAllUsers);
router.get('/:id', resourceOwnerOrAdmin, getUserById);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
