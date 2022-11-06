const express = require('express');
const path = require('path');
const router = express.Router();
const pantry = require('../models/pantry/pantry');
const validator = require('../utils/form-validation');

router.get('/', async (req, res) => {
    res.render('index');
})

router.post('/', async (req, res) => {
    console.log(req.body.test);
    const {valid, error} = validator(await {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });
    const errorElements = async (err) => {
            return await {
                error: err,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.username,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword
            };
    };
    if (!valid) {
        res.render('index', await errorElements(error));
    } else { 
        const {error, message} = await pantry.addUser({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password
        })
        if (await error == null) {
            res.send(message);
        } else {
            res.render('index', await errorElements([error]));
        }
    }
});

router.get('/test', async (req, res) => {
    res.sendFile(path.resolve(__dirname+'/../public/pages/account_created.html'));
    // console.log(__dirname+'/../public/pages/account_created.html');
    // res.end()
});

module.exports = router;