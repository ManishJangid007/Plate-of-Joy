const express = require('express');
const router = express.Router();
const spn_connect = require('../models/spoonacular/connect_user');
const bcrypt = require('bcrypt');
const dataDriver = require('../models/mongo/driver');
const auth = require('../models/mongo/auth');


router.get('/test', async (req, res) => {
    const data = await auth('manish', '123456789');
    console.log(data);
    res.send("Go to Console to see result");
});

router.get('/', async (req, res) => {
    res.render('home_page', {
        isAuth: req.session.isAuthenticated
    });
})

module.exports = router;