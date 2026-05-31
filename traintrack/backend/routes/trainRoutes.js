const express = require('express');
const router = express.Router();
const { searchTrains, getTrainById, getTrainStatus, searchByRoute, getStationSuggestions, getTrainsAtStation } = require('../controllers/trainController');

router.get('/search', searchTrains);
router.get('/search/route', searchByRoute);
router.get('/stations', getStationSuggestions);
router.get('/station/:station', getTrainsAtStation);
router.get('/:id', getTrainById);


router.get('/:id/status', getTrainStatus);

module.exports = router;
