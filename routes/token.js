var express = require('express');
const ControllerToken = require('../controllers/ControllerToken');
var router = express.Router();


/* GET users listing. */
router.get('/confirmation/:token', ControllerToken.confirmationToken);

module.exports = router;
