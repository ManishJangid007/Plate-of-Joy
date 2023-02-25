const express = require('express');
const router = express.Router();
const spn_connect = require('../models/spoonacular/connect_user');
const bcrypt = require('bcrypt');
const dataDriver = require('../models/mongo/driver');
const auth = require('../models/mongo/auth');


router.get('/test', async (req, res) => {
    console.log("Someone hit the end point", req.path);
    res.json([{ name: 'Mansih Haml' }]);
});

router.get('/', async (req, res) => {
    res.render('home_page', {
        isAuth: req.session.isAuthenticated
    });
})

module.exports = router;