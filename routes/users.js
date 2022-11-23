const express = require('express');
const router = express.Router();
const validator = require('../utils/validator');

router.get('/', (req, res) => {
    res.redirect("/users/login");
})

router.get('/create', (req, res) => {
    res.render("create_user")
});

router.post('/create', async (req, res) => {
    const {valid, errors} = await validator(req.body);
    if (!valid) res.render("create_user", {
        error: errors,
        data: req.body
    });
    else res.render("create_user");
});

router.get('/login', (req, res) => {
    res.render('login_user');
});

router.post('/login', async (req, res) => {
    
});

module.exports = router;