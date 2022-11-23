const express = require('express');
const router = express.Router();
const dataDriver = require('../models/mongo/driver');

router.get('/test', async (req, res) => {
    req.session.isAuth = true;
    res.send("Go to Console to see result");
});

router.get('/', async (req, res) => {
    res.redirect("/users/login");
})

module.exports = router;