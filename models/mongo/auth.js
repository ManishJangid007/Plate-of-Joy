const dataDriver = require('./driver');
const bcrypt = require('bcrypt');

module.exports = async function(usernameOrEmail, password) {
    try {
        let user = await dataDriver.findByUsername(usernameOrEmail);
        if (user.length > 0) {
            user = user[0];
            if (await bcrypt.compare(password, user.password)) {
                return user;
            } else return false;
        } else {
            user = await dataDriver.findByEmail(usernameOrEmail);
            if (user.length > 0) {
                user = user[0];
                if (await bcrypt.compare(password, user.password)) {
                    return user;
                } else return false;
            } else return false;
        }
    } catch (e) {console.log(e);}
}