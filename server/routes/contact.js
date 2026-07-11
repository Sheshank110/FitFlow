const express = require('express');
const { body } = require('express-validator');
const { submitContact } = require('../controllers/contactController');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 60 }),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 100 }),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
  ],
  validate,
  submitContact
);

module.exports = router;
