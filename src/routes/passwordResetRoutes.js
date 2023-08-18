// src/routes/passwordResetRoutes.js
const express = require('express');
const passwordResetController = require('../controllers/passwordResetController');

const router = express.Router();

router.post('/request-reset', passwordResetController.requestReset);
router.post('/reset-password', passwordResetController.resetPassword);

module.exports = router;
