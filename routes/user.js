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

router.get('/', async (req, res) => {
    if (req.session.isAuthenticated) {
        let user = await dataDriver.findById(req.session._id);
        user = user[0]
        res.send({
            isAuthenticated: true,
            fullName: `${user.firstname} ${user.lastname}`,
            username: user.username
        })
    } else {
        res.send({
            isAuthenticated: false
        });
    }
})

router.post('/create', async (req, res) => {
    const errors = await validator(req.body);
    if (errors) {
        res.send({
            err: true,
            errs: errors
        });
    } else {
        req.session.data = req.body;
        req.session.verify_email = true;
        const vCode = random.generateVerificationCode();
        req.session.code = vCode;

        try {
            await mail_service.sendVerificationCode(req.body.email, vCode);
        } catch (e) {
            res.send({
                err: true,
                errs: ['*Error : Something went wrong on the server, Try again later!']
            });
            return;
        }
        res.send({
            err: false
        })
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
            });

            const hashedPassword = await bcrypt.hash(req.session.data.password, 10);

            const result = await dataDriver.createUser({
                firstname: req.session.data.firstname,
                lastname: req.session.data.lastname,
                username: req.session.data.username,
                email: req.session.data.email,
                dob: req.session.data.dob,
                gender: req.session.data.gender,
                password: hashedPassword,
                spn: {
                    username: spn_res.data.username,
                    password: spn_res.data.spoonacularPassword,
                    hash: spn_res.data.hash
                }
            })

            console.log(result);

            const fullName = `${req.session.data.firstname} ${req.session.data.lastname}`;
            mail_service.sendEmail(
                req.session.data.email,
                strings.welcomeMessageSubject(),
                strings.welcomeMessage(fullName)
            );
            req.session.destroy();

            res.send({
                err: false
            })

        } catch (e) {
            console.log(e.message);
            res.send({
                err: true,
                err: ["*OTP : Something went wrong on the server"]
            });
        }
    } else {
        res.send({
            err: true,
            errs: ["*OTP : Invalid OTP"]
        });
    }
});

router.post('/login', async (req, res) => {
    const user = await auth(req.body.username, req.body.password);
    if (user) {
        req.session._id = user._id.toString();
        req.session.isAuthenticated = true;
        res.send({ err: false })
    } else {
        res.send({
            err: true,
            errs: ["*Invalid Username or Password"]
        })
    }
    return;
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
});

module.exports = router;