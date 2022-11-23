const express = require('express');
const router = express.Router();
const spn_connect = require('../models/spoonacular/connect_user');
const bcrypt = require('bcrypt');


router.get('/test', async (req, res) => {
    console.log(await bcrypt.hash('123456789', 10));
    res.send("Go to Console to see result");
});

router.get('/', async (req, res) => {
    res.redirect("/users/login");
})

module.exports = router;