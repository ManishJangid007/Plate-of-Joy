const express = require('express');
const router = express.Router();
const dataDriver = require('../models/mongo/driver');

router.get('/test', async (req, res) => {
    const data = await dataDriver.findByUsername("JohnElder");
    console.log(data.length);
    res.send("Go to Console to see result");
});

router.get('/', async (req, res) => {
    res.redirect("/users/login");
})

module.exports = router;