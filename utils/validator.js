const dataDriver = require('../models/mongo/driver');
const deep_email_validator = require('deep-email-validator');

module.exports = async function ({
    firstname,
    lastname,
    gender,
    dob,
    email,
    username,
    password,
    confirmPassword
}) {
    let error = [];

    !/^\s*[A-Za-z]{2,}\s*$/gm.test(firstname) && error.push("*Firstname : enter firstname");
    !/^\s*[A-Za-z]{2,}\s*$/gm.test(lastname) && error.push("*Lastname : enter lastname");
    !/^(?!.*select)(male|female|other)$/.test(gender) && error.push("*Gender : select gender");

    if (!/^(?:\d{4}[-/](?:0[1-9]|1[0-2])[-/](?:0[1-9]|[12]\d|3[01])|\d{2}[-/](?:0[1-9]|[12]\d|3[01])[-/]\d{4})$/g.test(dob)) {
        error.push("*DOB : enter valid date");
    }
    else if (!isValidDOB(dob)) { error.push("*DOB : enter valid Date of Birth"); }

    !/^[a-zA-Z0-9._-]{7,}$/.test(username) && error.push("*Username : username must be at least 7 characters long");

    const vUser = await dataDriver.findByUsername(username);
    vUser.length > 0 && error.push("*Username : username Already Occupied");

    const vEmail = await dataDriver.findByEmail(email);
    vEmail.length > 0 && error.push("*Email : Already have account with this email")

    const devEmail = await deep_email_validator.validate(email);
    !devEmail.validators.smtp.valid && error.push("*Email : Enter Valid Email");

    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) && error.push("*Email : enter correct email");

    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+-=,./?;:'"[\]{}|`~]{8,}$/.test(password) && error.push(`*Password : Your password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit`);

    password !== confirmPassword && error.push("*Confirm Password : password does not match");
    confirmPassword.length === 0 && error.push("*Confirm Password : enter password");

    if (error.length == 0) error = false;
    return error;
}

function isValidDOB(dob) {
    const dateArr = dob.split("-");
    const date = new Date(
        dateArr[0],
        dateArr[1] - 1,
        dateArr[2]
    );
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date < yesterday) return true;
    else return false;
}
