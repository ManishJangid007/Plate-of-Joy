const express = require('express');
const path = require('path');
const router = express.Router();
const pantry = require('../models/pantry/pantry');
const validator = require('../utils/form-validation');
const localData = require('../models/local_data/driver');

router.get('/', async (req, res) => {
    res.render('index');
})

router.post('/', async (req, res) => {
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
        res.render('index', await errorElements(error));
    } else { 
        const {error, message} = await pantry.addUser({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        if (await error == null) {
            res.send(message);
        } else {
            res.render('index', await errorElements(error));
        }
    }
});

router.get('/test', async (req, res) => {
    // const va = await emailValidator("w@g")
    // console.log(await va.validators.smtp.valid);
    // console.log(await va.validators.smtp.reason);
    // console.log(await pantry.redundantEAU("manishj6", "w@r"));
    // console.log(await pantry.redundantEmail("w@w"))

    // fs.readFile(path.resolve(`${__dirname}/../models/local_data/emails.json`), (err, data) => {
    //     if (err) console.log(err);
    //     else {
    //         const newRaw = JSON.parse(data);
    //         newRaw.push("7")
    //         const newData = JSON.stringify(newRaw);
    //         fs.writeFile(path.resolve(`${__dirname}/../models/local_data/emails.json`), newData, (err) => {
    //             if (err) console.log(err);
    //         })
    //     }
    //     res.end()
    // })

    localData.updateEmail("email")
    res.end()
});

module.exports = router;