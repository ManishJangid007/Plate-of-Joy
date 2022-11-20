const express = require('express');
const router = express.Router();

// const mailService = require('../utils/mail-service');
// const random = require('../utils/random');


router.get('/', async (req, res) => {
    res.redirect("/users/login");
})


router.get('/test', async (req, res) => {
    // await auth("manish", "password");
    // mailService.sendVerificationCode("manishjangid8619@gmail.com", random.generateVerificationCode())
    res.send("Go to Console to see result");
});

module.exports = router;