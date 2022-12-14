const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const validator = require('../utils/validator');
const random = require('../utils/random');
const mail_service = require('../utils/mail-service');
const strings = require('../utils/strings');
const spn_connect = require('../models/spoonacular/connect_user');
const dataDriver = require('../models/mongo/driver')
const auth = require('../models/mongo/auth');

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

            const sessionData = {
                firstname: req.session.data.firstname,
                lastname: req.session.data.lastname,
                username: req.session.data.username,
                email: req.session.data.email,
                password: req.session.data.password
            };

            const spn_res = await spn_connect({
                username: sessionData.username,
                firstname: sessionData.firstname,
                lastname: sessionData.lastname,
                email: sessionData.email
            });

            const hashedPassword = await bcrypt.hash(sessionData.password, 10);

            await dataDriver.createUser({
                firstname: sessionData.firstname,
                lastname: sessionData.lastname,
                username: sessionData.username,
                email: sessionData.email,
                password: hashedPassword,
                spn: {
                    username: await spn_res.data.username,
                    password: await spn_res.data.spoonacularPassword,
                    hash: await spn_res.data.hash
                }
            });

            const fullName = `${req.session.data.firstname} ${req.session.data.lastname}`;
            mail_service.sendEmail(
                req.session.data.email,
                strings.welcomeMessageSubject(),
                strings.welcomeMessage(fullName)
            );
            req.session.destroy();
            res.redirect('/users/login');
        } catch (e) {
            console.log(e.message);
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

router.get('/login', authenticated, (req, res) => {
        res.render('login_user');
});

router.post('/login', async (req, res) => {
    const user = await auth(req.body.username, req.body.password);
    if (await user) {
        req.session._id = user._id.toString();
        req.session.isAuthenticated = true;
        res.redirect('/')
    } else res.render('login_user', {
        data: {
            username: req.body.username,
            password: req.body.password
        },
        error: true
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/users/login');
});

function authenticated(req, res, next) {
    if (req.session.isAuthenticated) res.redirect('/');
    else next();
}

module.exports = router;