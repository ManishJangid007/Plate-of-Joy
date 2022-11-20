const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.redirect("/users/login");
})

router.get('/create', (req, res) => {
    res.render("create_user")
});

router.post('/create', async (req, res) => {
    
});

router.get('/login', (req, res) => {
    res.render('login_user');
});

router.post('/login', async (req, res) => {
    
});

module.exports = router;