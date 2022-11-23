const axios = require('axios');

module.exports = async function(data) {
    try {
        const res = await axios({
            method: 'post',
            url: `${process.env.SPN_URI}/users/connect?apiKey=${process.env.SPN_API_KEY}`,
            data: {
                username: data.username,
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email
            }
        })
        return await res;
    } catch (e) {console.log(e);}
}