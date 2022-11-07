const pantry = require('./pantry');

module.exports = async function(username, password) {
    const user = await pantry.getUser(username)
    if (await user.error === null) {
        if (user.data.password === password) return {
            error: null,
            message: 'verified'
        }
        else return {
            error: 'Incorrect password',
            message: null
        }
    } else return {
        error: user.error,
        message: null
    }
}