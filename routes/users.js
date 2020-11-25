var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('<h1>Hello Express</h1> <a href="/">back</a>');
});

module.exports = router;
