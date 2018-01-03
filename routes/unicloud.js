const express = require('express');
const router = express.Router();

router.use('/users',require('./users').router);
router.use('/dropbox',require('./dropbox').router);
router.use('/drive',require('./drive').router);
router.use('/share',require('./share').router);

module.exports.router = router;