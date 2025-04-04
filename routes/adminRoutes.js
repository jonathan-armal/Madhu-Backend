const express = require('express');
const { getAllUsers, getAllOrders, getAllServiceRequests, getDashboardStats, setupAdminUser } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized
 */
router.get('/users', authenticate, authorize('admin'), getAllUsers);

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Unauthorized
 */
router.get('/orders', authenticate, authorize('admin'), getAllOrders);

/**
 * @swagger
 * /api/admin/service-requests:
 *   get:
 *     summary: Get all service requests
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all service requests
 *       401:
 *         description: Unauthorized
 */
router.get('/service-requests', authenticate, authorize('admin'), getAllServiceRequests);

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *       401:
 *         description: Unauthorized
 */
router.get('/dashboard', authenticate, authorize('admin'), getDashboardStats);

/**
 * @swagger
 * /api/admin/setup:
 *   post:
 *     summary: Setup admin user
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Admin user setup complete
 *       500:
 *         description: Internal server error
 */
router.post('/setup', setupAdminUser);

module.exports = router;