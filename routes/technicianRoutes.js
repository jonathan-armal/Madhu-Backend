const express = require('express');
const { body } = require('express-validator');
const { getAssignedRequests, updateRequestStatus } = require('../controllers/technicianController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

/**
 * @swagger
 * /api/technicians/my-assignments:
 *   get:
 *     summary: Get assigned service requests for technician
 *     tags: [Technicians]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned service requests
 *       401:
 *         description: Unauthorized
 */
router.get('/my-assignments', authenticate, authorize('technician'), getAssignedRequests);

/**
 * @swagger
 * /api/technicians/update-status/{id}:
 *   put:
 *     summary: Update service request status
 *     tags: [Technicians]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [in-progress, completed]
 *     responses:
 *       200:
 *         description: Service request status updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Service request not found
 */
router.put('/update-status/:id', 
  authenticate, 
  authorize('technician'),
  [
    body('status').isIn(['in-progress', 'completed']).withMessage('Invalid status'),
    validateRequest
  ],
  updateRequestStatus
);

module.exports = router;