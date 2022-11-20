module.exports = function(data){
    let valid = false;
    let error = [];
    if (data.firstname.length <= 1 || data.firstname.length >= 21) error.push("Firstname Require Between 2 to 20 characters");
    if (data.lastname.length <= 1 || data.lastname.length >= 21) error.push("Lastname Require Between 2 to 20 characters");
    if (data.username.length < 6 || data.username.length > 10) error.push("Username Require Between 6 to 10 characters");
    if (data.email.length <= 1 || data.email.length >= 50) error.push("Valid Email Require");
    if (data.password.length < 8 || data.password.length > 20) error.push("Password Require and Length Should between 8 and 20 characters");
    if (data.confirmPassword != data.password) error.push("Password Does Not match");
    if (error.length == 0) valid = true;
    return {
        valid: valid,
        error: error
    }
}