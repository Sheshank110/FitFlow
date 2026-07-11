const express = require('express');
const { body } = require('express-validator');
const { chat } = require('../controllers/chatController');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  [
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 500 }),
    body('sessionId').trim().notEmpty().withMessage('sessionId is required'),
  ],
  validate,
  chat
);

module.exports = router;
