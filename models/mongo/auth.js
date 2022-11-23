const dataDriver = require('./driver');
const bcrypt = require('bcrypt');

module.exports = async function(username, password) {
    try {
        let user = await dataDriver.findByUsername(username);
        if (user.length > 0) {
            user = user[0];
            if (await bcrypt.compare(password, user.password)) {
                return user;
            } else return false;
        } else return false;
    } catch (e) {console.log(e);}
}