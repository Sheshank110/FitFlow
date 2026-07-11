const express = require('express');
const { getSection } = require('../controllers/contentController');

const router = express.Router();

router.get('/:section', getSection);

module.exports = router;
