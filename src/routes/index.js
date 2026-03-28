const express = require('express');
const { createCheckIn } = require('../controllers/checkInController');
const { createGameSession } = require('../controllers/gameController');
const { getLatestResult } = require('../controllers/resultController');

const router = express.Router();

router.post('/checkin', createCheckIn);
router.post('/game', createGameSession);
router.get('/result', getLatestResult);

module.exports = router;
