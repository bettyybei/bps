'use strict';
var router = require('express').Router();
module.exports = router;

// router.use('/google', require('./oauth'))

router.use('/members', require('./members'));
router.use('/projects', require('./projects'));
router.use('/elements', require('./elements'));
router.use('/users', require('./users'))

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
