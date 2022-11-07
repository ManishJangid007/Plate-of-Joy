const express = require('express');
const router = express.Router();

const auth = require('../models/pantry/auth')

router.get('/', async (req, res) => {
    res.redirect("/users/login");
})


router.get('/test', async (req, res) => {
    // await auth("manish", "password");
    res.send("Test")
});

module.exports = router;