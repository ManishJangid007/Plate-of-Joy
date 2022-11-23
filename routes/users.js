const express = require('express');
const router = express.Router();
const validator = require('../utils/validator');
const random = require('../utils/random');
const mail_service = require('../utils/mail-service');
const strings = require('../utils/strings');
const spn_connect = require('../models/spoonacular/connect_user');
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
        res.redirect('/users/verify');
    }
});

router.get('/verify', (req, res) => {
    if (req.session.verify_email) {
        res.render('verify_email', {
            email: req.session.data.email
        });
    } else {
        res.redirect('/users/create');
    }
});

router.post('/verify', async (req, res) => {
    if (req.body.code == req.session.code) {
        try {
            req.session.verify_email = false;

            const spn_res = await spn_connect({
                username: req.session.data.username,
                firstname: req.session.data.firstname,
                lastname: req.session.data.lastname,
                email: req.session.data.email
            })

            await dataDriver.createUser({
                firstname: req.session.data.firstname,
                lastname: req.session.data.lastname,
                username: req.session.data.username,
                email: req.session.data.email,
                password: req.session.data.password,
                spn: {
                    username: await spn_res.data.username,
                    password: await spn_res.data.spoonacularPassword,
                    hash: await spn_res.data.hash
                }
            })

            const fullName = `${req.session.data.firstname} ${req.session.data.lastname}`
            mail_service.sendEmail(
                req.session.data.email,
                strings.welcomeMessageSubject(),
                strings.welcomeMessage(fullName)
            )
            req.session.destroy()
            res.redirect('/users/login')
        } catch (e) {
            res.render('verify_email', {
                email: req.session.data.email,
                error: 'Something went wrong while creating your account'
            });
        }
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