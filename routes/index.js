const express = require('express');
const router = express.Router();
const spn_connect = require('../models/spoonacular/connect_user');

router.get('/test', async (req, res) => {
    spn_connect({
        username: 'test',
        firstname: 'test',
        lastname: 'test',
        email: 'test@example.com'
    })
    res.send("Go to Console to see result");
});

router.get('/', async (req, res) => {
    res.redirect("/users/login");
})

module.exports = router;