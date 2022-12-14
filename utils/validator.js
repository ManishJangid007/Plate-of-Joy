const dataDriver = require('../models/mongo/driver');
const deep_email_validator = require('deep-email-validator');

module.exports = async function(data){
    let error = [];
    if (data.firstname.length <= 1 || data.firstname.length >= 21) error.push("Firstname Require Between 2 to 20 characters");
    if (data.lastname.length <= 1 || data.lastname.length >= 21) error.push("Lastname Require Between 2 to 20 characters");
    if (data.username.length < 6 || data.username.length > 10) error.push("Username Require Between 6 to 10 characters");
    
    const vUser = await dataDriver.findByUsername(data.username);
    if (vUser.length > 0) error.push("Username Already Occupied");
    
    const vEmail = await dataDriver.findByEmail(data.email);
    if (vEmail.length > 0) error.push("Already have account with this email")

    const devEmail = await deep_email_validator.validate(data.email);
    if (!devEmail.validators.smtp.valid) error.push("Enter Valid Email");

    if (data.email.length <= 1 || data.email.length >= 50) error.push("Valid Email Require");
    if (data.password.length < 8 || data.password.length > 20) error.push("Password Require and Length Should between 8 and 20 characters");
    if (data.confirmPassword != data.password) error.push("Password Does Not match");
    
    if (error.length !== 0) return {
        valid: false,
        errors: error
    };
    else return {
        valid: true,
        errors: null
    }
}