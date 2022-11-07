const validator = require('deep-email-validator')

module.exports = async function (email) {
    return await validator.validate(email);
}