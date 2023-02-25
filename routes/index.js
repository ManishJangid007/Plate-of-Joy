const express = require('express');
const router = express.Router();
const spn_connect = require('../models/spoonacular/connect_user');
const bcrypt = require('bcrypt');
const dataDriver = require('../models/mongo/driver');
const auth = require('../models/mongo/auth');


router.get('/test', async (req, res) => {
    console.log("Someone hit the end point", req.path);
    res.json([{ test: 'test' }]);
});

router.get('/', async (req, res) => {
    console.log("Someone hit the end point", req.path);
    res.json([{ test: 'test' }]);
})

module.exports = router;