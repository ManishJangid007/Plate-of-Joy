const express = require('express');
const router = express.Router();
const pantry = require('../models/pantry/pantry');
const validator = require('../utils/form-validation');
const localData = require('../models/local_data/driver');
const auth = require('../models/pantry/auth');

router.get('/', (req, res) => {
    res.redirect("/users/login");
})

router.get('/create', (req, res) => {
    res.render("create_user")
});

router.post('/create', async (req, res) => {
    const {valid, error} = validator(await {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
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
                password: req.body.password,
                confirmPassword: req.body.confirmPassword
            };
    };
    if (!valid) {
        res.render('create_user', await errorElements(error));
    } else { 
        const {error, message} = await pantry.addUser({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            createdOn: Date()
        })
        if (await error == null) {
            res.redirect("/users/login")
        } else {
            res.render('create_user', await errorElements(error));
        }
    }
});

router.get('/login', (req, res) => {
    res.render('login_user');
});

router.post('/login', async (req, res) => {
    const data = await {
        username: req.body.username,
        password: req.body.password
    }
    if (localData.isUserExist(data.username).exist) {
        const result = await auth(data.username, data.password);
        if (await result.error === null) res.send("You are logged in")
        else res.render('login_user', {
            error: true, 
            message: result.error,
            username: data.username, 
            password: data.password
        });
    } else res.render('login_user', {
        error: true, 
        username: data.username, 
        password: data.password
    });
});

module.exports = router;