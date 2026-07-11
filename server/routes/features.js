const express = require('express');
const { getFeatures } = require('../controllers/featuresController');

const router = express.Router();

router.get('/', getFeatures);

module.exports = router;
