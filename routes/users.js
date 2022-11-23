const express = require('express');
const router = express.Router();
const validator = require('../utils/validator');
const random = require('../utils/random');
const mail_service = require('../utils/mail-service');
const strings = require('../utils/strings');
const dataDriver = require('../models/mongo/driver')

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
    else {
        req.session.data = req.body;
        req.session.verify_email = true;
        const vCode = random.generateVerificationCode();
        req.session.code = vCode;

        try {
            await mail_service.sendVerificationCode(req.body.email, vCode);
        } catch (e) {
            res.render("create_user", {
                error: ['Something went wrong on the server'],
                data: req.body
            });
        }
        res.redirect('users/../verify');
    }
});

router.get('/verify', (req, res) => {
    if (req.session.verify_email) {
        res.render('verify_email', {
            email: req.session.data.email
        });
    } else {
        res.redirect('users/../create');
    }
});

router.post('/verify', (req, res) => {
    if (req.body.code == req.session.code) {
        req.session.verify_email = false;
        const fullName = `${req.session.data.firstname} ${req.session.data.lastname}`
        mail_service.sendEmail(
            req.session.data.email,
            strings.welcomeMessageSubject(),
            strings.welcomeMessage(fullName)
        )
        res.send('Your Aaccount was successfully verified')
    } else {
        res.render('verify_email', {
            email: req.session.data.email,
            error: 'Invalid code'
        });
    }
});

router.get('/login', (req, res) => {
    res.render('login_user');
});

router.post('/login', async (req, res) => {
    
});

module.exports = router;